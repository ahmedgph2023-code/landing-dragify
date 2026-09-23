/** Scroll morph driver — lerp formA ↔ procedural dissolve via setHomes. */

export const easeFunctions = {
  linear: (t) => t,
  "power2.inOut": (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  "power2.out": (t) => 1 - (1 - t) * (1 - t),
  "power2.in": (t) => t * t,
};

export function getEase(name = "power2.inOut") {
  return easeFunctions[name] || easeFunctions["power2.inOut"];
}

export function lerpClouds(from, to, t) {
  const count = Math.min(from.positions.length, to.positions.length);
  const positions = new Float32Array(count);
  const colors = new Float32Array(count);
  const u = Math.max(0, Math.min(1, t));
  for (let i = 0; i < count; i++) {
    positions[i] = from.positions[i] + (to.positions[i] - from.positions[i]) * u;
    if (from.colors && to.colors) {
      colors[i] = from.colors[i] + (to.colors[i] - from.colors[i]) * u;
    } else if (from.colors) {
      colors[i] = from.colors[i];
    }
  }
  return { positions, colors };
}

/** Deterministic explode cloud — keeps logo colors while scattering positions. */
export function buildDissolveCloud(formA, { scale = 2.35, seed = 1 } = {}) {
  const n = formA.positions.length / 3;
  const positions = new Float32Array(formA.positions.length);
  const colors = formA.colors
    ? formA.colors.slice()
    : new Float32Array(formA.positions.length);
  let s = seed >>> 0 || 1;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  for (let i = 0; i < n; i++) {
    const i3 = i * 3;
    const u = rnd();
    const v = rnd();
    const w = rnd();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = scale * Math.cbrt(w);
    positions[i3] = Math.sin(phi) * Math.cos(theta) * r;
    positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
    positions[i3 + 2] = Math.cos(phi) * r * 0.55;
  }
  return { positions, colors };
}

export function sampleWindowProgress(progress, windows) {
  const p = Math.max(0, Math.min(1, progress));
  const list = windows?.length ? windows : [];
  for (let i = 0; i < list.length; i++) {
    const w = list[i];
    const [a, b] = w.range;
    if (p >= a && (p <= b || i === list.length - 1)) {
      const local = b <= a ? 1 : (p - a) / (b - a);
      return { window: w, local: Math.max(0, Math.min(1, local)) };
    }
  }
  const last = list[list.length - 1];
  return { window: last, local: 1 };
}

export function cloudAtProgress(progress, forms, windows, easing = "power2.inOut") {
  const ease = getEase(easing);
  const { window: w, local } = sampleWindowProgress(progress, windows);
  if (!w) return forms.formA;
  const from = forms[w.from] || forms.formA;
  const to = forms[w.to] || forms.formA;
  if (w.kind === "hold" || from === to) return from;
  return lerpClouds(from, to, ease(local));
}
