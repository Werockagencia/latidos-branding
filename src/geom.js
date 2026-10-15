// Utilidades geométricas: curvas suaves por puntos, transformación de trazos, glifos a contornos.
const fs = require('fs');
const opentype = require('opentype.js');

const n2 = (v) => +v.toFixed(2);

/** Trazo cerrado a partir de tramos suaves. runs: [[p0,p1,...], ...] — los extremos de cada tramo son esquinas. */
function smoothPath(runs, tension = 1) {
  let d = '';
  runs.forEach((pts, ri) => {
    if (ri === 0) d += `M${n2(pts[0][0])} ${n2(pts[0][1])}`;
    else d += `L${n2(pts[0][0])} ${n2(pts[0][1])}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension];
      const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension];
      d += `C${n2(c1[0])} ${n2(c1[1])} ${n2(c2[0])} ${n2(c2[1])} ${n2(p2[0])} ${n2(p2[1])}`;
    }
  });
  return d + 'Z';
}

/** Aplica x' = x*s + tx, y' = y*s + ty a un trazo con comandos absolutos (M L C Q Z). */
function xform(d, s, tx, ty) {
  return d.replace(/([MLCQZ])([^MLCQZ]*)/gi, (m, cmd, args) => {
    const nums = (args.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) || []).map(Number);
    const out = [];
    for (let i = 0; i < nums.length; i += 2) out.push(n2(nums[i] * s + tx), n2(nums[i + 1] * s + ty));
    return cmd.toUpperCase() + out.join(' ');
  });
}

function bbox(d) {
  const nums = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < nums.length; i += 2) {
    x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]);
    y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]);
  }
  return [x0, y0, x1 - x0, y1 - y0];
}

const fonts = {};
function font(name) {
  if (!fonts[name]) fonts[name] = opentype.parse(fs.readFileSync(`${__dirname}/fonts/${name}.ttf`).buffer);
  return fonts[name];
}
function ser(cmds) {
  return cmds.map((c) => {
    if (c.type === 'Z') return 'Z';
    if (c.type === 'M' || c.type === 'L') return `${c.type}${n2(c.x)} ${n2(c.y)}`;
    if (c.type === 'Q') return `Q${n2(c.x1)} ${n2(c.y1)} ${n2(c.x)} ${n2(c.y)}`;
    return `C${n2(c.x1)} ${n2(c.y1)} ${n2(c.x2)} ${n2(c.y2)} ${n2(c.x)} ${n2(c.y)}`;
  }).join('');
}
/** Contornos de un glifo separados (para poder quitar el punto de la i, etc.). */
function contours(cmds) {
  const out = []; let cur = [];
  for (const c of cmds) {
    if (c.type === 'M' && cur.length) { out.push(cur); cur = []; }
    if (c.type !== 'Z') cur.push(c);
  }
  if (cur.length) out.push(cur);
  return out.map((k) => [...k, { type: 'Z' }]);
}

/**
 * Compone texto glifo a glifo con tracking (en milésimas de em) y kerning.
 * Devuelve { d, glyphs:[{ch,d,x,adv}], width }. kern extra por par: { 'ti': -10 }
 */
function setText(fontName, text, size, x, y, { track = 0, pairs = {}, drop = {} } = {}) {
  const f = font(fontName);
  const sc = size / f.unitsPerEm;
  const glyphs = [];
  let pen = x;
  const chars = [...text];
  chars.forEach((ch, i) => {
    const g = f.charToGlyph(ch);
    let cmds = contours(g.getPath(pen, y, size).commands).flat();
    if (drop[ch]) cmds = contours(cmds).filter((c, k, arr) => !drop[ch](c, k, arr)).flat();
    glyphs.push({ ch, d: ser(cmds), x: pen });
    let adv = g.advanceWidth * sc + (track / 1000) * size;
    if (i < chars.length - 1) {
      const g2 = f.charToGlyph(chars[i + 1]);
      adv += f.getKerningValue(g, g2) * sc + ((pairs[ch + chars[i + 1]] || 0) / 1000) * size;
    }
    pen += adv;
  });
  const width = pen - x - (track / 1000) * size;
  return { d: glyphs.map((g) => g.d).join(''), glyphs, width };
}

module.exports = { smoothPath, xform, bbox, font, setText, contours, ser, n2 };
