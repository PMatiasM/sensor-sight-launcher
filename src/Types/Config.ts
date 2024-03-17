export type Config = {
  bluetooth: {
    primaryService: string;
    characteristic: string;
    attemptsToFindTheDevice: number;
  };
  serial: {
    baudRate: number;
    delimiter: string;
  };
};
