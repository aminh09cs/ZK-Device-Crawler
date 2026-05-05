import { Tray, Menu, nativeImage, app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

export class TrayManager {
  private tray!: Tray;

  constructor(
    private onSync: () => void,
    private onShowDashboard: () => void
  ) {}

  init() {
    const iconPath = path.join(process.cwd(), 'assets', 'icon.png');
    let icon = nativeImage.createEmpty();
    
    if (fs.existsSync(iconPath)) {
      icon = nativeImage.createFromPath(iconPath);
    } else {
      // Use default icon if file not found
      icon = nativeImage.createFromPath(path.join(__dirname, '../../assets/icon.png'));
    }

    this.tray = new Tray(icon);
    this.tray.setToolTip('Mayhomes ZK Agent');

    const menu = Menu.buildFromTemplate([
      { label: '🖥 Dashboard', click: this.onShowDashboard },
      { label: '🔄 Sync Now', click: this.onSync },
      { type: 'separator' },
      { label: '❌ Exit', click: () => app.exit(0) },
    ]);

    this.tray.setContextMenu(menu);
    this.tray.on('double-click', this.onShowDashboard);
  }

  // Remove old update() method as menu is no longer used for info display
}
