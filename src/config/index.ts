import * as fs from 'fs';
import * as path from 'path';
import { AppConfig } from '../types';

export function loadConfig(): AppConfig {
  const configPath = path.join(process.cwd(), 'config.json');
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return {
      zk_ip: raw.zk_ip || '127.0.0.1',
      zk_port: raw.zk_port || 4370,
      zk_timeout: raw.zk_timeout || 10000,
      odoo_webhook_url: raw.odoo_webhook_url || '',
      api_token: raw.api_token || '',
      sync_interval_minutes: raw.sync_interval_minutes || 15
    };
  } catch (err) {
    throw new Error('Failed to load config.json');
  }
}
