import * as THREE from "three";
import { StepState } from "./interface";

const hSel = THREE.MathUtils.randInt(0, 2);

export function makeHSLRandomColor() {
  let h = THREE.MathUtils.randInt(200, 240);
  switch (hSel) {
    case 0:
      h = THREE.MathUtils.randInt(200, 240); // blue
      break;
    case 1:
      h = THREE.MathUtils.randInt(0, 40); // red
      break;
    case 2:
      h = THREE.MathUtils.randInt(60, 100); //green
      break;
  }
  const s = THREE.MathUtils.randInt(60, 100);
  const l = THREE.MathUtils.randInt(40, 95);

  // return "hsl(" + h + "," + s + "," + l + ")";
  return `hsl(${h},${s}%,${l}%)`;
}

export function stepToString(step: StepState) {
  let res = "";
  switch (step) {
    case StepState.NONE:
      res = "NONE";
      break;
    case StepState.STEP_1:
      res = "STEP_1";
      break;
    case StepState.STEP_1_AND_2:
      res = "STEP_1_AND_2";
      break;
    case StepState.STEP_2:
      res = "STEP_2";
      break;
    case StepState.STEP_3:
      res = "STEP_3";
      break;
    default:
      res = "NONE";
      break;
  }
  return res;
}
