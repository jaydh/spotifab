const { app, BrowserWindow, globalShortcut, remote } = require('electron');
const url = require('url');
const path = require('path');
const widevine = require('electron-widevinecdm');
const isDev = require('electron-is-dev');
const windowStateKeeper = require('electron-window-state');
widevine.load(app);
let win;

function createWindow() {
  let mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 400
  });
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    webPreferences: {
      plugins: true
    }
  });
  mainWindowState.manage(win);
  // Create the browser window.
  win.loadURL('https://bard.jaydanhoward.com/');
  if (isDev) {
    win.webContents.openDevTools();
  }
  globalShortcut.register('MediaNextTrack', () =>
    win.webContents.executeJavaScript(`window.nextTrack()`)
  );
  globalShortcut.register('MediaPreviousTrack', () =>
    win.webContents.executeJavaScript(`window.previousTrack()`)
  );
  globalShortcut.register('MediaPlayPause', () =>
    win.webContents.executeJavaScript(`window.togglePlay()`)
  );
  globalShortcut.register('control+j', () =>
    win.webContents.executeJavaScript(`window.nextTrack()`)
  );
  globalShortcut.register('control+k', () =>
    win.webContents.executeJavaScript(`window.previousTrack()`)
  );
  globalShortcut.register('control+p', () =>
    win.webContents.executeJavaScript(`window.togglePlay()`)
  );

  globalShortcut.register('VolumeMute', () =>
    win.webContents.executeJavaScript(`window.toggleMute()`)
  );
  globalShortcut.register('control+m', () =>
    win.webContents.executeJavaScript(`window.toggleMute()`)
  );
  globalShortcut.register('control+u', () =>
    win.webContents.executeJavaScript(`window.volumeUp()`)
  );
  globalShortcut.register('control+n', () =>
    win.webContents.executeJavaScript(`window.volumeDown()`)
  );

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
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});
