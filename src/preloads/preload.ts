import { contextBridge, ipcRenderer } from "electron";
import { PortInfo } from "@serialport/bindings-interface";
import { Config } from "../types/Config";
import { Data } from "../types/Data";
import { Experiment } from "../types/Experiment";

contextBridge.exposeInMainWorld("electronAPI", {
  // Main
  minimize: () => ipcRenderer.send("minimize"),
  close: () => ipcRenderer.send("close"),
  cleanListeners: (channels: string[]) => {
    for (let index = 0; index < channels.length; index++) {
      const channel = channels[index];
      ipcRenderer.removeAllListeners(channel);
    }
  },

  // Database
  // Config
  getConfig: () => ipcRenderer.send("get-config"),
  config: (
    callback: (event: Electron.IpcRendererEvent, config: Config) => void
  ) => ipcRenderer.on("config", callback),
  updateConfig: (config: Config) => ipcRenderer.send("update-config", config),
  resetConfig: () => ipcRenderer.send("reset-config"),
  // Experiment
  getExperiment: () => ipcRenderer.send("get-experiment"),
  experiment: (
    callback: (
      event: Electron.IpcRendererEvent,
      defaultExperiment: Experiment[],
      userExperiment: Experiment[]
    ) => void
  ) => ipcRenderer.on("experiment", callback),
  createExperiment: (experiment: Experiment) =>
    ipcRenderer.send("create-experiment", experiment),
  updateExperiment: (id: string, experiment: Experiment) =>
    ipcRenderer.send("update-experiment", id, experiment),
  deleteExperiment: (id: string) => ipcRenderer.send("delete-experiment", id),
  // Data
  getData: () => ipcRenderer.send("get-data"),
  data: (callback: (event: Electron.IpcRendererEvent, data: Data[]) => void) =>
    ipcRenderer.on("data", callback),
  saveData: (data: Data) => ipcRenderer.send("save-data", data),
  deleteData: (id: string) => ipcRenderer.send("delete-data", id),

  // Bluetooth
  cancelBluetoothRequest: () => ipcRenderer.send("cancel-bluetooth-request"),
  getBluetoothDeviceList: (
    callback: (
      event: Electron.IpcRendererEvent,
      deviceList: Electron.BluetoothDevice[]
    ) => void
  ) => ipcRenderer.on("get-bluetooth-device-list", callback),
  selectBluetoothDevice: (deviceId: string) =>
    ipcRenderer.send("select-bluetooth-device", deviceId),

  // Serial
  getSerialPortList: () => ipcRenderer.send("get-serial-port-list"),
  serialPortList: (
    callback: (event: Electron.IpcRendererEvent, portList: PortInfo[]) => void
  ) => ipcRenderer.on("serial-port-list", callback),
  connectSerialPort: (path: string, baudRate: number, delimiter: string) =>
    ipcRenderer.send("connect-serial-port", path, baudRate, delimiter),
  serialPortReading: (
    callback: (event: Electron.IpcRendererEvent, reading: string) => void
  ) => ipcRenderer.on("serial-port-reading", callback),
  serialPortWriting: (writing: string) =>
    ipcRenderer.send("serial-port-writing", writing),
  serialPortConnected: (
    callback: (
      event: Electron.IpcRendererEvent,
      connected: boolean,
      path: string
    ) => void
  ) => ipcRenderer.on("serial-port-connected", callback),
  disconnectSerialPort: () => ipcRenderer.send("disconnect-serial-port"),
});
