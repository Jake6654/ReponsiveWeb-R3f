import * as THREE from "three";
import { StepState } from "./interface";
import { ballCount, velocity } from "./constants";

const hSel = THREE.MathUtils.randInt(0, 2);

export function makeHSLRandomColor(isAppBar: boolean = false) {
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
  let l = THREE.MathUtils.randInt(40, 95);
  if (isAppBar) {
    l = THREE.MathUtils.randInt(20, 50);
  }

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

export function initBallOptions(viewport: any) {
  const posLimitX = viewport.width * 0.5;
  const posLimitY = viewport.height * 0.5;

  const ballRadiusArrIn: number[] = [];
  const posVectorsIn: THREE.Vector3[] = [];
  const targetVectorsIn: THREE.Vector3[] = [];
  const balltoTargetVectorsIn: THREE.Vector3[] = [];
  const velocityArrayIn: number[] = [];
  const accelerationArrayIn: number[] = [];

  for (let i = 0; i < ballCount; i++) {
    // random radius
    const randomRadius = THREE.MathUtils.randFloat(0.1, 0.8);
    // random position
    const ballAX = THREE.MathUtils.randFloat(
      -posLimitX + randomRadius,
      posLimitX - randomRadius
    );
    const ballAY = THREE.MathUtils.randFloat(
      -posLimitY + randomRadius,
      posLimitY - randomRadius
    );
    const posVector = new THREE.Vector3(ballAX, ballAY, 0);

    // 현재 만들어진 포지션과 기존의 포지션의 거리를 검사하여 겹치치 않게 생성
    let isOverlay = false;
    posVectorsIn.forEach((vec: THREE.Vector3, vecIdx: number) => {
      const dis = posVector.distanceTo(vec);
      const prevRadius = ballRadiusArrIn[vecIdx];
      if (dis < prevRadius + randomRadius) {
        isOverlay = true;
      }
    });
    if (isOverlay) continue;

    ballRadiusArrIn.push(randomRadius);
    posVectorsIn.push(posVector); // for each loop, add the produced vector to array

    // target vector
    // make sure vector doesn't go beyond page boundaries
    const targetX = THREE.MathUtils.randFloat(
      -posLimitX + randomRadius,
      posLimitX - randomRadius
    );
    const targetY = THREE.MathUtils.randFloat(
      -posLimitY + randomRadius,
      posLimitY - randomRadius
    );
    const targetVector = new THREE.Vector3(targetX, targetY, 0);
    targetVectorsIn.push(targetVector);

    // ball to target 으로 가는 vector
    const ballToTargetVector = new THREE.Vector3();
    ballToTargetVector.subVectors(targetVector, posVector);
    ballToTargetVector.normalize();

    balltoTargetVectorsIn.push(ballToTargetVector);
    // 속도도 10개 생성
    velocityArrayIn.push(velocity);

    // 랜덤 가속도도 10개 생성
    const acceleration = THREE.MathUtils.randFloat(0.0001, 0.001);
    accelerationArrayIn.push(acceleration);
  }

  return {
    ballRadiusArrIn,
    posVectorsIn,
    targetVectorsIn,
    balltoTargetVectorsIn,
    velocityArrayIn,
    accelerationArrayIn,
  };
}

// Manage scrollY in Dom.tsx
let scrollTop = 0;
export function setScrollTop(scrollY: number) {
  scrollTop = scrollY;
}

export function getScrollTop() {
  return scrollTop;
}
