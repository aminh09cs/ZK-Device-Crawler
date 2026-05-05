import { ZKService } from './zk.service';
import { SyncResult, AttendanceRecord } from '../types';
import { logger } from '../utils/logger';

export class SyncService {
  constructor(private zk: ZKService) {}

  async execute(): Promise<SyncResult & { data?: AttendanceRecord[] }> {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

    try {
      // Direct call to helper for UI log
      const { BrowserWindow } = require('electron');
      const win = BrowserWindow.getAllWindows()[0];
      
      const { logs, users } = await this.zk.fetchData();
      if (win) win.webContents.send('log', 'ok tcp');

      const nameMap = new Map(users.map((u: any) => [String(u.userId), u.name]));
      
      if (win) {
        win.webContents.send('log', `[TIME RANGE]: ${twentyFourHoursAgo.toLocaleString()} TO ${now.toLocaleString()}`);
      }

      const filteredLogs = logs.filter((l: any) => {
        const logDate = new Date(l.recordTime);
        return logDate >= twentyFourHoursAgo && logDate <= now;
      });

      // PRINT RAW DATA TO TERMINAL FOR CHECKING (FORCE FULL LIST)
      console.log('--- [DEBUG] RAW 24H DATA IN TERMINAL (FULL) ---');
      console.log(JSON.stringify(filteredLogs, null, 2));
      console.log('-----------------------------------------------');

      if (!filteredLogs.length) {
        return { status: 'success', total: 0, processed: 0, syncedAt: now, data: [] };
      }

      const records: AttendanceRecord[] = filteredLogs.map((l: any) => ({
        userId: String(l.deviceUserId),
        name: nameMap.get(String(l.deviceUserId)) || '',
        timestamp: new Date(l.recordTime).toLocaleString('sv-SE').replace('T', ' '),
        punch: l.type === 0 ? 0 : 1,
      }));

      return { 
        status: 'success', 
        total: records.length, 
        processed: records.length, 
        syncedAt: now,
        data: records
      };
    } catch (err: any) {
      const errorMsg = err.message || String(err);
      logger.error('Sync process failed', errorMsg);
      return { status: 'failed', total: 0, processed: 0, syncedAt: now, error: errorMsg };
    }
  }
}
