declare module 'node-zklib' {
  export default class ZKLib {
    constructor(ip: string, port: number, timeout: number, inactivityTimeout: number);
    createSocket(): Promise<void>;
    getAttendances(): Promise<{ data: any[] }>;
    getUsers(): Promise<{ data: any[] }>;
    getInfo(): Promise<any>;
    disconnect(): Promise<void>;
  }
}
