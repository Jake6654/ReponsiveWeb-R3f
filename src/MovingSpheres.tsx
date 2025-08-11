import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MovingSpheres() {
  const ballARadius = 0.5;
  const ballPosInit = 4.5;
  const groupRef = useRef<THREE.Group>(null); // ball 위치 참조

  const posVectors: THREE.Vector3[] = [];
  const targetVectors: THREE.Vector3[] = [];
  const balltoTargetVectors: THREE.Vector3[] = [];
  const velocityArray: number[] = [];
  const accelerationArray: number[] = [];
  const ballCount = 10;

  let velocity = 0.0001;
  const velocityLimit = 0.5;
  const acceleration = 0.0001;

  for (let i = 0; i < ballCount; i++) {
    // ball vector
    const ballAX = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
    const ballAY = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
    const posVector = new THREE.Vector3(ballAX, ballAY, 0);
    posVectors.push(posVector); // 생성된 벡터를 배열에 추가

    // target vector
    const targetX = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
    const targetY = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
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
  const size = new THREE.Vector3(10, 10, 0);
  // 가운데에서 가로, 세로 10 사이즈의 박스 생성
  box.setFromCenterAndSize(center, size);

  // 박스의 상하좌우 경게값을 만들어 부딪히면 튕기게 설정
  const leftBox = center.x - size.x * 0.5;
  const rightBox = center.x + size.x * 0.5;
  const bottomBox = center.y - size.y * 0.5;
  const topBox = center.y + size.y * 0.5;

  function checkEdge(pos: THREE.Vector3, dirVec: THREE.Vector3) {
    if (pos.x - ballARadius < leftBox || pos.x + ballARadius > rightBox) {
      // 경계보다 커지면 directional vector 의 값을 반전 시켜준다
      dirVec.x = -dirVec.x;
    }
    // By adding or subtracting ballA's radius, the ball cannot go beyond the boundaries
    if (pos.y - ballARadius < bottomBox || pos.y + ballARadius > topBox) {
      dirVec.y = -dirVec.y;
    }
  }

  useFrame(() => {
    const group = groupRef.current;
    if (group && group.children.length) {
      console.log("group :", group);

      group.children.forEach((mesh: THREE.Object3D, idx: number) => {
        const pos = mesh.position;
        const target = balltoTargetVectors[idx];
        // pos.add(target);
        checkEdge(pos, target);

        // 각각의 ball 의 속력이 들어감
        velocityArray[idx] += accelerationArray[idx];
        if (velocityArray[idx] >= velocityLimit) {
          velocityArray[idx] = velocityLimit;
        }
        console.log("velocity: ", velocity);

        const addPos = target.clone().multiplyScalar(velocityArray[idx]);
        pos.add(addPos);
      });
    }
  });

  // if (
  //   pos.x > leftBox &&
  //   pos.x < rightBox &&
  //   pos.y < topBox &&
  //   pos.y > bottomBox
  // ) {
  //   pos.add(dirVec);
  // }

  // if (pos.x - ballARadius < leftBox || pos.x + ballARadius > rightBox) {
  //   // 경계보다 커지면 directional vector 의 값을 반전 시켜준다
  //   dirVec.x = -dirVec.x;
  // }
  // // By adding or subtracting ballA's radius, the ball cannot go beyond the boundaries
  // if (pos.y - ballARadius < bottomBox || pos.y + ballARadius > topBox) {
  //   dirVec.y = -dirVec.y;
  // }

  // if (velocity > 0.1) {
  //   velocity = 0.1;
  // }

  // velocity += acceleration;
  // console.log("velocity : ", velocity);
  // // 계속 변화는 값인 가속도 velocity 을 주어 가속 운동을 함
  // const addPos = dirVec.clone().multiplyScalar(velocity);

  // // 위치를 계속 변경해주는 함수
  // // pos.add(addPos);

  return (
    <>
      <group ref={groupRef}>
        {posVectors.length ? (
          posVectors.map((posVector) => {
            return (
              <mesh position={posVector}>
                <sphereGeometry args={[ballARadius]} />
                <meshBasicMaterial color={"blue"} />
              </mesh>
            );
          })
        ) : (
          <></>
        )}
      </group>
      <box3Helper args={[box, "blue"]} />
    </>
  );
}
