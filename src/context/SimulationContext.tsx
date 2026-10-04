import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Zone,
  ElectricalLoad,
  ControlRule,
  ScenarioType,
  Assumptions,
  SimulationStepData,
  TriageTag,
  AuditLogEntry,
  WhatsAppAlert,
} from '../types';
import {
  DEFAULT_ASSUMPTIONS,
  INITIAL_ZONES,
  INITIAL_LOADS,
  INITIAL_RULES,
  INITIAL_ALERTS,
  DEMO_STEPS,
} from '../constants/assumptions';
import { runFull24HourSimulation, computeDailySummary, DailySummary } from '../simulation/engine';

interface SimulationContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mode: 'triage' | 'baseline';
  setMode: (mode: 'triage' | 'baseline') => void;
  scenario: ScenarioType;
  setScenario: (sc: ScenarioType) => void;
  currentTimeIndex: number;
  setCurrentTimeIndex: (idx: number) => void;
  isPlaying: boolean;
  togglePlay: () => void;
  playbackSpeed: number; // 1, 10, 60
  setPlaybackSpeed: (speed: number) => void;
  
  zones: Zone[];
  loads: ElectricalLoad[];
  updateLoadTag: (loadId: string, newTag: TriageTag) => { success: boolean; reason?: string };
  rules: ControlRule[];
  toggleRule: (ruleId: string) => void;
  assumptions: Assumptions;
  updateAssumptions: (newAssumptions: Partial<Assumptions>) => void;
  resetAssumptions: () => void;
  
  // Modals & Panels
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  safetyLockModalOpen: boolean;
  setSafetyLockModalOpen: (open: boolean) => void;
  safetyLockLoad: ElectricalLoad | null;
  assumptionsModalOpen: boolean;
  setAssumptionsModalOpen: (open: boolean) => void;

  // Fail-safe & Outage simulation
  isKitFailed: boolean;
  simulateKitFailure: (active: boolean) => void;
  isOutageSimulated: boolean;
  simulateGridOutage: (active: boolean) => void;

  // Audit Log & Alerts
  auditLogs: AuditLogEntry[];
  alerts: WhatsAppAlert[];
  markAlertRead: (id: string) => void;

  // Guided Tour
  guidedDemoRunning: boolean;
  startGuidedDemo: () => void;
  stopGuidedDemo: () => void;
  demoStepIndex: number;

  // First time welcome modal
  showWelcomeTour: boolean;
  setShowWelcomeTour: (show: boolean) => void;

  // Dark mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Computed simulation
  simulationSteps: SimulationStepData[];
  currentStepData: SimulationStepData;
  dailySummary: DailySummary;
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mode, setMode] = useState<'triage' | 'baseline'>('triage');
  const [scenario, setScenario] = useState<ScenarioType>('summer');
  
  // Time starts at 14:15 (step 171) which shows peak daytime solar & cooling
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number>(171);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(10);

  const [zones] = useState<Zone[]>(INITIAL_ZONES);
  const [loads, setLoads] = useState<ElectricalLoad[]>(INITIAL_LOADS);
  const [rules, setRules] = useState<ControlRule[]>(INITIAL_RULES);
  const [assumptions, setAssumptions] = useState<Assumptions>(DEFAULT_ASSUMPTIONS);

  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [safetyLockModalOpen, setSafetyLockModalOpen] = useState<boolean>(false);
  const [safetyLockLoad, setSafetyLockLoad] = useState<ElectricalLoad | null>(null);
  const [assumptionsModalOpen, setAssumptionsModalOpen] = useState<boolean>(false);

  const [isKitFailed, setIsKitFailed] = useState<boolean>(false);
  const [isOutageSimulated, setIsOutageSimulated] = useState<boolean>(false);

  const [alerts, setAlerts] = useState<WhatsAppAlert[]>(INITIAL_ALERTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-0',
      timestamp: '14:15:02',
      loadOrZone: 'Overhead Tank Pump (5 HP)',
      tag: 'GREEN',
      action: 'Shifted to 11:30 Solar Surplus Window',
      justification: 'Rooftop Solar generation > 20 kW. Net zero grid import.',
      safetyCheck: 'PASSED',
    },
    {
      id: 'log-1',
      timestamp: '14:00:15',
      loadOrZone: 'Operating Theatre AHU',
      tag: 'RED',
      action: 'Hardware Lockout Enforced: Monitored Only',
      justification: 'NABH Surgical sterility requirement. CT Sensor only.',
      safetyCheck: 'LOCKED_BY_CLINICAL_PROTOCOL',
    },
    {
      id: 'log-2',
      timestamp: '13:45:00',
      loadOrZone: 'ICU Ventilators & Life Support',
      tag: 'RED',
      action: 'Hardware Lockout Enforced: Monitored Only',
      justification: 'Patient Life Support. Zero automated contactors physically wired.',
      safetyCheck: 'LOCKED_BY_CLINICAL_PROTOCOL',
    },
    {
      id: 'log-3',
      timestamp: '13:15:40',
      loadOrZone: 'General Ward A AC',
      tag: 'YELLOW',
      action: 'Fan-First Setpoint Nudge +1°C applied (24.5°C)',
      justification: 'Ceiling fans active at 0.8 m/s skin velocity. Equivalent PMV comfort index.',
      safetyCheck: 'PASSED',
    },
  ]);

  // Guided 90-sec demo
  const [guidedDemoRunning, setGuidedDemoRunning] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);

  // Welcome modal (show once on first visit)
  const [showWelcomeTour, setShowWelcomeTour] = useState<boolean>(false);

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Clock tick when playing
  useEffect(() => {
    if (!isPlaying) return;
    const intervalMs = playbackSpeed === 60 ? 120 : playbackSpeed === 10 ? 300 : 800;
    const timer = setInterval(() => {
      setCurrentTimeIndex((prev) => (prev + 1) % 288);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // Guided Demo timer
  useEffect(() => {
    if (!guidedDemoRunning) return;
    const currentStep = DEMO_STEPS[demoStepIndex];
    if (!currentStep) {
      setGuidedDemoRunning(false);
      return;
    }

    setActiveTab(currentStep.pageId);

    const stepTimer = setTimeout(() => {
      if (demoStepIndex < DEMO_STEPS.length - 1) {
        setDemoStepIndex((prev) => prev + 1);
      } else {
        setGuidedDemoRunning(false);
        setDemoStepIndex(0);
      }
    }, currentStep.durationMs);

    return () => clearTimeout(stepTimer);
  }, [guidedDemoRunning, demoStepIndex]);

  const startGuidedDemo = () => {
    setDemoStepIndex(0);
    setGuidedDemoRunning(true);
    setIsPlaying(true);
    setPlaybackSpeed(10);
  };

  const stopGuidedDemo = () => {
    setGuidedDemoRunning(false);
  };

  // Re-run simulation whenever assumptions, loads, rules, scenario, or fail-safe flags change
  const simulationSteps = useMemo(() => {
    return runFull24HourSimulation(
      zones,
      loads,
      rules,
      assumptions,
      scenario,
      isKitFailed,
      isOutageSimulated
    );
  }, [zones, loads, rules, assumptions, scenario, isKitFailed, isOutageSimulated]);

  const currentStepData = useMemo(() => {
    return simulationSteps[currentTimeIndex] || simulationSteps[0];
  }, [simulationSteps, currentTimeIndex]);

  const dailySummary = useMemo(() => {
    return computeDailySummary(simulationSteps, assumptions);
  }, [simulationSteps, assumptions]);

  // Load Tag update with CLINICAL LOCKOUT GUARD
  const updateLoadTag = useCallback((loadId: string, newTag: TriageTag): { success: boolean; reason?: string } => {
    const targetLoad = loads.find((l) => l.id === loadId);
    if (!targetLoad) return { success: false, reason: 'Load not found' };

    // Clinical lockout check: If originalTag is RED and trying to move to YELLOW or GREEN -> REJECT!
    if (targetLoad.originalTag === 'RED' && newTag !== 'RED') {
      setSafetyLockLoad(targetLoad);
      setSafetyLockModalOpen(true);

      // Add to audit log as security block event
      const logEntry: AuditLogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        loadOrZone: targetLoad.name,
        tag: 'RED',
        action: `BLOCKED ATTEMPT: User tried to re-tag ${targetLoad.name} to ${newTag}`,
        justification: targetLoad.lockoutReason || 'Clinical safety policy prohibits control relays on critical life-support loads.',
        safetyCheck: 'LOCKED_BY_CLINICAL_PROTOCOL',
      };
      setAuditLogs((prev) => [logEntry, ...prev]);

      return {
        success: false,
        reason: targetLoad.lockoutReason || 'Clinical lockout violation: Red loads cannot be assigned to controllable tiers.',
      };
    }

    setLoads((prev) =>
      prev.map((l) => (l.id === loadId ? { ...l, tag: newTag } : l))
    );

    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      loadOrZone: targetLoad.name,
      tag: newTag,
      action: `Tag changed to ${newTag}`,
      justification: 'Manual commissioning update by facilities engineer.',
      safetyCheck: 'PASSED',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);

    return { success: true };
  }, [loads]);

  const toggleRule = useCallback((ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          if (r.locked) return r; // Cannot toggle locked red rule
          const nextState = !r.enabled;
          const logEntry: AuditLogEntry = {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            loadOrZone: r.name,
            tag: r.tagApplied,
            action: nextState ? 'Rule Enabled' : 'Rule Bypassed',
            justification: r.description,
            safetyCheck: 'PASSED',
          };
          setAuditLogs((prevLog) => [logEntry, ...prevLog]);
          return { ...r, enabled: nextState };
        }
        return r;
      })
    );
  }, []);

  const updateAssumptions = useCallback((newAssumptions: Partial<Assumptions>) => {
    setAssumptions((prev) => ({ ...prev, ...newAssumptions }));
  }, []);

  const resetAssumptions = useCallback(() => {
    setAssumptions(DEFAULT_ASSUMPTIONS);
  }, []);

  const simulateKitFailure = useCallback((active: boolean) => {
    setIsKitFailed(active);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      loadOrZone: 'System Gateway & Contactor Bank',
      tag: 'RED',
      action: active ? 'HARDWARE FAIL-SAFE TRIGGERED: All NC contactors released to grid line' : 'Hardware restored to normal Triage operation',
      justification: active ? 'Simulated kit power loss / watchdog trip. Zero load interruption.' : 'System re-synchronized.',
      safetyCheck: 'FAILSAFE_REVERT',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
  }, []);

  const simulateGridOutage = useCallback((active: boolean) => {
    setIsOutageSimulated(active);
    const logEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      loadOrZone: 'Main HT/LT Grid Feeder',
      tag: 'RED',
      action: active ? 'GRID BLACKOUT SIMULATION: Microgrid Island Mode Active' : 'Grid power restored',
      justification: active ? 'Green loads shed instantly; Yellow ACs reduced; Red life support backed by Solar+Battery.' : 'Resumed normal grid sync.',
      safetyCheck: 'PASSED',
    };
    setAuditLogs((prev) => [logEntry, ...prev]);
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        activeTab,
        setActiveTab,
        mode,
        setMode,
        scenario,
        setScenario,
        currentTimeIndex,
        setCurrentTimeIndex,
        isPlaying,
        togglePlay: () => setIsPlaying((p) => !p),
        playbackSpeed,
        setPlaybackSpeed,
        zones,
        loads,
        updateLoadTag,
        rules,
        toggleRule,
        assumptions,
        updateAssumptions,
        resetAssumptions,
        selectedZoneId,
        setSelectedZoneId,
        safetyLockModalOpen,
        setSafetyLockModalOpen,
        safetyLockLoad,
        assumptionsModalOpen,
        setAssumptionsModalOpen,
        isKitFailed,
        simulateKitFailure,
        isOutageSimulated,
        simulateGridOutage,
        auditLogs,
        alerts,
        markAlertRead,
        guidedDemoRunning,
        startGuidedDemo,
        stopGuidedDemo,
        demoStepIndex,
        showWelcomeTour,
        setShowWelcomeTour,
        isDarkMode,
        toggleDarkMode,
        simulationSteps,
        currentStepData,
        dailySummary,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
