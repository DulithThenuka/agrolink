import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Scan, AlertTriangle } from 'lucide-react';

// 3D Organic Leaf Blade with Lesion Spots & Diagnostic Veins
const LeafBlade = ({ severity = 'Moderate' }) => {
  const meshRef = useRef();
  const scanBarRef = useRef();

  // Stylized leaf geometry
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -1.2);
    shape.bezierCurveTo(0.7, -0.6, 0.9, 0.4, 0, 1.3);
    shape.bezierCurveTo(-0.9, 0.4, -0.7, -0.6, 0, -1.2);

    const extrudeSettings = {
      steps: 2,
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 4
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.x = 0.1 + Math.cos(state.clock.elapsedTime * 0.4) * 0.08;
    }
    if (scanBarRef.current) {
      const scanY = Math.sin(state.clock.elapsedTime * 1.5) * 1.1;
      scanBarRef.current.position.y = scanY;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Leaf Tissue Blade */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#15803d"
          roughness={0.4}
          metalness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central Midrib Vein */}
      <mesh position={[0, 0.05, 0.03]}>
        <cylinderGeometry args={[0.015, 0.025, 2.3, 12]} />
        <meshStandardMaterial color="#65a30d" roughness={0.4} />
      </mesh>

      {/* Secondary Lateral Veins */}
      {[-0.5, -0.2, 0.1, 0.4, 0.7].map((y, idx) => (
        <group key={idx} position={[0, y, 0.025]}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <cylinderGeometry args={[0.006, 0.008, 0.45, 8]} />
            <meshStandardMaterial color="#84cc16" />
          </mesh>
          <mesh rotation={[0, 0, -Math.PI / 4]}>
            <cylinderGeometry args={[0.006, 0.008, 0.45, 8]} />
            <meshStandardMaterial color="#84cc16" />
          </mesh>
        </group>
      ))}

      {/* Necrotic Blight Lesion Cluster */}
      <group position={[0.2, 0.25, 0.035]}>
        <mesh>
          <circleGeometry args={[0.26, 24]} />
          <meshStandardMaterial
            color="#78350f"
            roughness={0.8}
            metalness={0.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      <group position={[-0.25, -0.3, 0.035]}>
        <mesh>
          <circleGeometry args={[0.18, 20]} />
          <meshStandardMaterial
            color="#92400e"
            roughness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Clean Scanner Indicator Bar */}
      <group ref={scanBarRef} position={[0, 0, 0.08]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.03, 1.8, 0.01]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
};

export const LeafPathology3D = ({ severity = 'Moderate' }) => {
  return (
    <div className="relative w-full h-[320px] rounded-2xl bg-slate-900 overflow-hidden border border-slate-700/80 shadow-sm select-none font-sans">
      {/* Top Diagnostics Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 rounded-xl text-emerald-400 border border-slate-700 text-xs font-semibold shadow-xs">
          <Scan className="w-3.5 h-3.5 text-emerald-400" />
          <span>Foliage Pathology Analysis</span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/90 px-2.5 py-1 rounded-xl border border-slate-700 text-[10px] font-semibold text-slate-300">
          <span>SCAN</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="text-emerald-400">DETECT</span>
          <span className="text-slate-500">&rarr;</span>
          <span>RECOMMEND</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.9} />
        <pointLight position={[5, 5, 5]} intensity={1.0} color="#ffffff" />
        <directionalLight position={[0, 4, 3]} intensity={0.8} color="#e2e8f0" />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
          <LeafBlade severity={severity} />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 3.4}
        />
      </Canvas>

      {/* Bottom Controls Info */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-xs text-slate-300 pointer-events-none">
        <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 text-emerald-300 flex items-center gap-1 text-[11px] font-semibold">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Alternaria solani • Early Blight
        </span>
        <span className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 text-[10px] text-slate-400 hidden sm:inline-block">
          Drag to inspect 3D sample
        </span>
      </div>
    </div>
  );
};

export default LeafPathology3D;
