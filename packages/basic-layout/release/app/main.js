const path = require('path');
const { app, BrowserWindow, shell, ipcMain, dialog } = require('electron');
const log = require('electron-log');
const MenuBuilder = require('./menu').MenuBuilder;

// 错误日志
process.on('uncaughtException', log.error);
log.info('process.version', process.version);
log.info('process.type', process.type);
log.info('process.env', process.env);

let mainWindow = null;

const isDebug = true || process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, './assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: true,
    width: 1400,
    height: 800,
    icon: getAssetPath('icon.png'),
    title: `Polymita${isDebug ? ' - debug' : ''}`,
    webPreferences: {
      devTools: isDebug || !app.isPackaged,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // mainWindow.loadURL('./index.html');
  mainWindow.loadURL(`file://${path.join(__dirname, './index.html')}`);

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    // if (process.env.START_MINIMIZED) {
    //   mainWindow.minimize();
    // } else {
    //   mainWindow.show();
    // }
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  // new AppUpdater();

  return mainWindow;
};

const restartMainWindow = () => {
  mainWindow?.close();
  setTimeout(() => {
    createWindow();
  }, 500);
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {

    app.on('activate', async () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        await createWindow();
      }
    });

    createWindow();
  })
  .catch(log.error);


ipcMain.handle('nodejs', async (module, api, args) => {
  const result = require(module)[api];
  if (typeof result === 'function') {
    return result(...args);
  }
  return result;
});