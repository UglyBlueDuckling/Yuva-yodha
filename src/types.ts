export type TriageTag = 'RED' | 'YELLOW' | 'GREEN';

export interface Zone {
  id: string;
  name: string;
  tag: TriageTag;
  areaSqM: number;
  beds?: number;
  baseTemp: number; // Current inside temperature
  targetTemp: number;
  safeTempBand: [number, number]; // [min, max]
  occupancyMax: number;
  svgCoords: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  loads: string[]; // load IDs
  description: string;
  clinicalNote: string;
}

export interface ElectricalLoad {
  id: string;
  name: string;
  zoneId: string;
  zoneName: string;
  tag: TriageTag;
  originalTag: TriageTag;
  ratedKw: number;
  category: 'HVAC' | 'LIGHTING' | 'CRITICAL_MEDICAL' | 'WATER' | 'STERILIZATION' | 'REFRIGERATION' | 'AUXILIARY';
  isControllable: boolean;
  lockoutReason?: string;
  ctSensorId: string;
  bypassRelay: 'NONE' | 'NC_CONTACTOR' | 'SMART_VFD';
  baselineSchedule: string;
  triageStrategy: string;
}

export interface ControlRule {
  id: string;
  name: string;
  category: 'HVAC' | 'LIGHTING' | 'SCHEDULE_SHIFT' | 'OPD_INTELLIGENCE';
  tagApplied: 'YELLOW' | 'GREEN' | 'RED';
  description: string;
  clinicalSafetyBoundary: string;
  enabled: boolean;
  estSavingKwHPerDay: number;
  locked?: boolean;
}

export type ScenarioType = 'summer' | 'heatwave' | 'outage';

export interface Assumptions {
  numBeds: number;
  gridTariffPerKwh: number; // INR ₹
  dieselGenTariffPerKwh: number; // INR ₹ for backup DG
  kitCostInr: number;
  annualMaintenanceInr: number;
  solarCapacityKwp: number;
  batteryCapacityKwh: number;
  batteryMaxDischargeKw: number;
  peakTariffMultiplier: number;
  peakHourStart: number; // e.g. 18:00
  peakHourEnd: number; // e.g. 22:00
  outdoorTempMinSummer: number;
  outdoorTempMaxSummer: number;
  outdoorTempMinHeatwave: number;
  outdoorTempMaxHeatwave: number;
  fanCoolingEquivalenceC: number; // 1 degree C feel reduction when ceiling fan runs
  corridorDimmingMinLux: number; // min safe lux
}

export interface SimulationStepData {
  timeIndex: number; // 0 to 287 (5-min intervals)
  timeStr: string; // "14:15"
  hour: number;
  minute: number;
  outdoorTemp: number;
  solarGenKw: number;
  
  // Power
  baselineTotalKw: number;
  triageTotalKw: number;
  gridImportBaselineKw: number;
  gridImportTriageKw: number;
  batteryDischargeKw: number;
  batterySocPercent: number;
  
  // By triage category (Triage mode)
  redKw: number;
  yellowKw: number;
  greenKw: number;

  // By triage category (Baseline mode)
  redKwBaseline: number;
  yellowKwBaseline: number;
  greenKwBaseline: number;

  // Cumulative
  cumulativeCostBaselineInr: number;
  cumulativeCostTriageInr: number;
  
  // Zone details
  zoneTempsTriage: Record<string, number>;
  zoneTempsBaseline: Record<string, number>;
  zoneOccupancy: Record<string, number>;
  
  // Fail-safe & Outage state
  isGridDown: boolean;
  isKitFailed: boolean;
  vaccineFridgeTemp: number;
  vaccineSafeHoursRemaining: number;
}

export interface WhatsAppAlert {
  id: string;
  timestamp: string;
  sender: string;
  title: string;
  message: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  category: 'MAINTENANCE' | 'SAFETY' | 'SAVINGS';
  actionable: boolean;
  read: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  loadOrZone: string;
  tag: TriageTag;
  action: string;
  justification: string;
  safetyCheck: 'PASSED' | 'LOCKED_BY_CLINICAL_PROTOCOL' | 'FAILSAFE_REVERT';
}

export interface DemoStep {
  pageId: string;
  title: string;
  badge: string;
  narration: string;
  actionHint?: string;
  durationMs: number;
}
