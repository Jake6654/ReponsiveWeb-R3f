"use client";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { StepState } from "../../common/interface";
import {
  atomCrntStep,
  atomCrntScrollY,
  atomCrntIsDebug,
} from "../../atoms/atoms";
import CameraControlsType from "camera-controls";
import { zoomLimit } from "../../common/constants";
import SinCos from "../../components/three/SinCos";
import Balls from "../../components/three/Balls";
import Dom from "../../components/Dom";
import ResponsiveAppBar from "../../components/ResponsiveAppBar";
import Domcontents from "../../components/DomContents";

export default function Scene() {
  const [crntStep] = useRecoilState(atomCrntStep);
  const [crntScrollY, setCrntScrollY] = useRecoilState(atomCrntScrollY);
  const [isDebug] = useRecoilState(atomCrntIsDebug);
  const camConRef = useRef<CameraControlsType | null>(null);

  function wheelControl(e: React.WheelEvent) {
    let scrollY = crntScrollY + e.deltaY;
    const minScrollY = 0;
    const maxScrollY = window.innerHeight * 3;
    if (scrollY > maxScrollY) scrollY = maxScrollY;
    else if (scrollY < minScrollY) scrollY = minScrollY;
    setCrntScrollY(scrollY);
  }

  function limitCamCon() {
    const cam = camConRef.current;
    if (!cam) return;
    cam.mouseButtons.wheel = CameraControlsType.ACTION.NONE;
    cam.mouseButtons.right = CameraControlsType.ACTION.NONE;
    if (crntStep >= StepState.STEP_2) {
      cam.mouseButtons.left = CameraControlsType.ACTION.NONE;
      cam.touches.one = CameraControlsType.ACTION.NONE;
    } else {
      cam.mouseButtons.left = CameraControlsType.ACTION.ROTATE;
      cam.touches.one = CameraControlsType.ACTION.TOUCH_ROTATE;
    }
  }

  function camConStart() {
    limitCamCon();
  }

  useEffect(() => {
    limitCamCon();
    const cam = camConRef.current;
    if (!cam) return;
    if (crntStep >= StepState.STEP_1_AND_2) {
      const initPolarAngle = THREE.MathUtils.degToRad(90);
      cam.rotateTo(0, initPolarAngle, true);
      if (crntStep >= StepState.STEP_2) cam.rotateTo(0, initPolarAngle, false);
    }
  }, [crntStep]);

  return (
    <div
      className="full-wrapper"
      onContextMenu={(e) => e.preventDefault()}
      onWheel={wheelControl}
    >
      <ResponsiveAppBar />
      <Domcontents wheelControl={wheelControl} />
      <Dom />
      <Canvas
        gl={{ alpha: true }}
        orthographic
        camera={{ zoom: zoomLimit, position: [0, 0, 100] }}
      >
        {crntStep <= StepState.STEP_1_AND_2 && <SinCos />}
        {crntStep >= StepState.STEP_1_AND_2 && <Balls isDebug={isDebug} />}
        <CameraControls
          ref={camConRef}
          onStart={camConStart}
          minZoom={zoomLimit}
          maxZoom={zoomLimit}
        />
        {isDebug && (
          <>
            <axesHelper args={[7]} />
            <gridHelper
              rotation={[THREE.MathUtils.degToRad(90), 0, 0]}
              args={[100, 100, "black"]}
            />
          </>
        )}
      </Canvas>
    </div>
  );
}
