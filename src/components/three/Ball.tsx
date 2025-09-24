"use client";

import * as THREE from "three";
import { IBallProps, StepState } from "../../common/interface";
import {
  arrowLength,
  arrowOrigin,
  velocityLimit,
  pointerBallRadius,
  boxCenter,
  startBallOpacity,
  endBallOpacity,
  endBallPosition,
  startBallPosition,
} from "../../common/constants";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRecoilState } from "recoil";
import { atomCrntStep } from "../../atoms/atoms";
import { getScrollTop } from "../../common/utils";

export default function Ball(props: IBallProps) {
  // Dom 으로 인해 state 을 관리하기 때문에 따로 set 함수는 필요하지 않음
  const [crntStep] = useRecoilState<StepState>(atomCrntStep);
  // crntStep 이 StepState.STEP_3 과 완전히 같을 때만  isGravity 가 true 가 됨
  const isGravity = crntStep === StepState.STEP_3;
  const { size, viewport } = useThree();
  const crntScrollTop = getScrollTop();

  // 윈도우 size 와 three.js viewport 의 비율을 구하는 공식
  // size.height :viewport.height = 68.5 : X;
  // size.height * x = viewport.height * 68.5;
  const appBarHeight = (viewport.height * 68.5) / size.height;

  let ballOpacity = 0;
  if (crntScrollTop >= size.height * startBallPosition) {
    ballOpacity = startBallOpacity;
    if (crntScrollTop > size.height * endBallPosition) {
      ballOpacity = endBallOpacity;
    }
  }

  const { isDebug, unprojectedPoint, boxSize } = props.evnOps;
  const { posVector, ballRadius, color, dir, ballIdx } = props.ballOp;
  const checkCollision = props.checkCollision;
  let target = props.ballOp.target;
  let vel = props.ballOp.vel;
  let acc = props.ballOp.acc;

  if (isGravity) {
    target = new THREE.Vector3(
      THREE.MathUtils.randFloat(-0.1, 0.1),
      -1,
      0
    ).normalize();
    acc *= 50;
  }

  const ballRef = useRef<THREE.Mesh>(null);

  // 박스의 상하좌우 경게값을 만들어 부딪히면 튕기게 설정
  const leftBox = boxCenter.x - boxSize.x * 0.5;
  const rightBox = boxCenter.x + boxSize.x * 0.5;
  const bottomBox = boxCenter.y - boxSize.y * 0.5;
  // 상단 bar 가 차지하는 px 이 68.5 px 그래서 바의 아랫부분에 부딪히면 튕겨지게끔 하고 싶음, 윈도우의 기준과 three.js 기준이 다름
  const topBox = boxCenter.y + boxSize.y * 0.5 - appBarHeight;

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
      if (isGravity) {
        target.x *= 0.9;
        target.z *= 0.9;
        vel *= 0.7;
        acc *= -1; // 가속도를 음수 값으로 설정해 공이 다시 튀기지 않게 설정
      }
    }
  }

  function checkPointer(mesh: THREE.Mesh) {
    if (ballRef.current) {
      const collidedMesh = ballRef.current;
      const dis = unprojectedPoint.distanceTo(collidedMesh.position);
      const bRadius = ballRadius * mesh.scale.x;
      if (dis < pointerBallRadius + bRadius) {
        // unprojectedballRadius 을 0으로 설정하기 않을 경우 z 값이 너무 크게 나오기 때문에
        // 그리고 여기서는 2D 좌표만 필요하기 때문에 useFrame 에서 z 값을 0 으로 초기화
        const crntPos = unprojectedPoint;
        const collidedPos = collidedMesh.position;
        // 현재 벡터에서 부딪히는 벡터를 빼야함 새로운 벡터를 가져오기
        const newtarget = crntPos.clone().sub(collidedPos).normalize();
        // 새로운 벡터 반대 방향
        target.x = -newtarget.x;
        target.y = -newtarget.y;

        vel *= 1.2;

        const moveDis = ballRadius + pointerBallRadius - dis; // subtract the overlapping distance between the two balls
        const colliedNewPos = target.clone().multiplyScalar(moveDis);
        collidedPos.add(colliedNewPos);
      }
    }
  }

  function update(pos: THREE.Vector3) {
    // vel, acc 은 const 가 아니라 변하는 값임으로 props 에서 직접 받아와 설정
    vel += acc;
    if (vel >= velocityLimit) {
      vel = velocityLimit;
    }

    const addPos = target.clone();
    if (isGravity) {
      addPos.y *= vel;
    } else {
      addPos.multiplyScalar(vel);
    }
    pos.add(addPos);
  }

  useFrame(() => {
    if (ballRef.current) {
      const mesh = ballRef.current;
      const pos = mesh.position;
      // ball 이 움직이는 방향

      checkEdge(pos);
      update(pos); // 먼저 ball 의 위치를 업뎃해야지 자연스럽게 된다
      if (!isGravity) {
        checkCollision(ballIdx, mesh, target);
      }
      checkPointer(mesh);

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
        <meshBasicMaterial color={color} opacity={ballOpacity} transparent />
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
