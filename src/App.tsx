import React, { useState, useEffect } from 'react';
import { Header, USER_ROLES } from './components/Header';
import { Sidebar, TabType } from './components/Sidebar';
import { GeospatialMap } from './components/GeospatialMap';
import { NetworkGraph } from './components/NetworkGraph';
import { PredictiveSocioDash } from './components/PredictiveSocioDash';
import { FIRRegistry } from './components/FIRRegistry';
import { AICrimeCopilot } from './components/AICrimeCopilot';
import { SuspectDossierModal } from './components/SuspectDossierModal';
import { FIRLoggerModal } from './components/FIRLoggerModal';
import { ReportExportModal } from './components/ReportExportModal';
import { Incident, Suspect, UserRole } from './types';
import { MOCK_SUSPECTS, MOCK_NETWORK_GRAPH, MOCK_ANOMALIES } from './data/mockDatabase';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLES[0]);

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [suspects, setSuspects] = useState<Suspect[]>(MOCK_SUSPECTS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const [activeSuspectModal, setActiveSuspectModal] = useState<Suspect | null>(null);
  const [isFIRModalOpen, setIsFIRModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Fetch initial incidents dataset from Express backend
  useEffect(() => {
    fetch('/api/incidents?limit=1500')
      .then((res) => res.json())
      .then((data) => {
        if (data.incidents) {
          setIncidents(data.incidents);
        }
      })
      .catch((err) => {
        console.error('Error fetching incidents:', err);
      });
  }, []);

  const handleTriggerAIBrief = (promptText: string) => {
    setCopilotInitialPrompt(promptText);
    setActiveTab('ai_copilot');
  };

  const handleFIRCreated = (newIncident: Incident) => {
    setIncidents((prev) => [newIncident, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Law Enforcement Header Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenFIRModal={() => setIsFIRModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onToggleAICopilot={() => setActiveTab('ai_copilot')}
        activeAnomaliesCount={MOCK_ANOMALIES.length}
        incidents={incidents}
        suspects={suspects}
        onOpenSuspectDossier={(suspect) => setActiveSuspectModal(suspect)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          incidentsCount={incidents.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />

        {/* Content View Switcher */}
        <main className="flex-1 h-full overflow-hidden relative bg-slate-950">
          {activeTab === 'map' && (
            <GeospatialMap
              incidents={incidents}
              selectedDistrict={selectedDistrict}
              onDistrictSelect={setSelectedDistrict}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onTriggerAIBrief={handleTriggerAIBrief}
            />
          )}

          {activeTab === 'network' && (
            <NetworkGraph
              initialNodes={MOCK_NETWORK_GRAPH.nodes}
              initialLinks={MOCK_NETWORK_GRAPH.links}
              onOpenSuspectDossier={(suspect) => setActiveSuspectModal(suspect)}
              onTriggerAIBrief={handleTriggerAIBrief}
            />
          )}

          {activeTab === 'predictive' && (
            <PredictiveSocioDash onTriggerAIBrief={handleTriggerAIBrief} />
          )}

          {activeTab === 'registry' && (
            <FIRRegistry
              incidents={incidents}
              suspects={suspects}
              onOpenSuspectDossier={(suspect) => setActiveSuspectModal(suspect)}
              onOpenFIRModal={() => setIsFIRModalOpen(true)}
            />
          )}

          {activeTab === 'ai_copilot' && (
            <AICrimeCopilot initialPrompt={copilotInitialPrompt} />
          )}
        </main>
      </div>

      {/* Modal Dialogs */}
      {activeSuspectModal && (
        <SuspectDossierModal
          suspect={activeSuspectModal}
          onClose={() => setActiveSuspectModal(null)}
          onTriggerAIBrief={handleTriggerAIBrief}
        />
      )}

      {isFIRModalOpen && (
        <FIRLoggerModal
          onClose={() => setIsFIRModalOpen(false)}
          onSuccess={handleFIRCreated}
        />
      )}

      {isReportModalOpen && (
        <ReportExportModal
          currentRole={currentRole}
          onClose={() => setIsReportModalOpen(false)}
          incidentsCount={incidents.length}
        />
      )}
    </div>
  );
}
