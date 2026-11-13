/* The walk-through gallery on the home page. Rooms and paintings come from data/works.js. */
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';

const SITE = window.SITE || {}, WORKS = window.WORKS || [];
const stage = document.querySelector('.gallery');
const canvas = document.getElementById('gallery-canvas');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const ROOMS = (SITE.rooms || []).map(name => ({ name, works: WORKS.filter(w => w.subject === name).slice(0, 10) })).filter(r => r.works.length);

/* room size in meters; paintings hang at two and a half times life size so they read on a screen */
const W = 9, D = 7, H = 3.6, T = 0.34, DOOR_W = 1.9, DOOR_H = 2.75, EYE = 1.6, HANG = 1.6, INCH = 0.0254 * 2.5;
const cx = i => i * W;
const money = n => '$' + Number(n).toLocaleString('en-US');

function fail() { stage.classList.add('is-flat'); }

let renderer;
try {
  if (!ROOMS.length) throw new Error('no rooms');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
} catch (e) { fail(); }

if (renderer) start();

async function start() {
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#DAD9D4');
  const camera = new THREE.PerspectiveCamera(52, 1, 0.2, 60);
  camera.rotation.order = 'YXZ';
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const loader = new THREE.TextureLoader();
  let dirty = true;
  const TRACK = 1.5, TRACK_LONG = 1.1; /* how far out from the side walls and the long walls the light tracks run */
  /* Lighting mood. "dim" keeps the room low and puts a spotlight on every painting;
     set galleryLights: "bright" in data/works.js for an evenly lit white room. */
  const DIM = SITE.galleryLights !== 'bright';
  const L = DIM
    ? { wall: '#5F5E5A', wash: 0.3, pool: [0.95, 0.78, 0.34], poolSize: [0.7, 0.75], shade: 1.25, frameShadow: 0.62, ceiling: '#55544F', slot: '#77756E', glow: 0, floor: '#8A8A88', sky: 1.0, bounce: 3, skirt: '#8B8A85', skirtTop: '#4F4E4A', reveal: '#57564F', head: '#4A4944', ink: '#ECE9E1', ink2: '#D8D5CC', card: '#E6E3DB', bg: '#3A3A37' }
    : { wall: '#B9B8B2', wash: 1, pool: [0.9, 0.62, 0.2], poolSize: [0.75, 0.75], shade: 1, frameShadow: 0.42, ceiling: '#E4E3DD', slot: '#FFFFFF', glow: 1, floor: '#CFCFCC', sky: 2.5, bounce: 10, skirt: '#E9E8E2', skirtTop: '#9D9C96', reveal: '#C4C3BD', head: '#B4B3AD', ink: '#2F302F', ink2: '#3E403E', card: '#F7F6F1', bg: '#DAD9D4' };
  stage.classList.toggle('is-dim', DIM);
  scene.background = new THREE.Color(L.bg);
  const P = 150; /* pixels per meter in the baked wall textures */
  const n = ROOMS.length, x0 = -W / 2, x1 = cx(n - 1) + W / 2, mid = (x0 + x1) / 2, len = x1 - x0, seg = (D - DOOR_W) / 2;
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const mkCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.round(w); c.height = Math.round(h); return c; };
  const asTex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t; };
  try { await document.fonts.load('600 64px "Bricolage Grotesque"'); await document.fonts.load('400 64px "Bricolage Grotesque"'); } catch (e) {}

  /* where every painting hangs */
  const hangs = [];
  const side = i => ({ lx: cx(i) - W / 2 + (i === 0 ? 0 : T / 2), rx: cx(i) + W / 2 - (i === n - 1 ? 0 : T / 2) });
  ROOMS.forEach((r, i) => {
    const c = cx(i), zs = DOOR_W / 2 + seg / 2, { lx, rx } = side(i);
    const add = (work, pos, normal, wall, u) => hangs.push({ work, pos, normal, wall, u, room: i, w: work.size.w * INCH, h: work.size.h * INCH });
    const back = r.works.slice(0, 3), rest = r.works.slice(3);
    const span = Math.min(2.9, (W - 1.6) / back.length);
    back.forEach((w, k) => { const x = c + (k - (back.length - 1) / 2) * span; add(w, V(x, HANG, -D / 2), V(0, 0, 1), 'back', x - (c - W / 2)); });
    const slots = [
      [V(lx, HANG, -zs), V(1, 0, 0), 'left', D / 2 + zs], [V(rx, HANG, -zs), V(-1, 0, 0), 'right', D / 2 - zs],
      [V(lx, HANG, zs), V(1, 0, 0), 'left', D / 2 - zs], [V(rx, HANG, zs), V(-1, 0, 0), 'right', D / 2 + zs],
      [V(c, HANG, D / 2), V(0, 0, -1), 'front', W / 2], [V(c - 2.9, HANG, D / 2), V(0, 0, -1), 'front', W / 2 + 2.9], [V(c + 2.9, HANG, D / 2), V(0, 0, -1), 'front', W / 2 - 2.9]
    ];
    rest.forEach((w, k) => { if (slots[k]) add(w, slots[k][0], slots[k][1], slots[k][2], slots[k][3]); });
  });

  /* fine plaster grain, reused on every wall */
  const grain = (() => { const c = mkCanvas(256, 256), g = c.getContext('2d'), d = g.createImageData(256, 256); for (let k = 0; k < d.data.length; k += 4) { const v = 110 + Math.random() * 145; d.data[k] = d.data[k + 1] = d.data[k + 2] = v; d.data[k + 3] = 255; } g.putImageData(d, 0, 0); return c; })();

  /* Bake one wall: ambient wash, a pool of light from the track spot over each painting,
     darkening into the corners, and the shadow each frame throws down the wall. */
  function bakeWall(length, list) {
    const c = mkCanvas(length * P, H * P), g = c.getContext('2d'), w = c.width, h = c.height;
    g.fillStyle = L.wall; g.fillRect(0, 0, w, h);
    let lg = g.createLinearGradient(0, 0, 0, h);
    lg.addColorStop(0, 'rgba(244,242,236,0)'); lg.addColorStop(0.42, 'rgba(244,242,236,' + 0.46 * L.wash + ')'); lg.addColorStop(0.72, 'rgba(244,242,236,' + 0.36 * L.wash + ')'); lg.addColorStop(1, 'rgba(244,242,236,' + 0.08 * L.wash + ')');
    g.fillStyle = lg; g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'screen';
    list.forEach(s => {
      const r = (Math.max(s.w, s.h) * L.poolSize[0] + L.poolSize[1]) * P;
      g.save(); g.translate(s.u * P, (H - HANG - 0.18) * P); g.scale(1, 1.22);
      const rg = g.createRadialGradient(0, 0, 0, 0, 0, r);
      rg.addColorStop(0, 'rgba(255,246,228,' + L.pool[0] + ')'); rg.addColorStop(0.38, 'rgba(255,246,228,' + L.pool[1] + ')'); rg.addColorStop(0.7, 'rgba(255,246,228,' + L.pool[2] + ')'); rg.addColorStop(0.88, 'rgba(255,246,228,' + L.pool[2] * 0.3 + ')'); rg.addColorStop(1, 'rgba(255,246,228,0)');
      g.fillStyle = rg; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill(); g.restore();
    });
    g.globalCompositeOperation = 'source-over';
    const shade = (x0, y0, x1, y1, a) => { const q = g.createLinearGradient(x0, y0, x1, y1); q.addColorStop(0, 'rgba(30,29,26,' + Math.min(0.6, a * L.shade) + ')'); q.addColorStop(1, 'rgba(30,29,26,0)'); g.fillStyle = q; g.fillRect(0, 0, w, h); };
    shade(0, 0, 0, 0.55 * P, 0.3); shade(0, h, 0, h - 0.4 * P, 0.24); shade(0, 0, 0.7 * P, 0, 0.2); shade(w, 0, w - 0.7 * P, 0, 0.2);
    list.forEach(s => {
      const fw = (s.w + 0.1) * P, fh = (s.h + 0.1) * P, x = s.u * P - fw / 2, y = (H - HANG) * P - fh / 2, far = 9000;
      g.fillStyle = '#000';
      g.shadowColor = 'rgba(14,13,11,' + L.frameShadow + ')'; g.shadowBlur = 0.2 * P; g.shadowOffsetY = far + 0.1 * P; g.fillRect(x, y - far, fw, fh);
      g.shadowColor = 'rgba(24,23,20,.5)'; g.shadowBlur = 0.035 * P; g.shadowOffsetY = far + 0.025 * P; g.fillRect(x, y - far, fw, fh);
      g.shadowColor = 'transparent';
    });
    g.globalAlpha = 0.03; g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, w, h);
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    for (let k = 0; k < 14; k++) { const x = Math.random() * w, y = Math.random() * h, r = (0.5 + Math.random() * 1.2) * P, rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(70,68,60,.035)'); rg.addColorStop(1, 'rgba(70,68,60,0)'); g.fillStyle = rg; g.fillRect(0, 0, w, h); }
    const t = asTex(c); t.repeat.set(1 / length, 1 / H); return t;
  }
  function wall(length, door, pos, rotY, list) {
    const s = new THREE.Shape(), a = length / 2 - DOOR_W / 2, b = length / 2 + DOOR_W / 2;
    s.moveTo(0, 0);
    if (door) { s.lineTo(a, 0); s.lineTo(a, DOOR_H); s.lineTo(b, DOOR_H); s.lineTo(b, 0); }
    s.lineTo(length, 0); s.lineTo(length, H); s.lineTo(0, H); s.closePath();
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ map: bakeWall(length, list) }));
    m.position.copy(pos); m.rotation.y = rotY; scene.add(m);
  }
  const flat = c => new THREE.MeshBasicMaterial({ color: c });
  const lift = (m, k) => { m.polygonOffset = true; m.polygonOffsetFactor = -k; m.polygonOffsetUnits = -k * 4; return m; };
  const box = (w, h, d, mat, x, y, z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); scene.add(m); return m; };
  const revealMat = flat(L.reveal), skirtMat = flat(L.skirt), skirtTop = flat(L.skirtTop), metal = new THREE.MeshStandardMaterial({ color: '#1A1A1A', roughness: 0.55, metalness: 0.4 });
  function skirting(x, z, length, alongX) {
    box(alongX ? length : 0.014, 0.09, alongX ? 0.014 : length, skirtMat, x, 0.045, z);
    box(alongX ? length : 0.016, 0.004, alongX ? 0.016 : length, skirtTop, x, 0.092, z);
  }

  ROOMS.forEach((r, i) => {
    const c = cx(i), { lx, rx } = side(i), on = name => hangs.filter(s => s.room === i && s.wall === name);
    wall(W, false, V(c - W / 2, 0, -D / 2), 0, on('back'));
    wall(W, false, V(c + W / 2, 0, D / 2), Math.PI, on('front'));
    wall(D, i > 0, V(lx, 0, D / 2), Math.PI / 2, on('left'));
    wall(D, i < n - 1, V(rx, 0, -D / 2), -Math.PI / 2, on('right'));
    skirting(c, -D / 2 + 0.007, W, true); skirting(c, D / 2 - 0.007, W, true);
    [[lx + 0.007, i > 0], [rx - 0.007, i < n - 1]].forEach(([x, door]) => {
      if (!door) return skirting(x, 0, D, false);
      skirting(x, -(DOOR_W / 2 + seg / 2), seg, false); skirting(x, DOOR_W / 2 + seg / 2, seg, false);
    });
    /* the thickness of the wall inside each doorway */
    if (i < n - 1) {
      const x = c + W / 2;
      box(T + 0.012, DOOR_H, 0.03, revealMat, x, DOOR_H / 2, -DOOR_W / 2 - 0.015); box(T + 0.012, DOOR_H, 0.03, revealMat, x, DOOR_H / 2, DOOR_W / 2 + 0.015);
      box(T + 0.012, 0.03, DOOR_W + 0.06, flat(L.head), x, DOOR_H + 0.015, 0);
    }

    /* ceiling: two recessed light slots that glow, darker toward the walls */
    const cc = mkCanvas(W * 100, D * 100), g = cc.getContext('2d');
    g.fillStyle = L.ceiling; g.fillRect(0, 0, cc.width, cc.height);
    [D / 2 - 1.2, D / 2 + 1.2].forEach(z => {
      /* a wide soft glow on the ceiling around each slot, then the bright slot itself */
      g.save(); g.translate(W / 2 * 100, z * 100); g.scale(1, 0.34);
      const glow = g.createRadialGradient(0, 0, 0, 0, 0, 330);
      glow.addColorStop(0, 'rgba(255,253,247,' + 0.7 * L.glow + ')'); glow.addColorStop(0.35, 'rgba(255,253,247,' + 0.42 * L.glow + ')'); glow.addColorStop(0.7, 'rgba(255,253,247,' + 0.14 * L.glow + ')'); glow.addColorStop(1, 'rgba(255,253,247,0)');
      g.fillStyle = glow; g.beginPath(); g.arc(0, 0, 330, 0, 7); g.fill(); g.restore();
      g.fillStyle = L.slot; g.fillRect((W / 2 - 1.8) * 100, z * 100 - 9, 360, 18);
    });
    g.globalAlpha = 0.035; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, cc.width, cc.height); g.globalAlpha = 1;
    [[0, 0, 0, 70], [0, cc.height, 0, cc.height - 70], [0, 0, 70, 0], [cc.width, 0, cc.width - 70, 0]].forEach(([a, b, c2, d]) => { const q = g.createLinearGradient(a, b, c2, d); q.addColorStop(0, 'rgba(60,58,52,.22)'); q.addColorStop(1, 'rgba(60,58,52,0)'); g.fillStyle = q; g.fillRect(0, 0, cc.width, cc.height); });
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshBasicMaterial({ map: asTex(cc) }));
    ceil.rotation.x = Math.PI / 2; ceil.position.set(c, H, 0); scene.add(ceil);

    /* floor shading: darker along the walls, and the shadow under the bench */
    const fc = mkCanvas(W * 80, D * 80), f = fc.getContext('2d');
    [[0, 0, 0, 64], [0, fc.height, 0, fc.height - 64], [0, 0, 64, 0], [fc.width, 0, fc.width - 64, 0]].forEach(([a, b, c2, d]) => { const q = f.createLinearGradient(a, b, c2, d); q.addColorStop(0, 'rgba(20,20,18,.42)'); q.addColorStop(1, 'rgba(20,20,18,0)'); f.fillStyle = q; f.fillRect(0, 0, fc.width, fc.height); });
    if (DIM) hangs.filter(s => s.room === i).forEach(s => {
      const px = (s.pos.x + s.normal.x * 0.9 - (c - W / 2)) * 80, pz = (s.pos.z + s.normal.z * 0.9 + D / 2) * 80, rr = (s.w * 0.5 + 0.9) * 80, q = f.createRadialGradient(px, pz, 0, px, pz, rr);
      q.addColorStop(0, 'rgba(255,244,224,.2)'); q.addColorStop(1, 'rgba(255,244,224,0)'); f.fillStyle = q; f.fillRect(0, 0, fc.width, fc.height);
    });
    f.fillStyle = '#000'; f.shadowColor = 'rgba(10,10,9,.6)'; f.shadowBlur = 26; f.shadowOffsetY = 9000; f.fillRect((W / 2 - 0.85) * 80, (D / 2 - 0.225) * 80 - 9000, 1.7 * 80, 0.45 * 80);
    const fo = new THREE.Mesh(new THREE.PlaneGeometry(W, D), lift(new THREE.MeshBasicMaterial({ map: asTex(fc), transparent: true, depthWrite: false }), 1));
    fo.rotation.x = -Math.PI / 2; fo.position.set(c, 0.002, 0); fo.renderOrder = 1; scene.add(fo);

    /* an oak bench on steel legs */
    box(1.7, 0.07, 0.45, new THREE.MeshStandardMaterial({ color: '#C2A67E', roughness: 0.55 }), c, 0.445, 0);
    [-0.72, 0.72].forEach(dx => { box(0.03, 0.41, 0.03, metal, c + dx, 0.205, -0.19); box(0.03, 0.41, 0.03, metal, c + dx, 0.205, 0.19); box(0.03, 0.03, 0.41, metal, c + dx, 0.395, 0); });

    const p = new THREE.PointLight(0xffffff, L.bounce, 14, 2); p.position.set(c, H - 0.6, 0); scene.add(p);
  });
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa7a7a2, L.sky));

  /* polished concrete floor that picks up a soft reflection of the room */
  const tex = name => { const t = loader.load('images/gallery/' + name, () => { dirty = true; }); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(len / 3, D / 3); t.anisotropy = maxAniso; return t; };
  const diff = tex('concrete_diff.jpg'); diff.colorSpace = THREE.SRGBColorSpace;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(len, D), new THREE.MeshStandardMaterial({ map: diff, normalMap: tex('concrete_nor_gl.jpg'), roughnessMap: tex('concrete_rough.jpg'), normalScale: new THREE.Vector2(0.5, 0.5), color: L.floor, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(mid, 0, 0); scene.add(floor);
  const mirror = new Reflector(new THREE.PlaneGeometry(len, D), {
    textureWidth: 768, textureHeight: 768, clipBias: 0.003,
    shader: {
      name: 'SoftFloorReflection',
      uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null } },
      vertexShader: 'uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorld; void main(){ vUv = textureMatrix * vec4(position, 1.0); vWorld = (modelMatrix * vec4(position, 1.0)).xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
      fragmentShader: 'uniform sampler2D tDiffuse; varying vec4 vUv; varying vec3 vWorld; void main(){ vec2 uv = vUv.xy / vUv.w; vec3 c = vec3(0.0); float tw = 0.0; for (int i = -3; i <= 3; i++) for (int j = -3; j <= 3; j++) { float w = 1.0 / (1.0 + float(i * i + j * j)); c += texture2D(tDiffuse, uv + vec2(float(i), float(j)) * 0.0028).rgb * w; tw += w; } c /= tw; vec3 v = normalize(cameraPosition - vWorld); float f = pow(1.0 - max(v.y, 0.0), 2.5); gl_FragColor = vec4(c, mix(0.08, 0.5, f)); \n#include <colorspace_fragment>\n }'
    }
  });
  mirror.material.transparent = true; mirror.material.depthWrite = false; mirror.renderOrder = 2; lift(mirror.material, 2);
  mirror.rotation.x = -Math.PI / 2; mirror.position.set(mid, 0.004, 0); scene.add(mirror);

  /* lettering on the walls */
  function lettering(text, height, color) {
    const px = 128, font = '600 ' + px + 'px "Bricolage Grotesque", sans-serif', probe = mkCanvas(8, 8).getContext('2d');
    probe.font = font; const tw = Math.ceil(probe.measureText(text).width) + 16;
    const c = mkCanvas(tw, px * 1.4), g = c.getContext('2d'); g.font = font; g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 8, c.height / 2);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(height * 1.4 * tw / c.height, height * 1.4), lift(new THREE.MeshBasicMaterial({ map: asTex(c), transparent: true }), 2));
    m.userData.w = height * 1.4 * tw / c.height;
    return m;
  }
  function placard(work) {
    const c = mkCanvas(560, 330), g = c.getContext('2d');
    g.fillStyle = L.card; g.fillRect(0, 0, 560, 330);
    g.fillStyle = '#1C1D1C'; g.textBaseline = 'top'; g.font = '600 40px "Bricolage Grotesque", sans-serif';
    let y = 40; const words = work.title.split(' '); let line = '';
    words.forEach(wd => { if (g.measureText(line + wd).width > 480 && line) { g.fillText(line.trim(), 40, y); y += 48; line = ''; } line += wd + ' '; }); g.fillText(line.trim(), 40, y); y += 62;
    g.fillStyle = '#55575A'; g.font = '400 27px "Bricolage Grotesque", sans-serif';
    [work.medium, work.size.w + ' x ' + work.size.h + ' in, ' + work.year, work.original ? (work.original.sold ? 'Sold' : money(work.original.price)) : ''].forEach(t => { if (t) { g.fillText(t, 40, y); y += 38; } });
    return new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.2), lift(new THREE.MeshBasicMaterial({ map: asTex(c) }), 2));
  }

  /* paintings: a dark float frame, the canvas set just inside it, a label, and a track spot overhead */
  const clickable = [];
  const frameMat = new THREE.MeshStandardMaterial({ color: '#1B1A19', roughness: 0.5 }), backMat = flat('#0E0E0D'), canMat = new THREE.MeshStandardMaterial({ color: '#161616', roughness: 0.4, metalness: 0.5 }), lensMat = lift(flat('#FFF6E2'), 2);
  hangs.forEach(s => {
    const { w, h, work } = s, g = new THREE.Group(); g.position.copy(s.pos); g.lookAt(s.pos.clone().add(s.normal)); scene.add(g);
    const bar = 0.022, gap = 0.014, ow = w + 2 * (gap + bar), oh = h + 2 * (gap + bar), deep = 0.075;
    const part = (bw, bh, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, deep), frameMat); m.position.set(x, y, deep / 2); g.add(m); };
    part(ow, bar, 0, oh / 2 - bar / 2); part(ow, bar, 0, -oh / 2 + bar / 2); part(bar, oh, -ow / 2 + bar / 2, 0); part(bar, oh, ow / 2 - bar / 2, 0);
    const bk = new THREE.Mesh(new THREE.PlaneGeometry(ow - bar, oh - bar), backMat); bk.position.z = 0.02; g.add(bk);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.04), flat('#D8D4CA')); edge.position.z = 0.04; g.add(edge);
    const mat = new THREE.MeshBasicMaterial({ color: '#D9D8D4' });
    const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); art.position.z = 0.0605; g.add(art);
    loader.load(work.image, t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; mat.map = t; mat.color.set('#FFFFFF'); mat.needsUpdate = true; dirty = true; });
    art.userData = { work, pos: s.pos.clone(), normal: s.normal.clone(), w, h, room: s.room };
    clickable.push(art);
    const card = placard(work); card.position.set(ow / 2 - 0.17, -oh / 2 - 0.19, 0.004); g.add(card);
    /* track spot: straight out from the middle of the painting, hung from a rail, tilted to aim at it */
    const long = s.wall === 'back' || s.wall === 'front';
    const at = s.pos.clone().add(s.normal.clone().multiplyScalar(long ? TRACK_LONG : TRACK)); at.y = H - 0.2;
    s.spot = at.clone();
    const can = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.16, 24), canMat); can.position.copy(at);
    const dir = s.pos.clone().sub(at).normalize(); can.quaternion.setFromUnitVectors(V(0, -1, 0), dir); scene.add(can);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.034, 24), lensMat); lens.position.copy(at.clone().add(dir.clone().multiplyScalar(0.082))); lens.lookAt(s.pos); scene.add(lens);
    box(0.016, 0.13, 0.016, canMat, at.x, H - 0.1, at.z);
  });
  /* one rail per wall, running just past its first and last spot, so rails never cross */
  ROOMS.forEach((r, i) => {
    const c = cx(i), { lx, rx } = side(i);
    const on = name => hangs.filter(s => s.room === i && s.wall === name), zLong = D / 2 - TRACK_LONG;
    ['back', 'front'].forEach(name => {
      const list = on(name); if (!list.length) return;
      const xs = list.map(s => s.spot.x);
      const lo = on('left').length ? lx + TRACK : Math.min(...xs) - 0.35, hi = on('right').length ? rx - TRACK : Math.max(...xs) + 0.35;
      box(hi - lo + 0.036, 0.028, 0.036, canMat, (lo + hi) / 2, H - 0.022, list[0].spot.z);
    });
    /* side rails meet the long rails in a clean corner instead of crossing them */
    ['left', 'right'].forEach(name => {
      const list = on(name); if (!list.length) return;
      const zs = list.map(s => s.spot.z);
      const lo = on('back').length ? -zLong : Math.min(...zs) - 0.35, hi = on('front').length ? zLong : Math.max(...zs) + 0.35;
      box(0.036, 0.028, hi - lo, canMat, list[0].spot.x, H - 0.022, (lo + hi) / 2);
    });

    const title = lettering(r.name, 0.26, L.ink);
    title.position.set(c - W / 2 + 0.5 + title.userData.w / 2, H - 0.6, -D / 2 + 0.006); scene.add(title);
    [[i - 1, lx, 1], [i + 1, rx, -1]].forEach(([j, x, dir]) => {
      if (j < 0 || j >= n) return;
      const label = lettering(ROOMS[j].name, 0.15, L.ink2);
      label.position.set(x + dir * 0.006, DOOR_H + (H - DOOR_H) / 2, 0); label.rotation.y = dir * Math.PI / 2; scene.add(label);
      const hit = new THREE.Mesh(new THREE.PlaneGeometry(DOOR_W, DOOR_H), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
      hit.position.set(x + dir * 0.02, DOOR_H / 2, 0); hit.rotation.y = dir * Math.PI / 2; hit.userData = { door: j, room: i }; scene.add(hit); clickable.push(hit);
    });
  });

  /* camera: stand in a room, drag to look, glide between places */
  const cam = { pos: new THREE.Vector3(), yaw: 0, pitch: 0 };
  /* You stand back from whatever you face: turning moves you around the middle of the room,
     so the wall you are looking at is always across the room from you. */
  const reach = () => camera.aspect < 0.8 ? 2.4 : 2.1;
  const stand = (i, yaw) => new THREE.Vector3(cx(i) + Math.sin(yaw) * reach(), EYE, Math.cos(yaw) * reach());
  const home = i => stand(i, 0);
  let room = Math.max(0, ROOMS.findIndex(r => r.name.toLowerCase() === decodeURIComponent(location.hash.slice(1)).toLowerCase()));
  let busy = false, focused = null, tweenState = null;
  function tween(to, seconds) {
    if (reduceMotion) seconds = 0;
    return new Promise(done => {
      const from = { pos: cam.pos.clone(), yaw: cam.yaw, pitch: cam.pitch };
      const end = { pos: to.pos || from.pos, yaw: to.yaw == null ? from.yaw : to.yaw, pitch: to.pitch == null ? from.pitch : to.pitch };
      end.yaw = from.yaw + Math.atan2(Math.sin(end.yaw - from.yaw), Math.cos(end.yaw - from.yaw));
      if (!seconds) { cam.pos.copy(end.pos); cam.yaw = end.yaw; cam.pitch = end.pitch; dirty = true; return done(); }
      tweenState = { from, end, t0: performance.now(), ms: seconds * 1000, done };
    });
  }
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const veil = document.querySelector('.gallery-veil');
  async function goRoom(j) {
    if (busy || j === room || j < 0 || j >= n) return;
    busy = true; closePanel();
    if (reduceMotion) {
      veil.classList.add('on'); await new Promise(r => setTimeout(r, 220));
      cam.pos.copy(home(j)); cam.yaw = 0; cam.pitch = 0; dirty = true; veil.classList.remove('on');
    } else {
      /* walk around the bench, through each doorway in turn, and stop facing the far wall of the new room */
      const dir = Math.sign(j - room), facing = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
      await tween({ pos: new THREE.Vector3(cx(room) + dir * 1.7, EYE, 0.9), yaw: facing, pitch: 0 }, 1.0);
      for (let k = room; k !== j; k += dir) {
        await tween({ pos: new THREE.Vector3(cx(k) + dir * W / 2, EYE, 0) }, 0.9);
        if (k + dir !== j) await tween({ pos: new THREE.Vector3(cx(k + dir), EYE, 0.95) }, 1.3);
      }
      await tween({ pos: home(j), yaw: 0 }, 1.3);
    }
    room = j; busy = false; setRoom();
  }

  async function focus(art) {
    if (busy) return;
    const u = art.userData;
    if (u.room !== room) return;
    busy = true;
    const vfov = camera.fov * Math.PI / 360;
    let dist = Math.max(u.h / 2 / Math.tan(vfov), u.w / 2 / (Math.tan(vfov) * camera.aspect)) * 1.55 + 0.2;
    dist = Math.min(Math.max(dist, 1.3), 4.2);
    const narrow = camera.aspect < 0.8;
    /* on a phone the info card covers the lower half, so stand lower and the painting sits higher in view */
    const pos = u.pos.clone().add(u.normal.clone().multiplyScalar(dist)); pos.y = narrow ? Math.max(0.5, HANG - dist * 0.36) : EYE;
    showPanel(u.work);
    await tween({ pos, yaw: Math.atan2(u.normal.x, u.normal.z), pitch: narrow ? 0 : Math.atan2(HANG - EYE, dist) }, 1.1);
    focused = art; busy = false;
  }
  async function stepBack() {
    if (busy) return;
    closePanel(); busy = true;
    await tween({ pos: stand(room, cam.yaw), pitch: 0 }, 0.9);
    busy = false;
  }

  /* the info card and room buttons are plain HTML over the canvas */
  const panel = document.querySelector('.gallery-panel'), roomNav = document.querySelector('.gallery-rooms'), list = document.querySelector('.gallery-list'), hint = document.querySelector('.gallery-hint');
  function priceLines(w) {
    const out = [], prints = (w.prints || []).map(p => p.price);
    if (w.original) out.push(w.original.sold ? 'Original sold' : 'Original ' + money(w.original.price));
    if (prints.length) out.push('Prints from ' + money(Math.min(...prints)));
    return out;
  }
  function showPanel(w) {
    panel.querySelector('h2').textContent = w.title;
    panel.querySelector('.gallery-panel-meta').textContent = w.medium + ', ' + w.size.w + ' x ' + w.size.h + ' in';
    panel.querySelector('.gallery-panel-price').innerHTML = '';
    priceLines(w).forEach(t => { const d = document.createElement('div'); d.textContent = t; panel.querySelector('.gallery-panel-price').appendChild(d); });
    panel.querySelector('a').href = 'work.html?id=' + encodeURIComponent(w.id);
    panel.hidden = false; hint.hidden = true;
  }
  function closePanel() { panel.hidden = true; focused = null; }
  panel.querySelector('.gallery-panel-close').addEventListener('click', stepBack);

  ROOMS.forEach((r, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = r.name; b.addEventListener('click', () => goRoom(i)); roomNav.appendChild(b);
  });
  function setRoom() {
    [...roomNav.children].forEach((b, i) => b.setAttribute('aria-current', i === room ? 'true' : 'false'));
    document.querySelector('.gallery-status').textContent = ROOMS[room].name + ' room';
    list.innerHTML = '';
    ROOMS[room].works.forEach(w => { const li = document.createElement('li'), a = document.createElement('a'); a.href = 'work.html?id=' + encodeURIComponent(w.id); a.textContent = w.title; li.appendChild(a); list.appendChild(li); });
    history.replaceState(null, '', '#' + ROOMS[room].name.toLowerCase());
  }
  setRoom();

  /* pointer: drag looks around, a clean click picks a painting or a doorway */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function pick(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(clickable, false)[0];
    return hit && hit.object;
  }
  let down = null;
  canvas.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, moved: 0 }; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', e => {
    if (down) {
      const dx = e.clientX - down.x, dy = e.clientY - down.y; down.moved += Math.abs(dx) + Math.abs(dy); down.x = e.clientX; down.y = e.clientY;
      if (!busy && down.moved > 6 && focused) { stepBack(); }
      if (!busy && down.moved > 6) { cam.yaw += dx * 0.0042; cam.pos.copy(stand(room, cam.yaw)); cam.pitch = Math.max(-0.45, Math.min(0.45, cam.pitch + dy * 0.0042)); dirty = true; canvas.classList.add('is-dragging'); hint.hidden = true; }
    } else if (e.pointerType === 'mouse') { canvas.classList.toggle('is-pointing', !!pick(e)); }
  });
  canvas.addEventListener('pointerup', e => {
    const wasClick = down && down.moved <= 6; down = null; canvas.classList.remove('is-dragging');
    if (!wasClick) return;
    const o = pick(e);
    if (o && o.userData.work) { if (focused === o) return; focus(o); }
    else if (o && o.userData.door != null) goRoom(o.userData.door);
    else if (focused) stepBack();
  });
  canvas.addEventListener('pointercancel', () => { down = null; });
  canvas.addEventListener('keydown', e => {
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !busy && !focused) { cam.yaw += e.key === 'ArrowLeft' ? 0.12 : -0.12; cam.pos.copy(stand(room, cam.yaw)); dirty = true; e.preventDefault(); }
    if (e.key === 'Escape' && focused) stepBack();
  });

  function resize() {
    stage.style.height = Math.max(420, innerHeight - stage.offsetTop) + 'px';
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = camera.aspect < 0.8 ? 82 : 52; camera.updateProjectionMatrix(); dirty = true;
    if (!busy && !focused && !tweenState) cam.pos.copy(stand(room, cam.yaw));
  }
  addEventListener('resize', resize); resize(); cam.pos.copy(home(room));

  function frame(now) {
    if (tweenState) {
      const s = tweenState, t = Math.min(1, (now - s.t0) / s.ms), k = ease(t);
      cam.pos.lerpVectors(s.from.pos, s.end.pos, k); cam.yaw = s.from.yaw + (s.end.yaw - s.from.yaw) * k; cam.pitch = s.from.pitch + (s.end.pitch - s.from.pitch) * k;
      dirty = true;
      if (t === 1) { tweenState = null; s.done(); }
    }
    if (dirty) { camera.position.copy(cam.pos); camera.rotation.set(cam.pitch, cam.yaw, 0); renderer.render(scene, camera); dirty = false; }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  stage.classList.add('is-ready');
  window.__gallery = { goRoom, clickable, focus, stepBack, cam, get busy() { return busy; } };
}
