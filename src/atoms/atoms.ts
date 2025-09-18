import { atom } from "recoil";
import { StepState } from "../common/interface";

export const atomCrntStep = atom<StepState>({
  key: "step",
  default: 0,
});

export const atomCrntScrollY = atom<number>({
  key: "scroll",
  default: 0,
});

export const atomCrntIsDebug = atom<boolean>({
  key: "isDebug",
  default: false,
});
