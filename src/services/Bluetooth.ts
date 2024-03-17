import { BrowserWindow, ipcMain } from "electron";

export default class BluetoothService {
  private _selectBluetoothCallback: ((deviceId: string) => void) | null = null;

  constructor(window: BrowserWindow) {
    window.webContents.on(
      "select-bluetooth-device",
      (event, deviceList, callback) => {
        event.preventDefault();
        this._selectBluetoothCallback = callback;
        window.webContents.send("get-bluetooth-device-list", deviceList);
      }
    );

    ipcMain.on("select-bluetooth-device", (_, deviceId: string) => {
      if (this._selectBluetoothCallback) {
        this._selectBluetoothCallback(deviceId);
        this._selectBluetoothCallback = null;
      }
    });

    ipcMain.on("cancel-bluetooth-request", () => {
      if (this._selectBluetoothCallback) {
        this._selectBluetoothCallback("");
        this._selectBluetoothCallback = null;
      }
    });
  }
}
