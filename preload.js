const { contextBridge, ipcRenderer } = require('electron');

// Exposer des APIs sécurisées au processus de rendu
contextBridge.exposeInMainWorld('electronAPI', {
  // Écouter les actions du menu
  onMenuAction: (callback) => {
    ipcRenderer.on('menu-action', callback);
  },
  
  // Supprimer les écouteurs
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // Informations sur la plateforme
  platform: process.platform,
  
  // Version de l'application
  getVersion: () => {
    return process.env.npm_package_version || '1.0.0';
  }
});