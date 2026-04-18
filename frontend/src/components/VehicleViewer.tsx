'use client';

import React, { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Text, Float, Center, Bounds } from '@react-three/drei';
import * as THREE from 'three';

// Pre-load the 100% reliable Khronos WebGL Truck model (perfect for testing Ad Wraps!)
const CAR_MODEL_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb';

function RealisticCar(props: any) {
  const { scene } = useGLTF(CAR_MODEL_URL);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <group {...props} dispose={null}>
       {/* Use Bounds and Center to automatically scale the model to fit screen! */}
       <Bounds fit clip observe margin={1.2}>
         <Center>
           <primitive object={clonedScene} />
         </Center>
       </Bounds>
       
       <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
           <mesh position={[1.5, 0.5, 0]} rotation={[0, Math.PI/2, 0]}>
               <planeGeometry args={[2, 0.8]} />
               <meshStandardMaterial color="#F39C12" transparent opacity={0.9} />
               <Text position={[0, 0, 0.01]} fontSize={0.2} color="black" fontWeight="900" anchorX="center" anchorY="middle">
                   YOUR BRAND{'\n'}TRUCK WRAP!
               </Text>
           </mesh>
       </Float>
    </group>
  );
}

// Fallback loader if the 3D model takes a few seconds to download over network
function Fallback() {
    return (
        <Text color="#F39C12" fontSize={0.4} position={[0, 0, 0]}>
            Rendering 3D Prototype...
        </Text>
    );
}

export default function VehicleViewer() {
  return (
    <div className="w-full h-full min-h-[450px]">
      <Canvas camera={{ position: [5, 2.5, 5], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <directionalLight position={[-10, 5, -5]} intensity={0.8} />
        
        {/* We use React Suspense bounds to gracefully load the heavy WebGL asset */}
        <Suspense fallback={<Fallback />}>
            <RealisticCar />
        </Suspense>

        {/* Ambient Ground Shadow */}
        <ContactShadows position={[0, -0.4, 0]} opacity={0.7} scale={20} blur={2.5} far={4} />
        
        {/* Orbital Camera Control - Auto rotates to give that showroom 360 presentation */}
        <OrbitControls 
            autoRotate 
            autoRotateSpeed={2.0} 
            enableZoom={true} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2.1} 
            minPolarAngle={Math.PI / 4} 
        />
        
        {/* High Definition Lighting Map */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
