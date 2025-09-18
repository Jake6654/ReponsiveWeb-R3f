import "./css/App.css";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import SinCos from "./components/three/SinCos";
import Balls from "./components/three/Balls";
import Dom from "./components/Dom";
import { useRecoilState } from "recoil";
import { StepState } from "./common/interface";
import { atomCrntStep, atomCrntScrollY, atomCrntIsDebug } from "./atoms/atoms";
import { useEffect, useRef, useState } from "react";
// drei 로 카메라 컨트롤즈를 가져오게되면 타입을 가져올 수 없기 때문에 직접 따로 임포트를 해줘야함
import CameraControlsType from "camera-controls";
import { zoomLimit } from "./common/constants";
import ResponsiveAppBar from "./components/ResponsiveAppBar";
import Domcontents from "./components/DomContents";
import Form from "./components/Form";

function App() {
  // Step 과 crntScrollY 값은 전역 상태 단위(atom)으로 설정하여 전역으로 다룰 수 있게 수정
  const [crntStep] = useRecoilState<StepState>(atomCrntStep);
  const [crntScrollY, setCrntScrollY] = useRecoilState<number>(atomCrntScrollY);
  const [isDebug] = useRecoilState<boolean>(atomCrntIsDebug);
  const camConRef = useRef<CameraControlsType>(null);

  function wheelControl(e: any) {
    let scrollY = crntScrollY + e.deltaY;
    const minScrollY = 0;
    const maxScrollY = window.innerHeight * 3;

    if (scrollY > maxScrollY) {
      scrollY = maxScrollY;
    } else if (scrollY < minScrollY) {
      scrollY = minScrollY;
    }
    setCrntScrollY(scrollY);
  }

  function limitCamCon() {
    if (camConRef.current) {
      // 휠버튼의 동작을 막음으로써 스크롤을 해도 줌인 줌 아웃이 되지 않음
      camConRef.current.mouseButtons.wheel = CameraControlsType.ACTION.NONE;
      camConRef.current.mouseButtons.right = CameraControlsType.ACTION.NONE;
      // from step 2, the object cannot rotate
      if (crntStep >= StepState.STEP_2) {
        camConRef.current.mouseButtons.left = CameraControlsType.ACTION.NONE;
        // 모바일 터치
        camConRef.current.touches.one = CameraControlsType.ACTION.NONE;
      } else {
        camConRef.current.mouseButtons.left = CameraControlsType.ACTION.ROTATE;
        camConRef.current.touches.one = CameraControlsType.ACTION.TOUCH_ROTATE;
      }
    }
  }
  function camConStart() {
    limitCamCon();
  }

  useEffect(() => {
    limitCamCon();
    if (camConRef.current) {
      // console.log(
      //   " camConRef.current.azimuthAngle: ",
      //   camConRef.current.azimuthAngle
      // );
      // console.log(
      //   " camConRef.current.polarAngle: ",
      //   camConRef.current.polarAngle
      // );
      if (crntStep >= StepState.STEP_1_AND_2) {
        // rotateTo( azimuthAngle, polarAngle, enableTransition )
        const initPolarAngle = THREE.MathUtils.degToRad(90);
        camConRef.current.rotateTo(0, initPolarAngle, true);
        if (crntStep >= StepState.STEP_2) {
          // 카메라를 조정하여 스텝 2이상일땐 카메라가 원점으로 돌아오게끔 설정
          camConRef.current.rotateTo(0, initPolarAngle, false);
        }
      }
    }
  }, [crntStep]); // crntStep 이 바뀔때마다 실행

  return (
    <div
      className="full-wrapper"
      onContextMenu={(e) => {
        e.preventDefault;
      }}
    >
      <Domcontents wheelControl={wheelControl} />
      <ResponsiveAppBar />
      <Dom />
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
      {/* <footer>
        <Form />
      </footer> */}
    </div>
  );
}

export default App;
