import { AppConfig, AttendanceRecord } from '../types';
import { retry } from '../utils/retry';

export class OdooService {
  constructor(private config: AppConfig) {}

  async push(serial: string, records: AttendanceRecord[]) {
    return retry(async () => {
      const res = await fetch(this.config.odoo_webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.config.api_token,
        },
        body: JSON.stringify({ serial, records }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Odoo API Error ${res.status}: ${errText}`);
      }
      
      return await res.json();
    });
  }
}
