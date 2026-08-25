import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Layers, Activity, Radio, RefreshCw } from 'lucide-react';

// Bioluminescent Agri-Particles Cloud
const AgriParticles = ({ count = 900, mode = 'ecosystem' }) => {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const c1 = mode === 'heatmap' 
      ? new THREE.Color('#f59e0b') 
      : mode === 'sensors' 
      ? new THREE.Color('#06b6d4') 
      : new THREE.Color('#10b981');
      
    const c2 = new THREE.Color('#34d399');
    const c3 = new THREE.Color('#a7f3d0');

    for (let i = 0; i < count; i++) {
      // Golden spiral distribution with spherical radius
      const radius = 2.0 + Math.random() * 2.8;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();

      pos[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(theta);

      const mixed = Math.random() > 0.5 ? c1.clone().lerp(c2, Math.random()) : c2.clone().lerp(c3, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count, mode]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.08;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Holographic Central World Globe & Wireframe
const AgroGlobe = ({ mode = 'ecosystem' }) => {
  const meshRef = useRef();
  const innerCoreRef = useRef();
  const ringsRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.1;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      innerCoreRef.current.scale.set(pulse, pulse, pulse);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * 0.05;
      ringsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
    }
  });

  const wireColor = mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#10b981';
  const coreColor = mode === 'heatmap' ? '#d97706' : mode === 'sensors' ? '#0891b2' : '#059669';

  return (
    <group>
      {/* Outer Wireframe Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshStandardMaterial
          color={wireColor}
          wireframe
          transparent
          opacity={0.45}
          emissive={wireColor}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerCoreRef}>
        <sphereGeometry args={[1.35, 32, 32]} />
        <meshStandardMaterial
          color={coreColor}
          transparent
          opacity={0.25}
          roughness={0.1}
          metalness={0.8}
          emissive={coreColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Orbital Data Rings */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[1.85, 0.012, 16, 64]} />
          <meshBasicMaterial color="#34d399" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, 0.5, 0]}>
          <torusGeometry args={[2.05, 0.008, 16, 64]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0.4} />
        </mesh>
      </group>
    </group>
  );
};

// 3D Interactive Farm Hub Pins
const FarmNodes = ({ onSelectNode }) => {
  const nodes = [
    { id: 'badulla', name: 'Welimada Organic Hub', crop: 'Grade A Tomatoes', lat: 0.3, lon: 0.6, color: '#10b981' },
    { id: 'polonnaruwa', name: 'Polonnaruwa Belt', crop: 'Samba Paddy Grain', lat: -0.2, lon: 2.1, color: '#34d399' },
    { id: 'jaffna', name: 'Jaffna Agro Hub', crop: 'Pungent Green Chillies', lat: 0.8, lon: -1.2, color: '#f59e0b' },
    { id: 'nuwaraeliya', name: 'Nuwara Eliya Cold Zone', crop: 'Export Potatoes', lat: -0.5, lon: -0.8, color: '#06b6d4' },
    { id: 'kandy', name: 'Central Spices Cluster', crop: 'Organic Pepper & Cloves', lat: 0.1, lon: -2.5, color: '#10b981' }
  ];

  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {nodes.map((node) => {
        const radius = 1.55;
        const x = radius * Math.cos(node.lat) * Math.sin(node.lon);
        const y = radius * Math.sin(node.lat);
        const z = radius * Math.cos(node.lat) * Math.cos(node.lon);

        return (
          <Float key={node.id} speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <group position={[x, y, z]}>
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
                onClick={() => onSelectNode(node)}
              >
                <octahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Pulsing Beacon Halo */}
              <mesh>
                <ringGeometry args={[0.1, 0.13, 16]} />
                <meshBasicMaterial color={node.color} transparent opacity={0.7} side={THREE.DoubleSide} />
              </mesh>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Orbiting Autonomous Agri-Drone
const AgriDrone = () => {
  const droneRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.6;
    if (droneRef.current) {
      const radius = 2.3;
      droneRef.current.position.x = Math.sin(t) * radius;
      droneRef.current.position.z = Math.cos(t) * radius;
      droneRef.current.position.y = Math.sin(t * 2) * 0.4 + 0.3;
      droneRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <group ref={droneRef}>
      {/* Central Chassis */}
      <mesh>
        <boxGeometry args={[0.16, 0.04, 0.16]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
      </mesh>
      {/* Sensor Beacon */}
      <mesh position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="#34d399" />
      </mesh>
      {/* Propeller Arms */}
      <mesh position={[0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
      <mesh position={[-0.1, 0, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
      <mesh position={[0.1, 0, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
      <mesh position={[-0.1, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08]} />
        <meshBasicMaterial color="#64748b" />
      </mesh>
    </group>
  );
};

// Center 3D Sprout Hologram Floating in Globe
const CenterSprout = () => {
  const sproutRef = useRef();

  useFrame((state) => {
    if (sproutRef.current) {
      sproutRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
      sproutRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={sproutRef} scale={1.1}>
      {/* Stem */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.35, 12]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
      </mesh>
      {/* Left Leaf */}
      <mesh position={[-0.09, 0.08, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.07, 0.22, 12]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.5} />
      </mesh>
      {/* Right Leaf */}
      <mesh position={[0.09, 0.12, 0]} rotation={[0, 0, -Math.PI / 3.5]}>
        <coneGeometry args={[0.065, 0.2, 12]} />
        <meshStandardMaterial color="#6ee7b7" emissive="#34d399" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export const AgriHero3DCanvas = () => {
  const [activeMode, setActiveMode] = useState('ecosystem'); // 'ecosystem', 'sensors', 'heatmap'
  const [selectedNode, setSelectedNode] = useState({
    name: 'Welimada Organic Hub',
    crop: 'Grade A Tomatoes',
    color: '#10b981'
  });
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[480px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden shadow-2xl border border-white/10 select-none">
      {/* Top Glassmorphic Mode HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveMode('ecosystem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'ecosystem'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ecosystem</span>
          </button>
          <button
            onClick={() => setActiveMode('sensors')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'sensors'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Telemetry</span>
          </button>
          <button
            onClick={() => setActiveMode('heatmap')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'heatmap'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Yield Matrix</span>
          </button>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-bold backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>WebGL 3D Active</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 text-sm gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span>Initializing 3D Farm Engine...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.8, 4.4], fov: 45 }}
          dpr={[1, 2]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.2} color="#6ee7b7" />
          <pointLight position={[-10, -10, -5]} intensity={0.6} color="#06b6d4" />
          <directionalLight position={[0, 5, 2]} intensity={0.8} color="#ffffff" />

          {/* 3D Scene Components */}
          <AgroGlobe mode={activeMode} />
          <CenterSprout />
          <AgriParticles count={1100} mode={activeMode} />
          <FarmNodes onSelectNode={(node) => setSelectedNode(node)} />
          <AgriDrone />

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.7}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.2}
          />
        </Canvas>
      </Suspense>

      {/* Bottom Floating Telemetry Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between gap-3">
        <div className="p-3.5 bg-slate-950/80 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs shadow-2xl pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Hub Telemetry
            </span>
            <span className="text-[10px] font-bold text-slate-400">DOA Verified</span>
          </div>
          <h4 className="text-sm font-black text-white">{selectedNode.name}</h4>
          <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
            {selectedNode.crop}
          </p>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleResetCamera}
            title="Reset 3D Camera"
            className="p-2.5 bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white rounded-xl transition shadow-lg"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[11px] font-semibold text-slate-300">
            🖱️ Drag to rotate
          </span>
        </div>
      </div>
    </div>
  );
};
