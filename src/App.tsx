import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { Dashboard } from './components/Dashboard';
import { AircraftSelector } from './components/AircraftSelector';
import { VisualAircraftExplorer } from './components/VisualAircraftExplorer';
import { SystemsExplorer } from './components/SystemsExplorer';
import { Troubleshooting } from './components/Troubleshooting';
import { PartsFinder } from './components/PartsFinder';
import { PartCompatibility } from './components/PartCompatibility';
import { AIMaintenanceAssistant } from './components/AIMaintenanceAssistant';
import { TaskManagement } from './components/TaskManagement';
import { DocLibrary } from './components/DocLibrary';
import { InventoryManager } from './components/InventoryManager';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-[#1e293b] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'aircraft' && (
          <div className="space-y-10">
            <AircraftSelector />
            <VisualAircraftExplorer />
          </div>
        )}
        {activeTab === 'systems' && <SystemsExplorer />}
        {activeTab === 'troubleshooting' && <Troubleshooting />}
        {activeTab === 'parts' && <PartsFinder />}
        {activeTab === 'compatibility' && <PartCompatibility />}
        {activeTab === 'ai-assistant' && <AIMaintenanceAssistant />}
        {activeTab === 'documents' && <DocLibrary />}
        {activeTab === 'maintenance' && <TaskManagement />}
        {activeTab === 'inventory' && <InventoryManager />}
      </main>

      <Footer />
      <GlobalSearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
