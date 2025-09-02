import * as THREE from "three";
import { IBallProps } from "../common/interface";
import { arrowLength, arrowOrigin } from "../common/constants";

export default function Ball(props: IBallProps) {
  const { isDebug } = props.evnOps;
  const { posVector, radius, color, dir, ballIdx } = props.ballOp;

  return (
    <>
      <mesh position={posVector} key={"mesh_" + ballIdx}>
        <sphereGeometry args={[radius]} />
        <meshBasicMaterial color={color} />
        {isDebug ? (
          <arrowHelper args={[dir, arrowOrigin, arrowLength, color]} />
        ) : (
          <></>
        )}
      </mesh>
    </>
  );
}
