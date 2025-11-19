// Defines the structure of our AI analysis
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ChecklistItem {
  id: string;
  action: string;
  description: string;
  priority: RiskLevel;
  isCompleted: boolean;
  role: string; // e.g., "Attorney", "Paralegal", "Client"
}

export interface RiskAnalysis {
  clause: string;
  issue: string;
  severity: RiskLevel;
  recommendation: string;
}

export interface DocumentAnalysis {
  documentType: string;
  summary: string;
  extractedText: string;
  partiesInvolved: string[];
  executionDate: string | null;
  risks: RiskAnalysis[];
  checklist: ChecklistItem[];
}

export interface AppState {
  status: 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';
  currentFile: File | null;
  imagePreview: string | null;
  analysis: DocumentAnalysis | null;
  error: string | null;
}