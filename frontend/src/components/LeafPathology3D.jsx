import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Layers, Sparkles } from 'lucide-react';

// 3D Organic Leaf Blade with Lesion Spots & Spore Infiltration
const LeafBlade = ({ severity = 'Moderate', showSpores = true }) => {
  const meshRef = useRef();
  const sporesRef = useRef();

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
    <div className="relative w-full h-[320px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden border border-white/10 shadow-xl select-none">
      {/* Top HUD Tag */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-xl text-emerald-400 border border-white/10 text-[11px] font-extrabold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>3D Foliage Pathology Hologram</span>
        </div>
        <div className="flex items-center gap-1 px-2.5 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-[10px] font-black">
          <span>● Active Necrotic Lesion</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 45 }}
        dpr={[1, 2]}
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
        <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-emerald-300">
          Epidermis • Mesophyll Necrosis
        </span>
        <span className="bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          🖱️ Drag to rotate 3D leaf
        </span>
      </div>
    </div>
  );
};
