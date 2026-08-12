import React, { createContext, useContext, useState } from 'react';
import {
  AircraftModel,
  UserRole,
  MaintenanceTask,
  Part,
  TroubleshootingFlow,
  TaskStatus,
  CompatibilityCheck,
} from '../types';
import {
  MOCK_AIRCRAFT,
  MOCK_PARTS,
  MOCK_TASKS,
  MOCK_TROUBLESHOOTING_FLOWS,
} from '../data/mockData';

interface AppContextType {
  selectedAircraft: AircraftModel;
  setSelectedAircraft: (aircraft: AircraftModel) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  globalSearchOpen: boolean;
  setGlobalSearchOpen: (open: boolean) => void;
  tasks: MaintenanceTask[];
  addTask: (task: Omit<MaintenanceTask, 'id' | 'taskNumber' | 'dateCreated'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, findings?: string, correctiveAction?: string) => void;
  parts: Part[];
  selectedPartForDetail: Part | null;
  setSelectedPartForDetail: (part: Part | null) => void;
  comparedPartNumbers: string[];
  toggleComparePart: (partNumber: string) => void;
  clearComparedParts: () => void;
  selectedTroubleshootingFlow: TroubleshootingFlow | null;
  setSelectedTroubleshootingFlow: (flow: TroubleshootingFlow | null) => void;
  checkCompatibility: (partNumber: string, aircraftModelId: string) => CompatibilityCheck;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedAircraft, setSelectedAircraft] = useState<AircraftModel>(MOCK_AIRCRAFT[0]); // Default 737-800
  const [userRole, setUserRole] = useState<UserRole>('technician');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  
  const [tasks, setTasks] = useState<MaintenanceTask[]>(MOCK_TASKS);
  const [parts] = useState<Part[]>(MOCK_PARTS);
  const [selectedPartForDetail, setSelectedPartForDetail] = useState<Part | null>(null);
  const [comparedPartNumbers, setComparedPartNumbers] = useState<string[]>([]);
  const [selectedTroubleshootingFlow, setSelectedTroubleshootingFlow] = useState<TroubleshootingFlow | null>(
    MOCK_TROUBLESHOOTING_FLOWS[0]
  );
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const addTask = (taskData: Omit<MaintenanceTask, 'id' | 'taskNumber' | 'dateCreated'>) => {
    const nextId = `task-${Date.now()}`;
    const nextTaskNum = `MT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTask: MaintenanceTask = {
      ...taskData,
      id: nextId,
      taskNumber: nextTaskNum,
      dateCreated: new Date().toISOString().split('T')[0],
    };
    setTasks(prev => [newTask, ...prev]);
    showToast(`New maintenance task ${nextTaskNum} created successfully.`);
  };

  const updateTaskStatus = (
    taskId: string,
    status: TaskStatus,
    findings?: string,
    correctiveAction?: string
  ) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            ...(findings !== undefined ? { findings } : {}),
            ...(correctiveAction !== undefined ? { correctiveAction } : {}),
          };
        }
        return t;
      })
    );
    showToast(`Task updated to status: ${status}`);
  };

  const toggleComparePart = (partNumber: string) => {
    setComparedPartNumbers(prev => {
      if (prev.includes(partNumber)) {
        return prev.filter(p => p !== partNumber);
      }
      if (prev.length >= 3) {
        showToast('Maximum 3 parts can be compared simultaneously.');
        return prev;
      }
      return [...prev, partNumber];
    });
  };

  const clearComparedParts = () => {
    setComparedPartNumbers([]);
  };

  const checkCompatibility = (partNumber: string, aircraftModelId: string): CompatibilityCheck => {
    const part = parts.find(p => p.partNumber.toLowerCase() === partNumber.toLowerCase() || p.alternatePartNumbers.some(a => a.toLowerCase() === partNumber.toLowerCase()));
    
    if (!part) {
      return {
        targetPartNumber: partNumber,
        evaluatedPartNumber: partNumber,
        aircraftModel: aircraftModelId,
        status: 'unknown',
        interchangeabilityNote: 'Part number not found in master catalog database. Verified documentation required.',
      };
    }

    const isDirectMatch = part.aircraftCompatibility.includes(aircraftModelId);

    if (isDirectMatch) {
      if (part.interchangeabilityType === 'conditional_sb') {
        return {
          targetPartNumber: partNumber,
          evaluatedPartNumber: part.partNumber,
          aircraftModel: aircraftModelId,
          status: 'verify',
          interchangeabilityNote: 'Compatible under Service Bulletin condition. Requires wiring harness adapter SB-32-882.',
          sbReference: 'BOEING-SB-737-32A1182',
        };
      }
      return {
        targetPartNumber: partNumber,
        evaluatedPartNumber: part.partNumber,
        aircraftModel: aircraftModelId,
        status: 'compatible',
        interchangeabilityNote: `Directly approved replacement for ${aircraftModelId} per IPC/AMM data.`,
      };
    }

    return {
      targetPartNumber: partNumber,
      evaluatedPartNumber: part.partNumber,
      aircraftModel: aircraftModelId,
      status: 'incompatible',
      interchangeabilityNote: `Part ${part.partNumber} is not approved for installation on ${aircraftModelId}.`,
    };
  };

  return (
    <AppContext.Provider
      value={{
        selectedAircraft,
        setSelectedAircraft,
        userRole,
        setUserRole,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        globalSearchOpen,
        setGlobalSearchOpen,
        tasks,
        addTask,
        updateTaskStatus,
        parts,
        selectedPartForDetail,
        setSelectedPartForDetail,
        comparedPartNumbers,
        toggleComparePart,
        clearComparedParts,
        selectedTroubleshootingFlow,
        setSelectedTroubleshootingFlow,
        checkCompatibility,
        notification,
        setNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
