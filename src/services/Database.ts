import { BrowserWindow, app, ipcMain } from "electron";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config";
import { Database } from "../types/Database";
import { Config } from "../types/Config";
import { Data } from "../types/Data";

export default class DatabaseService {
  private _path: string = join(app.getAppPath(), config.launcher.databaseFile);
  private _db: Database = this._readData();

  constructor(window: BrowserWindow) {
    ipcMain.on("get-config", () => {
      this._sendConfig(window);
    });
    ipcMain.on("reset-config", () => {
      this._resetConfig();
      this._sendConfig(window);
    });
    ipcMain.on("update-config", (_, config: Config) => {
      this._updateConfig(config);
      this._sendConfig(window);
    });
    ipcMain.on("get-data", () => {
      this._sendData(window);
    });
    ipcMain.on("save-data", (_, data: Data) => {
      this._updateData(data);
    });
  }

  private _readData(): Database {
    return JSON.parse(readFileSync(this._path, "utf8"));
  }

  private _writeData() {
    writeFileSync(this._path, JSON.stringify(this._db));
  }

  private _sendConfig(window: BrowserWindow) {
    window.webContents.send("config", this._db.config.user);
  }

  private _updateConfig(config: Config) {
    this._db.config.user = { ...config };
    this._writeData();
    this._db = this._readData();
  }

  private _resetConfig() {
    this._db.config.user = { ...this._db.config.default };
    this._writeData();
    this._db = this._readData();
  }

  private _sendData(window: BrowserWindow) {
    window.webContents.send("data", this._db.data);
  }

  private _updateData(data: Data) {
    this._db.data.unshift(data);
    this._writeData();
    this._db = this._readData();
  }
}
