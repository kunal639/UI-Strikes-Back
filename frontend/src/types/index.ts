export type SecurityState = 'normal' | 'warning' | 'threat';

export type RiskLevel = 'safe' | 'warning' | 'high';

export type AlertStatus = 'active' | 'investigating' | 'resolved';

export interface Device {
  id: number; // Changed to number to match state.py
  name: string;
  type: string;
  ip_address: string; // Made required as it's in state.py
  status: 'online' | 'offline';
  risk_level: RiskLevel;
  baseline_activity: number; // Added this
  current_activity: number;  // Added this
  // last_seen and created_at exist in types but not state.py
  // Mark them as optional so the compiler doesn't complain
  last_seen?: string; 
  created_at?: string;
}

export interface Alert {
  id: string;
  device_id: string; // Ensure this matches your backend (backend uses int, frontend uses string)
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  status: AlertStatus;
  confidence: number;
  detected_at: string;
  resolved_at?: string;
  metadata?: Record<string, any>; // <--- Add the "?" here
  device?: Device;
}

export interface ActivityLog {
  id: string;
  device_id: string;
  activity_type: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface ValidationStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  timestamp?: string;
}
