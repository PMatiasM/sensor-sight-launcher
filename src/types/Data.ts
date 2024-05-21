import { CONNECTION } from "../enums/Connection";
import { Experiment } from "./Experiment";
import { Reading } from "./Reading";

export type Data = {
  id: string;
  experiment: Experiment;
  device: string;
  connection: CONNECTION;
  date: Date;
  readings: Reading[][];
};
