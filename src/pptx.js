// Latidos · plantilla PowerPoint de propuesta comercial (respaldo editable del generador web).
// uso: node src/pptx.js  → descargas/comercial/Latidos_Plantilla_Propuesta.pptx
const fs = require('fs'), path = require('path');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..');
global.window = { LAT: { logo: () => '' } };
require(path.join(ROOT, 'comercial/data.js'));
const D = window.LATIDOS_DATA, ICONS = window.LATIDOS_ICONS;
delete global.window;
const NAVY = '0B1B3B', LIME = 'C6FF3D', IVORY = 'F8F5F0', MUTED = '5A6475', WHITE = 'FFFFFF';
const TMP = path.join(__dirname, 'traced', 'pptx');
fs.mkdirSync(TMP, { recursive: true });
const PNG = (n) => path.join(ROOT, 'descargas/png', n);
const FOTO = (k) => path.join(ROOT, 'comercial/fotos', `${D.photos[k] || k}.jpg`);

async function iconPng(k, color, bg) {
  const f = path.join(TMP, `ic-${k}-${color}-${bg || 'x'}.png`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 48 48">${bg ? `<rect width="48" height="48" rx="12" fill="#${bg}"/>` : ''}<g transform="translate(9 9) scale(.625)" fill="none" stroke="#${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">${ICONS[k]}</g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(f);
  return f;
}
async function wavesPng(name, w = 2000, h = 520) {
  const f = path.join(TMP, `waves-${name}.png`);
  let p = '';
  for (let i = 0; i < 6; i++) { const y = 30 + i * 46, hi = i === 2; p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? '#C6FF3D' : '#F8F5F0'}" stroke-width="13" stroke-linecap="round" opacity="${hi ? 1 : 0.15}"/>`; }
  await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice">${p}</svg>`)).png().toFile(f);
  return f;
}

const PptxGenJS = require('pptxgenjs');
(async () => {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_WIDE'; // 13.33 × 7.5 in
  pptx.author = 'We Rock Agencia'; pptx.company = 'Latidos'; pptx.title = 'Latidos · Propuesta comercial';
  const W = 13.333, H = 7.5, M = 0.6;
  const waves = await wavesPng('a');
  const T = (o) => ({ fontFace: 'Manrope', color: NAVY, fontSize: 14, margin: 0, ...o });
  const S = (o) => T({ fontFace: 'Sora', ...o });
  const kicker = (s, x, y, text, color = MUTED, w = 8) => s.addText(text.toUpperCase(), T({ x, y, w, h: 0.3, fontSize: 10, bold: true, charSpacing: 3, color }));
  const head = (s, title, dark) => {
    s.addText(title.toUpperCase(), T({ x: M, y: 0.32, w: 6, h: 0.25, fontSize: 8, bold: true, charSpacing: 3, color: dark ? 'B9C0CB' : MUTED }));
    s.addText('LATIDOS · PROPUESTA PARA [EMPRESA CLIENTE]', T({ x: W - M - 6, y: 0.32, w: 6, h: 0.25, fontSize: 8, bold: true, charSpacing: 3, align: 'right', color: dark ? 'B9C0CB' : MUTED }));
    s.addText('LATIDOS · EXPERIENCIAS CORPORATIVAS', T({ x: M, y: H - 0.5, w: 6, h: 0.25, fontSize: 8, bold: true, charSpacing: 3, color: dark ? 'B9C0CB' : MUTED }));
  };
  const photoBg = (s, k, transp = 12) => { s.addImage({ path: FOTO(k), x: 0, y: 0, w: W, h: H, sizing: { type: 'cover', w: W, h: H } }); s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: NAVY, transparency: transp }, line: { type: 'none' } }); };

  // 1 portada
  let s = pptx.addSlide(); s.background = { color: NAVY };
  photoBg(s, 'portada', 18);
  s.addImage({ path: waves, x: 0, y: H - 1.9, w: W, h: 1.9 * 1 });
  s.addImage({ path: PNG('Latidos_Principal_Color-Negativo.png'), x: M, y: 1.0, w: 3.2, h: 3.2 * 0.293 });
  kicker(s, M, 2.55, 'Propuesta comercial · N.º LAT-2026-000', LIME);
  s.addText('[Nombre del evento]', S({ x: M, y: 2.9, w: 8.5, h: 1.5, fontSize: 44, color: IVORY, valign: 'top' }));
  s.addText([{ text: 'Preparada para ', options: {} }, { text: '[Empresa cliente]', options: { bold: true } }], T({ x: M, y: 4.45, w: 8, h: 0.4, fontSize: 18, color: IVORY }));
  s.addText(`[Fecha]   ·   ${D.contact.email}   ·   ${D.contact.phones[0]}`, T({ x: M, y: H - 0.55, w: 10, h: 0.3, fontSize: 10, color: IVORY }));

  // 2 lo que entendimos
  s = pptx.addSlide(); s.background = { color: IVORY }; head(s, 'Lo que entendimos');
  kicker(s, M, 1.2, 'Para [Empresa cliente] · [Contacto], [Cargo]');
  s.addText('Lo que entendimos de su encuentro.', S({ x: M, y: 1.55, w: 5, h: 1.4, fontSize: 30, valign: 'top' }));
  s.addShape(pptx.ShapeType.roundRect, { x: M, y: 3.3, w: 5, h: 2.1, fill: { color: NAVY }, rectRadius: 0.15, line: { type: 'none' } });
  s.addImage({ path: await iconPng('estrella', NAVY, LIME), x: M + 0.35, y: 3.6, w: 0.6, h: 0.6 });
  kicker(s, M + 0.35, 4.35, 'Objetivo principal', LIME, 4);
  s.addText('[Ej. Celebración de logros]', S({ x: M + 0.35, y: 4.65, w: 4.3, h: 0.6, fontSize: 20, color: IVORY, bold: true }));
  s.addText('[Contexto del cliente: qué quieren lograr, a quién va dirigido y qué esperan del encuentro.]', T({ x: 6.4, y: 1.55, w: 6.3, h: 1.4, fontSize: 15, valign: 'top' }));
  const facts = [['planeacion', 'Fecha', '[Fecha]'], ['locaciones', 'Lugar', '[Ciudad / lugar]'], ['teambuilding', 'Personas', '[N.º]'], ['reloj', 'Duración', '[Duración]']];
  for (let i = 0; i < 4; i++) {
    const x = 6.4 + (i % 2) * 3.2, y = 3.3 + Math.floor(i / 2) * 1.1;
    s.addShape(pptx.ShapeType.roundRect, { x, y, w: 3.05, h: 0.95, fill: { color: WHITE }, line: { color: 'DCDDE0', width: 0.75 }, rectRadius: 0.1 });
    s.addImage({ path: await iconPng(facts[i][0], LIME, NAVY), x: x + 0.2, y: y + 0.2, w: 0.55, h: 0.55 });
    s.addText(facts[i][1].toUpperCase(), T({ x: x + 0.9, y: y + 0.18, w: 2, h: 0.25, fontSize: 8, bold: true, charSpacing: 3, color: MUTED }));
    s.addText(facts[i][2], S({ x: x + 0.9, y: y + 0.42, w: 2.05, h: 0.35, fontSize: 13, bold: true }));
  }

  // 3 la experiencia (3 tarjetas; copiar de la biblioteca para cambiar)
  s = pptx.addSlide(); s.background = { color: IVORY }; head(s, 'La experiencia');
  kicker(s, M, 1.0, 'Nuestra propuesta');
  s.addText('[Nuestra propuesta en una frase]', S({ x: M, y: 1.3, w: 11, h: 0.9, fontSize: 28, valign: 'top' }));
  const pick = ['reconocimiento', 'catering', 'teambuilding'];
  for (let i = 0; i < 3; i++) {
    const l = D.lines.find((x) => x.id === pick[i]); const x = M + i * 4.1, y = 2.5, w = 3.9, h = 4.3;
    s.addImage({ path: FOTO(l.id), x, y, w, h, sizing: { type: 'cover', w, h }, rounding: false });
    s.addShape(pptx.ShapeType.rect, { x, y: y + h * 0.45, w, h: h * 0.55, fill: { color: NAVY, transparency: 10 }, line: { type: 'none' } });
    s.addImage({ path: await iconPng(l.icon, NAVY, LIME), x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6 });
    s.addText(l.name, S({ x: x + 0.25, y: y + h * 0.5, w: w - 0.5, h: 0.5, fontSize: 16, bold: true, color: IVORY }));
    s.addText(l.items.slice(0, 4).map((t) => ({ text: t, options: { bullet: true } })), T({ x: x + 0.25, y: y + h * 0.5 + 0.6, w: w - 0.5, h: 1.4, fontSize: 11.5, color: IVORY, valign: 'top', paraSpaceAfter: 3 }));
  }
  s.addText('Para cambiar una línea: copien su tarjeta desde la biblioteca al final de esta presentación.', T({ x: M, y: H - 0.85, w: 10, h: 0.3, fontSize: 9, italic: true, color: MUTED }));

  // 4 agenda
  s = pptx.addSlide(); s.background = { color: IVORY }; head(s, 'Agenda');
  kicker(s, M, 2.0, 'Así se vivirá');
  s.addText('Agenda del encuentro.', S({ x: M, y: 2.3, w: 4.3, h: 1.4, fontSize: 32, valign: 'top' }));
  s.addText('Un ritmo pensado para que cada momento tenga sentido: la llegada, el punto más alto y el recuerdo que queda.', T({ x: M, y: 3.8, w: 4.2, h: 1, fontSize: 13, color: MUTED, valign: 'top' }));
  s.addTable([['8:00 a. m.', 'Llegada y bienvenida'], ['9:00 a. m.', 'Actividad central'], ['1:00 p. m.', 'Almuerzo'], ['3:00 p. m.', 'Actividad de integración'], ['5:00 p. m.', 'Cierre y reconocimientos']].map((r) => [
    { text: r[0], options: { bold: true, fontFace: 'Sora' } }, { text: r[1] }]),
  { x: 5.6, y: 1.8, w: 7.1, colW: [1.7, 5.4], rowH: 0.62, fontFace: 'Manrope', fontSize: 14, color: NAVY, fill: { color: WHITE }, border: { type: 'solid', color: 'E4E1DA', pt: 1 }, valign: 'middle', margin: 0.15 });

  // 5 inversión
  s = pptx.addSlide(); s.background = { color: IVORY }; head(s, 'Inversión');
  kicker(s, M, 1.0, 'Propuesta económica');
  s.addText('Inversión.', S({ x: M, y: 1.3, w: 8, h: 0.8, fontSize: 32 }));
  const hdr = (t, align = 'left') => ({ text: t.toUpperCase(), options: { bold: true, fontSize: 9, color: MUTED, charSpacing: 2, align, border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 2, color: NAVY }, { type: 'none' }] } });
  const cell = (t, align = 'left') => ({ text: t, options: { align, border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.75, color: 'DCDDE0' }, { type: 'none' }] } });
  s.addTable([[hdr('Concepto'), hdr('Cantidad', 'right'), hdr('Valor unitario', 'right'), hdr('Total', 'right')],
    ...[['[Concepto 1]', '1', '$ 0', '$ 0'], ['[Concepto 2]', '1', '$ 0', '$ 0'], ['[Concepto 3]', '1', '$ 0', '$ 0'], ['[Concepto 4]', '1', '$ 0', '$ 0']].map((r) => [cell(r[0]), cell(r[1], 'right'), cell(r[2], 'right'), cell(r[3], 'right')])],
  { x: M, y: 2.3, w: W - 2 * M, colW: [6.2, 1.6, 2.1, 2.23], rowH: 0.48, fontFace: 'Manrope', fontSize: 13, color: NAVY, margin: 0.12 });
  s.addText('Subtotal', T({ x: 7.6, y: 5.0, w: 2.5, h: 0.35 })); s.addText('$ 0', T({ x: 10.1, y: 5.0, w: 2.6, h: 0.35, align: 'right' }));
  s.addText('IVA 19 %', T({ x: 7.6, y: 5.4, w: 2.5, h: 0.35 })); s.addText('$ 0', T({ x: 10.1, y: 5.4, w: 2.6, h: 0.35, align: 'right' }));
  s.addShape(pptx.ShapeType.roundRect, { x: 7.45, y: 5.85, w: 5.3, h: 0.6, fill: { color: NAVY }, line: { type: 'none' }, rectRadius: 0.1 });
  s.addText('Total', S({ x: 7.65, y: 5.9, w: 2.5, h: 0.5, fontSize: 18, bold: true, color: IVORY }));
  s.addText('$ 0', S({ x: 10.1, y: 5.9, w: 2.5, h: 0.5, fontSize: 18, bold: true, color: LIME, align: 'right' }));

  // 6 condiciones y cierre
  s = pptx.addSlide(); s.background = { color: NAVY }; head(s, 'Condiciones y próximos pasos', true);
  s.addImage({ path: waves, x: 0, y: H - 1.6, w: W, h: 1.6 });
  kicker(s, M, 1.0, 'Condiciones', LIME);
  s.addText(['Propuesta LAT-2026-000, válida hasta [fecha].', 'Forma de pago: 50 % para reservar la fecha y 50 % antes del evento.', 'Valores en pesos colombianos.', 'La fecha se reserva con el primer pago.', 'Cambios en número de personas hasta 8 días antes.'].map((t) => ({ text: t, options: { bullet: { code: '25CF' }, color: IVORY } })), T({ x: M, y: 1.4, w: 5.6, h: 3.2, fontSize: 13.5, color: IVORY, valign: 'top', paraSpaceAfter: 8 }));
  kicker(s, 6.9, 1.0, 'Próximos pasos', LIME);
  ['Revisan la propuesta y nos cuentan sus ajustes.', 'Confirmamos fecha, número de personas y detalles.', 'Reservamos con el primer pago y empezamos a diseñar.'].forEach((t, i) => {
    const y = 1.4 + i * 0.85;
    s.addShape(pptx.ShapeType.roundRect, { x: 6.9, y, w: 5.8, h: 0.7, fill: { color: '17284A' }, line: { color: '2A3A5C', width: 0.75 }, rectRadius: 0.1 });
    s.addText(`0${i + 1}`, S({ x: 7.1, y: y + 0.1, w: 0.7, h: 0.5, fontSize: 22, color: LIME }));
    s.addText(t, T({ x: 7.8, y: y + 0.1, w: 4.8, h: 0.5, fontSize: 13, color: IVORY }));
  });
  s.addImage({ path: await iconPng('chat', NAVY, LIME), x: 6.9, y: 4.15, w: 0.6, h: 0.6 });
  s.addText([{ text: '[Nombre del asesor]', options: { bold: true, fontFace: 'Sora', breakLine: true } }, { text: `${D.contact.phones[0]} · ${D.contact.email}` }], T({ x: 7.65, y: 4.1, w: 5, h: 0.7, fontSize: 13, color: IVORY }));
  s.addImage({ path: PNG('Latidos_Principal_Color-Negativo.png'), x: M, y: H - 1.25, w: 2.2, h: 2.2 * 0.293 });

  // biblioteca: una diapositiva por línea
  s = pptx.addSlide(); s.background = { color: LIME };
  s.addText('Biblioteca de líneas', S({ x: M, y: 2.6, w: 10, h: 1, fontSize: 40 }));
  s.addText('Copien la tarjeta o la diapositiva de la línea que necesiten y péguenla en la propuesta. Estas diapositivas no se envían al cliente: bórrenlas antes de exportar.', T({ x: M, y: 3.7, w: 9, h: 1, fontSize: 15 }));
  for (const l of D.lines) {
    s = pptx.addSlide(); s.background = { color: IVORY }; head(s, `Línea ${String(l.n).padStart(2, '0')} · ${l.short}`);
    s.addImage({ path: FOTO(l.id), x: M, y: 0.9, w: 5.6, h: 5.9, sizing: { type: 'cover', w: 5.6, h: 5.9 } });
    s.addShape(pptx.ShapeType.rect, { x: M, y: 0.9 + 5.9 * 0.6, w: 5.6, h: 5.9 * 0.4, fill: { color: NAVY, transparency: 25 }, line: { type: 'none' } });
    s.addImage({ path: await iconPng(l.icon, NAVY, LIME), x: M + 0.3, y: 1.2, w: 0.8, h: 0.8 });
    s.addText(String(l.n).padStart(2, '0'), S({ x: M + 0.3, y: 5.2, w: 3, h: 1.3, fontSize: 80, color: IVORY }));
    s.addText(l.name, S({ x: 6.8, y: 1.3, w: 5.9, h: 1, fontSize: 30, valign: 'top' }));
    s.addText(l.line, S({ x: 6.8, y: 2.35, w: 5.9, h: 0.5, fontSize: 16 }));
    s.addText(l.desc, T({ x: 6.8, y: 2.95, w: 5.9, h: 0.9, fontSize: 12.5, color: MUTED, valign: 'top' }));
    kicker(s, 6.8, 3.95, 'Qué incluye');
    s.addText(l.items.map((t) => ({ text: t, options: { bullet: true } })), T({ x: 6.8, y: 4.25, w: 5.9, h: 2.2, fontSize: 12.5, valign: 'top', paraSpaceAfter: 2 }));
  }

  const out = path.join(ROOT, 'descargas/comercial/Latidos_Plantilla_Propuesta.pptx');
  await pptx.writeFile({ fileName: out });
  console.log('ok', out);
})();
