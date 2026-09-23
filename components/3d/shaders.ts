/** Shared GLSL chunks for the immersive landing scene. */

export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

export const CORE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uChaos;
uniform float uStructure;
uniform float uFlow;
uniform float uPulse;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

${SIMPLEX_3D}

void main() {
  vec3 p = position;
  vec3 n = normalize(normal);

  float chaos = snoise(p * 2.2 + vec3(0.0, uTime * 0.35, 0.0)) * uChaos * 0.55;
  float structure = snoise(p * 1.35 + vec3(uTime * 0.12)) * uStructure * 0.42;
  float flow =
      (sin(p.y * 4.2 + uTime * 1.8) * 0.06 +
       snoise(p * 1.5 + vec3(uTime * 0.55)) * 0.16) * uFlow;

  float disp = chaos + structure + flow + uPulse * 0.7;
  vec3 displaced = p + n * disp;
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);

  vDisp = disp;
  vNormal = normalize(normalMatrix * n);
  vView = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const CORE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;
uniform float uGlow;

varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;

void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);

  float fresnel = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), 2.4);
  float shade = clamp(dot(n, normalize(vec3(0.4, 0.8, 0.6))) * 0.5 + 0.5, 0.0, 1.0);

  vec3 base = mix(uColorA, uColorB, smoothstep(-0.35, 0.45, vDisp));
  vec3 col = base * (0.22 + shade * 0.5);
  col += fresnel * mix(uColorB, vec3(1.0), 0.22) * uGlow;

  gl_FragColor = vec4(col, uOpacity);
}
`;

export const PARTICLE_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uBurst;
uniform float uConverge;
uniform float uSize;
uniform float uPixelRatio;

attribute vec3 aAxis;
attribute vec3 aTarget;
attribute vec3 aOrbit;
attribute float aRnd;

varying float vRnd;
varying float vFade;

void main() {
  vec3 packed = aAxis * (0.35 + aRnd * 0.35);

  vec3 axis = normalize(aAxis);
  vec3 helper = abs(axis.y) > 0.95 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
  vec3 u = normalize(cross(axis, helper));
  vec3 w = normalize(cross(axis, u));
  float angle = aOrbit.z + uTime * aOrbit.y;
  vec3 orbit = (u * cos(angle) + w * sin(angle)) * aOrbit.x;
  orbit += axis * sin(uTime * aOrbit.y * 0.5 + aOrbit.z) * 0.35;

  vec3 pos = mix(packed, orbit, uBurst);
  pos = mix(pos, aTarget, uConverge);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vRnd = aRnd;
  vFade = uBurst;
  gl_PointSize = uSize * uPixelRatio * (0.55 + aRnd * 0.9) * (18.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

export const PARTICLE_FRAGMENT = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vRnd;
varying float vFade;

void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  if (d > 0.5) discard;
  float alpha = smoothstep(0.5, 0.05, d);
  vec3 col = mix(uColorA, uColorB, vRnd) * 1.35;
  col += vec3(0.5) * pow(1.0 - d * 2.0, 3.0);
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`;
