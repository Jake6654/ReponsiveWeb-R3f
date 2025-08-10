import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function MovingSphere() {
  const ballA = useRef<THREE.Mesh>(null); // ball 위치 참조
  const ballB = useRef<THREE.Mesh>(null);

  const ballAX = THREE.MathUtils.randFloat(-5, 5);
  const ballAY = THREE.MathUtils.randFloat(-5, 5);

  const vecA = new THREE.Vector3(ballAX, ballAY, 0);
  const vecB = new THREE.Vector3(-4, 6, 0);

  const vecAToB = vecB.clone().sub(vecA).normalize();
  const velocity = 0.1;
  const dirVec = vecAToB.clone(); // 방향 벡터를 갖고와서 움직임을 준다
  dirVec.multiplyScalar(velocity); // to normalize vector mu

  useFrame(() => {
    if (ballA.current) {
      const posA = ballA.current.position;
      const disBallAandB = posA.distanceTo(vecB);

      if (disBallAandB > 0.1) {
        posA.add(dirVec);
      }
    }
  });

  return (
    <>
      <mesh ref={ballA} position={vecA}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={"blue"} />
      </mesh>

      <mesh ref={ballB} position={vecB}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={"green"} />
      </mesh>

      <mesh position={vecAToB}>
        <sphereGeometry args={[0.5]} />
        <meshBasicMaterial color={"red"} />
      </mesh>
    </>
  );
}
