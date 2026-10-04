/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationProvider, useSimulation } from './context/SimulationContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { SafetyLockModal } from './components/SafetyLockModal';
import { AssumptionsModal } from './components/AssumptionsModal';
import { GuidedDemoOverlay } from './components/GuidedDemoOverlay';
import { OnboardingTour } from './components/OnboardingTour';

// Pages
import { OverviewPage } from './pages/OverviewPage';
import { LiveHospitalTwinPage } from './pages/LiveHospitalTwinPage';
import { LoadTaggingPage } from './pages/LoadTaggingPage';
import { RulesEnginePage } from './pages/RulesEnginePage';
import { EnergyMoneyPage } from './pages/EnergyMoneyPage';
import { SafetyFailSafePage } from './pages/SafetyFailSafePage';
import { AlertsPage } from './pages/AlertsPage';
import { RoiCalculatorPage } from './pages/RoiCalculatorPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { ReportPage } from './pages/ReportPage';

const AppContent: React.FC = () => {
  const { activeTab } = useSimulation();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'twin':
        return <LiveHospitalTwinPage />;
      case 'tagging':
        return <LoadTaggingPage />;
      case 'rules':
        return <RulesEnginePage />;
      case 'charts':
        return <EnergyMoneyPage />;
      case 'safety':
        return <SafetyFailSafePage />;
      case 'alerts':
        return <AlertsPage />;
      case 'roi':
        return <RoiCalculatorPage />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'report':
        return <ReportPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-500 selection:text-white">
      {/* Global Header */}
      <Header />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Center Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Persistent Disclaimer Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <SafetyLockModal />
      <AssumptionsModal />
      <GuidedDemoOverlay />
      <OnboardingTour />
    </div>
  );
};

export default function App() {
  return (
    <SimulationProvider>
      <AppContent />
    </SimulationProvider>
  );
}
