/*
Electron build configuration.
Sourced from:
https://gist.github.com/kitze/42bfc85e8f41ebe777609c250b183eec#file-electron-js
*/

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

// const path = require('path');
require('url');
const isDev = require('electron-is-dev');

if (!isDev) {require('./electron-server')};

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow(
        {
            width: 900, 
            height: 680,
            title: "EnviroLogistics",
            icon: __dirname + '/favicon.ico',
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                nativeWindowOpen: true,
            }
        }
    );
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : 'http://localhost:3007'); //isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on("browser-window-created", (e, win) => {
    win.removeMenu();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});