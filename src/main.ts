import { app, BrowserWindow, dialog } from "electron";
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
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "preloads", "preload.js"),
      experimentalFeatures: true,
    },
  });

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

  win.on("close", async (event) => {
    const url = new URL(win.webContents.getURL());
    if (url.pathname !== "/dashboard") {
      return;
    }
    event.preventDefault();
    const { response } = await dialog.showMessageBox(win, {
      type: "question",
      title: "  Confirm  ",
      message: "Are you sure that you want to close this window?",
      buttons: ["Yes", "No"],
    });

    response === 0 && win.destroy();
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
