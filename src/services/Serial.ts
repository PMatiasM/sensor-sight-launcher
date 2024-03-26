import { BrowserWindow, ipcMain } from "electron";
import { ReadlineParser, SerialPort } from "serialport";

export default class SerialService {
  private _connectedPort: SerialPort | null = null;

  constructor(window: BrowserWindow) {
    ipcMain.on("get-serial-port-list", async () => {
      window.webContents.send("serial-port-list", await this._listPorts());
    });

    ipcMain.on(
      "connect-serial-port",
      async (_, path: string, baudRate: number, delimiter: string) => {
        this._connect(window, path, baudRate);
        if (this._connectedPort) {
          const parser = this._connectedPort.pipe(
            new ReadlineParser({ delimiter, includeDelimiter: true })
          );
          parser.on("data", (reading) => {
            window.webContents.send(
              "serial-port-reading",
              reading.toString("utf8")
            );
          });
        }
      }
    );

    ipcMain.on("serial-port-writing", (_, writing: string) =>
      this._write(writing)
    );

    ipcMain.on("disconnect-serial-port", () => this._disconnect(window));
  }

  private async _listPorts() {
    return await SerialPort.list();
  }

  private _connect(window: BrowserWindow, path: string, baudRate: number) {
    this._connectedPort = new SerialPort({ path, baudRate }, (error) => {
      if (error) {
        this._connectedPort = null;
        window.webContents.send("serial-port-connected", false, "");
      } else {
        window.webContents.send(
          "serial-port-connected",
          true,
          this._connectedPort!.path
        );
      }
    });
  }

  private _write(writing: string) {
    if (this._connectedPort) {
      this._connectedPort.write(writing);
    }
  }

  private _disconnect(window: BrowserWindow) {
    if (this._connectedPort) {
      this._connectedPort.close();
    }
    this._connectedPort = null;
    window.webContents.send("serial-port-connected", false, "");
  }
}
