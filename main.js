const { app, BrowserWindow, globalShortcut, clipboard, ipcMain, desktopCapturer  } = require('electron')

let win
let imageData

const createWindow = () => {
    win = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences: {
        nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      }
    })
  
    win.loadFile('canvas.html')
  }

  app.whenReady().then(() => {

    const ret = globalShortcut.register('V', () => {
        createWindow()
        console.log('V is pressed')
        desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 3440, height: 1440 }})
        .then( sources => {
            imageData = sources[0].thumbnail.toDataURL() // The image to display the screenshot
        })
    })
  
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })


  app.on('window-all-closed', () => {
  })


  ipcMain.on('requestImage', (event, arg) => {
    event.sender.send('imageData', imageData)
  })


  

