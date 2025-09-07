import { atom } from "recoil";
import { StepState } from "../common/interface";

export const atomCrntStep = atom<StepState>({
  key: "step",
  default: 0,
});
