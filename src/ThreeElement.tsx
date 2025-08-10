
import * as THREE from 'three';

export default function ThreeElement(){

    const origin = new THREE.Vector3(0,0,0);

    const vecA = new THREE.Vector3(-6,7,0);
    const disVecA = origin.distanceTo(vecA);

    const vecB = new THREE.Vector3(4,3,0);
    const disVecB = origin.distanceTo(vecB);

    const vecC = vecB.clone().sub(vecA);
    const disVecC = origin.distanceTo(vecC);

    const normalizedVecA = vecA.clone().normalize().multiplyScalar(3.2);
    const disNormalizedVecA = origin.distanceTo(normalizedVecA);

    return(
        <>
            <directionalLight position={[5,5,5]} />
            {/* vector A */}
            <mesh
                position={vecA}
                rotation={
                    [
                        THREE.MathUtils.degToRad(45),
                        THREE.MathUtils.degToRad(45),
                        0
                    ]
                }
            >
                <sphereGeometry args={[0.3]}/>
                <meshStandardMaterial color="black" />
            </mesh>
            <arrowHelper args={[
                    vecA.clone().normalize(),
                    origin,
                    disVecA,
                    'black'
                ]}
            />

            {/* vector B */}
            <mesh
                position={vecB}
                rotation={
                    [
                        THREE.MathUtils.degToRad(45),
                        THREE.MathUtils.degToRad(45),
                        0
                    ]
                }
            >
                <sphereGeometry args={[0.3]}/>
                <meshStandardMaterial color="black" />
            </mesh>
            <arrowHelper args={[
                    vecB.clone().normalize(),
                    origin,
                    disVecB,
                    'black'
                ]}
            />

            {/* vector C */}
            <mesh
                position={vecC}
                rotation={
                    [
                        THREE.MathUtils.degToRad(45),
                        THREE.MathUtils.degToRad(45),
                        0
                    ]
                }
            >
                <sphereGeometry args={[0.3]}/>
                <meshStandardMaterial color="#9A1FE8" />
            </mesh>
            <arrowHelper args={[
                    vecC.clone().normalize(),
                    origin,
                    disVecC,
                    '#9A1FE8'
                ]}
            />


            {/* normalized vector A */}
            <mesh
                position={normalizedVecA}
                rotation={
                    [
                        THREE.MathUtils.degToRad(45),
                        THREE.MathUtils.degToRad(45),
                        0
                    ]
                }
            >
                <sphereGeometry args={[0.3]}/>
                <meshStandardMaterial color="red" opacity={0.5} transparent />
            </mesh>
            <arrowHelper args={[
                    normalizedVecA.clone().normalize(),
                    origin,
                    disNormalizedVecA,
                    'red',
                ]}
            />
        </>
    )
}