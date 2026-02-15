
export enum SpeechSupportType {
  STUTTERING = 'Stuttering'
}

export interface UserProfile {
  fullName: string;
  supportType: SpeechSupportType;
  struggleSounds: string;
  isInitialized: boolean;
}

export interface SessionData {
  id: string;
  timestamp: number;
  rawText: string;
  cleanedText: string;
  refinedText: string;
  confidence: number;
}

export type Status = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'DONE' | 'ERROR';
