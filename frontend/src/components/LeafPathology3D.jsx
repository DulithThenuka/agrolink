import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Sparkles, Scan, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

// 3D Organic Leaf Blade with Lesion Spots, Veins & Diagnostic Scanner Bar
const LeafBlade = ({ severity = 'Moderate', showSpores = true }) => {
  const meshRef = useRef();
  const sporesRef = useRef();
  const scanBarRef = useRef();

  // Create stylized curved leaf geometry
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

  // Spore particle distribution around lesion area
  const sporePositions = useMemo(() => {
    const count = 45;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = (Math.random() - 0.5) * 0.7;
      const v = (Math.random() - 0.5) * 0.9;
      pos[i * 3] = u;
      pos[i * 3 + 1] = v;
      pos[i * 3 + 2] = 0.06 + Math.random() * 0.12;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.25;
      meshRef.current.rotation.x = 0.1 + Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (sporesRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      sporesRef.current.scale.set(pulse, pulse, pulse);
    }
    if (scanBarRef.current) {
      // Move holographic laser scan beam up and down smoothly
      const scanY = Math.sin(state.clock.elapsedTime * 1.8) * 1.1;
      scanBarRef.current.position.y = scanY;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Leaf Tissue Blade */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#15803d"
          roughness={0.35}
          metalness={0.1}
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

      {/* Necrotic Blight Lesion Cluster Spots */}
      <group position={[0.2, 0.25, 0.035]}>
        <mesh>
          <circleGeometry args={[0.26, 24]} />
          <meshStandardMaterial
            color="#78350f"
            roughness={0.8}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* Chlorotic Yellow Halo Ring */}
        <mesh>
          <ringGeometry args={[0.26, 0.38, 24]} />
          <meshBasicMaterial color="#eab308" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      </group>

      <group position={[-0.22, -0.3, 0.035]}>
        <mesh>
          <circleGeometry args={[0.18, 24]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.18, 0.26, 24]} />
          <meshBasicMaterial color="#eab308" side={THREE.DoubleSide} transparent opacity={0.75} />
        </mesh>
      </group>

      {/* Dynamic Holographic Laser Diagnostic Scan Bar */}
      <group ref={scanBarRef} position={[0, 0, 0.07]}>
        <mesh>
          <boxGeometry args={[1.8, 0.02, 0.02]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.8, 0.15]} />
          <meshBasicMaterial
            color="#0284c7"
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Active Fungal Spore Cloud */}
      {showSpores && (
        <points ref={sporesRef} position={[0.15, 0.15, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={sporePositions.length / 3}
              array={sporePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.035}
            color="#ef4444"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </group>
  );
};

export const LeafPathology3D = ({ severity = 'Moderate' }) => {
  return (
    <div className="relative w-full h-[340px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden border border-white/10 shadow-2xl select-none">
      {/* Top HUD Diagnostics Pipeline Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-emerald-400 border border-white/10 text-[11px] font-extrabold shadow-sm">
          <Scan className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI Foliage Pathology Scan</span>
        </div>

        {/* Workflow steps tag: Scan -> Analyze -> Detect -> Recommend */}
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-extrabold text-slate-300">
          <span className="text-cyan-400">SCAN</span>
          <span className="text-slate-500">→</span>
          <span className="text-emerald-400">ANALYZE</span>
          <span className="text-slate-500">→</span>
          <span className="text-amber-400">DETECT</span>
          <span className="text-slate-500">→</span>
          <span className="text-teal-300">RECOMMEND</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2)]}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-5, -5, -3]} intensity={0.5} color="#10b981" />
        <directionalLight position={[0, 4, 3]} intensity={0.9} color="#e0f2fe" />

        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
          <LeafBlade severity={severity} showSpores={true} />
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
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[10px] font-bold text-slate-400 pointer-events-none">
        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-emerald-300 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          Alternaria solani • Early Blight
        </span>
        <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 hidden sm:inline-block">
          🖱️ Drag to rotate 3D leaf
        </span>
      </div>
    </div>
  );
};

export default LeafPathology3D;
