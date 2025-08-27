import "./App.css";
import { Canvas } from "@react-three/fiber";
import ThreeElement from "./ThreeElement";
import BearToHoney from "./BearToHoney";
import { CameraControls } from "@react-three/drei";
import * as THREE from "three";
import MovingSphere from "./MovingSphere";
import MovingSpheres from "./MovingSpheres";

const isDebug = true;
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
        {/* <ThreeElement /> */}
        {/* <BearToHoney /> */}
        <MovingSpheres />
        <CameraControls />
        {isDebug ? ( // debug mode
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
    </>
  );
}

export default App;
