import { BrowserWindow, app, ipcMain } from "electron";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config";
import { Database } from "../Types/Database";
import { Config } from "../Types/Config";
import { Data } from "../Types/Data";

export default class DatabaseService {
  private _path: string = join(app.getAppPath(), config.launcher.databaseFile);
  private _db: Database = this.readData();

  constructor(window: BrowserWindow) {
    ipcMain.on("get-config", () => {
      this.sendConfig(window);
    });
    ipcMain.on("reset-config", () => {
      this.resetConfig();
      this.sendConfig(window);
    });
    ipcMain.on("update-config", (_, config: Config) => {
      this.updateConfig(config);
      this.sendConfig(window);
    });
    ipcMain.on("get-data", () => {
      this.sendData(window);
    });
    ipcMain.on("save-data", (_, data: Data) => {
      this.updateData(data);
    });
  }

  private readData(): Database {
    return JSON.parse(readFileSync(this._path, "utf8"));
  }

  private writeData() {
    writeFileSync(this._path, JSON.stringify(this._db));
  }

  private sendConfig(window: BrowserWindow) {
    window.webContents.send("config", this.db.config.user);
  }

  private updateConfig(config: Config) {
    this._db.config.user = { ...config };
    this.writeData();
    this._db = this.readData();
  }

  private resetConfig() {
    this._db.config.user = { ...this._db.config.default };
    this.writeData();
    this._db = this.readData();
  }

  private sendData(window: BrowserWindow) {
    window.webContents.send("data", this.db.data);
  }

  private updateData(data: Data) {
    this._db.data.unshift(data);
    this.writeData();
    this._db = this.readData();
  }

  public get db() {
    return this._db;
  }
}
