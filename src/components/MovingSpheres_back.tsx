import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import React from "react";

//랜덤 색상
function makeRandomColor() {
  const r = THREE.MathUtils.randInt(0, 255);
  const g = THREE.MathUtils.randInt(0, 255);
  const b = THREE.MathUtils.randInt(0, 255);

  return "rgb(" + r + "," + g + "," + b + ")";
}

const hSel = THREE.MathUtils.randInt(0, 2);
// hsl -> hue / saturatio / lightness
function makeHSLRandomColor() {
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
  const l = THREE.MathUtils.randInt(40, 95);

  // return "hsl(" + h + "," + s + "," + l + ")";
  return `hsl(${h},${s}%,${l}%)`;
}

let prevUnprojectedPoint = new THREE.Vector3();

export default function MovingSpheres({ isDebug = false }) {
  const { viewport, scene, camera, pointer } = useThree();
  const pointerBallRadius = 1.0;
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
  const ballCount = 60;

  let velocity = 0.0001;
  const velocityLimit = 0.1;
  const ballARadiusMinLimit = 0.1;
  const ballScaleRadius = 0.99;
  const acceleration = 0.0001;

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

  const box = new THREE.Box3();
  const center = new THREE.Vector3();
  const size = new THREE.Vector3(viewport.width, viewport.height, 0);
  // 가운데에서 가로, 세로 10 사이즈의 박스 생성
  box.setFromCenterAndSize(center, size);

  // 박스의 상하좌우 경게값을 만들어 부딪히면 튕기게 설정
  const leftBox = center.x - size.x * 0.5;
  const rightBox = center.x + size.x * 0.5;
  const bottomBox = center.y - size.y * 0.5;
  const topBox = center.y + size.y * 0.5;

  function checkEdge(pos: THREE.Vector3, dirVec: THREE.Vector, idx: number) {
    // 가끔 속도가 빨라서 ball 의 포지션이 boundary 를 넘어설때가 있는데 위치를 재조정해주는 코드

    // 이제 ballRadius 가 각각 다르니 각 인덱스 마다 다르게 checkEdge 을 해준다
    const ballRadius = ballRadiusArr[idx];

    if (pos.x - ballRadius < leftBox) {
      dirVec.x *= -0.9;
      pos.x = leftBox + ballRadius;
    }

    if (pos.x + ballRadius > rightBox) {
      dirVec.x *= -0.9;
      pos.x = rightBox - ballRadius;
    }

    if (pos.y + ballRadius > topBox) {
      dirVec.y *= -0.9;
      pos.y = topBox - ballRadius;
    }

    if (pos.y - ballRadius < bottomBox) {
      dirVec.y *= -0.9;
      pos.y = bottomBox + ballRadius;
    }
  }

  function update(pos: THREE.Vector3, target: THREE.Vector3, idx: number) {
    velocityArray[idx] += accelerationArray[idx];
    if (velocityArray[idx] >= velocityLimit) {
      velocityArray[idx] = velocityLimit;
    }
    console.log("velocity: ", velocity);

    const addPos = target.clone().multiplyScalar(velocityArray[idx]);
    pos.add(addPos);
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

  function checkPointer(unprojectedPoint: THREE.Vector3) {
    const group = groupRef.current;
    if (group && group.children.length) {
      const mouseDistance = prevUnprojectedPoint.distanceTo(unprojectedPoint);
      group.children.forEach(
        (collidedMesh: THREE.Object3D, collidedIdx: number) => {
          const dis = unprojectedPoint.distanceTo(collidedMesh.position);
          const ballRadius = ballRadiusArr[collidedIdx];
          if (dis < pointerBallRadius + ballRadius) {
            // unprojectedBallRadius 을 0으로 설정하기 않을 경우 z 값이 너무 크게 나오기 때문에
            // 그리고 여기서는 2D 좌표만 필요하기 때문에 useFrame 에서 z 값을 0 으로 초기화
            const crntPos = unprojectedPoint;
            const collidedPos = collidedMesh.position;
            // 현재 벡터에서 부딪히는 벡터를 빼야함 새로운 벡터를 가져오기
            const newDirVec = crntPos.clone().sub(collidedPos).normalize();

            // target direction 을 바꿔줄 필요가 있다
            const targetDir = balltoTargetVectors[collidedIdx];

            // 새로운 벡터 반대 방향
            targetDir.x = -newDirVec.x;
            targetDir.y = -newDirVec.y;

            velocityArray[collidedIdx] *= 2.5 + mouseDistance;

            const moveDis = ballRadius + pointerBallRadius - dis; // subtract the overlapping distance between the two balls
            const colliedNewPos = targetDir.clone().multiplyScalar(moveDis);
            collidedPos.add(colliedNewPos);
          }
        }
      );
      prevUnprojectedPoint = unprojectedPoint;
    }
  }

  useFrame(() => {
    // 이제는 단일 ball(mesh) 가 아닌 group 을 사용
    const group = groupRef.current;
    if (group && group.children.length) {
      // convert pointer(2d position) to unprojectedPointer(3d position)
      const point = pointer;
      const unprojectedPoint = new THREE.Vector3(point.x, point.y, 0);
      unprojectedPoint.unproject(camera); // 하면 이제 최종적으로 3d 좌표료 변경됨
      unprojectedPoint.z = 0;

      if (pointerSphereRef.current) {
        pointerSphereRef.current.position.set(
          unprojectedPoint.x,
          unprojectedPoint.y,
          unprojectedPoint.z
        );
      }
      // 배열의 각 원소를 순회하면서 콜백 함수를 실행한다
      group.children.forEach((mesh: THREE.Object3D, idx: number) => {
        const pos = mesh.position;
        const target = balltoTargetVectors[idx];
        // pos.add(target);
        checkEdge(pos, target, idx);
        checkCollision(idx, mesh, target);
        checkPointer(unprojectedPoint);
        update(pos, target, idx);

        // 이런식으로 부딪힐때 방향이 바뀌므로 arrowHelper 의 dir 또한 바뀌게 설정
        if (mesh.children.length) {
          const arrowHelper = mesh.children[0] as THREE.ArrowHelper;
          arrowHelper.setDirection(target);
        }
      });
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
            // 현재 인덱스의 ball 의 디렉션을 담아줌
            const radius = ballRadiusArr[idx];
            const dir = balltoTargetVectors[idx];
            const origin = new THREE.Vector3();
            const length = 1;
            return (
              <mesh position={posVector}>
                <sphereGeometry args={[radius]} />
                <meshBasicMaterial color={color} />
                {isDebug ? (
                  <arrowHelper args={[dir, origin, length, color]} />
                ) : (
                  <></>
                )}
              </mesh>
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
