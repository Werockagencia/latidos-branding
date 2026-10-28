// Latidos · papelería y patrones listos para producir.
//  - Impresión: PDF en CMYK, con 3 mm de sangrado, marcas de corte y textos convertidos a contornos.
//  - Digital:   PDF y PNG en RGB al tamaño final, sin marcas; membrete también en Word (.docx).
//  - Patrones:  ondas de la marca en SVG, PNG y PDF (CMYK).
// Todo se dibuja con un solo modelo de escena (mm, eje y hacia abajo) que se exporta a PDF (CMYK o RGB) y a SVG.
// uso: node src/print.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const sharp = require('sharp');
const { setText } = require('./geom');

const ROOT = path.join(__dirname, '..');
global.window = {};
require(path.join(ROOT, 'assets/logos.js'));
const LOGO = window.LATIDOS_LOGOS.r1;

// ------------------------------------------------------------------ datos (cliente, 26/10/2026)
const DATA = { email: 'latidos.jhe.sas@hotmail.com', phones: ['318 986 0324', '323 282 2041'] };

// ------------------------------------------------------------------ color: cada tinta lleva su valor CMYK de imprenta y su RGB de pantalla
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const ink = (cmyk, rgbHex) => ({ cmyk: cmyk.map((v) => v / 100), rgb: hex(rgbHex) });
const INK = {
  navy: ink([100, 85, 40, 45], '#0B1B3B'),
  lime: ink([25, 0, 90, 0], '#C6FF3D'),
  ivory: ink([2, 3, 6, 0], '#F8F5F0'),
  steel: ink([35, 22, 18, 0], '#A7B0BA'),
  white: ink([0, 0, 0, 0], '#FFFFFF'),
};
const mix = (a, b, t) => ({ cmyk: a.cmyk.map((v, i) => v * (1 - t) + b.cmyk[i] * t), rgb: a.rgb.map((v, i) => v * (1 - t) + b.rgb[i] * t) });
const toHex = (c) => '#' + c.rgb.map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('');
const n = (v) => +v.toFixed(4);

// ------------------------------------------------------------------ escena
// op: {t:'rect',x,y,w,h,c} · {t:'path',d,c,m:[a,b,c,d,e,f],eo} · {t:'stroke',d,c,w,m} · {t:'clip',x,y,w,h,ops}
function logo(version, colors, x, y, { w, h }) {
  const L = LOGO[version];
  const s = w ? w / L.box[2] : h / L.box[3];
  return L.layers.map((l) => ({ t: 'path', d: l.d, c: colors[l.role] || colors.w, m: [s, 0, 0, s, x, y], eo: !!l.eo }));
}
const logoSize = (version, { w, h }) => { const b = LOGO[version].box; return w ? [w, (w * b[3]) / b[2]] : [(h * b[2]) / b[3], h]; };
const PT = 25.4 / 72;
function text(str, fontName, sizePt, x, y, c, { align = 'left', track = 0 } = {}) {
  const size = sizePt * PT;
  const w = setText(fontName, str, size, 0, 0, { track }).width;
  const x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  return { op: { t: 'path', d: setText(fontName, str, size, x0, y, { track }).d, c, m: [1, 0, 0, 1, 0, 0] }, w };
}
// ondas de la marca dentro de un rectángulo (encuadre tipo "cubrir")
function waves(x, y, w, h, bg, fg, acc, { lines = 7, sw = 16, alpha = 0.2, hi } = {}) {
  const VW = 940, VH = 340, s = Math.max(w / VW, h / VH);
  const ox = x + (w - VW * s) / 2, oy = y + (h - VH * s) / 2;
  const ops = [{ t: 'rect', x, y, w, h, c: bg }];
  const H = hi ?? Math.floor(lines / 3);
  for (let i = 0; i < lines; i++) {
    const yy = 30 + i * 46;
    const d = `M-40 ${yy + 30}C120 ${yy + 30} 160 ${yy - 20} 300 ${yy - 20}C440 ${yy - 20} 480 ${yy + 30} 640 ${yy + 30}C800 ${yy + 30} 840 ${yy - 20} 980 ${yy - 20}`;
    ops.push({ t: 'stroke', d, c: i === H ? acc : mix(bg, fg, alpha), w: sw, m: [s, 0, 0, s, ox, oy] });
  }
  return { t: 'clip', x, y, w, h, ops };
}

// ------------------------------------------------------------------ piezas
const BLEED = 3;
function cardFront() {
  const W = 90, H = 50, ops = [];
  ops.push({ t: 'rect', x: -BLEED, y: -BLEED, w: W + 2 * BLEED, h: H + 2 * BLEED, c: INK.navy });
  ops.push(waves(-BLEED, 31, W + 2 * BLEED, H - 31 + BLEED, INK.navy, INK.ivory, INK.lime, { lines: 7, sw: 15, alpha: 0.16, hi: 3 }));
  const [lw, lh] = logoSize('primary', { w: 56 });
  ops.push(...logo('primary', { w: INK.ivory, a: INK.lime, d: INK.ivory }, (W - lw) / 2, 16.5 - lh / 2 + 1, { w: 56 }));
  return { W, H, ops, name: 'Frente' };
}
function cardBack() {
  const W = 90, H = 50, ops = [];
  ops.push({ t: 'rect', x: -BLEED, y: -BLEED, w: W + 2 * BLEED, h: H + 2 * BLEED, c: INK.ivory });
  // franja azul a la derecha con el ícono
  ops.push({ t: 'rect', x: 64, y: -BLEED, w: W - 64 + BLEED, h: H + 2 * BLEED, c: INK.navy });
  ops.push({ t: 'rect', x: 64, y: -BLEED, w: 1.2, h: H + 2 * BLEED, c: INK.lime });
  const [iw, ih] = logoSize('symbol', { w: 16 });
  ops.push(...logo('symbol', { w: INK.ivory, a: INK.lime }, 65.2 + (W - 65.2 - iw) / 2, (H - ih) / 2, { w: 16 }));
  // nombre y datos
  ops.push(...logo('wordmark', { w: INK.navy, a: INK.lime }, 7, 7, { w: 30 }));
  ops.push(text('EXPERIENCIAS CORPORATIVAS', 'manrope-600', 4.6, 7, 18.6, INK.navy, { track: 160 }).op);
  const rows = [DATA.email, ...DATA.phones];
  rows.forEach((r, i) => {
    const y = 31.5 + i * 5;
    ops.push({ t: 'path', d: circle(8.2, y - 1.05, 0.95), c: INK.lime, m: [1, 0, 0, 1, 0, 0] });
    ops.push(text(r, i ? 'manrope-600' : 'manrope-500', 6.6, 11, y, INK.navy).op);
  });
  return { W, H, ops, name: 'Reverso' };
}
function letterhead() {
  const W = 215.9, H = 279.4, ops = [];
  const B = BLEED;
  ops.push({ t: 'rect', x: -B, y: -B, w: W + 2 * B, h: H + 2 * B, c: INK.white });
  // marca de agua: ícono muy suave, recortado por el borde
  ops.push({ t: 'clip', x: -B, y: -B, w: W + 2 * B, h: H + 2 * B, ops: logo('symbolM', { m: mix(INK.white, INK.navy, 0.028) }, 128, 182, { w: 112 }) });
  // franja lateral
  ops.push({ t: 'rect', x: -B, y: -B, w: 6 + B, h: H + 2 * B, c: INK.navy });
  ops.push({ t: 'rect', x: 6, y: -B, w: 2.2, h: 30 + B, c: INK.lime });
  // encabezado
  ops.push(...logo('primary', { w: INK.navy, a: INK.lime, d: INK.navy }, 24, 17, { w: 62 }));
  const rx = W - 18;
  ops.push(text(DATA.email, 'manrope-500', 8.5, rx, 22.5, INK.navy, { align: 'right' }).op);
  ops.push(text(`${DATA.phones[0]}  ·  ${DATA.phones[1]}`, 'manrope-600', 8.5, rx, 28, INK.navy, { align: 'right' }).op);
  ops.push(text('EXPERIENCIAS CORPORATIVAS', 'manrope-600', 6, rx, 34.2, mix(INK.white, INK.navy, 0.55), { align: 'right', track: 180 }).op);
  ops.push({ t: 'rect', x: 24, y: 44, w: W - 24 - 18, h: 0.3, c: mix(INK.white, INK.navy, 0.14) });
  // pie con la onda
  ops.push(waves(-B, H - 16, W + 2 * B, 16 + B, INK.navy, INK.ivory, INK.lime, { lines: 7, sw: 12, alpha: 0.16, hi: 3 }));
  return { W, H, ops, name: 'Membrete' };
}
function circle(cx, cy, r) {
  const k = 0.5523 * r;
  return `M${cx - r} ${cy}C${cx - r} ${cy - k} ${cx - k} ${cy - r} ${cx} ${cy - r}C${cx + k} ${cy - r} ${cx + r} ${cy - k} ${cx + r} ${cy}C${cx + r} ${cy + k} ${cx + k} ${cy + r} ${cx} ${cy + r}C${cx - k} ${cy + r} ${cx - r} ${cy + k} ${cx - r} ${cy}Z`;
}
function patternPiece(bgName) {
  const W = 300, H = 200;
  const bg = INK[bgName], fg = bgName === 'navy' ? INK.ivory : INK.navy, acc = bgName === 'lime' ? INK.navy : INK.lime;
  return { W, H, ops: [waves(0, 0, W, H, bg, fg, acc, { lines: 9, sw: 16, alpha: bgName === 'lime' ? 0.25 : 0.18, hi: 3 })], name: 'Patrón' };
}

// ------------------------------------------------------------------ trazos SVG → operadores PDF
function pathOps(d, m) {
  const tk = d.match(/[MLCQHVZ]|-?\d*\.?\d+(?:e-?\d+)?/gi);
  const T = (x, y) => [n(m[0] * x + m2(m, 'c') * y + m[4]), n(m[1] * x + m[3] * y + m[5])];
  let out = '', i = 0, cmd = '', cx = 0, cy = 0, sx = 0, sy = 0;
  const num = () => +tk[i++];
  while (i < tk.length) {
    if (/[A-Z]/i.test(tk[i])) cmd = tk[i++].toUpperCase();
    if (cmd === 'M') { cx = num(); cy = num(); sx = cx; sy = cy; out += `${T(cx, cy).join(' ')} m\n`; cmd = 'L'; }
    else if (cmd === 'L') { cx = num(); cy = num(); out += `${T(cx, cy).join(' ')} l\n`; }
    else if (cmd === 'H') { cx = num(); out += `${T(cx, cy).join(' ')} l\n`; }
    else if (cmd === 'V') { cy = num(); out += `${T(cx, cy).join(' ')} l\n`; }
    else if (cmd === 'C') { const a = [num(), num(), num(), num(), num(), num()]; out += `${T(a[0], a[1]).join(' ')} ${T(a[2], a[3]).join(' ')} ${T(a[4], a[5]).join(' ')} c\n`; cx = a[4]; cy = a[5]; }
    else if (cmd === 'Q') {
      const [qx, qy, x, y] = [num(), num(), num(), num()];
      const c1 = [cx + (2 / 3) * (qx - cx), cy + (2 / 3) * (qy - cy)], c2 = [x + (2 / 3) * (qx - x), y + (2 / 3) * (qy - y)];
      out += `${T(...c1).join(' ')} ${T(...c2).join(' ')} ${T(x, y).join(' ')} c\n`; cx = x; cy = y;
    } else if (cmd === 'Z') { out += 'h\n'; cx = sx; cy = sy; cmd = ''; }
    else i++;
  }
  return out;
}
function m2(m) { return m[2]; }

function colorOp(c, mode, stroke) {
  if (mode === 'cmyk') return `${c.cmyk.map(n).join(' ')} ${stroke ? 'K' : 'k'}\n`;
  return `${c.rgb.map(n).join(' ')} ${stroke ? 'RG' : 'rg'}\n`;
}
function opsToPdf(ops, mode) {
  let s = '';
  for (const o of ops) {
    if (o.t === 'rect') s += colorOp(o.c, mode) + `${n(o.x)} ${n(o.y)} ${n(o.w)} ${n(o.h)} re f\n`;
    else if (o.t === 'path') s += colorOp(o.c, mode) + pathOps(o.d, o.m) + (o.eo ? 'f*\n' : 'f\n');
    else if (o.t === 'stroke') s += 'q\n' + colorOp(o.c, mode, true) + `1 J 1 j ${n(o.w * o.m[0])} w\n` + pathOps(o.d, o.m) + 'S\nQ\n';
    else if (o.t === 'clip') s += `q\n${n(o.x)} ${n(o.y)} ${n(o.w)} ${n(o.h)} re W n\n` + opsToPdf(o.ops, mode) + 'Q\n';
  }
  return s;
}

/** PDF multipágina. print=true → CMYK + sangrado + marcas de corte; si no, RGB al tamaño final. */
function writePdf(file, pieces, { print, title }) {
  const MM = 72 / 25.4;
  const mode = print ? 'cmyk' : 'rgb';
  const SLUG = print ? 12 : 0; // espacio para marcas
  const objs = [];
  const add = (s) => { objs.push(s); return objs.length; };
  const pagesId = 1000; // marcador, se reemplaza
  const pageIds = [];
  const kids = [];
  for (const p of pieces) {
    const off = print ? BLEED + SLUG : 0;
    const Wmm = p.W + 2 * off, Hmm = p.H + 2 * off;
    const Wpt = Wmm * MM, Hpt = Hmm * MM;
    let c = `q\n1 0 0 -1 0 ${n(Hpt)} cm\n${n(MM)} 0 0 ${n(MM)} ${n(off * MM)} ${n(off * MM)} cm\n`;
    if (!print) c += `0 0 ${p.W} ${p.H} re W n\n`;
    c += opsToPdf(p.ops, mode);
    if (print) {
      // marcas de corte en registro, separadas del sangrado
      const g = BLEED + 1, L = 6, reg = '1 1 1 1 K\n0.09 w\n';
      let mk = reg;
      for (const [x, y, dx, dy] of [[0, 0, -1, -1], [p.W, 0, 1, -1], [0, p.H, -1, 1], [p.W, p.H, 1, 1]]) {
        mk += `${n(x + dx * g)} ${n(y)} m ${n(x + dx * (g + L))} ${n(y)} l S\n`;
        mk += `${n(x)} ${n(y + dy * g)} m ${n(x)} ${n(y + dy * (g + L))} l S\n`;
      }
      c += mk;
      const lbl = text(`Latidos · ${p.name} · ${p.W} × ${p.H} mm · CMYK · sangrado 3 mm`, 'manrope-500', 6, 0, -BLEED - 4, INK.navy);
      c += '0 0 0 1 k\n' + pathOps(lbl.op.d, lbl.op.m) + 'f\n';
    }
    c += 'Q\n';
    const data = zlib.deflateSync(Buffer.from(c, 'latin1'));
    const cid = add({ stream: data });
    const box = (b) => `[${n(b[0])} ${n(b[1])} ${n(b[2])} ${n(b[3])}]`;
    const trim = [off * MM, off * MM, (off + p.W) * MM, (off + p.H) * MM];
    const bleed = print ? [(off - BLEED) * MM, (off - BLEED) * MM, (off + p.W + BLEED) * MM, (off + p.H + BLEED) * MM] : trim;
    const pid = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${n(Wpt)} ${n(Hpt)}] /TrimBox ${box(trim)} /BleedBox ${box(bleed)} /Resources << >> /Contents ${cid} 0 R >>`);
    pageIds.push(pid); kids.push(`${pid} 0 R`);
  }
  const pid = add(`<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${kids.length} >>`);
  const info = add(`<< /Title (${title}) /Author (We Rock Agencia) /Creator (We Rock Agencia) >>`);
  const cat = add(`<< /Type /Catalog /Pages ${pid} 0 R >>`);
  let out = Buffer.from('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n', 'latin1');
  const parts = [out];
  const xref = [];
  let pos = out.length;
  objs.forEach((o, i) => {
    let body;
    if (typeof o === 'string') body = Buffer.from(`${i + 1} 0 obj\n${o.replace(`${pagesId} 0 R`, `${pid} 0 R`)}\nendobj\n`, 'latin1');
    else body = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n<< /Length ${o.stream.length} /Filter /FlateDecode >>\nstream\n`, 'latin1'), o.stream, Buffer.from('\nendstream\nendobj\n', 'latin1')]);
    xref.push(pos); parts.push(body); pos += body.length;
  });
  const x = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${xref.map((p) => `${String(p).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R /Info ${info} 0 R >>\nstartxref\n${pos}\n%%EOF\n`;
  parts.push(Buffer.from(x, 'latin1'));
  fs.writeFileSync(file, Buffer.concat(parts));
}

// ------------------------------------------------------------------ escena → SVG (RGB, tamaño final)
function opsToSvg(ops) {
  let s = '', k = 0;
  for (const o of ops) {
    if (o.t === 'rect') s += `<rect x="${n(o.x)}" y="${n(o.y)}" width="${n(o.w)}" height="${n(o.h)}" fill="${toHex(o.c)}"/>`;
    else if (o.t === 'path') s += `<path transform="matrix(${o.m.map(n).join(' ')})" fill="${toHex(o.c)}"${o.eo ? ' fill-rule="evenodd"' : ''} d="${o.d}"/>`;
    else if (o.t === 'stroke') s += `<path transform="matrix(${o.m.map(n).join(' ')})" fill="none" stroke="${toHex(o.c)}" stroke-width="${o.w}" stroke-linecap="round" d="${o.d}"/>`;
    else if (o.t === 'clip') { const id = `c${Math.random().toString(36).slice(2, 8)}${k++}`; s += `<clipPath id="${id}"><rect x="${n(o.x)}" y="${n(o.y)}" width="${n(o.w)}" height="${n(o.h)}"/></clipPath><g clip-path="url(#${id})">${opsToSvg(o.ops)}</g>`; }
  }
  return s;
}
const svgOf = (p) => `<svg xmlns="http://www.w3.org/2000/svg" width="${p.W}mm" height="${p.H}mm" viewBox="0 0 ${p.W} ${p.H}">${opsToSvg(p.ops)}</svg>`;
const png = (p, file, dpi = 300) => sharp(Buffer.from(svgOf(p)), { density: dpi * 1.02 }).resize(Math.round((p.W / 25.4) * dpi)).flatten({ background: '#ffffff' }).png().toFile(file);

// ------------------------------------------------------------------ Word: membrete como fondo en el encabezado (se repite en cada página)
async function wordLetterhead(file, bgPng) {
  const D = require('docx');
  const tw = (mm) => Math.round(mm * 56.6929);
  const img = new D.ImageRun({
    type: 'png', data: fs.readFileSync(bgPng), transformation: { width: 816, height: 1056 },
    floating: { horizontalPosition: { relative: D.HorizontalPositionRelativeFrom.PAGE, offset: 0 }, verticalPosition: { relative: D.VerticalPositionRelativeFrom.PAGE, offset: 0 }, behindDocument: true, allowOverlap: true, lockAnchor: true },
  });
  const p = (t, o = {}) => new D.Paragraph({ spacing: { after: 160 }, children: [new D.TextRun({ text: t, font: 'Manrope', size: 21, color: '0B1B3B', ...o })] });
  const doc = new D.Document({
    creator: 'We Rock Agencia', title: 'Latidos · Membrete',
    sections: [{
      properties: { page: { size: { width: tw(215.9), height: tw(279.4) }, margin: { top: tw(58), bottom: tw(30), left: tw(24), right: tw(18), header: 0, footer: 0 } } },
      headers: { default: new D.Header({ children: [new D.Paragraph({ children: [img] })] }) },
      children: [
        p('Ciudad, día de mes de 2026', { color: '5A6475' }),
        p(''),
        p('Señores', { bold: true }), p('Nombre de la empresa', { bold: true }),
        p(''),
        p('Asunto: escriba aquí el asunto', { font: 'Sora', size: 26, bold: true }),
        p('Escriba aquí el texto de la carta. Este documento ya tiene el membrete de Latidos como fondo en todas las páginas: solo reemplacen este texto y guarden con otro nombre.'),
        p(''),
        p('Cordialmente,'), p(''), p('Nombre Apellido', { bold: true }), p('Cargo', { color: '5A6475' }),
      ],
    }],
  });
  fs.writeFileSync(file, await D.Packer.toBuffer(doc));
}

// ------------------------------------------------------------------ main
(async () => {
  const OUT = path.join(ROOT, 'descargas');
  const IMP = path.join(OUT, 'papeleria', 'Impresion_CMYK'), DIG = path.join(OUT, 'papeleria', 'Digital_RGB'), PAT = path.join(OUT, 'patrones');
  for (const d of [path.join(OUT, 'papeleria'), PAT]) fs.rmSync(d, { recursive: true, force: true });
  for (const d of [IMP, DIG, PAT]) fs.mkdirSync(d, { recursive: true });

  const front = cardFront(), back = cardBack(), lh = letterhead();
  writePdf(path.join(IMP, 'Latidos_Tarjeta_9x5cm_CMYK_Impresion.pdf'), [front, back], { print: true, title: 'Latidos · Tarjeta de presentación · Impresión CMYK' });
  writePdf(path.join(IMP, 'Latidos_Membrete_Carta_CMYK_Impresion.pdf'), [lh], { print: true, title: 'Latidos · Membrete carta · Impresión CMYK' });
  fs.writeFileSync(path.join(IMP, 'LEEME_imprenta.txt'), `LATIDOS · ARCHIVOS PARA IMPRENTA\r\n\r\nTarjeta de presentación: 9 x 5 cm, frente y reverso (página 1 y 2).\r\nMembrete: tamaño carta, 21,59 x 27,94 cm.\r\n\r\n- Color: CMYK.  Azul profundo C100 M85 Y40 K45 · Lima C25 M0 Y90 K0 · Marfil C2 M3 Y6 K0\r\n- Sangrado de 3 mm por lado y marcas de corte incluidas.\r\n- Textos convertidos a contornos (no se necesitan fuentes).\r\n- Se recomienda pedir prueba de color antes del tiraje, en especial del verde lima.\r\n- Sugerencia: tarjeta en propalcote o papel mate de 300 g; membrete en bond de 90 g.\r\n\r\nWe Rock Agencia\r\n`);

  // digital
  const dfront = { ...front, ops: front.ops }, dback = back;
  writePdf(path.join(DIG, 'Latidos_Tarjeta_Digital_RGB.pdf'), [dfront, dback], { print: false, title: 'Latidos · Tarjeta digital' });
  writePdf(path.join(DIG, 'Latidos_Membrete_Digital_RGB.pdf'), [lh], { print: false, title: 'Latidos · Membrete digital' });
  await png(front, path.join(DIG, 'Latidos_Tarjeta_Frente.png'));
  await png(back, path.join(DIG, 'Latidos_Tarjeta_Reverso.png'));
  await png(lh, path.join(DIG, 'Latidos_Membrete.png'));
  const bg150 = path.join(__dirname, 'traced', 'membrete-150.png');
  fs.mkdirSync(path.dirname(bg150), { recursive: true });
  await png(lh, bg150, 150);
  await wordLetterhead(path.join(DIG, 'Latidos_Membrete_Word.docx'), bg150);

  // patrones
  for (const [k, name] of [['navy', 'Azul'], ['ivory', 'Marfil'], ['lime', 'Lima']]) {
    const p = patternPiece(k);
    fs.writeFileSync(path.join(PAT, `Latidos_Patron_Ondas_${name}.svg`), svgOf(p));
    await png(p, path.join(PAT, `Latidos_Patron_Ondas_${name}.png`), 254);
    writePdf(path.join(PAT, `Latidos_Patron_Ondas_${name}_CMYK.pdf`), [{ ...p, name: `Patrón ondas ${name}` }], { print: false, title: `Latidos · Patrón de ondas ${name}` });
  }
  // la versión CMYK de patrones usa tintas CMYK pero sin marcas: se reescribe en modo cmyk
  for (const [k, name] of [['navy', 'Azul'], ['ivory', 'Marfil'], ['lime', 'Lima']]) {
    const p = patternPiece(k);
    writePdfMode(path.join(PAT, `Latidos_Patron_Ondas_${name}_CMYK.pdf`), p, `Latidos · Patrón de ondas ${name}`);
  }
  console.log('ok papelería + patrones');
})();

// PDF CMYK sin marcas (para patrones)
function writePdfMode(file, p, title) {
  const tmpPrint = { ...p };
  // reutiliza writePdf en modo impresión pero sin sangrado ni marcas
  const MM = 72 / 25.4;
  let c = `q\n1 0 0 -1 0 ${n(p.H * MM)} cm\n${n(MM)} 0 0 ${n(MM)} 0 0 cm\n0 0 ${p.W} ${p.H} re W n\n${opsToPdf(tmpPrint.ops, 'cmyk')}Q\n`;
  const data = zlib.deflateSync(Buffer.from(c, 'latin1'));
  const head = '%PDF-1.4\n';
  const o = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`,
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(p.W * MM)} ${n(p.H * MM)}] /Resources << >> /Contents 4 0 R >>`,
  ];
  const parts = [Buffer.from(head, 'latin1')];
  const xref = []; let pos = head.length;
  o.forEach((s, i) => { const b = Buffer.from(`${i + 1} 0 obj\n${s}\nendobj\n`, 'latin1'); xref.push(pos); parts.push(b); pos += b.length; });
  const sb = Buffer.concat([Buffer.from(`4 0 obj\n<< /Length ${data.length} /Filter /FlateDecode >>\nstream\n`, 'latin1'), data, Buffer.from('\nendstream\nendobj\n', 'latin1')]);
  xref.push(pos); parts.push(sb); pos += sb.length;
  const ib = Buffer.from(`5 0 obj\n<< /Title (${title}) /Author (We Rock Agencia) >>\nendobj\n`, 'latin1'); xref.push(pos); parts.push(ib); pos += ib.length;
  parts.push(Buffer.from(`xref\n0 6\n0000000000 65535 f \n${xref.map((x) => `${String(x).padStart(10, '0')} 00000 n \n`).join('')}trailer\n<< /Size 6 /Root 1 0 R /Info 5 0 R >>\nstartxref\n${pos}\n%%EOF\n`, 'latin1'));
  fs.writeFileSync(file, Buffer.concat(parts));
}
