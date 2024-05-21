export type Config = {
  bluetooth: {
    primaryService: string;
    characteristic: string;
    attemptsToFindTheDevice: number;
  };
  network: {
    URI: string;
    requestInterval: number;
  };
  serial: {
    baudRate: number;
    delimiter: string;
  };
};
