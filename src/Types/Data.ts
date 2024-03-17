import { CONNECTION } from "../Enums/Connection";
import { Reading } from "./Reading";

export type Data = {
  device: string;
  connection: CONNECTION;
  date: Date;
  readings: Reading[];
};
