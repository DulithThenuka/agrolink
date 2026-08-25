import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Layers, Activity, Radio, RefreshCw, Truck, Zap } from 'lucide-react';

// Bioluminescent Agri-Particles Cloud
const AgriParticles = ({ count = 950, mode = 'ecosystem' }) => {
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
      const radius = 1.9 + Math.random() * 2.8;
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

// Node coordinate conversion helper
const latLonToVector3 = (lat, lon, radius = 1.55) => {
  const x = radius * Math.cos(lat) * Math.sin(lon);
  const y = radius * Math.sin(lat);
  const z = radius * Math.cos(lat) * Math.cos(lon);
  return new THREE.Vector3(x, y, z);
};

// Hub coordinates
const FARM_HUBS = [
  { id: 'badulla', name: 'Welimada Organic Hub', crop: 'Grade A Tomatoes', lat: 0.3, lon: 0.6, color: '#10b981' },
  { id: 'polonnaruwa', name: 'Polonnaruwa Belt', crop: 'Samba Paddy Grain', lat: -0.2, lon: 2.1, color: '#34d399' },
  { id: 'jaffna', name: 'Jaffna Agro Hub', crop: 'Pungent Green Chillies', lat: 0.8, lon: -1.2, color: '#f59e0b' },
  { id: 'nuwaraeliya', name: 'Nuwara Eliya Cold Zone', crop: 'Export Potatoes', lat: -0.5, lon: -0.8, color: '#06b6d4' },
  { id: 'kandy', name: 'Central Spices Cluster', crop: 'Organic Pepper & Cloves', lat: 0.1, lon: -2.5, color: '#10b981' }
];

// 3D Animated Curved Trade Arcs with Real-Time Cargo Pulses
const TradeRouteArcs = ({ mode = 'ecosystem' }) => {
  const routes = useMemo(() => {
    const pairs = [
      ['badulla', 'polonnaruwa'],
      ['nuwaraeliya', 'badulla'],
      ['jaffna', 'polonnaruwa'],
      ['kandy', 'nuwaraeliya'],
      ['kandy', 'jaffna']
    ];

    return pairs.map(([fromId, toId], idx) => {
      const fromHub = FARM_HUBS.find((h) => h.id === fromId);
      const toHub = FARM_HUBS.find((h) => h.id === toId);

      const p1 = latLonToVector3(fromHub.lat, fromHub.lon, 1.55);
      const p2 = latLonToVector3(toHub.lat, toHub.lon, 1.55);

      // Elevated midpoint for dramatic 3D arc
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(1.55 + Math.min(distance * 0.45, 0.75));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(32);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return {
        id: `${fromId}-${toId}`,
        curve,
        geometry,
        speed: 0.35 + (idx % 3) * 0.1,
        offset: idx * 0.22,
        color: mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#34d399'
      };
    });
  }, [mode]);

  const pulsesRef = useRef([]);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }

    const t = state.clock.elapsedTime;
    routes.forEach((route, idx) => {
      const pulseMesh = pulsesRef.current[idx];
      if (pulseMesh && route.curve) {
        const progress = ((t * route.speed + route.offset) % 1);
        const point = route.curve.getPointAt(progress);
        pulseMesh.position.copy(point);
        const pulseScale = 1 + Math.sin(progress * Math.PI) * 0.6;
        pulseMesh.scale.set(pulseScale, pulseScale, pulseScale);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {routes.map((route, idx) => (
        <group key={route.id}>
          {/* Luminous Translucent Trade Arc Curve */}
          <line geometry={route.geometry}>
            <lineBasicMaterial
              color={route.color}
              transparent
              opacity={0.55}
              blending={THREE.AdditiveBlending}
              linewidth={1}
            />
          </line>

          {/* Traveling High-Speed Harvest/Trade Pulse Bead */}
          <mesh
            ref={(el) => (pulsesRef.current[idx] = el)}
          >
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.95}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
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
          opacity={0.4}
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
          opacity={0.22}
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
          <meshBasicMaterial color="#34d399" transparent opacity={0.5} />
        </mesh>
        <mesh rotation={[Math.PI / 1.7, 0.5, 0]}>
          <torusGeometry args={[2.05, 0.008, 16, 64]} />
          <meshBasicMaterial color="#6ee7b7" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
};

// 3D Interactive Farm Hub Pins with Ripple HALO
const FarmNodes = ({ onSelectNode, selectedNodeId }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {FARM_HUBS.map((node) => {
        const isSelected = selectedNodeId === node.id;
        const pos = latLonToVector3(node.lat, node.lon, 1.55);

        return (
          <Float key={node.id} speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
            <group position={[pos.x, pos.y, pos.z]}>
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'auto';
                }}
                onClick={() => onSelectNode(node)}
                scale={isSelected ? 1.4 : 1.0}
              >
                <octahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial
                  color={node.color}
                  emissive={node.color}
                  emissiveIntensity={isSelected ? 1.4 : 0.8}
                  roughness={0.2}
                />
              </mesh>
              {/* Pulsing Beacon Halo */}
              <mesh>
                <ringGeometry args={[0.1, 0.13, 16]} />
                <meshBasicMaterial
                  color={node.color}
                  transparent
                  opacity={isSelected ? 0.95 : 0.6}
                  side={THREE.DoubleSide}
                />
              </mesh>
              {/* Extra Active Shockwave Ring for Selected Hub */}
              {isSelected && (
                <mesh>
                  <ringGeometry args={[0.16, 0.18, 16]} />
                  <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Orbiting Autonomous Agri-Drone with Holographic Downward Scanner Beam
const AgriDrone = ({ mode = 'ecosystem' }) => {
  const droneRef = useRef();
  const scanConeRef = useRef();
  const groundRingRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * 0.55;
    if (droneRef.current) {
      const radius = 2.25;
      const x = Math.sin(t) * radius;
      const z = Math.cos(t) * radius;
      const y = Math.sin(t * 2) * 0.35 + 0.4;

      droneRef.current.position.set(x, y, z);
      droneRef.current.rotation.y = -t + Math.PI / 2;

      // Pulse scan cone opacity and rotation
      if (scanConeRef.current) {
        scanConeRef.current.rotation.y += delta * 2;
        const pulse = 0.25 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
        scanConeRef.current.material.opacity = pulse;
      }

      // Track ground scanning hotspot on globe surface directly below drone
      if (groundRingRef.current) {
        const dronePos = new THREE.Vector3(x, y, z);
        const groundPos = dronePos.clone().normalize().multiplyScalar(1.52);
        groundRingRef.current.position.copy(groundPos);
        groundRingRef.current.lookAt(0, 0, 0);
      }
    }
  });

  const beamColor = mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#10b981';

  return (
    <group>
      {/* Moving Drone Chassis & Attached Downward Scanner Laser */}
      <group ref={droneRef}>
        {/* Central Carbon-Fiber Body */}
        <mesh>
          <boxGeometry args={[0.18, 0.045, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
        </mesh>
        
        {/* Top Telemetry Flasher */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>

        {/* 4 Carbon Arms */}
        <mesh position={[0.11, 0, 0.11]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <mesh position={[-0.11, 0, -0.11]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <mesh position={[0.11, 0, -0.11]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>
        <mesh position={[-0.11, 0, 0.11]}>
          <cylinderGeometry args={[0.007, 0.007, 0.09]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>

        {/* 4 Spinning Rotor Discs */}
        {[[0.11, 0.02, 0.11], [-0.11, 0.02, -0.11], [0.11, 0.02, -0.11], [-0.11, 0.02, 0.11]].map((p, i) => (
          <mesh key={i} position={p}>
            <cylinderGeometry args={[0.045, 0.045, 0.004, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Holographic Downward Scanning Laser Cone Beam */}
        <mesh
          ref={scanConeRef}
          position={[0, -0.45, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <coneGeometry args={[0.38, 0.9, 24, 1, true]} />
          <meshBasicMaterial
            color={beamColor}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Surface Projected Scanning Radar Ring */}
      <mesh ref={groundRingRef}>
        <ringGeometry args={[0.15, 0.22, 24]} />
        <meshBasicMaterial
          color={beamColor}
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
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
  const [selectedNode, setSelectedNode] = useState(FARM_HUBS[0]);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[490px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden shadow-2xl border border-white/10 select-none">
      {/* Top Glassmorphic Mode HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
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
          <span>Live Arcs &amp; Scanner Active</span>
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
          <AgriParticles count={950} mode={activeMode} />
          <TradeRouteArcs mode={activeMode} />
          <FarmNodes
            onSelectNode={(node) => setSelectedNode(node)}
            selectedNodeId={selectedNode?.id}
          />
          <AgriDrone mode={activeMode} />

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.6}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.2}
          />
        </Canvas>
      </Suspense>

      {/* Bottom Floating Telemetry Card & Trade Status */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between gap-3">
        <div className="p-3.5 bg-slate-950/85 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs shadow-2xl pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Live Node Telemetry
            </span>
            <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
              <Truck className="w-2.5 h-2.5 text-emerald-400" /> In-Transit
            </span>
          </div>
          <h4 className="text-sm font-black text-white">{selectedNode.name}</h4>
          <div className="flex items-center justify-between mt-1 pt-1 border-t border-white/10 text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
              {selectedNode.crop}
            </span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> 100% Sync
            </span>
          </div>
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
