
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react';

export default function BearToHoney(){

    const bearRef = useRef<THREE.Sprite>(null);

    const bearTexture = useLoader(THREE.TextureLoader, '/bear.png');
    const honeyTexture = useLoader(THREE.TextureLoader, '/honey.png');

    const bearX = THREE.MathUtils.randFloat(-5, 5);
    const bearY = THREE.MathUtils.randFloat(-5, 5);
    const honeyX = THREE.MathUtils.randFloat(-5, 5);
    const honeyY = THREE.MathUtils.randFloat(-5, 5);
    
    const bearVec = new THREE.Vector3(bearX,bearY,0);
    const honeyVec = new THREE.Vector3(honeyX,honeyY,0);
    
    const bearToHoneyVec = honeyVec.clone().sub(bearVec);
    const disBearToHoneyVec = 
        bearToHoneyVec
        .distanceTo(new THREE.Vector3(0,0,0));

    const bearToHoneyUnitVec = bearToHoneyVec.clone().normalize();

    let useTime = true;
    // move by distance
    const desireMoveDistancePerSec = 2; // 2m/sec;
    const desireMoveDistancePerFrame = desireMoveDistancePerSec / 60; // 0.03m/frame;
    const moveVec = 
        bearToHoneyUnitVec
        .clone()
        .multiplyScalar(desireMoveDistancePerFrame);

    // move over time
    const randomSec = THREE.MathUtils.randFloat(1, 5);
    const desireMoveSec = randomSec;
    const desireMoveFrame = desireMoveSec * 60;
    const moveVec2 =
        bearToHoneyUnitVec
        .clone()
        .multiplyScalar(disBearToHoneyVec)
        .divideScalar(desireMoveFrame);

    useFrame((state, delta) =>{
        
        const bearObj = bearRef.current;
        if(bearObj){
            const bearPos = bearObj.position;
            const honeyPos = honeyVec;
            const disBearAndHoney = bearPos.distanceTo(honeyPos);
            bearObj.scale.set(1,1,1);
            if(disBearAndHoney > 0.1){
                if(useTime){
                    bearObj.position.x += moveVec2.x;
                    bearObj.position.y += moveVec2.y;
                }else{
                    bearObj.position.x += moveVec.x;
                    bearObj.position.y += moveVec.y;
                }
                
            }else{
                bearObj.scale.set(2,2,2);
            }
        }
    })
    
    return(
        <>
            <sprite ref={bearRef} position={bearVec} >
                <spriteMaterial map={bearTexture} />
            </sprite>
            <sprite position={honeyVec} >
                <spriteMaterial map={honeyTexture} />
            </sprite>
        </>
    )
}