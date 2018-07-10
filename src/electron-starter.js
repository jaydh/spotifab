const { app, BrowserWindow, globalShortcut, remote } = require('electron');
const url = require('url');
const path = require('path');
const widevine = require('electron-widevinecdm');
const isDev = require('electron-is-dev');
widevine.load(app);
let win;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      plugins: true
    }
  });

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  win.webContents.openDevTools();
  globalShortcut.register('CommandOrControl+j', () => {
    win.webContents.executeJavaScript(`window.nextTrack()`);
  });
  globalShortcut.register('CommandOrControl+k', () => {
    win.webContents.executeJavaScript(`window.previousTrack()`);
  });
  globalShortcut.register('CommandOrControl+p', () => {
    win.webContents.executeJavaScript(`window.togglePlay()`);
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('will-quit', () => {
  // Unregister a shortcut.
  globalShortcut.unregister('CommandOrControl+X');

  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
