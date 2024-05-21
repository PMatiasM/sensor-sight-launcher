import { Button } from "./Button";
import { Variable } from "./Variable";

export type Experiment = {
  id: string;
  name: string;
  variables: Variable[];
  buttons: Button[];
  chart: boolean;
  terminal: boolean;
};
