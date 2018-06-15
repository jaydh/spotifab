const { app, BrowserWindow, globalShortcut, remote } = require('electron');
const url = require('url');
const path = require('path');
const widevine = require('electron-widevinecdm');
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
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: path.join(__dirname, '/../build/index.html'),
      protocol: 'file:',
      slashes: true
    });
  win.loadURL(startUrl); // Open the DevTools.
  win.webContents.openDevTools();
  globalShortcut.register('CommandOrControl+j', () => {
    win.webContents.executeJavaScript(`window.player.nextTrack()`);
  });
  globalShortcut.register('CommandOrControl+k', () => {
    win.webContents.executeJavaScript(`window.player.previousTrack()`);
  });
  globalShortcut.register('CommandOrControl+p', () => {
    win.webContents.executeJavaScript(`window.player.togglePlay()`);
  });

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
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
