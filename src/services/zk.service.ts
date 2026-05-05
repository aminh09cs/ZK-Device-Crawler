import ZKLib from 'node-zk-ahris';
import { AppConfig } from '../types';
import { logger } from '../utils/logger';

export class ZKService {
  private zk: ZKLib;

  constructor(private config: AppConfig) {
    this.zk = new ZKLib(config.zk_ip, config.zk_port, 10000, 4000);
  }

  async fetchData(): Promise<{ logs: any[]; users: any[]; serial: string }> {
    try {
      logger.info(`Connecting to ZK at ${this.config.zk_ip}...`);
      await this.zk.createSocket();
      
      // Delay for stability just like in test-zk.js
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Fetch SEQUENTIALLY to prevent hardware confusion
      const logsRes = await this.zk.getAttendances();
      
      await new Promise(resolve => setTimeout(resolve, 500));
      const usersRes = await this.zk.getUsers();

      return {
        logs: logsRes.data || [],
        users: usersRes.data || [],
        serial: this.config.zk_ip
      };
    } catch (err: any) {
      const msg = err?.message || String(err);
      logger.error('Hardware connection failed', msg);
      throw new Error(msg);
    } finally {
      try {
        await this.zk.disconnect();
        logger.info('Disconnected from ZK safely.');
      } catch (e) {}
    }
  }
}
