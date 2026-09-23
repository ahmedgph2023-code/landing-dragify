import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NL2_TUNING } from '../../../config/newLanding2Scene';
import { damp, sampleWorld } from '../../../lib/new-landing-2/worldMath';
import type { ProgressBus } from '../../../lib/new-landing-2/scrollEngine';

const ELECTRIC = new THREE.Color(NL2_TUNING.colors.electric);
const PINK = new THREE.Color(NL2_TUNING.colors.pink);

const VERT = /* glsl */ `
uniform float uTime;
uniform float uBurst;
uniform float uSize;
uniform float uPR;
attribute float aRnd;
attribute vec3 aAxis;
varying float vRnd;
void main(){
  vec3 axis = normalize(aAxis);
  vec3 helper = abs(axis.y) > 0.9 ? vec3(1,0,0) : vec3(0,1,0);
  vec3 u = normalize(cross(axis, helper));
  vec3 w = normalize(cross(axis, u));
  float ang = aRnd * 6.28318 + uTime * (0.2 + aRnd * 0.4);
  float r = mix(0.4, 3.8, aRnd) * mix(0.2, 1.0, uBurst);
  vec3 pos = (u * cos(ang) + w * sin(ang)) * r + axis * sin(uTime*0.5+aRnd)*0.3*uBurst;
  vec4 mv = modelViewMatrix * vec4(pos,1.0);
  vRnd = aRnd;
  gl_PointSize = uSize * uPR * (0.6 + aRnd) * (16.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform float uOpacity;
varying float vRnd;
void main(){
  float d = length(gl_PointCoord - 0.5);
  if(d>0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uA, uB, vRnd);
  gl_FragColor = vec4(col, a * uOpacity);
}
`;

export function EnergyParticles({
  bus,
  count,
}: {
  bus: ProgressBus;
  count: number;
}) {
  const ref = useRef<THREE.Points>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const axis = new Float32Array(count * 3);
    const rnd = new Float32Array(count);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1;
      const th = Math.random() * Math.PI * 2;
      const s = Math.sqrt(Math.max(0, 1 - u * u));
      axis[i * 3] = s * Math.cos(th);
      axis[i * 3 + 1] = u;
      axis[i * 3 + 2] = s * Math.sin(th);
      rnd[i] = Math.random();
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aAxis', new THREE.BufferAttribute(axis, 3));
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 10);
    return geo;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBurst: { value: 0 },
      uSize: { value: 4.2 },
      uPR: { value: 1 },
      uOpacity: { value: 0 },
      uA: { value: ELECTRIC.clone() },
      uB: { value: PINK.clone() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uPR.value = Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      2,
    );
  }, [uniforms]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const world = sampleWorld(bus.progress);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uBurst.value = damp(uniforms.uBurst.value, world.particleBurst, 4, dt);
    uniforms.uOpacity.value = damp(
      uniforms.uOpacity.value,
      Math.max(0.05, world.particleBurst * 0.9),
      4,
      dt,
    );
    if (ref.current) ref.current.visible = uniforms.uOpacity.value > 0.02;
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
