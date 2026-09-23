import puppeteer from 'puppeteer-core';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:3010/new-landing';

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--window-size=1440,900',
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const errors = [];
const warnings = [];
page.on('console', (m) => {
  const t = m.type();
  const text = m.text();
  if (t === 'error') errors.push(text);
  else if (t === 'warning') warnings.push(text);
});
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('requestfailed', (r) =>
  errors.push('REQFAIL: ' + r.url() + ' ' + (r.failure()?.errorText ?? '')),
);

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise((r) => setTimeout(r, 2500));

const diag = await page.evaluate(() => {
  const canvas = document.querySelector('#nl-root canvas');
  const gl = canvas && (canvas.getContext('webgl2') || canvas.getContext('webgl'));
  return {
    canvasPresent: !!canvas,
    canvasSize: canvas ? `${canvas.width}x${canvas.height}` : null,
    renderer: gl ? gl.getParameter(gl.RENDERER) : null,
    docHeight: document.documentElement.scrollHeight,
    viewport: window.innerHeight,
    headline: document.querySelector('#nl-root h1')?.textContent?.trim(),
    sections: document.querySelectorAll('[data-nl-panel]').length,
  };
});

// Sample exactly at each narrative beat, letting the 1.5s scrub fully settle
const beats = [
  ['chaos', 0],
  ['connection', 0.25],
  ['orchestration', 0.5],
  ['intelligence', 0.75],
  ['finale', 1],
];
const shots = [];
for (const [name, ratio] of beats) {
  await page.evaluate((r) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, max * r);
  }, ratio);
  await new Promise((r) => setTimeout(r, 3000));
  const file = `nl-shot-${name}.png`;
  await page.screenshot({ path: file });
  const dbg = await page.evaluate(() => window.__nlDebug);

  // Measure where light actually lands: bounding box + coarse heat grid of the
  // rendered frame, so we can tell a wide particle field from a small blob.
  const b64 = (await page.screenshot({ encoding: 'base64' }));
  const lit = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + data;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const { data: px } = ctx.getImageData(0, 0, c.width, c.height);

    // Ignore the top/bottom strips that hold the HTML copy and chrome
    const y0 = Math.round(c.height * 0.06);
    const y1 = Math.round(c.height * 0.62);
    let minX = 1e9, maxX = -1, minY = 1e9, maxY = -1, count = 0;
    const gw = 16, gh = 8;
    const grid = Array.from({ length: gh }, () => new Array(gw).fill(0));

    for (let y = y0; y < y1; y++) {
      for (let x = 0; x < c.width; x++) {
        const i = (y * c.width + x) * 4;
        const lum = px[i] * 0.3 + px[i + 1] * 0.6 + px[i + 2] * 0.1;
        if (lum > 42) {
          count++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          grid[Math.min(gh - 1, Math.floor(((y - y0) / (y1 - y0)) * gh))][
            Math.min(gw - 1, Math.floor((x / c.width) * gw))
          ]++;
        }
      }
    }
    return {
      litPixels: count,
      box: maxX < 0 ? null : { x: minX, y: minY, w: maxX - minX, h: maxY - minY },
      grid: grid.map((row) => row.map((v) => (v > 400 ? '#' : v > 80 ? '+' : v > 8 ? '.' : ' ')).join('')),
    };
  }, b64);

  shots.push({ beat: name, file, dbg, lit });
}

// Headline colour must not be inheriting the light-theme grey from globals.css
const headingColors = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#nl-root h1, #nl-root h2')).map((h) => ({
    text: (h.textContent || '').slice(0, 22),
    color: getComputedStyle(h).color,
  })),
);

// The CTA must be inside the viewport at the very bottom of the page
const ctaVisible = await page.evaluate(() => {
  const cta = Array.from(document.querySelectorAll('#nl-root a')).find((a) =>
    (a.textContent || '').includes('Book a walkthrough'),
  );
  if (!cta) return 'MISSING';
  const r = cta.getBoundingClientRect();
  return {
    top: Math.round(r.top),
    bottom: Math.round(r.bottom),
    inViewport: r.top >= 0 && r.bottom <= window.innerHeight,
    opacity: getComputedStyle(cta.parentElement).opacity,
  };
});

const metrics = await page.evaluate(() =>
  Array.from(document.querySelectorAll('#nl-root [data-nl-panel] span'))
    .map((s) => s.textContent)
    .filter((t) => t && /^[\d.]+$/.test(t)),
);

console.log(
  JSON.stringify(
    { diag, headingColors, ctaVisible, metrics, shots, errors, warnings: warnings.slice(0, 8) },
    null,
    2,
  ),
);

await browser.close();
