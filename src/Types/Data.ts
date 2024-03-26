import { CONNECTION } from "../enums/Connection";
import { Reading } from "./Reading";

export type Data = {
  device: string;
  connection: CONNECTION;
  date: Date;
  readings: Reading[];
};
