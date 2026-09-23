import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function makeNodes(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = radius * (0.55 + ((i * 37) % 100) / 220);
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

function Network({ colorA, colorB }: { colorA: string; colorB: string }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => makeNodes(20, 3.2), []);
  const edges = useMemo(() => makeEdges(nodes, 2, 24), [nodes]);
  const colors = useMemo(() => [colorA, colorB], [colorA, colorB]);

  const lineGeom = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      positions.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], i * 6);
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [edges, nodes]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.05;
      group.current.rotation.x = Math.sin(t * 0.08) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color={colorA} transparent opacity={0.28} />
      </lineSegments>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 4 === 0 ? 0.07 : 0.04, 10, 10]} />
          <meshBasicMaterial color={colors[i % colors.length]} />
        </mesh>
      ))}
    </group>
  );
}

function CenterOrb({ colorA }: { colorA: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
  });
  return (
    <mesh ref={ref} scale={1.1}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color={colorA}
        emissive={colorA}
        emissiveIntensity={0.25}
        roughness={0.2}
        metalness={0.5}
        distort={0.25}
        speed={1.2}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}

interface HeroSceneProps {
  colorA: string;
  colorB: string;
  reducedMotion?: boolean;
}

export default function HeroScene({ colorA, colorB, reducedMotion }: HeroSceneProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[6, 4, 6]} intensity={35} color={colorA} />
      <pointLight position={[-6, -3, -4]} intensity={22} color={colorB} />

      <Float speed={reducedMotion ? 0 : 1} rotationIntensity={0.2} floatIntensity={0.5}>
        <CenterOrb colorA={colorA} />
      </Float>

      {!reducedMotion && <Network colorA={colorA} colorB={colorB} />}
      <Sparkles count={50} scale={8.5} size={1.2} speed={0.2} opacity={0.45} color={colorB} />
    </Canvas>
  );
}
