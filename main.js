// main.js — Yawi Ride (offline)
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Yawi Ride',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false
    }
  });

  // Chemin du build local (index.html doit exister ici)
  const indexPath = path.join(__dirname, 'build', 'index.html');

  if (fs.existsSync(indexPath)) {
    // 100% hors-ligne : charge le build local
    mainWindow.loadFile(indexPath);
  } else {
    // Secours (si pas encore de build local copié) : charge la version en ligne
    const ONLINE_URL = 'https://application-yawi-rid-9wja.bolt.host';
    mainWindow.loadURL(ONLINE_URL);
  }

  // Ouvrir les liens externes dans le navigateur
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  // Menu minimal (tu peux l’enlever si tu veux)
  Menu.setApplicationMenu(null);

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
