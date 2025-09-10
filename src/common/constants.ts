import * as THREE from "three";

export const arrowLength = 1;
export const arrowOrigin = new THREE.Vector3();
export const velocityLimit = 0.1;
export const pointerBallRadius = 1.0;

export const boxCenter = new THREE.Vector3();

export const ballCount = 60;

export let velocity = 0.0001;
export const ballARadiusMinLimit = 0.1;
export const ballScaleRadius = 0.99;
export const zoomLimit = 45;

export const startBallOpacity = 0.3;
export const endBallOpacity = 1.0;
export const startBallPosition = 0.8;
export const endBallPosition = 1;

// sin/cos curve
export const curveCount = 3;
export const minFontSize = 0.2;
export const maxFontSize = 2.5;
export const xCount = 360;
export const amplitude = 5;
export const xDivision = 15;
export const curveGroupX = (xCount / xDivision) * 0.5;

export const startCurveScale = 1.0;
export const endCurveScale = 5.0;
