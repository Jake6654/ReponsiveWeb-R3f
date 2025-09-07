export interface IBallProps {
  // 이 프롭스 인터페이스를 넘겨줌

  evnOps: {
    isDebug: boolean;
    unprojectedPoint: THREE.Vector3;
    boxSize: THREE.Vector3;
  };

  ballOp: {
    posVector: THREE.Vector3;
    ballRadius: number;
    color: string;
    dir: THREE.Vector3;
    ballIdx: number;
    target: THREE.Vector3;
    vel: number;
    acc: number;
  };
  checkCollision: Function;
}

export enum StepState {
  // 이 enum type 을 숫자로 지정해두면 편한게 많다
  NONE = 0,
  STEP_1 = 1,
  STEP_1_AND_2 = 2,
  STEP_2 = 3,
  STEP_2_AND_3 = 4,
  STEP_3 = 5,
}
