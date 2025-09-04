import * as THREE from "three";
import { IBallProps } from "../../common/interface";
import {
  arrowLength,
  arrowOrigin,
  velocityLimit,
  pointerBallRadius,
  boxCenter,
} from "../../common/constants";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

export default function Ball(props: IBallProps) {
  const { isDebug, unprojectedPoint, boxSize } = props.evnOps;
  const { posVector, ballRadius, color, dir, ballIdx, target, vel, acc } =
    props.ballOp;
  const checkCollision = props.checkCollision;

  const ballRef = useRef<THREE.Mesh>(null);

  // 박스의 상하좌우 경게값을 만들어 부딪히면 튕기게 설정
  const leftBox = boxCenter.x - boxSize.x * 0.5;
  const rightBox = boxCenter.x + boxSize.x * 0.5;
  const bottomBox = boxCenter.y - boxSize.y * 0.5;
  const topBox = boxCenter.y + boxSize.y * 0.5;

  // 가끔 속도가 빨라서 ball 의 포지션이 boundary 를 넘어설때가 있는데 위치를 재조정해주는 코드
  function checkEdge(pos: THREE.Vector3) {
    if (pos.x - ballRadius < leftBox) {
      target.x *= -0.9;
      pos.x = leftBox + ballRadius;
    }

    if (pos.x + ballRadius > rightBox) {
      target.x *= -0.9;
      pos.x = rightBox - ballRadius;
    }

    if (pos.y + ballRadius > topBox) {
      target.y *= -0.9;
      pos.y = topBox - ballRadius;
    }

    if (pos.y - ballRadius < bottomBox) {
      target.y *= -0.9;
      pos.y = bottomBox + ballRadius;
    }
  }

  function checkPointer() {
    if (ballRef.current) {
      const collidedMesh = ballRef.current;
      const dis = unprojectedPoint.distanceTo(collidedMesh.position);
      if (dis < pointerBallRadius + ballRadius) {
        // unprojectedballRadius 을 0으로 설정하기 않을 경우 z 값이 너무 크게 나오기 때문에
        // 그리고 여기서는 2D 좌표만 필요하기 때문에 useFrame 에서 z 값을 0 으로 초기화
        const crntPos = unprojectedPoint;
        const collidedPos = collidedMesh.position;
        // 현재 벡터에서 부딪히는 벡터를 빼야함 새로운 벡터를 가져오기
        const newtarget = crntPos.clone().sub(collidedPos).normalize();
        // 새로운 벡터 반대 방향
        target.x = -newtarget.x;
        target.y = -newtarget.y;

        props.ballOp.vel *= 1.2;

        const moveDis = ballRadius + pointerBallRadius - dis; // subtract the overlapping distance between the two balls
        const colliedNewPos = target.clone().multiplyScalar(moveDis);
        collidedPos.add(colliedNewPos);
      }
    }
  }

  function update(pos: THREE.Vector3) {
    // vel, acc 은 const 가 아니라 변하는 값임으로 props 에서 직접 받아와 설정
    props.ballOp.vel += props.ballOp.acc;
    if (props.ballOp.vel >= velocityLimit) {
      props.ballOp.vel = velocityLimit;
    }

    const addPos = target.clone().multiplyScalar(props.ballOp.vel);
    pos.add(addPos);
  }

  useFrame(() => {
    if (ballRef.current) {
      const mesh = ballRef.current;
      const pos = mesh.position;
      // ball 이 움직이는 방향

      checkEdge(pos);
      checkCollision(ballIdx, mesh, target);
      checkPointer();
      update(pos);

      // 이런식으로 부딪힐때 방향이 바뀌므로 arrowHelper 의 dir 또한 바뀌게 설정
      if (mesh.children.length) {
        const arrowHelper = mesh.children[0] as THREE.ArrowHelper;
        arrowHelper.setDirection(target);
      }
    }
  });

  return (
    <>
      <mesh ref={ballRef} position={posVector} key={"mesh_" + ballIdx}>
        <sphereGeometry args={[ballRadius]} />
        <meshBasicMaterial color={color} />
        {isDebug ? (
          // arrowHelper is a utility calss designed to visualize a direction vector in a 3d scene by rendering a visible arrow
          <arrowHelper args={[dir, arrowOrigin, arrowLength, color]} />
        ) : (
          <></>
        )}
      </mesh>
    </>
  );
}
