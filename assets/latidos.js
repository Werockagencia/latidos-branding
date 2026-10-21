/* Latidos · motor de la propuesta de identidad (We Rock)
   - logo(): versiones desde los maestros vectoriales (assets/logos.js) con colores por rol
   - mockups de experiencias corporativas generados con la paleta de cada ruta
   - renderRoute(): arma el manual completo de una ruta desde su configuración */
(function () {
  'use strict';
  if (/shot/.test(location.search)) document.documentElement.classList.add('shot');
  const LOGOS = window.LATIDOS_LOGOS;
  const WA = '573125766056';
  const $ = (s, r = document) => r.querySelector(s);

  // ---------------------------------------------------------------- sprite
  const defs = [];
  for (const [r, vs] of Object.entries(LOGOS)) {
    for (const [v, L] of Object.entries(vs)) {
      const paths = L.layers.map((l) => `<path fill="var(--l-${l.role}, var(--l-p, #000))"${l.eo ? ' fill-rule="evenodd"' : ''} d="${l.d}"/>`).join('');
      defs.push(`<symbol id="${r}-${v}" viewBox="0 0 ${L.box[2]} ${L.box[3]}">${paths}</symbol>`);
    }
  }
  document.body.insertAdjacentHTML('afterbegin', `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${defs.join('')}</defs></svg>`);

  /** r: r1|r2|r3 · v: primary|horizontal|symbol|wordmark (+M = monotinta) · c: {p,a,w,d,m} */
  function logo(r, v, c = {}, o = {}) {
    const L = LOGOS[r][v];
    const [, , w, h] = L.box;
    const vars = Object.entries(c).map(([k, val]) => `--l-${k}:${val}`).join(';');
    return `<svg class="lg ${o.cls || ''}" viewBox="0 0 ${w} ${h}" style="${vars};${o.style || ''}" role="img" aria-label="${o.label || 'Latidos'}"><use href="#${r}-${v}"/></svg>`;
  }
  const mono = (col) => ({ m: col });

  // medidas útiles de cada versión (desde los puntos de control: aproximado)
  function groupBox(r, v, g) {
    const nums = LOGOS[r][v].layers.filter((l) => l.g === g).map((l) => l.d).join(' ').match(/-?\d*\.?\d+/g).map(Number);
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (let i = 0; i < nums.length; i += 2) { x0 = Math.min(x0, nums[i]); x1 = Math.max(x1, nums[i]); y0 = Math.min(y0, nums[i + 1]); y1 = Math.max(y1, nums[i + 1]); }
    return [x0, y0, x1 - x0, y1 - y0];
  }

  // ---------------------------------------------------------------- color
  const rgb = (hex) => { const n = parseInt(hex.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  function cmyk(hex) {
    const [r, g, b] = rgb(hex).map((v) => v / 255);
    const k = 1 - Math.max(r, g, b);
    if (k >= 1) return '0 · 0 · 0 · 100';
    return [(1 - r - k) / (1 - k), (1 - g - k) / (1 - k), (1 - b - k) / (1 - k), k].map((v) => Math.round(v * 100)).join(' · ');
  }
  function lum(hex) { const [r, g, b] = rgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; }
  const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const onColor = (hex) => (lum(hex) > 0.4 ? '#14161c' : '#fff');
  const grade = (c) => (c >= 7 ? 'AAA' : c >= 4.5 ? 'AA' : c >= 3 ? 'AA grande' : 'Solo decorativo');

  // ---------------------------------------------------------------- mockups
  // t: { r, pri, acc, bg, ink, sup, c (logo sobre claro), ci (logo sobre oscuro), surf, stage, ... }
  const M = {};
  const sh = (a = 0.35) => `0 1px 1px rgba(0,0,0,.18), 0 18px 40px -10px rgba(0,0,0,${a}), 0 44px 80px -30px rgba(0,0,0,${a * 0.8})`;

  M.stage = (t) => `
    <div class="abs" style="inset:0;background:radial-gradient(70% 60% at 50% 30%, ${t.stageGlow || t.pri}66, transparent 70%), linear-gradient(180deg,#05060a,#0b0d14 60%,#020203)"></div>
    <div class="abs" style="left:10%;top:-10%;width:22%;height:90%;background:linear-gradient(180deg, ${t.acc}55, transparent);transform:skewX(18deg);filter:blur(14px);opacity:.55"></div>
    <div class="abs" style="right:10%;top:-10%;width:22%;height:90%;background:linear-gradient(180deg, ${t.acc}55, transparent);transform:skewX(-18deg);filter:blur(14px);opacity:.55"></div>
    <div class="abs" style="left:22%;right:22%;top:12%;height:52%;background:${t.screen || t.pri};border-radius:4px;box-shadow:0 0 0 3px #111, 0 0 90px ${t.pri}aa;display:grid;place-items:center;overflow:hidden">
      <div style="width:${t.stageW || 52}%">${logo(t.r, t.stageV || 'primary', t.ci)}</div>
      <div class="abs" style="inset:0;background:repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 2px, transparent 2px 4px);mix-blend-mode:multiply"></div>
    </div>
    <div class="abs" style="left:5%;width:13%;top:20%;height:36%;background:${t.side || t.dk};border-radius:3px;box-shadow:0 0 0 3px #111, 0 0 50px ${t.pri}66;display:grid;place-items:center;padding:2.4%">${logo(t.r, 'symbol', t.sideC || t.ci)}</div>
    <div class="abs" style="right:5%;width:13%;top:20%;height:36%;background:${t.side || t.dk};border-radius:3px;box-shadow:0 0 0 3px #111, 0 0 50px ${t.pri}66;display:grid;place-items:center;padding:2.4%">${logo(t.r, 'symbol', t.sideC || t.ci)}</div>
    <div class="abs" style="left:0;right:0;top:70%;bottom:0;background:linear-gradient(180deg,#141722,#05060a)"></div>
    <div class="abs" style="left:14%;right:14%;top:70%;height:5%;background:linear-gradient(180deg, ${t.pri}88, transparent);filter:blur(6px);opacity:.7"></div>
    <svg class="abs" viewBox="0 0 1000 120" preserveAspectRatio="none" style="left:0;right:0;bottom:0;width:100%;height:24%" aria-hidden="true">
      ${Array.from({ length: 3 }, (_, row) => Array.from({ length: 26 - row * 2 }, (_, i) => { const n = 26 - row * 2; const x = (i + 0.5) * (1000 / n) + (row % 2) * 12; const y = 120 - row * 30; const r = 15 + row * 3; return `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * 1.25}" fill="#020204" opacity="${0.95 - row * 0.12}"/>`; }).join('')).join('')}
    </svg>`;

  M.deck = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="left:8%;right:8%;top:13%;aspect-ratio:16/9;background:${t.slide || t.pri};border-radius:6px;box-shadow:${sh(0.4)};overflow:hidden;color:${t.slideInk || '#fff'};container-type:inline-size">
      <div class="abs" style="left:6%;top:8%;width:${t.deckLogoW || 24}%">${logo(t.r, t.deckV || 'horizontal', t.slideC || t.ci)}</div>
      <div class="abs" style="left:6%;bottom:12%;width:54%">
        <div style="font-family:Sora;font-weight:500;font-size:clamp(14px,6.2cqw,52px);line-height:1;letter-spacing:-.035em">${t.headline}</div>
        <div style="margin-top:4cqw;font-size:clamp(6px,1.5cqw,13px);letter-spacing:.18em;text-transform:uppercase;opacity:.7;font-weight:600">Título de la presentación · 2026</div>
      </div>
      <div class="abs" style="right:-9%;top:16%;width:46%;aspect-ratio:1;opacity:${t.deckSymOp || 1}">${logo(t.r, 'symbol', t.deckSym || t.ci)}</div>
      <div class="abs" style="left:6%;right:6%;bottom:6%;height:1px;background:currentColor;opacity:.2"></div>
    </div>`;

  M.avatar = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="left:50%;top:15%;width:46%;aspect-ratio:1;transform:translateX(-50%);border-radius:50%;background:${t.pri};display:grid;place-items:center;padding:11%;box-shadow:0 0 0 5px ${t.surf}, 0 0 0 7px ${t.acc}, ${sh(0.3)}">${logo(t.r, 'symbol', t.ci)}</div>
    <div class="abs" style="left:0;right:0;top:66%;text-align:center;color:${t.ink}">
      <div style="font-family:Sora;font-weight:600;font-size:clamp(13px,5cqw,22px);letter-spacing:-.02em">Latidos</div>
      <div style="font-size:clamp(8px,2.6cqw,12px);opacity:.6;margin-top:2px">Experiencias corporativas</div>
    </div>
    <div class="abs" style="left:14%;right:14%;bottom:8%;display:flex;justify-content:center;gap:8%">
      ${[[t.bg, t.c], [t.acc, t.accC || mono(t.ink)], [t.ink, t.ci]].map(([bg, c]) => `<div style="width:22%;aspect-ratio:1;border-radius:${t.avR || '50%'};background:${bg};display:grid;place-items:center;padding:4.5%;box-shadow:0 0 0 1px rgba(0,0,0,.08), 0 8px 18px -8px rgba(0,0,0,.35)">${logo(t.r, 'symbol', c)}</div>`).join('')}
    </div>`;

  function qr(seed, col) {
    let s = seed, cells = '';
    const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (finder) continue;
      if (rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
    const fnd = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
    return `<svg viewBox="0 0 21 21" style="width:100%;display:block" shape-rendering="crispEdges" fill="${col}">${cells}${fnd(0, 0)}${fnd(14, 0)}${fnd(0, 14)}</svg>`;
  }

  M.badge = (t) => `
    <div class="abs" style="inset:0;background:${t.surf}"></div>
    <div class="abs" style="left:38%;top:-4%;width:9%;height:26%;background:${t.strap || t.acc};transform:rotate(-14deg);transform-origin:top;box-shadow:inset -3px 0 6px rgba(0,0,0,.15)"></div>
    <div class="abs" style="left:53%;top:-4%;width:9%;height:26%;background:${t.strap || t.acc};transform:rotate(14deg);transform-origin:top;box-shadow:inset 3px 0 6px rgba(0,0,0,.15)"></div>
    <div class="abs" style="left:46%;top:17%;width:8%;height:6%;border-radius:3px;background:linear-gradient(180deg,#c9ccd2,#8b9099);box-shadow:0 2px 3px rgba(0,0,0,.3)"></div>
    <div class="abs" style="left:24%;right:24%;top:22%;bottom:7%;border-radius:12px;background:${t.badge || '#fff'};box-shadow:${sh(0.35)};overflow:hidden;color:${t.ink};display:flex;flex-direction:column">
      <div style="height:7%"></div>
      <div style="margin:0 auto;width:12%;height:2.6%;border-radius:9px;background:${t.surf};box-shadow:inset 0 1px 2px rgba(0,0,0,.25)"></div>
      <div style="padding:10% 12% 0;display:grid;place-items:start"><div style="width:${t.badgeLogoW || 70}%">${logo(t.r, t.badgeV || 'horizontal', t.c)}</div></div>
      <div style="flex:1"></div>
      <div style="padding:0 12%">
        <div style="font-family:Sora;font-weight:600;font-size:clamp(11px,4.6cqw,22px);line-height:1.05;letter-spacing:-.02em">Nombre<br>Apellido</div>
        <div style="font-size:clamp(6px,2.1cqw,10.5px);opacity:.65;margin-top:6%;letter-spacing:.04em">Cargo · Empresa</div>
      </div>
      <div style="display:flex;align-items:flex-end;justify-content:space-between;padding:9% 12% 10%;gap:8%">
        <div style="width:34%">${qr(7, t.ink)}</div>
        <div style="font-size:clamp(6px,1.9cqw,10px);letter-spacing:.16em;text-transform:uppercase;font-weight:700;padding:.7em 1em;border-radius:99px;background:${t.acc};color:${onColor(t.acc)}">Anfitrión</div>
      </div>
      <div style="height:4%;background:${t.pri}"></div>
    </div>`;

  M.sign = (t) => `
    <div class="abs" style="inset:0;background:${t.wall || t.bg2 || t.surf}"></div>
    <div class="abs" style="inset:auto 0 0 0;height:16%;background:rgba(0,0,0,.08)"></div>
    <div class="abs" style="left:30%;top:9%;width:40%;bottom:12%;background:${t.signBg || t.pri};border-radius:${t.signR || '6px'};box-shadow:${sh(0.35)};padding:10% 9%;display:flex;flex-direction:column;gap:6%;color:${t.signInk || '#fff'}">
      <div style="width:${t.signLogoW || 78}%">${logo(t.r, t.signV || 'primary', t.signC || t.ci)}</div>
      <div style="flex:1"></div>
      ${[['←', 'Registro'], ['→', 'Auditorio'], ['↑', 'Salas'], ['↓', 'Lounge']].map(([a, n]) => `<div style="display:flex;align-items:center;gap:9%;border-top:1px solid rgba(255,255,255,.2);padding-top:7%;font-family:Sora;font-weight:500;font-size:clamp(8px,3.5cqw,17px);letter-spacing:-.01em"><span style="flex:none;display:grid;place-items:center;width:1.7em;height:1.7em;border-radius:50%;background:${t.acc};color:${onColor(t.acc)};font-size:.85em;font-weight:700">${a}</span>${n}</div>`).join('')}
    </div>
    <div class="abs" style="left:34%;width:32%;bottom:9%;height:3.5%;background:rgba(0,0,0,.35);border-radius:2px"></div>`;

  M.invite = (t) => `
    <div class="abs" style="inset:0;background:${t.surf2 || t.surf}"></div>
    <div class="abs" style="left:50%;top:7%;width:50%;aspect-ratio:.5;transform:translateX(-50%) rotate(3deg);border-radius:9% / 4.5%;background:#0c0c0e;padding:2.4%;box-shadow:0 0 0 1.5px #2a2a2e inset, ${sh(0.4)}">
      <div style="width:100%;height:100%;border-radius:7.5% / 3.7%;overflow:hidden;background:${t.inviteBg || t.pri};color:${t.inviteInk || '#fff'};display:flex;flex-direction:column;align-items:center;padding:16% 10% 12%;text-align:center">
        <div style="width:44%">${logo(t.r, 'symbol', t.inviteC || t.ci)}</div>
        <div style="flex:1"></div>
        <div style="font-size:clamp(5px,1.7cqw,9px);letter-spacing:.2em;text-transform:uppercase;opacity:.7;font-weight:700">Te invitamos a vivir</div>
        <div style="font-family:Sora;font-weight:500;font-size:clamp(10px,4.4cqw,22px);line-height:1.02;letter-spacing:-.03em;margin:7% 0 9%">${t.inviteTitle || 'Un encuentro que deja huella'}</div>
        <div style="width:100%;padding:.9em 0;border-radius:99px;background:${t.acc};color:${onColor(t.acc)};font-weight:700;font-size:clamp(5px,1.7cqw,9px);letter-spacing:.06em">Confirmar asistencia</div>
      </div>
    </div>`;

  M.wall = (t) => `
    <div class="abs" style="inset:0;background:${t.pri}"></div>
    <div class="abs" style="inset:0;background:radial-gradient(80% 90% at 85% 10%, ${t.acc}33, transparent 60%)"></div>
    <div class="abs" style="left:7%;top:50%;transform:translateY(-50%);width:${t.wallW || 54}%">${logo(t.r, t.wallV || 'horizontal', t.ci)}</div>
    <div class="abs" style="right:-8%;top:-20%;width:46%;aspect-ratio:1;opacity:.14">${logo(t.r, 'symbolM', mono(t.bg))}</div>`;

  // ---------------------------------------------------------------- render de una ruta
  let CUR = {};
  const head = (n, title, desc) => `<div class="sec-head rv"><div class="sec-num"><b>${n}</b> / ${CUR.short}</div><h2 class="sec-title">${title}</h2><p class="sec-desc">${desc}</p></div>`;

  function renderRoute(C) {
    CUR = C;
    const r = C.r, P = C.colors;
    C.files = C.files || ['Principal', 'Horizontal', 'Simbolo', 'Logotipo'].flatMap((v) => ['Color', 'Color-Negativo', 'Monocromo', 'Monocromo-Negativo'].map((x) => `Latidos_${C.slug}_${v}_${x}.svg`));
    let h = '';

    // portada
    h += `<header class="cover" id="top"><div class="art">${logo(r, 'primary', C.cover.c)}</div>
      <div class="wrap meta rv"><div class="num">${C.num}</div><div><div class="eyebrow" style="color:inherit;opacity:.7">${C.kind || 'Opción'} ${C.num} · Latidos</div><h1>${C.name}</h1></div>
      <div style="display:grid;gap:14px"><p>${C.tagline}</p><span class="scroll">Desliza para conocerla ↓</span></div></div></header>`;

    // 01 la idea
    h += `<section class="sec" id="idea"><div class="wrap">${head('01', 'La idea', C.concept.intro)}
      <div class="concept"><div class="rv">${C.concept.text.map((p, i) => (i === 0 ? `<p class="lead">${p}</p><div style="height:30px"></div>` : `<p>${p}</p>`)).join('')}
        <div class="kw">${C.concept.keywords.map((w) => `<span>${w}</span>`).join('')}</div>
        <div class="adjust"><div class="eyebrow">En qué se inspira</div><ul>${C.concept.inspired.map((x) => `<li>${x}</li>`).join('')}</ul>
          ${C.concept.ref ? `<div class="ref-vs"><figure><div class="box"><img src="${C.concept.ref}" alt="Boceto aprobado" loading="lazy"></div>Boceto aprobado</figure><figure><div class="box" style="background:${P.bg}">${logo(r, 'primary', C.light)}</div>Versión final</figure></div>` : ''}</div>
      </div><div class="stage rv" style="background:${C.concept.stage.bg}">${logo(r, C.concept.stage.v || 'symbol', C.concept.stage.c)}</div></div></div></section>`;

    // 02 el logo
    h += `<section class="sec alt" id="logo"><div class="wrap">${head('02', 'El logo', C.logoIntro)}
      <div class="tile hero-logo rv edge" style="background:${P.bg}">${logo(r, 'primary', C.light, { style: 'max-height:100%' })}<div class="cap" style="color:${P.ink}"><span>Versión principal</span><span>${C.primaryLabel}</span></div></div>
      <div style="height:24px"></div>
      <div class="grid g3">${[
        ['horizontal', 'Horizontal', C.hUse, P.bg, C.light, true],
        ['symbol', C.symLabel || 'Símbolo', C.symUse, P.pri, C.dark, false],
        ['wordmark', C.wordLabel || 'Solo el nombre', C.wordUse, P.bg2, C.light, true],
      ].map(([v, n, d, bg, c, wide]) => `<div class="rv"><div class="tile ver ${wide ? 'wide' : ''} edge" style="background:${bg}">${logo(r, v, c, { style: 'max-height:100%' })}</div><div class="ver-meta"><b>${n}</b><span class="muted">${d}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 03 a un solo color
    const monoTiles = [
      ['primaryM', 'Un solo color', P.bg, mono(C.monoInk), 'Para impresos sencillos, sellos y documentos'],
      ['primary', 'Sobre fondo de color', P.pri, C.dark, 'Sobre el color principal de la marca'],
      ['primaryM', 'Un color sobre oscuro', C.negBg, mono(P.bg), 'Para grabados, bordados y vinilos'],
      ['symbolM', 'Símbolo a un color', P.bg, mono(C.monoInk), 'Para piezas muy pequeñas'],
      ['horizontalM', 'Horizontal a un color', P.bg2, mono(C.monoInk), 'Para firmas y papelería'],
      ['symbolM', 'Sobre el color de acento', P.acc, mono(C.onAcc || P.ink), 'Solo en piezas de apoyo'],
    ];
    h += `<section class="sec" id="color-unico"><div class="wrap">${head('03', 'A un solo color', C.monoIntro)}
      <div class="grid g3">${monoTiles.map(([v, n, bg, c, d]) => `<div class="rv"><div class="tile ver ${v.startsWith('symbol') ? '' : 'wide'} edge" style="background:${bg}">${logo(r, v, c, { style: 'max-height:100%' })}</div><div class="ver-meta"><b>${n}</b><span class="muted">${d}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 04 espacio y tamaño
    h += `<section class="sec alt" id="espacio"><div class="wrap">${head('04', 'Espacio y tamaño', 'Para que el logo se vea siempre limpio, necesita aire a su alrededor y un tamaño mínimo para leerse bien.')}
      <div class="build"><div class="tile stage rv edge" style="background:${P.bg}">${buildSvg(r, C)}<div class="cap" style="color:${P.ink}"><span>Espacio libre alrededor del logo</span></div></div>
        <div class="grid rv" style="align-content:start">
          <div class="card pad"><div class="eyebrow">Espacio libre</div><p style="margin:.6em 0 0">Ningún texto, foto o borde debe entrar en el recuadro que rodea al logo. Ese aire es lo que lo hace verse profesional.</p></div>
          <div class="card pad"><div class="eyebrow" style="margin-bottom:18px">Tamaño mínimo</div><div class="minsizes">${C.min.map(([v, wpx, txt]) => `<figure><div style="width:${wpx}px">${logo(r, v, C.light)}</div><figcaption>${txt}</figcaption></figure>`).join('')}</div>
            <p class="small muted" style="margin:18px 0 0">${C.minNote}</p></div>
        </div></div>
      <div style="height:clamp(48px,7vw,90px)"></div>
      <div class="sec-head rv" style="margin-bottom:32px"><div class="sec-num">Fondos</div><h3 class="sec-title" style="font-size:clamp(28px,3.6vw,46px)">Sobre qué fondos va</h3><p class="sec-desc">El logo luce mejor sobre los colores de su propia paleta.</p></div>
      <div class="grid g4">${C.backs.map((b) => `<div class="rv"><div class="tile ver wide ${b.ok ? 'ok' : 'no'}" style="background:${b.bg};${b.edge ? 'box-shadow:inset 0 0 0 1px var(--line)' : ''}">${logo(r, b.v || 'primary', b.c, { style: 'max-height:100%' })}</div><div class="dont-cap"><b>${b.n}</b><span class="muted">${b.d}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 05 colores
    h += `<section class="sec" id="colores"><div class="wrap">${head('05', 'Colores', C.colorIntro)}
      <div class="swatches">${C.palette.map((c) => `<div class="sw rv"><div class="chip" style="background:${c.hex};color:${onColor(c.hex)};${lum(c.hex) > 0.85 ? 'box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)' : ''}"><span class="role">${c.role}</span><span class="nm">${c.name}</span></div>
        <dl><dt>Código</dt><dd><button class="copy" data-copy="${c.hex}" title="Copiar">${c.hex}</button></dd></dl><div class="use">${c.use}</div></div>`).join('')}</div>
      <div class="eyebrow rv" style="margin-top:36px">Cuánto se usa cada color</div>
      <div class="ratio rv" style="margin-top:12px">${C.palette.map((c) => `<div style="flex:${c.share};background:${c.hex};color:${onColor(c.hex)};${lum(c.hex) > 0.85 ? 'box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)' : ''}">${c.share}%</div>`).join('')}</div>
      </div></section>`;

    // 06 tipografía
    const T = C.type;
    h += `<section class="sec alt" id="tipografia"><div class="wrap">${head('06', 'Tipografía', T.intro)}
      <div class="type-grid">
        <div class="card pad specimen rv"><div class="eyebrow">Para títulos</div><div class="aa sora" style="font-weight:${T.dW}">Aa</div>
          <div class="abc sora" style="font-weight:${T.dW}">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 &amp; ¡!¿?</div>
          <div class="meta"><span><b style="color:var(--fg)">Sora</b> — moderna, clara y con personalidad</span></div></div>
        <div class="card pad specimen rv"><div class="eyebrow">Para textos</div><div class="aa" style="font-family:Manrope;font-weight:500">Aa</div>
          <div class="abc" style="font-family:Manrope">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br>abcdefghijklmnñopqrstuvwxyz<br>0123456789 &amp; ¡!¿?</div>
          <div class="meta"><span><b style="color:var(--fg)">Manrope</b> — cómoda de leer en cualquier pantalla o papel</span></div></div>
      </div>
      <div style="height:24px"></div>
      <div class="card pad hier rv">
        <div class="row"><span class="tag">Título</span><div class="sora" style="font-weight:${T.dW};font-size:clamp(34px,5vw,64px);line-height:1;letter-spacing:-.035em">${T.sample.h}</div></div>
        <div class="row"><span class="tag">Subtítulo</span><div class="sora" style="font-size:clamp(21px,2.4vw,28px);line-height:1.22;letter-spacing:-.015em">${T.sample.s}</div></div>
        <div class="row"><span class="tag">Texto</span><div style="max-width:62ch">${T.sample.p}</div></div>
        <div class="row"><span class="tag">Detalle</span><div style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;font-weight:600">${T.sample.l}</div></div>
      </div></div></section>`;

    // 07 lo que no se debe hacer
    const D = C.dont;
    const donts = [
      ['Deformar', 'No estirarlo ni aplastarlo', logo(r, 'primary', C.light, { style: 'max-height:100%;transform:scaleX(1.4) scaleY(.78)' })],
      ['Inclinar', 'Siempre derecho', logo(r, 'primary', C.light, { style: 'max-height:100%;transform:rotate(-16deg)' })],
      ['Cambiar colores', 'Solo con los colores de la marca', logo(r, 'primary', D.wrong, { style: 'max-height:100%' })],
      ['Agregar efectos', 'Sin sombras ni brillos', logo(r, 'primary', C.light, { style: 'max-height:100%;filter:drop-shadow(6px 8px 0 rgba(0,0,0,.35))' })],
      ['Poco contraste', 'Evitar fondos que lo apaguen', logo(r, 'primaryM', mono(D.low), { style: 'max-height:100%' })],
      ['Desarmar', 'No mover ni cambiar sus partes', `<div style="display:grid;gap:6%;justify-items:center;align-content:center;width:100%;height:100%"><div style="width:${D.recompose || 34}%;transform:rotate(12deg)">${logo(r, 'symbol', C.light)}</div><div style="width:80%">${logo(r, 'wordmark', C.light)}</div></div>`],
    ];
    h += `<section class="sec" id="evitar"><div class="wrap">${head('07', 'Lo que no se debe hacer', 'Así la marca se reconoce siempre igual, en cualquier lugar.')}
      <div class="grid g3">${donts.map(([n, d, svg], i) => `<div class="rv"><div class="tile dont" style="background:${i === 4 ? D.lowBg : P.bg2}">${svg}</div><div class="dont-cap"><b>${n}</b><span class="muted">${d}</span></div></div>`).join('')}</div>
      </div></section>`;

    // 08 así se vería
    h += `<section class="sec dark" id="aplicaciones"><div class="wrap">${head('08', 'Así se vería', C.mockIntro)}
      <div class="mocks">${C.mocks.map(([type, span, label, over]) => { const t = { ...C.mock, ...(over || {}) }; return `<div class="mock ${span} rv" style="--surf:${t.surf};--mlbl:${t.lbl || 'rgba(0,0,0,.5)'}"><span class="lbl">${label}</span>${M[type](t)}<div class="light"></div></div>`; }).join('')}</div>
      <p class="small muted" style="margin-top:18px">Imágenes de ejemplo para imaginar la marca en uso. Nombres y textos son ilustrativos.</p>
      </div></section>`;

    // 09 opinión
    h += `<section class="sec" id="opinion"><div class="wrap">${head('09', 'Tu opinión', 'Cuéntanos qué sientes con esta propuesta y envíanoslo por WhatsApp en un toque.')}
      <div class="fb rv"><div><p class="lead">¿Latidos se siente así?</p><p class="muted">“Me gusta el símbolo pero no el color” es justo el tipo de comentario que nos ayuda a definir la dirección final.</p></div>
        <div><div class="react" role="group" aria-label="Reacción">${['💛 Me encanta', '✏️ Con ajustes', '🤔 No me convence'].map((x) => `<button type="button" aria-pressed="false" data-r="${x}">${x}</button>`).join('')}</div>
          <textarea class="note" id="note" placeholder="Lo que más me gusta… lo que cambiaría…"></textarea>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:16px"><button class="btn wa" type="button" id="wa1">Enviar mi opinión por WhatsApp</button><a class="btn ghost" href="index.html#comparativa">Comparar las 3 propuestas →</a></div>
          <div class="saved" id="saved"></div></div></div></div></section>`;

    h += `<div class="wrap"><div class="next">${C.nav.map((n) => `<a href="${n.href}" style="background:${n.bg};color:${n.fg}"><small>${n.small}</small><strong>${n.title}</strong></a>`).join('')}</div>
      <div class="foot"><span>Latidos · Propuesta de identidad</span><span>We Rock Agencia · Octubre 2026</span></div></div>`;

    $('#app').insertAdjacentHTML('beforeend', h);
    wireFeedback(r);
    wireCommon();
  }

  function buildSvg(r, C) {
    const L = LOGOS[r].primary;
    const [, , W, H] = L.box;
    const wb = groupBox(r, 'primary', 'logotipo');
    const X = wb[3] * C.xRatio;
    const m = X * 1.7;
    const G = C.build;
    const xh = wb[1] + wb[3] - X;
    const lines = [
      [wb[1] + wb[3], 'línea base'], [xh, 'altura x'],
    ];
    const sb = LOGOS[r].primary.layers.some((l) => l.g === 'simbolo') ? groupBox(r, 'primary', 'simbolo') : null;
    const fw = (n) => +n.toFixed(2);
    return `<svg class="lg" viewBox="${fw(-m)} ${fw(-m)} ${fw(W + 2 * m)} ${fw(H + 2 * m)}" aria-label="Área de seguridad">
      <rect x="${fw(-X)}" y="${fw(-X)}" width="${fw(W + 2 * X)}" height="${fw(H + 2 * X)}" fill="${G.zone}" stroke="${G.guide}" stroke-width="${fw(W / 600)}" stroke-dasharray="${fw(W / 120)} ${fw(W / 160)}"/>
      <rect x="0" y="0" width="${W}" height="${H}" fill="none" stroke="${G.guide}" stroke-width="${fw(W / 900)}"/>
      <g stroke="${G.guide}" stroke-width="${fw(W / 1100)}" fill="none" opacity=".85">
        ${lines.map(([y]) => `<line x1="${fw(-m)}" y1="${fw(y)}" x2="${fw(W + m)}" y2="${fw(y)}"/>`).join('')}
        <line x1="${fw(W / 2)}" y1="${fw(-m)}" x2="${fw(W / 2)}" y2="${fw(H + m)}" stroke-dasharray="${fw(W / 200)} ${fw(W / 200)}"/>
        ${sb ? `<circle cx="${fw(sb[0] + sb[2] / 2)}" cy="${fw(sb[1] + sb[3] / 2)}" r="${fw(Math.max(sb[2], sb[3]) / 2)}"/>` : ''}
      </g>
      <g style="--l-p:${C.light.p};--l-a:${C.light.a};--l-w:${C.light.w};--l-d:${C.light.d}"><use href="#${r}-primary" width="${W}" height="${H}"/></g>
      ${[[-X, -X], [W, -X], [-X, H], [W, H]].map(([a, b]) => `<rect x="${fw(a)}" y="${fw(b)}" width="${fw(X)}" height="${fw(X)}" fill="${G.mod}"/>`).join('')}
      <rect x="${fw(wb[0] + wb[2] + X * 0.15)}" y="${fw(xh)}" width="${fw(X * 0.12)}" height="${fw(X)}" fill="${G.mod}"/>
    </svg>`;
  }

  // ---------------------------------------------------------------- comportamiento
  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  function wireFeedback(r) {
    const key = `latidos-fb2-${r}`;
    const data = store.get(key) || { r: '', note: '' };
    const btns = document.querySelectorAll('.react button');
    const note = $('#note'), saved = $('#saved');
    const paint = () => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.r === data.r)));
    const save = () => { saved.textContent = store.set(key, data) ? 'Guardado en este dispositivo ✓' : ''; };
    paint(); note.value = data.note || '';
    btns.forEach((b) => b.addEventListener('click', () => { data.r = data.r === b.dataset.r ? '' : b.dataset.r; paint(); save(); }));
    let tm; note.addEventListener('input', () => { data.note = note.value; clearTimeout(tm); tm = setTimeout(save, 350); });
    $('#wa1').addEventListener('click', () => {
      const txt = `*Latidos — ${CUR.kind || 'Opción'} ${CUR.num} · ${CUR.name}*\nReacción: ${data.r || '—'}${data.note ? `\n${data.note}` : ''}`;
      window.open(`https://wa.me/${WA}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
    });
  }
  function toast(msg) {
    let el = $('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('on'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('on'), 1600);
  }
  function wireCommon() {
    const sy = new URLSearchParams(location.search).get('y');
    if (sy && +sy) document.body.style.marginTop = -sy + 'px';
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.rv:not(.in)').forEach((el) => io.observe(el));
    const bar = $('.topbar');
    if (bar) {
      const cover = $('.cover');
      const on = () => {
        const over = !!cover && scrollY < cover.offsetHeight - bar.offsetHeight;
        bar.classList.toggle('solid', scrollY > 8);
        bar.classList.toggle('oncover', over && scrollY > 8);
      };
      on(); addEventListener('scroll', on, { passive: true });
    }
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-copy]');
      if (!b) return;
      navigator.clipboard && navigator.clipboard.writeText(b.dataset.copy).then(() => toast(`${b.dataset.copy} copiado`), () => {});
    });
  }

  window.LAT = { WA, logo, mono, renderRoute, wireCommon, store, toast, onColor, contrast, M };
})();
