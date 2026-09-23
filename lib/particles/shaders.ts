import * as THREE from 'three';

/** Focused bright core — VV “sharp constellation” look */
export function createSoftParticleTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.08, 'rgba(255,255,255,1)');
  g.addColorStop(0.2, 'rgba(200,255,250,0.82)');
  g.addColorStop(0.38, 'rgba(80,200,255,0.35)');
  g.addColorStop(0.58, 'rgba(120,110,255,0.14)');
  g.addColorStop(0.78, 'rgba(43,233,209,0.04)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export const MAIN_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPR;
uniform float uIdle;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uMouseRadius;
attribute float aRnd;
attribute float aBright;
varying float vRnd;
varying float vBright;
void main() {
  vec3 pos = position;
  float wave = sin(uTime * (0.4 + aRnd * 0.6) + aRnd * 6.28318) * uIdle;
  pos.x += wave * 0.4;
  pos.y += cos(uTime * 0.35 + aRnd * 4.0) * uIdle * 0.5;
  pos.z += sin(uTime * 0.25 + aRnd) * uIdle * 0.35;

  // Subtle mouse repulsion in LOCAL icon space (uMouse already converted to local XY)
  vec2 m = uMouse;
  vec2 d = pos.xy - m;
  float dist = length(d) + 0.001;
  // Soft falloff — never punches holes through the silhouette
  float influence = smoothstep(uMouseRadius, uMouseRadius * 0.15, dist) * uMouseStrength * (0.35 + aRnd * 0.35);
  pos.xy += normalize(d) * influence;
  pos.z += influence * 0.12 * (aRnd - 0.5);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vRnd = aRnd;
  vBright = aBright;
  float zdist = max(0.8, -mv.z);
  float size = uSize * uPR * (0.62 + aRnd * 0.38) * (0.8 + vBright * 0.35) * (7.2 / zdist);
  gl_PointSize = min(size, 14.0);
  gl_Position = projectionMatrix * mv;
}
`;

export const MAIN_FRAG = /* glsl */ `
uniform vec3 uCore;
uniform vec3 uGlow;
uniform vec3 uAccent;
uniform float uOpacity;
uniform float uColorMix;
uniform sampler2D uMap;
varying float vRnd;
varying float vBright;
void main() {
  vec4 tex = texture2D(uMap, gl_PointCoord);
  float a = tex.a;
  if (a < 0.04) discard;
  // Cinematic RGB field: cyan/teal core → blue mid → violet accents
  vec3 cyan = uGlow;
  vec3 hot = uCore;
  vec3 violet = uAccent;
  vec3 blue = mix(cyan, violet, 0.42);
  float band = fract(vRnd * 3.17 + vBright * 0.35);
  vec3 base = mix(cyan, hot, clamp(vBright * 0.9, 0.0, 1.0));
  vec3 mid = mix(base, blue, 0.28 + vRnd * 0.35);
  vec3 tinted = mix(mid, violet, band * uColorMix * (0.55 + vRnd * 0.45));
  vec3 col = tinted * (0.88 + vBright * 0.48);
  float alpha = a * uOpacity * (0.42 + vBright * 0.58);
  gl_FragColor = vec4(col, alpha);
}
`;

export const AMBIENT_VERT = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPR;
uniform vec2 uMouse;
uniform vec2 uMouseNdc;
uniform float uParallax;
uniform float uRepel;
attribute float aRnd;
varying float vRnd;
void main() {
  vec3 pos = position;
  pos.x += sin(uTime * 0.08 + aRnd * 10.0) * 0.08;
  pos.y += cos(uTime * 0.06 + aRnd * 8.0) * 0.06;

  // Parallax drift (screen NDC) + soft repulsion (world XY)
  float depthFactor = 0.35 + aRnd * 0.9;
  pos.x += uMouseNdc.x * uParallax * depthFactor;
  pos.y += uMouseNdc.y * uParallax * depthFactor * 0.7;

  vec2 d = pos.xy - uMouse;
  float dist = length(d) + 0.001;
  float influence = smoothstep(4.5, 0.0, dist) * uRepel * depthFactor;
  pos.xy += normalize(d) * influence;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vRnd = aRnd;
  float size = uSize * uPR * (0.25 + aRnd * 0.9) * (7.5 / max(0.8, -mv.z));
  gl_PointSize = min(size, 6.5);
  gl_Position = projectionMatrix * mv;
}
`;

export const AMBIENT_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uTime;
uniform sampler2D uMap;
varying float vRnd;
void main() {
  vec4 tex = texture2D(uMap, gl_PointCoord);
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.5 + vRnd * 2.2) + vRnd * 14.0);
  float a = tex.a * (0.35 + vRnd * 0.65) * twinkle;
  if (a < 0.025) discard;
  gl_FragColor = vec4(uColor, a * uOpacity);
}
`;
