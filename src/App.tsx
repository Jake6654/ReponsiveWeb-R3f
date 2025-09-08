import "./css/App.css";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import MovingSpheres from "./components/three/Balls";
import SinCos from "./components/three/SinCos";
import Balls from "./components/three/Balls";
import Dom from "./components/Dom";
import { useRecoilState } from "recoil";
import { StepState } from "./common/interface";
import { atomCrntStep } from "./atoms/atoms";
import { useEffect, useRef, useState } from "react";
// drei 로 카메라 컨트롤즈를 가져오게되면 타입을 가져올 수 없기 때문에 직접 따로 임포트를 해줘야함
import CameraControlsType from "camera-controls";
import { zoomLimit } from "./common/constants";

const isDebug = false;
function App() {
  const [crntStep] = useRecoilState<StepState>(atomCrntStep);
  const [scrollYDelta, setScrollYDelta] = useState<number>(0);
  const camConRef = useRef<CameraControlsType>(null);

  function wheelControl(e: any) {
    console.log("wheelControl e.deltaY :", e.deltaY);
    setScrollYDelta(e.deltaY); // 이 값을 Dom 의 Props 로 전달
  }

  function limitCamCon() {
    if (camConRef.current) {
      // 휠버튼의 동작을 막음으로써 스크롤을 해도 줌인 줌 아웃이 되지 않음
      camConRef.current.mouseButtons.wheel = CameraControlsType.ACTION.NONE;
      camConRef.current.mouseButtons.right = CameraControlsType.ACTION.NONE;
    }
  }
  function camConStart() {
    limitCamCon();
  }

  useEffect(() => {
    console.log("camConRef.current : ", camConRef.current);
    limitCamCon();
  }, [crntStep]); // crntStep 이 바뀔때마다 실행

  return (
    <div
      className="full-wrapper"
      onContextMenu={(e) => {
        e.preventDefault;
      }}
    >
      <Dom scrollYDelta={scrollYDelta} />
      <Canvas
        onWheel={wheelControl}
        gl={{ alpha: true }}
        orthographic
        camera={{
          zoom: zoomLimit,
          position: [0, 0, 100],
        }}
      >
        {/* <color attach={"background"} args={["black"]} /> */}
        {crntStep <= StepState.STEP_1_AND_2 ? <SinCos /> : <></>}
        {crntStep >= StepState.STEP_1_AND_2 ? (
          <Balls isDebug={isDebug} />
        ) : (
          <></>
        )}
        <CameraControls
          ref={camConRef}
          onStart={camConStart}
          minZoom={zoomLimit}
          maxZoom={zoomLimit}
        />
        {isDebug ? ( // debug mode 일때만 카메라가 움직을 수 있게 설정
          <>
            <axesHelper args={[7]} />
            <gridHelper
              rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
              args={[100, 100, "black"]}
            />
          </>
        ) : (
          <></>
        )}
      </Canvas>
    </div>
  );
}

export default App;
