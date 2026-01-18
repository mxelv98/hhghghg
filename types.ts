
export type Strategy = 'SAFE' | 'BALANCED' | 'AGGRESSIVE';

export interface Prediction {
  id: string;
  timestamp: string;
  multiplier: number;
  confidence: number;
  isAiGenerated?: boolean;
}

export interface AiSignal {
  predictedMultiplier: number;
  confidence: number;
  reasoning: string;
  strength: number; // 0-100
}

export interface User {
  id: string;
  username: string;
  email?: string;
  isVip: boolean;
  isV3Paid: boolean;
  scansCount: number;
  version: 'Pluxo v3' | 'Pluxo v6';
  language: string;
  preferredStrategy: Strategy;
}

export enum AppState {
  LOGIN = 'LOGIN',
  LANDING = 'LANDING',
  VIP_DASHBOARD = 'VIP_DASHBOARD',
  AI_CHAT = 'AI_CHAT',
  ACCOUNT = 'ACCOUNT',
  ABOUT = 'ABOUT',
  PAYMENT = 'PAYMENT'
}
