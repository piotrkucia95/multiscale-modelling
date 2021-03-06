const electron      = require('electron');
const url           = require('url');
const path          = require('path');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;

const INITIAL_WIDTH = 400;
const INITIAL_HEIGHT = 620;

// SET ENV
// process.env.NODE_ENV = 'production';

let mainWindow;

app.on('ready', function() {
    mainWindow = new BrowserWindow({
        width: INITIAL_WIDTH,
        height: INITIAL_HEIGHT,
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
    var newWidth = parseInt(width) + INITIAL_WIDTH + 100;
    var newHeight = parseInt(height) > INITIAL_HEIGHT - 100 ? parseInt(height) + 100 : INITIAL_HEIGHT;
    mainWindow.setSize(newWidth, newHeight);
});

ipcMain.on('export:enable', function(e, blob, states, ) {
    mainMenuTemplate[1].submenu[1].enabled = true;
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

ipcMain.on('export:disable', function(e) {
    mainMenuTemplate[1].submenu[1].enabled = false;
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Reload',
                accelerator: process.platform == 'darwin' ? 'Command+R' : 'Ctrl+R',
                click() {
                    app.relaunch({ args: process.argv.slice(1).concat(['--relaunch']) });
                    app.quit();
                }
            }, 
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }, {
        label: 'Microstructure',
        submenu: [
            {
                label: 'Import',
                click() {
                    dialog.showOpenDialog([], {
                        openFile: true
                    }).then(function(file) {
                        var filePath = file.filePaths[0];
                        if (filePath.includes('.txt')) {
                            mainWindow.webContents.send('canvas:import:txt', filePath);
                        } else if (filePath.includes('.bmp') || filePath.includes('.png') || filePath.includes('.jpg') || filePath.includes('.jpeg')) {
                            mainWindow.webContents.send('canvas:import:img', filePath);
                        } else {
                            mainWindow.webContents.send('error', '');
                        }
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
            }, {
                label: 'Export',
                enabled: false,
                submenu: [
                    {
                        label: 'TXT',
                        click() {
                            mainWindow.webContents.send('canvas:export:txt');
                        }
                    }, {
                        label: 'IMAGE',
                        click() {
                            mainWindow.webContents.send('canvas:export:img');
                        }
                    }
                ]
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
        ]
    });
}