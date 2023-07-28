const { app, BrowserWindow, globalShortcut  } = require('electron')

let win

const createWindow = () => {
    win = new BrowserWindow({
      width: 1000,
      height: 1000,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    win.loadFile('canvas.html')
  }

  app.whenReady().then(() => {

    const ret = globalShortcut.register('V', () => {
        createWindow()
        console.log('V is pressed')
      })
  
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })


  app.on('window-all-closed', () => {
  })


  

