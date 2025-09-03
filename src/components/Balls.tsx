import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { IBallProps } from "../common/interface";
import {
  pointerBallRadius,
  velocity,
  ballCount,
  ballARadiusMinLimit,
  ballScaleRadius,
  boxCenter,
} from "../common/constants";
import Ball from "./Ball";
import { makeHSLRandomColor } from "../common/utils";

export default function Balls({ isDebug = false }) {
  const { viewport, scene, camera, pointer } = useThree();
  // const ballRadius = 0.4;
  const posLimitX = viewport.width * 0.5;
  const posLimitY = viewport.height * 0.5;
  const groupRef = useRef<THREE.Group>(null); // ball 위치 참조
  const pointerSphereRef = useRef<THREE.Mesh>(null); // ball 위치 참조

  // random size ball
  const ballRadiusArr: number[] = [];
  // 각각의 벡터, 타겟 벡터, ball to Target 벡터, 속도, 가속도 을 배열로 만들어 각 공의 특성들을 따로 관리
  const posVectors: THREE.Vector3[] = [];
  const targetVectors: THREE.Vector3[] = [];
  const balltoTargetVectors: THREE.Vector3[] = [];
  const velocityArray: number[] = [];
  const accelerationArray: number[] = [];

  // convert pointer(2d position) to unprojectedPointer(3d position)
  const unprojectedPoint = new THREE.Vector3(0, 0, 0);
  const box = new THREE.Box3();
  const boxSize = new THREE.Vector3(viewport.width, viewport.height, 0);
  // 가운데에서 가로, 세로 10 사이즈의 박스 생성
  box.setFromCenterAndSize(boxCenter, boxSize);

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
    posVectors.forEach((vec: THREE.Vector3, vecIdx: number) => {
      const dis = posVector.distanceTo(vec);
      const prevRadius = ballRadiusArr[vecIdx];
      if (dis < prevRadius + randomRadius) {
        isOverlay = true;
      }
    });
    if (isOverlay) continue;

    ballRadiusArr.push(randomRadius);
    posVectors.push(posVector); // for each loop, add the produced vector to array

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
    targetVectors.push(targetVector);

    // ball to target 으로 가는 vector
    const ballToTargetVector = new THREE.Vector3();
    ballToTargetVector.subVectors(targetVector, posVector);
    ballToTargetVector.normalize();

    balltoTargetVectors.push(ballToTargetVector);
    // 속도도 10개 생성
    velocityArray.push(velocity);

    // 랜덤 가속도도 10개 생성
    const acceleration = THREE.MathUtils.randFloat(0.0001, 0.001);
    accelerationArray.push(acceleration);
  }

  // 볼이 서로 부딪히면 튕겨져 나가는 함수 구현
  function checkCollision(
    crntIdx: number,
    crntMesh: THREE.Object3D,
    crntDir: THREE.Vector3
  ) {
    const group = groupRef.current;
    if (group && group.children.length) {
      const crntRadius = ballRadiusArr[crntIdx];
      group.children.forEach(
        (collidedMesh: THREE.Object3D, collidedIdx: number) => {
          const collidedRadius = ballRadiusArr[collidedIdx];
          // distance between current ball and others
          if (crntIdx !== collidedIdx) {
            const dis = crntMesh.position.distanceTo(collidedMesh.position);
            if (dis < crntRadius + collidedRadius) {
              // 2개의 볼의 반지름보다 작을 시 튕겨나가게 설정
              const mesh = crntMesh as THREE.Mesh;
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
              const targetDir = balltoTargetVectors[collidedIdx];

              // 새로운 벡터 반대 방향
              targetDir.x = -newDirVec.x;
              targetDir.y = -newDirVec.y;

              // 충돌이 일어나는 순간 decrease the velocity of the ball
              velocityArray[crntIdx] *= 0.2;
              velocityArray[collidedIdx] *= 0.2;

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
                ballRadiusArr[crntIdx] *= ballScaleRadius;
                ballRadiusArr[collidedIdx] *= ballScaleRadius;
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
            const dir = balltoTargetVectors[idx];

            // target 은 ball 의 움직이는 방향
            const target = balltoTargetVectors[idx];

            const vel = velocityArray[idx];
            const acc = accelerationArray[idx];

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
              <>
                <Ball
                  evnOps={props.evnOps}
                  ballOp={props.ballOp}
                  checkCollision={checkCollision}
                />
              </>
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
            <meshBasicMaterial color={"black"} opacity={0.0} transparent />
          </mesh>
          <box3Helper args={[box, "blue"]} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}
