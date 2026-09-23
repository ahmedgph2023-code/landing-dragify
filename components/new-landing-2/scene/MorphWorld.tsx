import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  FEATURE_VISUALS,
  INTEGRATION_ICONS,
  NL2_TUNING,
} from '../../../config/newLanding2Scene';
import {
  damp,
  formationTarget,
  sampleWorld,
  type NodeTarget,
} from '../../../lib/new-landing-2/worldMath';
import type { ProgressBus } from '../../../lib/new-landing-2/scrollEngine';
import { makeFeatureModuleTexture, makeIconNodeTexture } from './textures';

const ELECTRIC = new THREE.Color(NL2_TUNING.colors.electric);
const VIOLET = new THREE.Color(NL2_TUNING.colors.violet);
const CYAN = new THREE.Color(NL2_TUNING.colors.cyan);

const HUB_VERT = /* glsl */ `
uniform float uTime;
uniform float uPulse;
varying vec3 vN;
varying vec3 vV;
void main(){
  vec3 p = position + normal * (sin(uTime*2.0 + position.y*4.0)*0.04*uPulse);
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  vN = normalize(normalMatrix * normal);
  vV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const HUB_FRAG = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform float uGlow;
varying vec3 vN;
varying vec3 vV;
void main(){
  vec3 n = normalize(vN);
  vec3 v = normalize(vV);
  float f = pow(1.0 - clamp(dot(n,v),0.0,1.0), 2.2);
  float shade = clamp(dot(n, normalize(vec3(0.3,0.8,0.5)))*0.5+0.5,0.0,1.0);
  vec3 col = mix(uA,uB,shade) * (0.25 + shade*0.5);
  col += f * mix(uB, vec3(1.0), 0.25) * uGlow;
  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * The living sculpture — one hub + morphing nodes + tethers.
 * Formations evolve with scroll; icons come from INTEGRATION_ICONS / FEATURE_VISUALS.
 */
export function MorphWorld({
  bus,
  nodeCount,
  reducedMotion,
}: {
  bus: ProgressBus;
  nodeCount: number;
  reducedMotion: boolean;
}) {
  const hubRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const nodesGroup = useRef<THREE.Group>(null);

  const hubGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const hubUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0.4 },
      uGlow: { value: 1.0 },
      uA: { value: ELECTRIC.clone() },
      uB: { value: VIOLET.clone() },
    }),
    [],
  );

  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.55, 0.018, 6, 96), []);
  const ringMats = useMemo(
    () => [
      new THREE.MeshBasicMaterial({
        color: ELECTRIC,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
      new THREE.MeshBasicMaterial({
        color: VIOLET,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ],
    [],
  );

  const icons = useMemo(
    () => INTEGRATION_ICONS.slice(0, nodeCount),
    [nodeCount],
  );

  const nodeMeshes = useMemo(() => {
    if (typeof document === 'undefined') return [] as THREE.Mesh[];
    const plane = new THREE.PlaneGeometry(1.1, 1.1);
    return icons.map((def, i) => {
      // Alternate feature module cards for first 4, then brand icons
      const isFeature = i < FEATURE_VISUALS.length;
      const tex = isFeature
        ? makeFeatureModuleTexture(FEATURE_VISUALS[i].label, FEATURE_VISUALS[i].color)
        : makeIconNodeTexture(def);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(
        isFeature ? new THREE.PlaneGeometry(1.55, 0.88) : plane,
        mat,
      );
      mesh.frustumCulled = false;
      mesh.userData.isFeature = isFeature;
      return mesh;
    });
  }, [icons]);

  useEffect(
    () => () => {
      hubGeo.dispose();
      ringGeo.dispose();
      ringMats.forEach((m) => m.dispose());
      nodeMeshes.forEach((m) => {
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.map?.dispose();
        mat.dispose();
        m.geometry.dispose();
      });
    },
    [hubGeo, ringGeo, ringMats, nodeMeshes],
  );

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(nodeCount * 2 * 3), 3),
    );
    return geo;
  }, [nodeCount]);

  const lineMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: CYAN,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    [],
  );

  useEffect(
    () => () => {
      lineGeo.dispose();
      lineMat.dispose();
    },
    [lineGeo, lineMat],
  );

  const live = useMemo(
    () =>
      Array.from({ length: nodeCount }, () => ({
        x: 0,
        y: 0,
        z: 0,
        s: 0.4,
      })),
    [nodeCount],
  );

  const tmpA = useMemo<NodeTarget>(() => ({ x: 0, y: 0, z: 0, s: 0.4 }), []);
  const tmpB = useMemo<NodeTarget>(() => ({ x: 0, y: 0, z: 0, s: 0.4 }), []);
  const hubPos = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const world = sampleWorld(bus.progress);
    const motion = reducedMotion ? 0.25 : 1;

    hubUniforms.uTime.value = t;
    hubUniforms.uPulse.value = damp(
      hubUniforms.uPulse.value,
      0.35 + world.particleBurst * 0.8 + world.hubScale * 0.2,
      4,
      dt,
    );
    hubUniforms.uGlow.value = damp(
      hubUniforms.uGlow.value,
      0.85 + world.particleBurst * 0.9,
      3,
      dt,
    );

    if (hubRef.current) {
      const s = world.hubScale;
      hubRef.current.scale.setScalar(damp(hubRef.current.scale.x, s, 4, dt));
      if (!reducedMotion) {
        hubRef.current.rotation.y += dt * (0.25 + world.particleBurst * 0.4);
        hubRef.current.rotation.x = Math.sin(t * 0.22) * 0.12 * motion;
      }
      hubPos.copy(hubRef.current.position);
    }

    if (shellRef.current && !reducedMotion) {
      shellRef.current.rotation.y -= dt * 0.4;
      shellRef.current.scale.setScalar(1.12 + Math.sin(t * 1.4) * 0.03 * world.particleBurst);
    }

    const attr = lineGeo.getAttribute('position') as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    for (let i = 0; i < nodeCount; i++) {
      formationTarget(world.formationA, i, nodeCount, t, tmpA);
      formationTarget(world.formationB, i, nodeCount, t, tmpB);
      const bx = tmpA.x + (tmpB.x - tmpA.x) * world.blend;
      const by = tmpA.y + (tmpB.y - tmpA.y) * world.blend;
      const bz = tmpA.z + (tmpB.z - tmpA.z) * world.blend;
      const bs = tmpA.s + (tmpB.s - tmpA.s) * world.blend;

      // Converge pulls toward hub
      const converge =
        world.formationB === 'converge' || world.formationA === 'converge'
          ? world.formationB === 'converge'
            ? world.blend
            : 1 - world.blend
          : world.activeId === 'cta'
            ? 1
            : 0;

      const lx = live[i];
      const tx = bx * (1 - converge);
      const ty = by * (1 - converge);
      const tz = bz * (1 - converge);
      lx.x = damp(lx.x, tx, 5.5, dt);
      lx.y = damp(lx.y, ty, 5.5, dt);
      lx.z = damp(lx.z, tz, 5.5, dt);
      lx.s = damp(lx.s, bs * (1 - converge * 0.85), 5, dt);

      const mesh = nodeMeshes[i];
      if (mesh) {
        mesh.position.set(lx.x, lx.y, lx.z);
        mesh.lookAt(state.camera.position);
        mesh.scale.setScalar(Math.max(0.001, lx.s));
        const mat = mesh.material as THREE.MeshBasicMaterial;
        // Emphasize brand icons during network, feature cards during modules
        const preferFeature = world.activeId === 'features' || world.activeId === 'agents';
        const preferBrand =
          world.activeId === 'integrations' ||
          world.activeId === 'workflow' ||
          world.activeId === 'partners';
        let op = 0.85;
        if (mesh.userData.isFeature) {
          op = preferFeature ? 0.98 : preferBrand ? 0.2 : 0.55;
        } else {
          op = preferBrand ? 0.98 : preferFeature ? 0.25 : 0.7;
        }
        if (world.activeId === 'cta' || converge > 0.5) op *= 1 - converge;
        mat.opacity = damp(mat.opacity, op, 6, dt);
      }

      const o = i * 6;
      arr[o] = lx.x;
      arr[o + 1] = lx.y;
      arr[o + 2] = lx.z;
      arr[o + 3] = hubPos.x;
      arr[o + 4] = hubPos.y;
      arr[o + 5] = hubPos.z;
    }

    attr.needsUpdate = true;
    lineMat.opacity = damp(lineMat.opacity, world.lineOpacity * 0.85, 5, dt);
  });

  return (
    <group>
      <group ref={hubRef}>
        <mesh geometry={hubGeo}>
          <shaderMaterial
            vertexShader={HUB_VERT}
            fragmentShader={HUB_FRAG}
            uniforms={hubUniforms}
          />
        </mesh>
        <mesh ref={shellRef} geometry={hubGeo} scale={1.14}>
          <meshBasicMaterial
            color={VIOLET}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
        <mesh geometry={ringGeo} material={ringMats[0]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh
          geometry={ringGeo}
          material={ringMats[1]}
          rotation={[Math.PI / 3, Math.PI / 5, 0]}
          scale={1.12}
        />
      </group>

      <group ref={nodesGroup}>
        {nodeMeshes.map((m) => (
          <primitive key={m.uuid} object={m} />
        ))}
      </group>

      <lineSegments geometry={lineGeo} material={lineMat} frustumCulled={false} />
    </group>
  );
}
