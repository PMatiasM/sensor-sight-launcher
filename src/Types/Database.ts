import { Config } from "./Config";
import { Data } from "./Data";
import { Experiment } from "./Experiment";

export type Database = {
  config: {
    default: Config;
    user: Config;
  };
  experiment: {
    default: Experiment[];
    user: Experiment[];
  };
  data: Data[];
};
