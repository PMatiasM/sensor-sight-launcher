import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "node:path";
import { config } from "./config";
import DatabaseService from "./services/Database";
import BluetoothService from "./services/Bluetooth";
import SerialService from "./services/Serial";

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: false,
    fullscreen: false,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#201c1c",
    webPreferences: {
      preload: join(__dirname, "preloads", "preload.js"),
      experimentalFeatures: true,
      // devTools: false,
    },
  });

  ipcMain.on("minimize", () => win.minimize());
  ipcMain.on("close", () => win.close());

  const databaseService = new DatabaseService(win);
  const bluetoothService = new BluetoothService(win);
  const serialService = new SerialService(win);

  win.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin, details) => {
      if (permission === "serial") {
        return true;
      }
      return false;
    }
  );

  win.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === "serial") {
      return true;
    }
    return false;
  });

  win.webContents.session.on("will-download", (event, item, webContents) => {
    item.setSaveDialogOptions({ title: "Export Data" });
  });

  win.loadURL(config.launcher.URI);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
