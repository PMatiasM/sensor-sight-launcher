import { contextBridge, ipcRenderer } from "electron";
import { PortInfo } from "@serialport/bindings-interface";
import { Config } from "../Types/Config";
import { Data } from "../Types/Data";

contextBridge.exposeInMainWorld("electronAPI", {
  // Main
  getConfig: () => ipcRenderer.send("get-config"),
  config: (
    callback: (event: Electron.IpcRendererEvent, config: Config) => void
  ) => ipcRenderer.on("config", callback),
  updateConfig: (config: Config) => ipcRenderer.send("update-config", config),
  resetConfig: () => ipcRenderer.send("reset-config"),
  getData: () => ipcRenderer.send("get-data"),
  data: (callback: (event: Electron.IpcRendererEvent, data: Data[]) => void) =>
    ipcRenderer.on("data", callback),
  saveData: (data: Data) => ipcRenderer.send("save-data", data),
  cleanListeners: (channels: string[]) => {
    for (let index = 0; index < channels.length; index++) {
      const channel = channels[index];
      ipcRenderer.removeAllListeners(channel);
    }
  },

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
    callback: (event: Electron.IpcRendererEvent, reading: number) => void
  ) => ipcRenderer.on("serial-port-reading", callback),
  serialPortConnected: (
    callback: (
      event: Electron.IpcRendererEvent,
      connected: boolean,
      path: string
    ) => void
  ) => ipcRenderer.on("serial-port-connected", callback),
  disconnectSerialPort: () => ipcRenderer.send("disconnect-serial-port"),
});
