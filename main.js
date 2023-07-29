const { Menu, app, BrowserWindow, globalShortcut, clipboard, ipcMain, desktopCapturer, Notification, shell  } = require('electron')


let win
let imageData
const createWindow = () => {
    win = new BrowserWindow({
      titleBarStyle: 'hidden',
      width: 1000,
      height: 1000,
      frame: false,
      transparent: false,
      alwaysOnTop: true,
      focusable: false, //THIS IS THE KEY
      closable: true,
      fullscreenable: false,
      maximizable: false,
      resizable: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      }
    })
  
    win.loadFile('canvas.html')

    var contextMenu = Menu.buildFromTemplate([
      { label: 'Show App', click:  function(){
          win.show();
      } },
      { label: 'Quit', click:  function(){
          app.isQuiting = true;
          app.quit();
      } }
    ]);

    Menu.setApplicationMenu(contextMenu)
  }

  app.whenReady().then(() => {

        const TITLE1 = "kayaShot"
        const BODY1 = "kayaShot is ready to go!"
        new Notification({title: TITLE1, body : BODY1}).show();

    const ret = globalShortcut.register('Alt+V',async  () => {

        const TITLE = "kayaShot"
        const BODY = "Successfully created screenshot!"
        new Notification({title: TITLE, body : BODY}).show();

        
        
        
        console.log('V is pressed')
        desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 3440, height: 1440 }})
        .then( sources => {
            imageData = sources[0].thumbnail.toDataURL() // The image to display the screenshot
        })
        await sleep(200);
        if (BrowserWindow.getAllWindows().length !== 0) { win.close()}
        createWindow()
      
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

  ipcMain.on('uploadImage', async (event, arg) => {


    let base64result = arg.split(',')[1];
                    
    const requestOptions = {
    method : "PUT",
    headers : { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body : JSON.stringify({imageData:base64result})
    }

    let baseLink = "http://www.malenkaya.net/imagehost/"
    let response = await fetch("http://malenkaya.net/api/images/upload", requestOptions)
    let newRes = await response.json()
    let fullLink = baseLink+newRes.link
    clipboard.writeText(fullLink)

    const TITLE = "kayaShot"
    const BODY = "Successfully uploaded screenshot!"
    new Notification({title: TITLE, body : BODY}).show();

    shell.openExternal(fullLink)

  })

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  ipcMain.on('quit', (event, arg) => {
    app.quit();
  })

  ipcMain.on('minimize', (event, arg) => {
    win.close()
  })



  

