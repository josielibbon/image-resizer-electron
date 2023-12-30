const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

process.env.NODE_ENV = 'production';

const isDev = process.env.NODE_ENV !== 'production';
//darwin on mac, win32 on windows, linux on linux
const isMac = process.platform === 'darwin'

let mainWindow;

//creates main window
//uses chromium under the hood
function createMainWindow() {
    mainWindow = new BrowserWindow({
        title: 'Image Resizer',
        //size ternary
        width: isDev ? 1000 : 500,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    //open devtools if in dev env
    if(isDev) {
        mainWindow.webContents.openDevTools();
    }

    //window loads our html file in renderer
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));

}

//create about window
function createAboutWindow(){
    const aboutWindow = new BrowserWindow({
        title: 'About Image Resizer',
        //size ternary
        width: 300,
        height: 300
    });

    //window loads our html file in renderer
    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));

}

//when app is ready the window is created
app.whenReady().then(() => {
    createMainWindow();

    //implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    //remove mainWindow from memory on close
    mainWindow.on('closed', () => (mainWindow = null));

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    })
});

//menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
            },
        ],
    }] : []),
    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label: 'Help',
        submenu: [
            {
                label:'About',
                click: createAboutWindow,
            },
        ],
    }] : [])
];

//respond to ipcRenderer resize
ipcMain.on('image:resize', (e, options) => {
    options.dest = path.join(os.homedir(), 'image:resizer');
    resizeImage(options);
});

//resize the image
async function resizeImage({ imgPath, width, height, dest }) {
    try {
        const newPath = await resizeImg(fs.readFileSync(imgPath), {
            width: +width,
            height: +height,
        });

        //create filename
        const filename = path.basename(imgPath);

        //create dest folder if doesn't exist
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }

        //write file to dest
        fs.writeFileSync(path.join(dest, filename), newPath);

        //send success to render
        mainWindow.webContents.send('image:done')

        //open dest folder
        shell.openPath(dest);
    } catch (error) {
        console.log(error);
    }
}

//makes quit be standard + cross-platform
//listening for an event (all windows closed)
app.on('window-all-closed', () => {
    if(!isMac) {
        app.quit()
    }
})