export type AircraftCategory = 'commercial_jet' | 'helicopter';

export interface AircraftModel {
  id: string;
  name: string; // e.g. "737-800"
  family: string; // e.g. "737 NG" or "A320 family" or "Sikorsky S-92"
  manufacturer: 'Boeing' | 'Airbus' | 'Sikorsky' | 'Bell' | 'Airbus Helicopters' | 'Leonardo' | 'Boeing/Vertol';
  category: AircraftCategory;
  variants: string[];
  engines: string[];
  maxSeatsOrPayload: string;
  ataSystemsCount: number;
  imageUrl: string;
  description: string;
  primaryApplications: string;
  activeFleetCount: number;
}

export interface ATAChapter {
  code: string; // e.g. "ATA 29"
  number: number; // 29
  title: string; // "Hydraulic Power"
  description: string;
  category: 'Airframe' | 'Structure' | 'Powerplant' | 'Avionics' | 'Rotors' | 'Equipment';
}

export interface AircraftSystem {
  id: string;
  ataCode: string;
  name: string;
  aircraftModelIds: string[];
  description: string;
  primaryComponents: string[];
  safetyCritical: boolean;
  commonFaults: string[];
}

export interface ComponentItem {
  id: string;
  name: string;
  systemId: string;
  ataCode: string;
  description: string;
  installationZone: string; // e.g. "Nose Landing Gear Bay"
  associatedParts: string[]; // Part numbers
}

export type InterchangeabilityType = 'direct_replacement' | 'superseded' | 'alternate' | 'conditional_sb' | 'not_interchangeable';

export interface Part {
  partNumber: string;
  alternatePartNumbers: string[];
  manufacturerPartNumber: string;
  serialNumberRequired: boolean;
  description: string;
  manufacturer: string;
  manufacturerCode: string; // e.g. "CAGE 73389"
  cageCode: string;
  nsn?: string; // National Stock Number e.g. "1620-01-443-8910"
  aircraftCompatibility: string[]; // Aircraft Model IDs e.g. ["b737-800", "b737-max"]
  componentType: string;
  ataCode: string;
  systemName: string;
  installationPosition: string;
  associatedComponents: string[];
  applicableTasks: string[];
  inspectionRequirements: string;
  overhaulIntervalHours?: number;
  lifeLimitCycles?: number;
  supersededPartNumbers: string[];
  replacementPartNumbers: string[];
  interchangeabilityType: InterchangeabilityType;
  status: 'In Stock' | 'Reorder Required' | 'AOG Critical' | 'In Maintenance';
  stockQuantity: number;
  locationBin: string;
  priceUsd: number;
  techDocsReferences: string[];
  imageUrl?: string;
  notes?: string;
}

export interface CompatibilityCheck {
  targetPartNumber: string;
  evaluatedPartNumber: string;
  aircraftModel: string;
  variant?: string;
  status: 'compatible' | 'verify' | 'incompatible' | 'unknown';
  interchangeabilityNote: string;
  sbReference?: string;
}

export interface DiagnosticStep {
  id: string;
  stepNumber: number;
  action: string;
  inspectionDetail: string;
  requiredTools: string[];
  expectedResult: string;
  relatedPartNumbers: string[];
  ammReference: string;
  passNextStepId?: string;
  failNextStepId?: string;
}

export interface TroubleshootingFlow {
  id: string;
  title: string;
  aircraftModelId: string;
  aircraftModelName: string;
  ataCode: string;
  systemName: string;
  reportedDefect: string;
  symptoms: string[];
  possibleCauses: {
    cause: string;
    probability: 'High' | 'Medium' | 'Low';
    system: string;
    inspection: string;
  }[];
  steps: DiagnosticStep[];
}

export type TaskStatus = 'Open' | 'Diagnosing' | 'Waiting for Parts' | 'In Progress' | 'Inspection Required' | 'Completed' | 'Deferred';

export interface MaintenanceTask {
  id: string;
  taskNumber: string;
  aircraftReg: string; // e.g. "N737AF"
  aircraftModelId: string;
  aircraftModelName: string;
  serialNumberMSN: string;
  ataCode: string;
  title: string;
  reportedDefect: string;
  priority: 'AOG' | 'High' | 'Routine';
  technician: string;
  inspector: string;
  dateCreated: string;
  dueDate: string;
  status: TaskStatus;
  requiredParts: { partNumber: string; description: string; qty: number; status: 'Allocated' | 'Pending' | 'Installed' }[];
  requiredTools: string[];
  findings?: string;
  correctiveAction?: string;
  signedOffBy?: string;
  signoffTechnician?: string;
  signoffInspector?: string;
  hoursLogged: number;
  ammReference: string;
}

export type DocType = 'AMM' | 'IPC' | 'SRM' | 'FIM' | 'CMM' | 'WDM' | 'MEL' | 'SB' | 'AD' | 'EO' | 'MPD';

export interface TechnicalDocument {
  id: string;
  docType: DocType;
  documentNumber: string; // e.g. "BOEING-AMM-32-51-00"
  title: string;
  aircraftModels: string[];
  ataCode: string;
  revisionDate: string;
  approvedBy: string; // e.g. "FAA / EASA / Boeing MRO"
  isSampleDemoData: boolean;
  summary: string;
  contentSnippet: string;
  fileSize: string;
  applicableModels: string[];
}

export type TechDocument = TechnicalDocument;

export type UserRole = 'technician' | 'engineer' | 'inspector' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  certifications: string[]; // e.g. "A&P License #382910", "FAA IA", "EASA B1.1"
  assignedStation: string; // e.g. "KJFK Line Station - Hangar 4"
  avatarUrl: string;
}

export interface ToolItem {
  id: string;
  toolNumber: string;
  name: string;
  serialNumber: string;
  calibrationDueDate: string;
  nextCalibrationDue: string;
  calibrationStatus: 'Calibrated' | 'Calibration Due' | 'Out of Service' | 'In Use';
  certNumber: string;
  locationBin: string;
  status: 'Calibrated' | 'Calibration Due' | 'Out of Service' | 'In Use';
  assignedToTask?: string;
}

export interface HotspotZone {
  id: string;
  name: string;
  zoneCode: string;
  ataChapters: string[];
  description: string;
  xPercentage: number;
  yPercentage: number;
}
