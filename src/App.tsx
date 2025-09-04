import "./css/App.css";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import MovingSpheres from "./components/three/Balls";
import SinCos from "./components/three/SinCos";
import Balls from "./components/three/Balls";
import Dom from "./components/Dom";

const isDebug = false;
function App() {
  return (
    <>
      <Canvas
        orthographic
        camera={{
          zoom: 60,
          position: [0, 0, 100],
        }}
      >
        <color attach={"background"} args={["black"]} />
        <Balls isDebug={isDebug} />
        <CameraControls />
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
        <SinCos />
      </Canvas>
      <Dom />
    </>
  );
}

export default App;
