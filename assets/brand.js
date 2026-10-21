/* Latidos · logo y maquetas para el manual de marca (We Rock) */
(function () {
  'use strict';
  if (/shot/.test(location.search)) document.documentElement.classList.add('shot');
  const LOGOS = window.LATIDOS_LOGOS;
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

  function wireCommon() {
    const sy = new URLSearchParams(location.search).get('y');
    if (sy && +sy) document.body.style.marginTop = -sy + 'px';
  }
  window.LAT = { logo, mono, onColor, contrast, M, wireCommon };
})();
