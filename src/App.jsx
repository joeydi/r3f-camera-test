import React, { useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Stats, OrbitControls } from "@react-three/drei";
import "./styles/main.scss";

function Box(props) {
    return (
        <mesh {...props}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="hotpink" />
        </mesh>
    );
}

function Scene() {
    const camera = useThree((state) => state.camera);
    const gltf = useLoader(GLTFLoader, "/artist_workroom/scene.gltf");

    function handleClick() {
        console.log(camera.position);
        console.log(camera.rotation);
    }

    return (
        <primitive
            object={gltf.scene}
            onClick={() => {
                handleClick();
            }}
        />
    );
}

function CameraRig({
    position: [positionX, positionY, positionZ],
    lookAt: [lookAtX, lookAtY, lookAtZ],
    targetPosition,
    setTargetPosition,
}) {
    useFrame((state) => {
        const camera = state.camera;

        camera.position.lerp({ x: positionX, y: positionY, z: positionZ }, 0.1);

        let [targetX, targetY, targetZ] = [...targetPosition];

        targetX = targetX + (lookAtX - targetX) * 0.05;
        targetY = targetY + (lookAtY - targetY) * 0.05;
        targetZ = targetZ + (lookAtZ - targetZ) * 0.05;

        setTargetPosition([targetX, targetY, targetZ]);
        camera.lookAt(targetX, targetY, targetZ);
    });
}

function App() {
    const positions = [
        {
            id: 1,
            position: [24.26, 12.57, 24.41],
            lookAt: [0, 2, 0],
        },
        {
            id: 2,
            position: [12, 6, 12],
            lookAt: [-1, 0.1, 1],
        },
        {
            id: 3,
            position: [-1.693, 5.946, 12.35],
            lookAt: [1.5, 0.75, -0.75],
        },
        {
            id: 4,
            position: [12, 1, 9],
            lookAt: [-1.5, 2.5, -1],
        },
        {
            id: 5,
            position: [-1.06, 1.93, 15],
            lookAt: [1.1, 2, -1.6],
        },
    ];

    const [camera, setCamera] = useState(positions[0]);

    const [checked, setChecked] = useState(false);
    const [positionId, setPositionId] = useState(1);

    const [targetPosition, setTargetPosition] = useState([0, 2, 0]);

    const onPositionChange = (position) => {
        setPositionId(position.id);
        setCamera(position);
    };

    return (
        <>
            <div className="controls">
                <div>
                    <label>
                        <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />
                        <span>OrbitControls</span>
                    </label>
                </div>
                {positions.map((position) => {
                    return (
                        <div key={position.id}>
                            <label>
                                <input
                                    type="radio"
                                    name="position"
                                    checked={positionId === position.id}
                                    onChange={() => onPositionChange(position)}
                                />
                                <span>Position {position.id}</span>
                            </label>
                        </div>
                    );
                })}
            </div>
            <Canvas camera={{ fov: 10, position: camera.position }}>
                <ambientLight intensity={0.1} />
                <pointLight position={[2, 3, 3]} intensity={30} color="#fff" />
                <Box position={targetPosition} scale={0.05} />
                {!checked && (
                    <CameraRig
                        position={camera.position}
                        lookAt={camera.lookAt}
                        targetPosition={targetPosition}
                        setTargetPosition={setTargetPosition}
                    />
                )}
                {checked && <OrbitControls xminPolarAngle={Math.PI / 2.5} xmaxPolarAngle={Math.PI / 2.5} target={[0, 1.5, 0]} />}
                <Scene />
                <Stats />
            </Canvas>
        </>
    );
}

export default App;
