declare module 'node-zk-ahris' {
  class ZKLib {
    constructor(ip: string, port: number, timeout: number, inactivityTimeout: number);
    createSocket(): Promise<void>;
    getAttendances(): Promise<{ data: any[] }>;
    getUsers(): Promise<{ data: any[] }>;
    disconnect(): Promise<void>;
  }
  export default ZKLib;
}
