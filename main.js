const { app, BrowserWindow } = require("electron");
const url = require("url");
const path = require("path");

let win;

const createWindow = () => {
    win = new BrowserWindow({
        width: 1024,
        height: 576
    });
    win.loadURL(url.format({
        pathname: path.join(__dirname, '/public/index.html'),
        protocol: "file",
        slashes: true
    }))

    win.on('close', () => {
        win = null;
    })
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
})
app.on("activate", () => {
    if(win == null){
        createWindow();
    }
})