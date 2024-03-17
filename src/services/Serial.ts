import { BrowserWindow, ipcMain } from "electron";
import { ReadlineParser, SerialPort } from "serialport";

export default class SerialService {
  private _connectedPort: SerialPort | null = null;

  constructor(window: BrowserWindow) {
    ipcMain.on("get-serial-port-list", async () => {
      window.webContents.send("serial-port-list", await this.listPorts());
    });

    ipcMain.on(
      "connect-serial-port",
      async (_, path: string, baudRate: number, delimiter: string) => {
        this.connect(window, path, baudRate);
        if (this.connectedPort) {
          const parser = this.connectedPort.pipe(
            new ReadlineParser({ delimiter })
          );
          parser.on("data", (reading) => {
            const parsedReading = Number(reading.toString("utf8"));
            if (!isNaN(parsedReading)) {
              window.webContents.send("serial-port-reading", parsedReading);
            }
          });
        }
      }
    );

    ipcMain.on("disconnect-serial-port", () => this.disconnect(window));
  }

  public async listPorts() {
    return await SerialPort.list();
  }

  public connect(window: BrowserWindow, path: string, baudRate: number) {
    this._connectedPort = new SerialPort({ path, baudRate }, (error) => {
      if (error) {
        this._connectedPort = null;
        window.webContents.send("serial-port-connected", false, "");
      } else {
        window.webContents.send(
          "serial-port-connected",
          true,
          this.connectedPort?.path
        );
      }
    });
  }

  public disconnect(window: BrowserWindow) {
    if (this._connectedPort) {
      this._connectedPort.close();
    }
    this._connectedPort = null;
    window.webContents.send("serial-port-connected", false, "");
  }

  public get connectedPort() {
    return this._connectedPort;
  }
}
