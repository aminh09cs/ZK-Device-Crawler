import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { SyncService } from './services/sync.service';
import { ZKService } from './services/zk.service';
import { AppConfig } from './types';
import * as fs from 'fs';
import { TrayManager } from './tray/TrayManager';

let mainWindow: BrowserWindow | null = null;
let trayManager: TrayManager | null = null;
let isSyncing = false;

(app as any).isQuitting = false;

const configPath = path.join(process.cwd(), 'config.json');
const config: AppConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const zkService = new ZKService(config);
const syncService = new SyncService(zkService);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 650,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'Mayhomes ZK Sync Agent'
  });

  mainWindow.loadFile(path.join(__dirname, 'ui/index.html'));

  mainWindow.on('close', (event) => {
    if (!(app as any).isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
    return false;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('init', config);
    setTimeout(() => handleSync(), 2000);
  });
}

async function handleSync() {
  if (isSyncing) return;
  isSyncing = true;
  mainWindow?.webContents.send('log', 'Connecting to hardware...');
  
  try {
    const result: any = await syncService.execute();
    
    // Send detailed logs to UI
    if (result.data && result.data.length > 0) {
      result.data.forEach((r: any, i: number) => {
        mainWindow?.webContents.send('log', `[${i+1}] ID: ${r.userId.padEnd(5)} | Time: ${r.timestamp}`);
      });
    } else {
      mainWindow?.webContents.send('log', 'No new records found in the last 24h.');
    }

    mainWindow?.webContents.send('status-update', result);
  } catch (err: any) {
    mainWindow?.webContents.send('log', `Error: ${err.message}`);
    mainWindow?.webContents.send('status-update', { status: 'failed', processed: 0 });
  } finally {
    isSyncing = false;
  }
}

app.whenReady().then(() => {
  createWindow();
  trayManager = new TrayManager(() => handleSync(), () => mainWindow?.show());
  trayManager.init();
  
  const intervalMs = (config.sync_interval_minutes || 15) * 60 * 1000;
  setInterval(() => handleSync(), intervalMs);
});

ipcMain.handle('force-sync', async () => {
  handleSync();
  return { status: 'requested' };
});

ipcMain.handle('get-config', () => config);
