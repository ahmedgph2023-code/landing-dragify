import * as THREE from 'three';
import type { IconDef } from '../../../config/newLanding2Scene';

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Builds a canvas texture for a node card.
 * Icons come from INTEGRATION_ICONS (image path or svgPath) — easy to swap.
 */
export function makeIconNodeTexture(def: IconDef, accent = def.color): THREE.CanvasTexture {
  const w = 256;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  // soft glow plate
  const glow = ctx.createRadialGradient(w / 2, h / 2, 20, w / 2, h / 2, 120);
  glow.addColorStop(0, `${accent}55`);
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // disc
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 78, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10,14,28,0.92)';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = accent;
  ctx.stroke();

  // inner icon tile
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 48, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  if (def.svgPath) {
    ctx.save();
    ctx.translate(w / 2 - 18, h / 2 - 18);
    ctx.scale(36 / 24, 36 / 24);
    ctx.fillStyle = '#fff';
    ctx.fill(new Path2D(def.svgPath));
    ctx.restore();
  } else {
    // letter fallback until image loads asynchronously
    ctx.fillStyle = '#fff';
    ctx.font = '700 28px Outfit, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(def.label.slice(0, 1), w / 2, h / 2 + 1);
  }

  // label under disc
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '600 18px Outfit, Cairo, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(def.label, w / 2, h / 2 + 92);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;

  // If image provided, paint it into the center when loaded
  if (def.image && typeof Image !== 'undefined') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // redraw disc + image
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 48, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.save();
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 42, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, w / 2 - 36, h / 2 - 36, 72, 72);
      ctx.restore();
      tex.needsUpdate = true;
    };
    img.src = def.image;
  }

  return tex;
}

export function makeFeatureModuleTexture(label: string, color: string): THREE.CanvasTexture {
  const w = 320;
  const h = 180;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  roundRect(ctx, 8, 8, w - 16, h - 16, 28);
  ctx.fillStyle = 'rgba(255,255,255,0.96)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(230,226,246,1)';
  ctx.lineWidth = 3;
  ctx.stroke();

  const grad = ctx.createLinearGradient(8, 0, w - 8, 0);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(1, color);
  ctx.fillStyle = grad;
  roundRect(ctx, 8, 8, w - 16, 10, 8);
  ctx.fill();

  ctx.fillStyle = color;
  roundRect(ctx, 28, 40, 64, 64, 16);
  ctx.fill();

  ctx.fillStyle = '#868fa6';
  ctx.font = '700 14px Outfit, system-ui, sans-serif';
  ctx.fillText('CAPABILITY', 108, 58);

  ctx.fillStyle = '#0b0d16';
  ctx.font = '700 26px Outfit, system-ui, sans-serif';
  ctx.fillText(label, 108, 96);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
