export interface IBallProps {
  // 이 프롭스 인터페이스를 넘겨줌

  evnOps: {
    isDebug: boolean;
  };

  ballOp: {
    posVector: THREE.Vector3;
    radius: number;
    color: string;
    dir: THREE.Vector3;

    ballIdx: number;
  };
}
