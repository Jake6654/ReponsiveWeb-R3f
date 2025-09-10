import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { IBallProps } from "../../common/interface";
import {
  pointerBallRadius,
  velocity,
  ballCount,
  ballARadiusMinLimit,
  ballScaleRadius,
  boxCenter,
} from "../../common/constants";
import Ball from "./Ball";
import { makeHSLRandomColor, initBallOptions } from "../../common/utils";
import React from "react";

function Balls({ isDebug = false }) {
  const { viewport, scene, camera, pointer } = useThree();
  const groupRef = useRef<THREE.Group>(null); // ball 위치 참조
  const pointerSphereRef = useRef<THREE.Mesh>(null); // ball 위치 참조

  const [ballRadiusArr, setBallRadiusArr] = useState<number[]>([]);
  const [velocityArr, setVelocityArr] = useState<number[]>([]);
  const [accelerationArr, setAccelerationArr] = useState<number[]>([]);
  const [posVectors, setPosVectors] = useState<THREE.Vector3[]>([]);
  const [targetVectors, setTargetVectors] = useState<THREE.Vector3[]>([]);
  const [ballToTargetVectors, setBallToTargetVectors] = useState<
    THREE.Vector3[]
  >([]);

  console.log("balls");
  useEffect(() => {
    const op = initBallOptions(viewport);

    setBallRadiusArr(op.ballRadiusArrIn);
    setVelocityArr(op.velocityArrayIn);
    setAccelerationArr(op.accelerationArrayIn);
    setPosVectors(op.posVectorsIn);
    setTargetVectors(op.targetVectorsIn);
    setBallToTargetVectors(op.balltoTargetVectorsIn);
  }, [viewport]);

  // convert pointer(2d position) to unprojectedPointer(3d position)
  const unprojectedPoint = new THREE.Vector3(0, 0, 0);
  const box = new THREE.Box3();
  const boxSize = new THREE.Vector3(viewport.width, viewport.height, 0);
  // 가운데에서 가로, 세로 10 사이즈의 박스 생성
  box.setFromCenterAndSize(boxCenter, boxSize);

  // 볼이 서로 부딪히면 튕겨져 나가는 함수 구현
  function checkCollision(
    crntIdx: number,
    crntMesh: THREE.Object3D,
    crntDir: THREE.Vector3
  ) {
    const group = groupRef.current;
    if (group && group.children.length) {
      const mesh = crntMesh as THREE.Mesh;
      const crntRadius = ballRadiusArr[crntIdx] * mesh.scale.x;
      group.children.forEach(
        (collidedMesh: THREE.Object3D, collidedIdx: number) => {
          const collidedRadius =
            ballRadiusArr[collidedIdx] * collidedMesh.scale.x;
          // distance between current ball and others
          if (crntIdx !== collidedIdx) {
            const dis = crntMesh.position.distanceTo(collidedMesh.position);
            if (dis < crntRadius + collidedRadius) {
              // 2개의 볼의 반지름보다 작을 시 튕겨나가게 설정

              // const mat = mesh.material as THREE.MeshBasicMaterial;
              //  mat.color = new THREE.Color("red");
              if (isDebug) {
                const mat = mesh.material as THREE.MeshBasicMaterial;
                mat.color = new THREE.Color("red");
              }

              // 이 함수는 crntBall 의 방향만 바꿔줌
              const crntPos = mesh.position;
              const collidedPos = collidedMesh.position;
              // 현재 벡터에서 부딪히는 벡터를 빼야함 새로운 벡터를 가져오기
              const newDirVec = crntPos.clone().sub(collidedPos).normalize();

              // 새로운 벡터 방향
              crntDir.x = newDirVec.x;
              crntDir.y = newDirVec.y;

              // target direction 을 바꿔줄 필요가 있다
              const targetDir = ballToTargetVectors[collidedIdx];

              // 새로운 벡터 반대 방향
              targetDir.x = -newDirVec.x;
              targetDir.y = -newDirVec.y;

              // 충돌이 일어나는 순간 decrease the velocity of the ball
              velocityArr[crntIdx] *= 0.2;
              velocityArr[collidedIdx] *= 0.2;

              // 충돌시 프레임이 겹쳐서 속도가 완전히 느려지는것을 방지
              // prevent the ball's velocity from decreaseing when it collides with other balls
              const moveDis = crntRadius + collidedRadius - dis; // subtract the overlapping distance between the two balls
              const crntNewPos = crntDir.clone().multiplyScalar(moveDis);
              crntPos.add(crntNewPos);

              const colliedNewPos = targetDir.clone().multiplyScalar(moveDis);
              collidedPos.add(colliedNewPos);

              // 마우스와 부딪힐때 sphere 볼 작게 하기
              if (ballRadiusArr[crntIdx] > ballARadiusMinLimit) {
                // scale down
                // ballRadiusArr[crntIdx] *= ballScaleRadius;
                // ballRadiusArr[collidedIdx] *= ballScaleRadius;
                // need to decrease mesh's scale directly

                mesh.scale.set(
                  mesh.scale.x * ballScaleRadius,
                  mesh.scale.y * ballScaleRadius,
                  mesh.scale.z * ballScaleRadius
                );
              }

              if (ballRadiusArr[collidedIdx] > ballARadiusMinLimit) {
                collidedMesh.scale.set(
                  collidedMesh.scale.x * ballScaleRadius,
                  collidedMesh.scale.y * ballScaleRadius,
                  collidedMesh.scale.z * ballScaleRadius
                );
              }
            }
          }
        }
      );
    }
  }

  useFrame(() => {
    // 이제는 단일 ball(mesh) 가 아닌 group 을 사용
    const group = groupRef.current;
    if (group && group.children.length) {
      unprojectedPoint.x = pointer.x;
      unprojectedPoint.y = pointer.y;
      unprojectedPoint.unproject(camera); // 하면 이제 최종적으로 3d 좌표료 변경됨
      unprojectedPoint.z = 0;

      if (pointerSphereRef.current) {
        pointerSphereRef.current.position.set(
          unprojectedPoint.x,
          unprojectedPoint.y,
          unprojectedPoint.z
        );
      }
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {posVectors.length ? (
          posVectors.map((posVector: THREE.Vector3, idx: number) => {
            let color = makeHSLRandomColor();
            if (isDebug) {
              color = "blue";
            }
            // 현재 인덱스의 ball 의 디렉션을 담아줌 이것들을 props 로 모두 넘겨준다
            const ballRadius = ballRadiusArr[idx];
            const dir = ballToTargetVectors[idx];

            // target 은 ball 의 움직이는 방향
            const target = ballToTargetVectors[idx];

            const vel = velocityArr[idx];
            const acc = accelerationArr[idx];

            const props: IBallProps = {
              evnOps: {
                isDebug: isDebug,
                unprojectedPoint,
                boxSize,
              },

              ballOp: {
                posVector,
                ballRadius,
                color,
                dir,
                ballIdx: idx,
                target,
                vel,
                acc,
              },
              checkCollision,
            };
            return (
              <Ball
                key={"ballcomp_" + idx}
                evnOps={props.evnOps}
                ballOp={props.ballOp}
                checkCollision={checkCollision}
              />
            );
          })
        ) : (
          <></>
        )}
      </group>
      {isDebug ? (
        <>
          <mesh ref={pointerSphereRef}>
            <sphereGeometry args={[pointerBallRadius]} />
            <meshBasicMaterial color={"black"} opacity={0.5} transparent />
          </mesh>
          <box3Helper args={[box, "blue"]} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default React.memo(Balls);
