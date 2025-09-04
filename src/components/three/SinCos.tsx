import * as THREE from "three";
import { Text, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function SinCos() {
  const curveGroupRef = useRef<THREE.Group>();
  const points: THREE.Vector3[] = [];
  const pointsGroup: THREE.Vector3[][] = [];
  const count = 360;
  const amplitude = 5;
  const xDivision = 15;
  const curveGroupX = (count / xDivision) * 0.5;
  const textStr = "The Campers Ministry";
  const curveCount = 3;
  const minFontSize = 0.2;
  const maxFontSize = 2.5;

  for (let i = 0; i < count; i++) {
    const x = i / xDivision;
    const sin = Math.sin(THREE.MathUtils.degToRad(i)) * amplitude;
    const cos = Math.cos(THREE.MathUtils.degToRad(i)) * amplitude;

    // sin 그래프를 형성
    const pos = new THREE.Vector3(x, sin, cos);
    points.push(pos);
  }

  // Three 에서 curve 을 직접 만들 수 있음 그리고 getPoints 를 사용하여 몇개의 point을 나타낼건지 컨트롤할 수 있다.
  const curve = new THREE.CatmullRomCurve3(points);
  const curvePointCount = textStr.length - 1;
  const curvePoints = curve.getPoints(curvePointCount);

  for (let i = 0; i < curveCount; i++) {
    pointsGroup.push(curvePoints);
  }

  useFrame(() => {
    if (curveGroupRef.current) {
      curveGroupRef.current.children.forEach((curve) => {
        curve.rotation.x += 0.01;

        // 글씨가 뒤로 가면 작아지는 입체감을 구현하기 위해 z position 이 필요하다
        curve.children.forEach((text) => {
          // local 좌표계는 안 바뀜으로 다른걸 사용해야함 월드 포지션을 가져와야 한다
          // 내가 원하는 포지션이 안 올경우 이게 월드 포지션인제 로컬 포지션인지 잘 확인해야한다
          //const zPos = text.position.z;
          const pos = new THREE.Vector3();
          text.getWorldPosition(pos);
          const scale = THREE.MathUtils.mapLinear(
            pos.z,
            -amplitude,
            amplitude,
            minFontSize,
            maxFontSize
          );
          text.scale.set(scale, scale, scale);
        });
      });
    }
  });

  return (
    <>
      <group ref={curveGroupRef} position={[-curveGroupX, 0, 0]}>
        {pointsGroup.length ? (
          pointsGroup.map((cPoints: THREE.Vector3[], cpIndex: number) => {
            const deg = (cpIndex * 360) / curveCount;
            const rad = THREE.MathUtils.degToRad(deg);

            return cPoints.length ? (
              <group
                rotation={[rad, 0, 0]}
                //position={[cpIndex * 10, 0, 0]}
              >
                {cPoints.map((point: THREE.Vector3, PIndex: number) => {
                  const text = textStr[PIndex];
                  return (
                    // by wrapping it with a billboard, the text is made to follow camera's movemen

                    <Billboard
                      key={"text_" + PIndex}
                      position={[point.x, point.y, point.z]}
                    >
                      <Text fontSize={0.5} color={"white"} fontWeight={"bold"}>
                        {text}
                      </Text>
                    </Billboard>
                  );
                })}
              </group>
            ) : (
              <></>
            );
          })
        ) : (
          <></>
        )}
      </group>
    </>
  );
}
