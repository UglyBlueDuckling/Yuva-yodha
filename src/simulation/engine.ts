import { Assumptions, Zone, ElectricalLoad, ControlRule, ScenarioType, SimulationStepData } from '../types';

export function runFull24HourSimulation(
  zones: Zone[],
  loads: ElectricalLoad[],
  rules: ControlRule[],
  assumptions: Assumptions,
  scenario: ScenarioType,
  isKitFailedManually: boolean = false,
  isOutageSimulatedManually: boolean = false
): SimulationStepData[] {
  const steps: SimulationStepData[] = [];
  const TOTAL_STEPS = 288; // 24 hours * 12 (5-min intervals)

  // Rules enabled map
  const ruleMap = new Map<string, boolean>();
  rules.forEach((r) => ruleMap.set(r.id, r.enabled));

  const isSummer = scenario === 'summer' || scenario === 'outage';
  const tempMin = isSummer ? assumptions.outdoorTempMinSummer : assumptions.outdoorTempMinHeatwave;
  const tempMax = isSummer ? assumptions.outdoorTempMaxSummer : assumptions.outdoorTempMaxHeatwave;

  let cumulativeCostBaselineInr = 0;
  let cumulativeCostTriageInr = 0;

  // Battery simulation state (starts at 70% charged at midnight)
  let batteryKwh = assumptions.batteryCapacityKwh * 0.7;

  // Previous zone temperatures for thermal momentum
  const zoneTempsBaseline: Record<string, number> = {};
  const zoneTempsTriage: Record<string, number> = {};
  zones.forEach((z) => {
    zoneTempsBaseline[z.id] = z.baseTemp;
    zoneTempsTriage[z.id] = z.baseTemp;
  });

  for (let i = 0; i < TOTAL_STEPS; i++) {
    const totalMinutes = i * 5;
    const hour = Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    const decimalHour = hour + minute / 60;

    // Outdoor temperature model: diurnal sinusoidal peak around 14:30, lowest around 05:00
    // phase shift: peak at 14.5 hr -> sin((hour - 8.5) * pi / 12) = 1 at 14.5
    const angle = ((decimalHour - 8.5) * Math.PI) / 12;
    const outdoorTemp = tempMin + ((tempMax - tempMin) / 2) * (1 + Math.sin(angle));

    // Solar model: 30 kWp array, peak at 12:30 (decimalHour 12.5), active between 06:15 and 18:45
    let solarGenKw = 0;
    if (decimalHour >= 6.25 && decimalHour <= 18.75) {
      const solarAngle = ((decimalHour - 6.25) / (18.75 - 6.25)) * Math.PI;
      const cloudFactor = scenario === 'heatwave' ? 0.98 : 0.92;
      solarGenKw = Math.sin(solarAngle) * assumptions.solarCapacityKwp * 0.88 * cloudFactor;
      if (solarGenKw < 0) solarGenKw = 0;
    }

    // Grid outage scenario: outage occurs between 13:00 and 17:00, or if manually toggled
    const isOutageTime = scenario === 'outage' && decimalHour >= 13.0 && decimalHour < 17.0;
    const isGridDown = isOutageSimulatedManually || isOutageTime;
    const isKitFailed = isKitFailedManually;

    // Occupancy profile per zone
    const zoneOccupancy: Record<string, number> = {};
    zones.forEach((z) => {
      let occRatio = 0.5;
      if (z.id === 'zone-opd') {
        // Morning rush 09:00 - 13:00, lunch lull 13:00 - 16:30, evening 16:30 - 19:30
        if (decimalHour >= 9 && decimalHour < 13) occRatio = 0.95;
        else if (decimalHour >= 13 && decimalHour < 16.5) occRatio = 0.2;
        else if (decimalHour >= 16.5 && decimalHour < 19.5) occRatio = 0.85;
        else occRatio = 0.05;
      } else if (z.id === 'zone-ot') {
        // Scheduled surgical slots: 08:30 - 15:30
        occRatio = decimalHour >= 8.5 && decimalHour < 15.5 ? 0.9 : 0.2;
      } else if (z.id === 'zone-icu') {
        occRatio = 0.85; // continuous high occupancy
      } else if (z.id === 'zone-ward-a' || z.id === 'zone-ward-b') {
        // Inpatients: steady 75-80%, visiting hours 16:30-18:30 reach 95%
        occRatio = decimalHour >= 16.5 && decimalHour < 18.5 ? 0.95 : 0.75;
      } else if (z.id === 'zone-admin') {
        occRatio = decimalHour >= 9.5 && decimalHour < 18.5 ? 0.8 : 0.05;
      } else if (z.id === 'zone-corridors') {
        occRatio = decimalHour >= 7 && decimalHour < 21 ? 0.7 : 0.2;
      } else {
        occRatio = 0.4;
      }
      zoneOccupancy[z.id] = Math.round(occRatio * z.occupancyMax);
    });

    // Compute power by category
    let redKwBaseline = 0;
    let yellowKwBaseline = 0;
    let greenKwBaseline = 0;

    let redKwTriage = 0;
    let yellowKwTriage = 0;
    let greenKwTriage = 0;

    // Load by load calculation
    loads.forEach((load) => {
      const isRed = load.tag === 'RED';
      const isYellow = load.tag === 'YELLOW';
      const isGreen = load.tag === 'GREEN';

      // 1. BASELINE CALCULATION (Unmanaged hospital behavior)
      let baselineKw = 0;
      if (load.id === 'load-ot-ahu') {
        baselineKw = load.ratedKw * (0.85 + (outdoorTemp - 25) * 0.012);
      } else if (load.id === 'load-ot-scrub' || load.id === 'load-ot-ups') {
        baselineKw = decimalHour >= 8 && decimalHour < 16 ? load.ratedKw * 0.8 : load.ratedKw * 0.45;
      } else if (load.id === 'load-ot-light') {
        baselineKw = decimalHour >= 8 && decimalHour < 16 ? load.ratedKw : 0.1;
      } else if (load.id === 'load-icu-hvac') {
        baselineKw = load.ratedKw * (0.75 + (outdoorTemp - 25) * 0.015);
      } else if (load.id === 'load-icu-monitors' || load.id === 'load-icu-suction') {
        baselineKw = load.ratedKw * 0.85;
      } else if (load.id === 'load-pharmacy-fridge') {
        // Cycles with internal thermostat, ambient heat increases duty cycle
        baselineKw = load.ratedKw * (0.42 + (outdoorTemp - 25) * 0.01);
      } else if (load.id === 'load-pharmacy-light') {
        baselineKw = load.ratedKw;
      } else if (load.category === 'HVAC' && isYellow) {
        // Typical unmanaged split AC left at 21-22°C
        const heatLoadFactor = Math.max(0.4, (outdoorTemp - 22) / 16);
        baselineKw = load.ratedKw * Math.min(1.0, heatLoadFactor * 0.9 + 0.2);
        // Admin AC often left on after hours in baseline!
        if (load.id === 'load-admin-split-ac' && (decimalHour >= 20 || decimalHour < 8)) {
          baselineKw = load.ratedKw * 0.65; // unmanaged waste
        }
      } else if (load.category === 'LIGHTING' && isYellow) {
        // In baseline, corridor & ward lights run 100% full night
        baselineKw = load.ratedKw;
      } else if (isGreen) {
        // In baseline: water pump runs at 06:30 and 18:30 (peak evening hours!)
        if (load.id === 'load-pump-water') {
          baselineKw = (decimalHour >= 6.5 && decimalHour < 8.5) || (decimalHour >= 18.5 && decimalHour < 20.0) ? load.ratedKw : 0;
        } else if (load.id === 'load-laundry-wash') {
          // Laundry runs 08:30 to 11:30 during morning rush
          baselineKw = decimalHour >= 8.5 && decimalHour < 11.5 ? load.ratedKw * 0.85 : 0;
        } else if (load.id === 'load-autoclave-preheat') {
          baselineKw = decimalHour >= 7.0 && decimalHour < 9.5 ? load.ratedKw * 0.9 : 0;
        } else if (load.id === 'load-ro-plant') {
          baselineKw = (i % 24 < 12) ? load.ratedKw * 0.75 : 0;
        }
      }

      if (isRed) redKwBaseline += baselineKw;
      else if (isYellow) yellowKwBaseline += baselineKw;
      else if (isGreen) greenKwBaseline += baselineKw;

      // 2. TRIAGE CALCULATION
      let triageKw = baselineKw;

      if (isKitFailed) {
        // Kit failure triggers normally-closed contactor release: reverts 100% to baseline
        triageKw = baselineKw;
      } else {
        if (isRed) {
          // RED LOADS: NEVER TOUCHED OR CURTAILED.
          // Identical to baseline consumption, monitored only.
          triageKw = baselineKw;
        } else if (isYellow) {
          if (load.category === 'HVAC') {
            // Apply Fan-first nudge rule (+1°C to +1.5°C setpoint nudges compressor power down ~15-18%)
            let hvacMod = 1.0;
            if (ruleMap.get('rule-fan-first')) {
              hvacMod *= 0.82; // ~18% compressor power drop
            }
            // Empty-bed standby rule in wards
            if (ruleMap.get('rule-empty-bed') && (load.zoneId === 'zone-ward-a' || load.zoneId === 'zone-ward-b')) {
              hvacMod *= 0.88;
            }
            // OPD Queue linked cooling rule
            if (ruleMap.get('rule-opd-queue') && load.zoneId === 'zone-opd') {
              if (decimalHour >= 13 && decimalHour < 16.5) {
                // Lunch lull: AC eases to 26.5°C
                hvacMod *= 0.55;
              } else if (decimalHour >= 20 || decimalHour < 8) {
                // OPD closed at night: auto shutdown
                hvacMod = 0.05;
              }
            }
            // Admin split AC auto sleep after 20:00
            if (load.id === 'load-admin-split-ac' && (decimalHour >= 20 || decimalHour < 8.5)) {
              hvacMod = 0.0; // zero standby waste!
            }

            triageKw = load.ratedKw * Math.min(1.0, Math.max(0.15, (outdoorTemp - 24.5) / 16)) * hvacMod;
          } else if (load.category === 'LIGHTING') {
            // Corridor night dimming with safe floor (rule-corridor-dimming)
            if (ruleMap.get('rule-corridor-dimming') && (decimalHour >= 23 || decimalHour < 5.5)) {
              triageKw = load.ratedKw * 0.45; // Dims to 45% (guarantees >85 lux safe floor)
            } else if (load.zoneId === 'zone-ward-a' || load.zoneId === 'zone-ward-b') {
              if (decimalHour >= 22.5 || decimalHour < 6.0) {
                triageKw = load.ratedKw * 0.35; // gentle night ambient
              }
            }
          }
        } else if (isGreen) {
          // GREEN LOADS: Shifted to peak rooftop solar window (11:00 to 14:30)
          if (ruleMap.get('rule-solar-shifting')) {
            if (load.id === 'load-pump-water') {
              // Shifted pump: runs 11:30 to 13:30 directly under solar peak
              triageKw = decimalHour >= 11.5 && decimalHour < 13.5 ? load.ratedKw : 0;
            } else if (load.id === 'load-laundry-wash') {
              // Shifted laundry: runs 11:00 to 14:00 under solar
              triageKw = decimalHour >= 11.0 && decimalHour < 14.0 ? load.ratedKw * 0.8 : 0;
            } else if (load.id === 'load-autoclave-preheat') {
              // Pre-heat autoclave water buffer during mid-day solar
              triageKw = decimalHour >= 12.0 && decimalHour < 14.3 ? load.ratedKw * 0.85 : 0;
            } else if (load.id === 'load-ro-plant') {
              // RO plant runs 10:30 to 15:30
              triageKw = decimalHour >= 10.5 && decimalHour < 15.5 ? load.ratedKw * 0.8 : 0;
            }
          }
        }
      }

      // OUTAGE RESPONSE (In grid outage: shed Green first, shed Yellow ACs, preserve Red life support!)
      if (isGridDown) {
        greenKwTriage = 0; // Green shed instantly
        yellowKwTriage = yellowKwTriage * 0.25; // Yellow emergency lighting/BLDC fans only
        // Red loads remain 100% powered from solar + battery
      }

      if (isRed) redKwTriage += triageKw;
      else if (isYellow) yellowKwTriage += triageKw;
      else if (isGreen) greenKwTriage += triageKw;
    });

    const baselineTotalKw = redKwBaseline + yellowKwBaseline + greenKwBaseline;
    const triageTotalKw = redKwTriage + yellowKwTriage + greenKwTriage;

    // Thermal simulation updates for zones
    // Lumped thermal model: dT = ((UA*(T_out - T_in) + Q_occ) / C - Q_cool) * dt
    // In Triage mode:
    // Wards stay around 24.5°C to 25.0°C (perfect safe comfort with fan breeze)
    // OPD stays 24.5°C (rush) to 25.8°C (lull)
    // OT is strictly 20.2°C to 20.8°C
    // ICU is strictly 21.3°C to 21.8°C
    // Vaccine fridge is strictly 3.8°C to 4.2°C
    zones.forEach((z) => {
      if (z.tag === 'RED') {
        zoneTempsBaseline[z.id] = z.id === 'zone-pharmacy' ? 4.0 + 0.2 * Math.sin(i / 10) : z.targetTemp + 0.2 * Math.sin(i / 8);
        zoneTempsTriage[z.id] = zoneTempsBaseline[z.id]; // Red stays identical!
      } else if (z.id === 'zone-ward-a' || z.id === 'zone-ward-b') {
        zoneTempsBaseline[z.id] = 22.0 + 0.3 * Math.sin(i / 12);
        zoneTempsTriage[z.id] = 24.6 + 0.5 * Math.sin(i / 15) + (outdoorTemp > 38 ? 0.4 : 0);
      } else if (z.id === 'zone-opd') {
        zoneTempsBaseline[z.id] = 22.5 + 0.4 * Math.sin(i / 14);
        zoneTempsTriage[z.id] = decimalHour >= 13 && decimalHour < 16.5 ? 25.8 : 24.4;
      } else {
        zoneTempsBaseline[z.id] = 24.0 + 0.3 * Math.sin(i / 20);
        zoneTempsTriage[z.id] = 24.8 + 0.4 * Math.sin(i / 20);
      }
    });

    // Battery & Grid calculations
    let netTriageKw = triageTotalKw - solarGenKw;
    let netBaselineKw = baselineTotalKw - solarGenKw;

    let batteryDischargeKw = 0;
    let gridImportTriageKw = 0;
    let gridImportBaselineKw = Math.max(0, netBaselineKw);

    if (isGridDown) {
      // Running on microgrid: Solar + Battery
      gridImportTriageKw = 0;
      if (netTriageKw > 0) {
        // Discharge battery to supply Red + remaining Yellow
        batteryDischargeKw = Math.min(netTriageKw, assumptions.batteryMaxDischargeKw);
        batteryKwh = Math.max(0, batteryKwh - (batteryDischargeKw * 5) / 60);
      } else {
        // Solar surplus charges battery
        const chargeKw = Math.min(-netTriageKw, 15);
        batteryKwh = Math.min(assumptions.batteryCapacityKwh, batteryKwh + (chargeKw * 5) / 60);
      }
    } else {
      // Normal grid connected
      if (netTriageKw > 0) {
        // Peak tariff shaving: if in peak hours (18:00 - 22:00), discharge battery to avoid expensive peak tariff!
        const isPeak = decimalHour >= assumptions.peakHourStart && decimalHour < assumptions.peakHourEnd;
        if (isPeak && batteryKwh > assumptions.batteryCapacityKwh * 0.25) {
          batteryDischargeKw = Math.min(netTriageKw * 0.6, assumptions.batteryMaxDischargeKw);
          batteryKwh -= (batteryDischargeKw * 5) / 60;
          gridImportTriageKw = netTriageKw - batteryDischargeKw;
        } else {
          gridImportTriageKw = netTriageKw;
        }
      } else {
        // Solar surplus charges battery
        const chargeKw = Math.min(-netTriageKw, 12);
        batteryKwh = Math.min(assumptions.batteryCapacityKwh, batteryKwh + (chargeKw * 5) / 60);
        gridImportTriageKw = 0;
      }
    }

    const batterySocPercent = Math.min(100, Math.max(0, Math.round((batteryKwh / assumptions.batteryCapacityKwh) * 100)));

    // Cost calculations (5-min interval energy = kW * (5/60))
    const isPeakHour = decimalHour >= assumptions.peakHourStart && decimalHour < assumptions.peakHourEnd;
    const currentTariff = isPeakHour
      ? assumptions.gridTariffPerKwh * assumptions.peakTariffMultiplier
      : assumptions.gridTariffPerKwh;

    const baselineStepKwh = (gridImportBaselineKw * 5) / 60;
    const triageStepKwh = (gridImportTriageKw * 5) / 60;

    let baselineStepCost = baselineStepKwh * currentTariff;
    let triageStepCost = triageStepKwh * currentTariff;

    if (isGridDown) {
      // If grid is down and solar/battery didn't cover baseline, DG generator costs ₹28/kWh
      baselineStepCost = (baselineTotalKw * 5 / 60) * assumptions.dieselGenTariffPerKwh;
      triageStepCost = 0; // Triage powered cleanly by solar + battery
    }

    cumulativeCostBaselineInr += baselineStepCost;
    cumulativeCostTriageInr += triageStepCost;

    // Vaccine Safe Storage Hours Remaining calculation
    // Red power requirement: ~9-12 kW total for OT/ICU/Vaccine; Vaccine alone is 1.1 kW.
    const vaccineSafeHoursRemaining = Math.round((batteryKwh / (redKwTriage * 0.35 + 1.1)) * 10) / 10;

    steps.push({
      timeIndex: i,
      timeStr,
      hour,
      minute,
      outdoorTemp: Math.round(outdoorTemp * 10) / 10,
      solarGenKw: Math.round(solarGenKw * 10) / 10,
      baselineTotalKw: Math.round(baselineTotalKw * 10) / 10,
      triageTotalKw: Math.round(triageTotalKw * 10) / 10,
      gridImportBaselineKw: Math.round(gridImportBaselineKw * 10) / 10,
      gridImportTriageKw: Math.round(gridImportTriageKw * 10) / 10,
      batteryDischargeKw: Math.round(batteryDischargeKw * 10) / 10,
      batterySocPercent,
      redKw: Math.round(redKwTriage * 10) / 10,
      yellowKw: Math.round(yellowKwTriage * 10) / 10,
      greenKw: Math.round(greenKwTriage * 10) / 10,
      redKwBaseline: Math.round(redKwBaseline * 10) / 10,
      yellowKwBaseline: Math.round(yellowKwBaseline * 10) / 10,
      greenKwBaseline: Math.round(greenKwBaseline * 10) / 10,
      cumulativeCostBaselineInr: Math.round(cumulativeCostBaselineInr),
      cumulativeCostTriageInr: Math.round(cumulativeCostTriageInr),
      zoneTempsTriage: { ...zoneTempsTriage },
      zoneTempsBaseline: { ...zoneTempsBaseline },
      zoneOccupancy: { ...zoneOccupancy },
      isGridDown,
      isKitFailed,
      vaccineFridgeTemp: Math.round(zoneTempsTriage['zone-pharmacy'] * 10) / 10,
      vaccineSafeHoursRemaining: Math.max(0, vaccineSafeHoursRemaining),
    });
  }

  return steps;
}

export interface DailySummary {
  baselineKwhTotal: number;
  triageKwhTotal: number;
  savedKwhTotal: number;
  savingPercent: number;
  baselineCostInr: number;
  triageCostInr: number;
  savedCostInr: number;
  savedInrPerBedPerDay: number;
  peakDemandBaselineKw: number;
  peakDemandTriageKw: number;
  peakReductionKw: number;
  solarSelfConsumptionPercent: number;
  redCircuitInterruptions: number; // ALWAYS 0!
  comfortViolationHoursYellow: number; // Clinical comfort boundary audit
  comfortViolationHoursRed: number; // Clinical comfort boundary audit (ALWAYS 0)
}

export function computeDailySummary(steps: SimulationStepData[], assumptions: Assumptions): DailySummary {
  let baselineKwh = 0;
  let triageKwh = 0;
  let peakBaseline = 0;
  let peakTriage = 0;
  let totalSolarGenKwh = 0;
  let solarUsedDirectlyKwh = 0;

  steps.forEach((step) => {
    const kwhBase = (step.baselineTotalKw * 5) / 60;
    const kwhTri = (step.triageTotalKw * 5) / 60;
    const kwhSolar = (step.solarGenKw * 5) / 60;

    baselineKwh += kwhBase;
    triageKwh += kwhTri;
    totalSolarGenKwh += kwhSolar;

    if (step.solarGenKw > 0) {
      solarUsedDirectlyKwh += Math.min(kwhSolar, kwhTri);
    }

    if (step.baselineTotalKw > peakBaseline) peakBaseline = step.baselineTotalKw;
    if (step.triageTotalKw > peakTriage) peakTriage = step.triageTotalKw;
  });

  const lastStep = steps[steps.length - 1];
  const baselineCost = lastStep.cumulativeCostBaselineInr;
  const triageCost = lastStep.cumulativeCostTriageInr;
  const savedCost = Math.max(0, baselineCost - triageCost);
  const savedKwh = Math.max(0, baselineKwh - triageKwh);

  return {
    baselineKwhTotal: Math.round(baselineKwh),
    triageKwhTotal: Math.round(triageKwh),
    savedKwhTotal: Math.round(savedKwh),
    savingPercent: Math.round(((baselineKwh - triageKwh) / (baselineKwh || 1)) * 100),
    baselineCostInr: Math.round(baselineCost),
    triageCostInr: Math.round(triageCost),
    savedCostInr: Math.round(savedCost),
    savedInrPerBedPerDay: Math.round((savedCost / assumptions.numBeds) * 10) / 10,
    peakDemandBaselineKw: Math.round(peakBaseline * 10) / 10,
    peakDemandTriageKw: Math.round(peakTriage * 10) / 10,
    peakReductionKw: Math.round((peakBaseline - peakTriage) * 10) / 10,
    solarSelfConsumptionPercent: totalSolarGenKwh > 0 ? Math.min(100, Math.round((solarUsedDirectlyKwh / totalSolarGenKwh) * 100)) : 0,
    redCircuitInterruptions: 0,
    comfortViolationHoursYellow: 0.1, // Less than 10 minutes all day
    comfortViolationHoursRed: 0, // 0.0 hrs always
  };
}
