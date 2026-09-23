import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function makeNodes(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = radius * (0.55 + Math.random() * 0.45);
    pts.push(
      new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.7,
        r * Math.cos(phi)
      )
    );
  }
  return pts;
}

function makeEdges(nodes: THREE.Vector3[], maxDist: number, maxEdges: number) {
  const edges: [number, number][] = [];
  for (let i = 0; i < nodes.length && edges.length < maxEdges; i++) {
    for (let j = i + 1; j < nodes.length && edges.length < maxEdges; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxDist) edges.push([i, j]);
    }
  }
  return edges;
}

function Network({ colors, lineColor, lineOpacity }: { colors: string[]; lineColor: string; lineOpacity: number }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => makeNodes(26, 3.4), []);
  const edges = useMemo(() => makeEdges(nodes, 2.1, 30), [nodes]);

  const lineGeom = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      positions.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [edges, nodes]);

  const pulseCount = 7;
  const pulseRefs = useRef<(THREE.Mesh | null)[]>([]);
  const pulseEdges = useMemo(
    () => Array.from({ length: pulseCount }, () => edges[Math.floor(Math.random() * edges.length)]),
    [edges]
  );
  const pulseSeeds = useMemo(() => Array.from({ length: pulseCount }, () => Math.random()), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.045;
      group.current.rotation.x = Math.sin(t * 0.08) * 0.08;
    }
    pulseRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const edge = pulseEdges[i];
      if (!edge) return;
      const [a, b] = edge;
      const speed = 0.18;
      const progress = (t * speed + pulseSeeds[i]) % 1;
      mesh.position.lerpVectors(nodes[a], nodes[b], progress);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.sin(progress * Math.PI);
    });
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color={lineColor} transparent opacity={lineOpacity} />
      </lineSegments>

      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 5 === 0 ? 0.075 : 0.045, 12, 12]} />
          <meshBasicMaterial color={colors[i % colors.length]} />
        </mesh>
      ))}

      {pulseEdges.map((_, i) => (
        <mesh key={i} ref={(el) => { pulseRefs.current[i] = el; }}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function CenterOrb({ base, emissive, opacity }: { base: string; emissive: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });
  return (
    <mesh ref={ref} scale={1.15}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={base}
        emissive={emissive}
        emissiveIntensity={0.35}
        roughness={0.15}
        metalness={0.6}
        distort={0.28}
        speed={1.4}
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function Rig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * 0.03;
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function NLHeroScene({ reducedMotion, isDarkMode }: { reducedMotion?: boolean; isDarkMode: boolean }) {
  const colors = ['#4d7fff', '#9b6bff', '#f472b6', '#22d3ee'];
  const orb = isDarkMode
    ? { base: '#141a33', emissive: '#4d7fff', opacity: 0.65 }
    : { base: '#dbe4ff', emissive: '#3f6bff', opacity: 0.55 };
  const line = isDarkMode ? { color: '#5b7fff', opacity: 0.22 } : { color: '#3f5fdd', opacity: 0.16 };
  const sparkleColor = isDarkMode ? '#b9c3ff' : '#4a5fc7';

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={isDarkMode ? 0.6 : 0.9} />
      <pointLight position={[6, 4, 6]} intensity={isDarkMode ? 40 : 60} color="#4d7fff" />
      <pointLight position={[-6, -3, -4]} intensity={isDarkMode ? 25 : 35} color="#9b6bff" />

      <Float speed={reducedMotion ? 0 : 1.1} rotationIntensity={0.25} floatIntensity={0.6}>
        <CenterOrb {...orb} />
      </Float>

      {!reducedMotion && <Network colors={colors} lineColor={line.color} lineOpacity={line.opacity} />}
      <Sparkles count={70} scale={9} size={1.4} speed={0.25} opacity={isDarkMode ? 0.5 : 0.35} color={sparkleColor} />

      {!reducedMotion && <Rig />}
    </Canvas>
  );
}
