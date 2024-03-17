import { Config } from "./Config";
import { Data } from "./Data";

export type Database = {
  config: {
    default: Config;
    user: Config;
  };
  data: Data[];
};
