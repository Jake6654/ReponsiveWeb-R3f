import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MovingSphere() {
  const ballARadius = 0.5;
  const ballPosInit = 4.5;
  const ballA = useRef<THREE.Mesh>(null); // ball 위치 참조

  const ballAX = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
  const ballAY = THREE.MathUtils.randFloat(-ballPosInit, ballPosInit);
  const targetX = THREE.MathUtils.randFloat(-5, 5);
  const targetY = THREE.MathUtils.randFloat(-5, 5);

  const vecA = new THREE.Vector3(ballAX, ballAY, 0);
  const targetB = new THREE.Vector3(targetX, targetY, 0);

  const vecAToB = targetB.clone().sub(vecA).normalize();
  let velocity = 0.01;
  const acceleration = 0.0001;
  const dirVec = vecAToB.clone(); // 방향 벡터를 갖고와서 움직임을 준다
  // dirVec.multiplyScalar(velocity); // to normalize vector mu

  // 이제는 공이 박스 안에서만 움직일 수 있도록 설정(벽에 닿으면 튀겨나가게끔)
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

  useFrame(() => {
    if (ballA.current) {
      const posA = ballA.current.position;

      // if (
      //   posA.x > leftBox &&
      //   posA.x < rightBox &&
      //   posA.y < topBox &&
      //   posA.y > bottomBox
      // ) {
      //   posA.add(dirVec);
      // }

      if (posA.x - ballARadius < leftBox || posA.x + ballARadius > rightBox) {
        // 경계보다 커지면 directional vector 의 값을 반전 시켜준다
        dirVec.x = -dirVec.x;
      }
      // By adding or subtracting ballA's radius, the ball cannot go beyond the boundaries
      if (posA.y - ballARadius < bottomBox || posA.y + ballARadius > topBox) {
        dirVec.y = -dirVec.y;
      }

      if (velocity > 0.1) {
        velocity = 0.1;
      }
      velocity += acceleration;
      console.log("velocity : ", velocity);
      const addPos = dirVec.clone().multiplyScalar(velocity);

      posA.add(addPos);
    }
  });

  return (
    <>
      <mesh ref={ballA} position={vecA}>
        <sphereGeometry args={[ballARadius]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>
      <box3Helper args={[box, "blue"]} />
    </>
  );
}
