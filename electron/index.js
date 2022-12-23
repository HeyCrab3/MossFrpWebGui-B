const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      devTools: true,
      // 集成网页和 Node.js，也就是在渲染进程中，可以调用 Node.js 方法
      nodeIntegration: true,
      contextIsolation: false,
      //允许html页面上的javascipt代码访问nodejs 环境api代码的能力（与node集成的意思）
    }
  })
  if (process.env.NODE_ENV != 'development') {
      win.loadFile(path.join(__dirname, "../index.html"));
  } else {
    win.loadURL(`http://localhost:5173`)
  }
  win.webContents.openDevTools();
}
app.on('ready', () => {
  // Menu.setApplicationMenu(Menu.buildFromTemplate([]))
})
app.whenReady().then(createWindow)