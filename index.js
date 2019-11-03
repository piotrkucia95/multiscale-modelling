const electron  = require('electron');
const url       = require('url');
const path      = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 600;

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/main.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('close', function() {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('canvas:create', function(e, width, height) {
    var newWidth = parseInt(width) + INITIAL_WIDTH;
    var newHeight = parseInt(height) > INITIAL_HEIGHT - 100 ? parseInt(height) + 100 : INITIAL_HEIGHT;
    mainWindow.setSize(newWidth, newHeight);
});

ipcMain.on('export:enable', function(e) {
    mainMenuTemplate[0].submenu[0].submenu[1].enabled = true;
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('export:disable', function(e) {
    mainMenuTemplate[0].submenu[0].submenu[1].enabled = false;
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Microstructure',
                submenu: [
                    {
                        label: 'Import',
                        click() {
                            console.log('Import placeholder');
                        }
                    }, {
                        label: 'Export',
                        enabled: false,
                        click() {
                            console.log('Export placeholder');
                        }
                    }
                ]
            },
            {
                role: 'reload'
            }
        ]
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

// Add developer tools items if not in production
if (process.env.NODE_ENV != 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload',
            }
        ]
    });
}