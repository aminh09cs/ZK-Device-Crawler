export interface AppConfig {
  zk_ip: string;
  zk_port: number;
  zk_timeout: number;
  odoo_webhook_url: string;
  api_token: string;
  sync_interval_minutes: number;
}

export interface RawAttendanceLog {
  deviceUserId: string;
  recordTime: string;
  type: number;
}

export interface RawZKUser {
  userId: string;
  name: string;
}

export interface AttendanceRecord {
  userId: string;
  name: string;
  timestamp: string;
  punch: number;
}

export interface SyncResult {
  status: 'success' | 'failed';
  total: number;
  processed: number;
  syncedAt: Date;
  error?: string;
}
