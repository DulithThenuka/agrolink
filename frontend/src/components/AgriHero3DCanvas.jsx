import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Sparkles, Layers, Activity, Radio, RefreshCw, Truck, Zap, Globe } from 'lucide-react';

// Procedural High-Definition Photorealistic Earth & Topography Texture
const createRealisticEarthTextures = () => {
  const width = 2048;
  const height = 1024;

  // 1. Daytime Earth Map (Oceans, Continents, Terrain Gradients, Grid)
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Deep Space Ocean Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#021024');
  oceanGrad.addColorStop(0.5, '#051937');
  oceanGrad.addColorStop(1, '#021024');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Ocean Bathymetry & Currents (Subtle glowing grid and depth lines)
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
  ctx.lineWidth = 1;
  for (let lat = 0; lat < height; lat += 32) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(width, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon < width; lon += 64) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, height);
    ctx.stroke();
  }

  // Draw Realistic Major Continents & Landmasses with Topographic Shading
  const drawLand = (coords, color = '#0f3a2c', strokeColor = '#10b981') => {
    ctx.fillStyle = color;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    coords.forEach(([xPct, yPct], i) => {
      const x = xPct * width;
      const y = yPct * height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // Indian Subcontinent & South Asia
  drawLand([
    [0.64, 0.35], [0.69, 0.38], [0.72, 0.45], [0.70, 0.58], 
    [0.68, 0.62], [0.65, 0.54], [0.62, 0.44], [0.63, 0.36]
  ], '#134e3a', '#34d399');

  // Sri Lanka Island (Enlarged & Detailed for Agro Hub Prominence)
  drawLand([
    [0.695, 0.625], [0.708, 0.630], [0.712, 0.655], [0.705, 0.680],
    [0.690, 0.675], [0.685, 0.645]
  ], '#15803d', '#6ee7b7');

  // Southeast Asia & Australia
  drawLand([
    [0.73, 0.48], [0.78, 0.52], [0.82, 0.58], [0.79, 0.65],
    [0.75, 0.56], [0.73, 0.50]
  ], '#0f3a2c', '#10b981');
  drawLand([
    [0.78, 0.72], [0.88, 0.70], [0.90, 0.84], [0.82, 0.88], [0.76, 0.78]
  ], '#114232', '#059669');

  // Africa & Middle East
  drawLand([
    [0.48, 0.38], [0.58, 0.36], [0.62, 0.46], [0.59, 0.58],
    [0.54, 0.78], [0.48, 0.65], [0.44, 0.48], [0.46, 0.40]
  ], '#1e3a2b', '#10b981');

  // Europe & Northern Eurasia
  drawLand([
    [0.46, 0.22], [0.60, 0.20], [0.80, 0.18], [0.88, 0.26],
    [0.75, 0.34], [0.55, 0.32], [0.45, 0.28]
  ], '#14532d', '#34d399');

  // Americas (North & South)
  drawLand([
    [0.15, 0.18], [0.28, 0.20], [0.30, 0.38], [0.22, 0.44], [0.12, 0.32]
  ], '#134e3a', '#10b981');
  drawLand([
    [0.22, 0.52], [0.32, 0.56], [0.35, 0.74], [0.28, 0.88], [0.20, 0.68]
  ], '#15803d', '#34d399');

  // Add Night City Lights / Bio-luminescence Nodes
  ctx.fillStyle = '#fef08a';
  for (let i = 0; i < 240; i++) {
    const lx = Math.random() * width;
    const ly = Math.random() * height;
    ctx.beginPath();
    ctx.arc(lx, ly, Math.random() * 1.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const earthTex = new THREE.CanvasTexture(canvas);
  earthTex.wrapS = THREE.RepeatWrapping;
  earthTex.wrapT = THREE.ClampToEdgeWrapping;

  // 2. Cloud Atmosphere Texture
  const cloudCanvas = document.createElement('canvas');
  cloudCanvas.width = 1024;
  cloudCanvas.height = 512;
  const cctx = cloudCanvas.getContext('2d');
  cctx.clearRect(0, 0, 1024, 512);

  // Soft organic cloud bands
  cctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  for (let i = 0; i < 65; i++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 512;
    const cr = 35 + Math.random() * 75;
    cctx.beginPath();
    cctx.arc(cx, cy, cr, 0, Math.PI * 2);
    cctx.fill();
  }

  const cloudTex = new THREE.CanvasTexture(cloudCanvas);
  cloudTex.wrapS = THREE.RepeatWrapping;
  cloudTex.wrapT = THREE.ClampToEdgeWrapping;

  return { earthTex, cloudTex };
};

// Node coordinate conversion helper for spherical Earth
const latLonToVector3 = (lat, lon, radius = 1.52) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// High-Precision Agricultural Hubs mapped to realistic geographic coordinates
const REAL_FARM_HUBS = [
  { id: 'badulla', name: 'Welimada Organic Hub', crop: 'Grade A Tomatoes', lat: 6.9, lon: 80.9, color: '#10b981', code: 'HUB-BDL' },
  { id: 'polonnaruwa', name: 'Polonnaruwa Belt', crop: 'Samba Paddy Grain', lat: 7.9, lon: 81.0, color: '#34d399', code: 'HUB-PLN' },
  { id: 'jaffna', name: 'Jaffna Agro Hub', crop: 'Pungent Green Chillies', lat: 9.6, lon: 80.0, color: '#f59e0b', code: 'HUB-JAF' },
  { id: 'nuwaraeliya', name: 'Nuwara Eliya Cold Zone', crop: 'Export Potatoes', lat: 6.97, lon: 80.78, color: '#06b6d4', code: 'HUB-NWE' },
  { id: 'kandy', name: 'Central Spices Cluster', crop: 'Organic Pepper & Cloves', lat: 7.29, lon: 80.63, color: '#10b981', code: 'HUB-KDY' },
  { id: 'colombo', name: 'Colombo Export Terminal', crop: 'Escrow Trade Gateway', lat: 6.92, lon: 79.86, color: '#38bdf8', code: 'GATE-CMB' }
];

// Photorealistic 3D Earth Globe with Atmosphere and Cloud Shell
const RealEarthGlobe = ({ mode = 'ecosystem' }) => {
  const globeRef = useRef();
  const cloudRef = useRef();
  const atmosphereRef = useRef();

  const { earthTex, cloudTex } = useMemo(() => createRealisticEarthTextures(), []);

  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.12;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.16;
    }
    if (atmosphereRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
      atmosphereRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  const glowColor = mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#10b981';

  return (
    <group>
      {/* 1. Photorealistic Solid Earth Sphere */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          map={earthTex}
          roughness={0.45}
          metalness={0.15}
          emissive="#06281e"
          emissiveIntensity={0.35}
        />
      </mesh>

      {/* 2. Floating Atmospheric Cloud Layer */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.52, 48, 48]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Outer Fresnel Atmospheric Glow Halo */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[1.56, 48, 48]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

// 3D Active Hub Halos & Pulsing Concentric Radar Beacons
const ActiveHubHalos = ({ onSelectNode, selectedNodeId }) => {
  const groupRef = useRef();
  const shockwavesRef = useRef([]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }

    // Radiate shockwave rings outward
    const t = state.clock.elapsedTime;
    shockwavesRef.current.forEach((ring, i) => {
      if (ring) {
        const progress = (t * 1.5 + i * 0.4) % 1;
        const scale = 1 + progress * 2.2;
        ring.scale.set(scale, scale, scale);
        if (ring.material) {
          ring.material.opacity = Math.max(0, (1 - progress) * 0.85);
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {REAL_FARM_HUBS.map((hub, idx) => {
        const isSelected = selectedNodeId === hub.id;
        const pos = latLonToVector3(hub.lat, hub.lon, 1.52);
        const normal = pos.clone().normalize();

        // Calculate rotation quaternion to lay halos flush on Earth's curved surface
        const up = new THREE.Vector3(0, 0, 1);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normal);

        return (
          <group key={hub.id} position={[pos.x, pos.y, pos.z]} quaternion={quaternion}>
            {/* 1. Core 3D Interactive Hub Beacon Pin */}
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
              onClick={() => onSelectNode(hub)}
              scale={isSelected ? 1.6 : 1.1}
            >
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial
                color={hub.color}
                emissive={hub.color}
                emissiveIntensity={isSelected ? 2.0 : 1.2}
                roughness={0.1}
              />
            </mesh>

            {/* 2. Vertical Holographic Light Pillar */}
            <mesh position={[0, 0, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.006, 0.016, 0.16, 12]} />
              <meshBasicMaterial
                color={hub.color}
                transparent
                opacity={isSelected ? 0.9 : 0.6}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* 3. Surface Concentric Active Halo Rings */}
            <mesh>
              <ringGeometry args={[0.07, 0.095, 24]} />
              <meshBasicMaterial
                color={hub.color}
                transparent
                opacity={isSelected ? 0.95 : 0.65}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* 4. Radiating Radar Shockwave Ring */}
            <mesh ref={(el) => (shockwavesRef.current[idx] = el)}>
              <ringGeometry args={[0.09, 0.11, 24]} />
              <meshBasicMaterial
                color={isSelected ? '#ffffff' : hub.color}
                transparent
                opacity={0.8}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// 3D Animated Trade Arcs between Real Earth Coordinates
const RealEarthTradeArcs = ({ mode = 'ecosystem' }) => {
  const routes = useMemo(() => {
    const pairs = [
      ['badulla', 'colombo'],
      ['nuwaraeliya', 'badulla'],
      ['jaffna', 'colombo'],
      ['polonnaruwa', 'colombo'],
      ['kandy', 'colombo'],
      ['kandy', 'jaffna']
    ];

    return pairs.map(([fromId, toId], idx) => {
      const fromHub = REAL_FARM_HUBS.find((h) => h.id === fromId);
      const toHub = REAL_FARM_HUBS.find((h) => h.id === toId);

      const p1 = latLonToVector3(fromHub.lat, fromHub.lon, 1.52);
      const p2 = latLonToVector3(toHub.lat, toHub.lon, 1.52);

      // Elevated Great-Circle Midpoint for smooth 3D arc over the Earth
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(1.52 + Math.min(distance * 0.65, 0.55));

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(36);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      return {
        id: `${fromId}-${toId}`,
        curve,
        geometry,
        speed: 0.4 + (idx % 3) * 0.12,
        offset: idx * 0.18,
        color: mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#34d399'
      };
    });
  }, [mode]);

  const pulsesRef = useRef([]);
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.12;
    }

    const t = state.clock.elapsedTime;
    routes.forEach((route, idx) => {
      const pulseMesh = pulsesRef.current[idx];
      if (pulseMesh && route.curve) {
        const progress = ((t * route.speed + route.offset) % 1);
        const point = route.curve.getPointAt(progress);
        pulseMesh.position.copy(point);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {routes.map((route, idx) => (
        <group key={route.id}>
          {/* Luminous Translucent Trade Line */}
          <line geometry={route.geometry}>
            <lineBasicMaterial
              color={route.color}
              transparent
              opacity={0.65}
              blending={THREE.AdditiveBlending}
              linewidth={1}
            />
          </line>

          {/* Traveling Harvest Pulse Packet */}
          <mesh ref={(el) => (pulsesRef.current[idx] = el)}>
            <sphereGeometry args={[0.038, 16, 16]} />
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

// 3D Bioluminescent Spores Cloud
const BioluminescentSpores = ({ count = 750, mode = 'ecosystem' }) => {
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

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 2.5;
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = 2 * Math.PI * Math.random();

      pos[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(theta);

      const mixed = c1.clone().lerp(c2, Math.random());
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count, mode]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.06;
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
        size={0.032}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// 3D Orbiting Autonomous Agri-Drone with Downward Holographic Scanner
const OrbitingDroneScanner = ({ mode = 'ecosystem' }) => {
  const droneRef = useRef();
  const scanConeRef = useRef();
  const groundRingRef = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * 0.55;
    if (droneRef.current) {
      const radius = 2.25;
      const x = Math.sin(t) * radius;
      const z = Math.cos(t) * radius;
      const y = Math.sin(t * 2) * 0.35 + 0.35;

      droneRef.current.position.set(x, y, z);
      droneRef.current.rotation.y = -t + Math.PI / 2;

      if (scanConeRef.current) {
        scanConeRef.current.rotation.y += delta * 2;
        const pulse = 0.25 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
        scanConeRef.current.material.opacity = pulse;
      }

      if (groundRingRef.current) {
        const groundPos = new THREE.Vector3(x, y, z).normalize().multiplyScalar(1.53);
        groundRingRef.current.position.copy(groundPos);
        groundRingRef.current.lookAt(0, 0, 0);
      }
    }
  });

  const beamColor = mode === 'heatmap' ? '#f59e0b' : mode === 'sensors' ? '#06b6d4' : '#10b981';

  return (
    <group>
      <group ref={droneRef}>
        {/* Chassis */}
        <mesh>
          <boxGeometry args={[0.18, 0.045, 0.18]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.85} />
        </mesh>
        
        {/* Flashing Green Sensor Beacon */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color="#34d399" />
        </mesh>

        {/* 4 Rotors */}
        {[[0.11, 0.02, 0.11], [-0.11, 0.02, -0.11], [0.11, 0.02, -0.11], [-0.11, 0.02, 0.11]].map((p, i) => (
          <mesh key={i} position={p}>
            <cylinderGeometry args={[0.045, 0.045, 0.004, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
          </mesh>
        ))}

        {/* Holographic Downward Scanning Laser Beam */}
        <mesh
          ref={scanConeRef}
          position={[0, -0.42, 0]}
          rotation={[Math.PI, 0, 0]}
        >
          <coneGeometry args={[0.35, 0.85, 24, 1, true]} />
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

      {/* Surface Ground Target Radar Ring */}
      <mesh ref={groundRingRef}>
        <ringGeometry args={[0.12, 0.18, 24]} />
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

export const AgriHero3DCanvas = () => {
  const [activeMode, setActiveMode] = useState('ecosystem');
  const [selectedNode, setSelectedNode] = useState(REAL_FARM_HUBS[0]);
  const controlsRef = useRef();

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-[500px] rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 overflow-hidden shadow-2xl border border-white/10 select-none">
      {/* Top Glassmorphic Mode HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        <div className="flex items-center gap-1.5 p-1 bg-black/55 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveMode('ecosystem')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeMode === 'ecosystem'
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>3D Earth</span>
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
            <span>Hub Telemetry</span>
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
          <span>Real 3D Earth &amp; Halos</span>
        </div>
      </div>

      {/* 3D WebGL Canvas */}
      <Suspense
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 text-sm gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
            <span>Loading Photorealistic 3D Earth...</span>
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0.7, 4.3], fov: 45 }}
          dpr={[1, 2]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.85} />
          <pointLight position={[12, 10, 12]} intensity={1.4} color="#e0f2fe" />
          <pointLight position={[-12, -8, -8]} intensity={0.5} color="#059669" />
          <directionalLight position={[5, 3, 5]} intensity={0.9} color="#ffffff" />

          {/* Real Earth 3D Components */}
          <RealEarthGlobe mode={activeMode} />
          <ActiveHubHalos
            onSelectNode={(node) => setSelectedNode(node)}
            selectedNodeId={selectedNode?.id}
          />
          <RealEarthTradeArcs mode={activeMode} />
          <BioluminescentSpores count={800} mode={activeMode} />
          <OrbitingDroneScanner mode={activeMode} />

          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.55}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 3.2}
          />
        </Canvas>
      </Suspense>

      {/* Bottom Floating Telemetry Card & Active Hub HUD */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between gap-3">
        <div className="p-3.5 bg-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl max-w-xs shadow-2xl pointer-events-auto transition-all">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" /> Active Hub Halo
            </span>
            <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/60">
              {selectedNode.code}
            </span>
          </div>
          <h4 className="text-sm font-black text-white">{selectedNode.name}</h4>
          <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/10 text-xs">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: selectedNode.color }} />
              {selectedNode.crop}
            </span>
            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-0.5">
              <Zap className="w-3 h-3" /> Live GPS
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
            🖱️ Drag to rotate Earth
          </span>
        </div>
      </div>
    </div>
  );
};
