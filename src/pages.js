// Genera las páginas de las tres propuestas (ronda 02) y redirige las páginas de la ronda anterior.
// uso: node src/pages.js
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const FILES = ['propuesta-01-pulso.html', 'propuesta-02-cumbre.html', 'propuesta-03-sello.html'];

const P1 = {
  vars: `--bg: #F8F5F0; --bg2: #EFEBE3; --fg: #0B1B3B; --muted: #5A6475; --line: rgba(11, 27, 59, .13); --card: #FFFFFF;
    --acc: #C6FF3D; --acc-ink: #0B1B3B; --on-acc: #0B1B3B; --r: 18px;
    --dk: #0B1B3B; --dk-fg: #F8F5F0; --dk-line: rgba(248, 245, 240, .14); --dk-muted: #A7B0BA; --dk-card: #13244a;
    --cover-bg: #0B1B3B; --cover-fg: #F8F5F0; --cover-line: rgba(248, 245, 240, .2); --top-fg: #F8F5F0;`,
  light: { p: '#0B1B3B', w: '#0B1B3B', a: '#C6FF3D', d: '#0B1B3B' },
  dark: { p: '#F8F5F0', w: '#F8F5F0', a: '#C6FF3D', d: '#F8F5F0' },
  colors: { bg: '#F8F5F0', bg2: '#EFEBE3', pri: '#0B1B3B', acc: '#C6FF3D', ink: '#0B1B3B' },
  palette: [
    { name: 'Azul profundo', role: 'Principal', hex: '#0B1B3B', share: 40, use: 'El color de la marca: logo, títulos y fondos.' },
    { name: 'Lima vibrante', role: 'Acento', hex: '#C6FF3D', share: 10, use: 'La chispa: detalles, botones y momentos destacados. Se usa con medida.' },
    { name: 'Marfil cálido', role: 'Fondo', hex: '#F8F5F0', share: 40, use: 'Fondo cálido para impresos y pantallas, en lugar del blanco.' },
    { name: 'Gris acero', role: 'Apoyo', hex: '#A7B0BA', share: 10, use: 'Para líneas, datos y elementos secundarios.' },
  ],
  colorIntro: 'Un azul profundo que transmite confianza, un verde lima lleno de energía y dos neutros que dan aire.',
  backs: (light, dark) => [
    { n: 'Marfil cálido', d: 'Fondo principal', bg: '#F8F5F0', c: light, ok: true, edge: true },
    { n: 'Azul profundo', d: 'Versión en claro', bg: '#0B1B3B', c: dark, ok: true },
    { n: 'Lima vibrante', d: 'Para piezas de alto impacto', bg: '#C6FF3D', c: { m: '#0B1B3B' }, v: 'primaryM', ok: true },
    { n: 'Gris acero', d: 'La cinta verde se pierde', bg: '#A7B0BA', c: light, ok: false },
  ],
  monoInk: '#0B1B3B', negBg: '#0B1B3B', onAcc: '#0B1B3B',
  build: { zone: 'rgba(198,255,61,.16)', guide: '#7d8796', mod: '#C6FF3D', modInk: '#0B1B3B' },
  dont: { wrong: { w: '#7B2CBF', a: '#FF8A00', d: '#7B2CBF' }, low: '#C9CFD6', lowBg: '#E6E9ED', recompose: 30 },
  mock: (r, light, dark, headline) => ({ r, pri: '#0B1B3B', acc: '#C6FF3D', bg: '#F8F5F0', bg2: '#EFEBE3', ink: '#0B1B3B', dk: '#0B1B3B', c: light, ci: dark, surf: '#DCD7CD', headline, lbl: 'rgba(11,27,59,.55)', stageW: 62, deckLogoW: 30, wall: '#E7E2D8', accC: { m: '#0B1B3B' }, badgeLogoW: 92, badgeV: 'wordmark', signV: 'primary', signLogoW: 100 }),
  mocks: [
    ['stage', 'w6', 'Pantalla de escenario', { lbl: 'rgba(255,255,255,.6)' }],
    ['deck', 'w4', 'Portada de presentación'],
    ['avatar', 'w2', 'Foto de perfil'],
    ['badge', 'w2', 'Credencial', { strap: '#C6FF3D' }],
    ['sign', 'w2', 'Señalización'],
    ['invite', 'w2', 'Invitación digital', { surf2: '#C6FF3D', lbl: 'rgba(11,27,59,.6)' }],
  ],
  min: [['primary', 160, 'Logo completo · desde 3,5 cm'], ['wordmark', 100, 'Solo el nombre · desde 2,2 cm'], ['symbol', 30, 'Ícono · desde 0,8 cm']],
  minNote: 'En tamaños más pequeños se usa el logo sin la frase “Experiencias corporativas”, para que siempre se lea bien.',
  logoLabels: { primaryLabel: 'Con su frase', hUse: 'Encabezados, correos y banners', symLabel: 'Ícono L·A', symUse: 'Foto de perfil, sellos y pantallas', wordLabel: 'Solo el nombre', wordUse: 'Fachadas, regalos de marca y espacios angostos' },
  type: { intro: 'Sora para los títulos, con energía y personalidad; Manrope para los textos, fácil de leer en cualquier lugar.', dW: 500 },
  monoIntro: 'Cuando solo se puede usar un color —un sello, un grabado, un bordado— el logo sigue funcionando: la cinta y la onda se separan con una línea fina.',
};

const P3 = {
  vars: `--bg: #F4F2F8; --bg2: #EAE6F0; --fg: #1F1428; --muted: #625A6C; --line: rgba(60, 28, 76, .14); --card: #FFFFFF;
    --acc: #C6FF3D; --acc-ink: #3C1C4C; --on-acc: #1F1428; --r: 24px;
    --dk: #3C1C4C; --dk-fg: #F4F2F8; --dk-line: rgba(244, 242, 248, .16); --dk-muted: #C9BCD3; --dk-card: #4a2a5c;
    --cover-bg: #3C1C4C; --cover-fg: #F4F2F8; --cover-line: rgba(244, 242, 248, .22); --top-fg: #F4F2F8;`,
  light: { p: '#3C1C4C', k: '#F4F2F8', w: '#3C1C4C', a: '#C6FF3D', d: '#3C1C4C' },
  dark: { p: '#F4F2F8', k: '#3C1C4C', w: '#F4F2F8', a: '#C6FF3D', d: '#F4F2F8' },
  colors: { bg: '#F4F2F8', bg2: '#EAE6F0', pri: '#3C1C4C', acc: '#C6FF3D', ink: '#1F1428' },
  palette: [
    { name: 'Ciruela profunda', role: 'Principal', hex: '#3C1C4C', share: 35, use: 'El color de la marca: sello, nombre y fondos.' },
    { name: 'Lima vibrante', role: 'Acento', hex: '#C6FF3D', share: 10, use: 'La onda dentro del sello, botones y detalles destacados.' },
    { name: 'Niebla', role: 'Fondo', hex: '#F4F2F8', share: 45, use: 'Fondo claro para impresos y pantallas, con un leve tono violeta.' },
    { name: 'Azul profundo', role: 'Apoyo', hex: '#0B1B3B', share: 10, use: 'Versión alternativa del sello, textos y fondos oscuros.' },
  ],
  colorIntro: 'Una ciruela profunda con carácter, el verde lima como chispa, un fondo claro y luminoso y un azul profundo como color alterno.',
  backs: (light, dark) => [
    { n: 'Niebla', d: 'Fondo principal', bg: '#F4F2F8', c: light, ok: true, edge: true },
    { n: 'Ciruela profunda', d: 'Versión en claro', bg: '#3C1C4C', c: dark, ok: true },
    { n: 'Azul profundo', d: 'Color alterno', bg: '#0B1B3B', c: { p: '#F4F2F8', k: '#0B1B3B', w: '#F4F2F8', a: '#C6FF3D', d: '#F4F2F8' }, ok: true },
    { n: 'Lima vibrante', d: 'La onda se pierde', bg: '#C6FF3D', c: light, ok: false },
  ],
  monoInk: '#3C1C4C', negBg: '#3C1C4C', onAcc: '#1F1428',
  build: { zone: 'rgba(198,255,61,.18)', guide: '#8a8296', mod: '#C6FF3D', modInk: '#3C1C4C' },
  dont: { wrong: { p: '#1E88E5', k: '#fff', w: '#1E88E5', a: '#E53935', d: '#1E88E5' }, low: '#CFC8D8', lowBg: '#E4E0EA', recompose: 34 },
  mock: (r, light, dark, headline) => ({ r, pri: '#3C1C4C', acc: '#C6FF3D', bg: '#F4F2F8', bg2: '#EAE6F0', ink: '#1F1428', dk: '#1F1428', c: light, ci: dark, surf: '#DCD6E3', headline, lbl: 'rgba(31,20,40,.55)', stageW: 34, deckLogoW: 32, wall: '#E5E0EB', accC: { m: '#1F1428' }, badgeLogoW: 90, signLogoW: 100, signR: '999px 999px 10px 10px' }),
  mocks: [
    ['stage', 'w6', 'Pantalla de escenario', { lbl: 'rgba(255,255,255,.6)' }],
    ['deck', 'w4', 'Portada de presentación'],
    ['avatar', 'w2', 'Foto de perfil'],
    ['badge', 'w2', 'Credencial'],
    ['sign', 'w2', 'Señalización'],
    ['invite', 'w2', 'Invitación digital', { surf2: '#C6FF3D', lbl: 'rgba(31,20,40,.6)' }],
  ],
  min: [['primary', 110, 'Vertical · desde 2,5 cm'], ['horizontal', 150, 'Horizontal · desde 3,5 cm'], ['symbol', 26, 'Sello · desde 0,8 cm']],
  minNote: 'En tamaños muy pequeños se usa solo el sello, que se reconoce por su forma redonda.',
  logoLabels: { primaryLabel: 'Vertical', hUse: 'Página web, encabezados y correos', symLabel: 'Sello', symUse: 'Foto de perfil, medallas, stickers y sellos', wordLabel: 'Solo el nombre', wordUse: 'Espacios angostos y regalos de marca' },
  type: { intro: 'Sora para los títulos, moderna y cercana; Manrope para los textos, fácil de leer en cualquier lugar.', dW: 600 },
  monoIntro: 'Cuando solo se puede usar un color, el sello funciona como un calado: la L, la onda y la A quedan en el color del fondo.',
};

const ROUTES = [
  {
    file: FILES[0], fav: 'fav-r1.svg', base: P1, r: 'r1', num: '01', name: 'Pulso', slug: 'Propuesta01_Pulso',
    tagline: 'La L se convierte en una onda que sube y forma la A: un solo gesto, suave y continuo, como el ritmo de un buen encuentro.',
    intro: 'Energía y movimiento dentro del nombre, con una A que ahora se lee clara.',
    text: [
      'Un latido es un impulso que sube y baja. En esta propuesta ese pulso vive dentro del nombre: la L se estira en una onda que asciende y dibuja la A.',
      'Respondiendo a sus comentarios, la onda ahora forma una A completa: sube hasta una cima redondeada y la cinta verde la cruza como el trazo central de la letra. Se lee “Latidos” a primera vista sin perder el movimiento.',
      'La cinta verde corre por debajo del azul como una segunda capa de energía, y el punto de la <i>i</i> repite ese verde para cerrar la palabra con fuerza.',
      'Es la versión más fluida y amable de las tres: transmite cercanía y creatividad, ideal para una marca que diseña experiencias.',
    ],
    keywords: ['Energía', 'Fluidez', 'Ritmo', 'Cercanía', 'Creatividad'],
    inspired: [
      'El pulso del corazón: un impulso que sube y baja, sin caer en el típico corazón o electrocardiograma.',
      'La curva emocional de un evento: la llegada, el momento cumbre y el recuerdo que queda.',
      'Las cintas de luz de un escenario: dos capas de color que avanzan juntas.',
    ],
    logoIntro: 'La palabra completa es la marca. La L con su onda en forma de A también funciona sola, como ícono para redes y espacios pequeños.',
    headline: 'Encuentros con pulso propio',
    sample: { h: 'Encuentros con pulso propio.', s: 'Diseñamos experiencias corporativas que conectan personas y se quedan en la memoria del equipo.', p: 'Cada encuentro empieza con una pregunta: ¿qué queremos que la gente sienta al salir? Desde ahí diseñamos el formato, el lugar, el ritmo y los detalles que convierten una agenda de trabajo en una experiencia compartida.', l: 'Experiencias corporativas · 2026' },
    stageBg: '#0B1B3B',
    nav: [
      { href: FILES[1], small: 'Siguiente · Propuesta 02', title: 'Cumbre →', bg: '#0B1B3B', fg: '#F8F5F0' },
      { href: 'index.html#comparativa', small: 'Volver', title: 'Comparar y elegir', bg: '#C6FF3D', fg: '#0B1B3B' },
    ],
  },
  {
    file: FILES[1], fav: 'fav-r2.svg', base: P1, r: 'r2', num: '02', name: 'Cumbre', slug: 'Propuesta02_Cumbre',
    tagline: 'La onda sube hasta un vértice marcado: la A más clara y decidida, el punto más alto de una experiencia.',
    intro: 'La A como una cumbre: el momento más alto de cada encuentro.',
    text: [
      'Toda experiencia memorable tiene un momento cumbre: el instante en que todo encaja y la gente lo siente. Esta propuesta convierte ese momento en la A.',
      'La onda nace en la L y sube hasta un vértice firme, que dibuja una A inconfundible. La cinta verde la atraviesa como el trazo central, así “Latidos” se lee de inmediato, incluso de lejos.',
      'Conserva el ritmo y la energía de la onda, pero con un carácter más decidido y corporativo: confianza para el cliente, emoción para los invitados.',
      'Es la versión más legible de las tres y la que mejor resiste tamaños pequeños y distancias largas, como una pantalla de escenario o una valla.',
    ],
    keywords: ['Cumbre', 'Claridad', 'Decisión', 'Energía', 'Confianza'],
    inspired: [
      'El momento cumbre de un evento: cuando la energía del grupo llega a su punto más alto.',
      'Una montaña: el reto compartido que un equipo alcanza junto.',
      'El trazo de una firma: un gesto rápido y seguro que no necesita explicación.',
    ],
    logoIntro: 'La palabra completa es la marca. La L con la A en cumbre funciona sola, como ícono para redes y espacios pequeños.',
    headline: 'El punto más alto de cada encuentro',
    sample: { h: 'El punto más alto de cada encuentro.', s: 'Diseñamos experiencias corporativas que llevan a los equipos a su mejor momento.', p: 'Una experiencia memorable no se improvisa: se diseña para que cada invitado llegue a ese instante que recordará. Formato, lugar, ritmo y detalles al servicio de un solo objetivo: que el encuentro deje huella.', l: 'Experiencias corporativas · 2026' },
    stageBg: '#0B1B3B',
    nav: [
      { href: FILES[2], small: 'Siguiente · Propuesta 03', title: 'Sello →', bg: '#3C1C4C', fg: '#F4F2F8' },
      { href: FILES[0], small: 'Anterior · Propuesta 01', title: '← Pulso', bg: '#0B1B3B', fg: '#F8F5F0' },
    ],
  },
  {
    file: FILES[2], fav: 'fav-r3.svg', base: P3, r: 'r3', num: '03', name: 'Sello', slug: 'Propuesta03_Sello',
    tagline: 'La L, la onda y la A dentro de un círculo: una huella. La marca que deja cada experiencia.',
    intro: 'Un sello que se lleva puesto: la huella que dejan las experiencias.',
    text: [
      'Las mejores experiencias dejan huella. Esta propuesta convierte esa idea en un sello: un círculo que guarda la L, la onda y la A de Latidos.',
      'El círculo es el punto de encuentro, el espacio donde todos coinciden. Dentro, la L y la onda verde suben hasta formar la A, que aparece calada en la forma.',
      'Al ser un emblema, funciona solo con mucha fuerza: en una credencial, un pin, una medalla, un sticker o la foto de perfil. El nombre debajo completa la firma.',
      'La ciruela profunda le da un carácter moderno y distinto, y el verde lima mantiene la energía de la marca.',
    ],
    keywords: ['Huella', 'Encuentro', 'Emblema', 'Modernidad', 'Pertenencia'],
    inspired: [
      'Un sello o una medalla: la marca que certifica que algo valió la pena.',
      'El círculo como punto de encuentro: todos alrededor de una misma experiencia.',
      'Los emblemas de marcas que se reconocen solo con su símbolo.',
    ],
    logoIntro: 'El sello va sobre el nombre. Es un emblema independiente: puede vivir solo en cualquier formato.',
    headline: 'Experiencias que dejan huella',
    sample: { h: 'Experiencias que dejan huella.', s: 'Creamos encuentros corporativos que la gente quiere repetir y contar.', p: 'Cada experiencia que diseñamos lleva un sello: personas que se conectan, equipos que se fortalecen y momentos que se recuerdan mucho después de que termina el evento.', l: 'Experiencias corporativas · 2026' },
    stageBg: '#3C1C4C',
    nav: [
      { href: 'index.html#comparativa', small: 'Siguiente', title: 'Comparar y elegir →', bg: '#3C1C4C', fg: '#F4F2F8' },
      { href: FILES[1], small: 'Anterior · Propuesta 02', title: '← Cumbre', bg: '#0B1B3B', fg: '#F8F5F0' },
    ],
  },
];

const J = (o) => JSON.stringify(o);
for (const R of ROUTES) {
  const B = R.base;
  const nav = FILES.map((f, i) => `<a href="${f}"${f === R.file ? ' aria-current="page"' : ''}>0${i + 1}</a>`).join('');
  const cfg = `const light = ${J(B.light)};
const dark = ${J(B.dark)};
LAT.renderRoute({
  r: '${R.r}', num: '${R.num}', name: ${J(R.name)}, short: ${J(R.name)}, slug: '${R.slug}', kind: 'Propuesta',
  tagline: ${J(R.tagline)},
  colors: ${J(B.colors)},
  light, dark, cover: { c: dark },
  concept: { intro: ${J(R.intro)}, text: ${J(R.text)}, keywords: ${J(R.keywords)}, inspired: ${J(R.inspired)}, ref: '', stage: { bg: '${R.stageBg}', c: dark } },
  logoIntro: ${J(R.logoIntro)},
  ${Object.entries(B.logoLabels).map(([k, v]) => `${k}: ${J(v)}`).join(', ')},
  monoIntro: ${J(B.monoIntro)},
  monoInk: '${B.monoInk}', negBg: '${B.negBg}', onAcc: '${B.onAcc}',
  xLabel: 'altura de las letras', xRatio: 0.63,
  build: ${J(B.build)},
  min: ${J(B.min)},
  minNote: ${J(B.minNote)},
  backs: ${J(B.backs(B.light, B.dark))},
  colorIntro: ${J(B.colorIntro)},
  palette: ${J(B.palette)},
  type: { intro: ${J(B.type.intro)}, dW: ${B.type.dW}, sample: ${J(R.sample)} },
  dont: ${J(B.dont)},
  mockIntro: 'La marca en los momentos clave de un evento: la invitación, la llegada, el escenario y lo que queda después.',
  mock: ${J(B.mock(R.r, B.light, B.dark, R.headline))},
  mocks: ${J(B.mocks)},
  nav: ${J(R.nav)},
});`;
  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Propuesta ${R.num} · ${R.name} — Latidos</title>
<meta name="description" content="Latidos · Propuesta ${R.num} · ${R.name}: la idea, el logo, los colores y cómo se vería.">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" href="assets/${R.fav}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/core.css">
<style>
  :root {
    ${B.vars}
  }
  .sec.dark .sec-num b { color: var(--acc); }
</style>
</head>
<body>
<header class="topbar">
  <a class="brand" href="index.html"><span>Latidos</span><span class="lbl">· Propuesta de identidad</span></a>
  <nav aria-label="Propuestas">${nav}<a href="index.html#comparativa">⇆<span class="lbl">&nbsp;Comparar</span></a></nav>
</header>
<main id="app"></main>
<script src="assets/logos.js"></script>
<script src="assets/latidos.js"></script>
<script>
${cfg}
</script>
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, R.file), html);
}

// páginas de la ronda anterior → portada actual
for (const old of ['ruta-01-pulso-creativo.html', 'ruta-02-conexion.html', 'ruta-03-personas-en-movimiento.html']) {
  fs.writeFileSync(path.join(ROOT, old), `<!doctype html><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=index.html"><title>Latidos</title><a href="index.html">Ver la propuesta actualizada</a>\n`);
}
console.log('ok', FILES.join(', '));
