export interface IBallProps {
  // 이 프롭스 인터페이스를 넘겨줌

  evnOps: {
    isDebug: boolean;
    unprojectedPoint: THREE.Vector3;
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
}
