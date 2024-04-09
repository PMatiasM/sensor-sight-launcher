import { BrowserWindow, app, ipcMain } from "electron";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "../config";
import { Database } from "../types/Database";
import { Config } from "../types/Config";
import { Data } from "../types/Data";
import { Experiment } from "../types/Experiment";

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
    ipcMain.on("get-experiment", () => {
      this._sendExperiment(window);
    });
    ipcMain.on("create-experiment", (_, experiment: Experiment) => {
      this._createExperiment(experiment);
      this._sendExperiment(window);
    });
    ipcMain.on("update-experiment", (_, id: string, experiment: Experiment) => {
      this._updateExperiment(id, experiment);
      this._sendExperiment(window);
    });
    ipcMain.on("delete-experiment", (_, id: string) => {
      this._deleteExperiment(id);
      this._sendExperiment(window);
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

  private _sendExperiment(window: BrowserWindow) {
    window.webContents.send(
      "experiment",
      this._db.experiment.default,
      this._db.experiment.user
    );
  }

  private _createExperiment(experiment: Experiment) {
    this._db.experiment.user.push({ ...experiment });
    this._writeData();
    this._db = this._readData();
  }

  private _updateExperiment(id: string, experiment: Experiment) {
    const index = this._db.experiment.user.findIndex(
      (experiment) => experiment.id === id
    );
    this._db.experiment.user[index] = { ...experiment };
    this._writeData();
    this._db = this._readData();
  }

  private _deleteExperiment(id: string) {
    const index = this._db.experiment.user.findIndex(
      (experiment) => experiment.id === id
    );
    this._db.experiment.user.splice(index, 1);
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
