/* Latidos · Portafolio comercial */
(function () {
  'use strict';
  const { logo } = window.LAT;
  const D = window.LATIDOS_DATA, ic = window.latIcon;
  const R = 'r1';
  const C = { navy: '#0B1B3B', navy2: '#13244A', lime: '#C6FF3D', ivory: '#F8F5F0' };
  const light = { w: C.navy, a: C.lime, d: C.navy }, dark = { w: C.ivory, a: C.lime, d: C.ivory };
  const pages = [];
  const pg = (cls, title, body, o = {}) => pages.push({ cls, title, body, o });

  // ondas de la marca como fondo
  function waves(bg, fg, acc, n = 7, sw = 16, alpha = 0.2) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const y = 30 + i * 46, hi = i === Math.floor(n / 3);
      p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? acc : fg}" stroke-width="${sw}" stroke-linecap="round" opacity="${hi ? 1 : alpha}"/>`;
    }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true"><rect width="940" height="340" fill="${bg}"/>${p}</svg>`;
  }
  const band = (bg, fg, acc, h = '32%', extra = '') => `<div class="wv" style="left:0;right:0;bottom:0;height:${h};${extra}">${waves(bg, fg, acc, 6, 13, 0.16)}</div>`;

  // ---------------------------------------------------------------- 1 portada
  pg('navy', '', `${band(C.navy, C.ivory, C.lime, '44%')}
    <div style="position:relative;z-index:2;flex:1;display:grid;align-content:center;gap:clamp(24px,4vw,44px);padding-bottom:12%">
      <div style="width:min(460px,72%)">${logo(R, 'primary', dark)}</div>
      <div><span class="kicker">Portafolio comercial · 2026</span><h1 class="h1" style="max-width:15ch">${D.claim}.</h1></div>
    </div>
    <div style="position:relative;z-index:2;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px;opacity:.85"><span>${D.contact.email}</span><span>${D.contact.phones.join('  ·  ')}</span></div>`, { noHead: true, noFoot: true });

  // ---------------------------------------------------------------- 2 quiénes somos
  pg('', 'Quiénes somos', `<div class="cols c21">
      <div style="display:flex;flex-direction:column;justify-content:center"><span class="kicker">Quiénes somos</span><h2 class="h1" style="font-size:clamp(34px,4.8vw,64px)">Diseñamos experiencias corporativas que dejan huella.</h2></div>
      <div style="display:flex;flex-direction:column;justify-content:center;gap:16px"><p class="lead">${D.intro}</p><p class="muted">${D.about}</p></div>
    </div>
    <div style="position:relative;height:clamp(70px,10vw,110px);margin-top:16px;border-radius:12px;overflow:hidden">${waves(C.navy, C.ivory, C.lime, 6, 14, 0.16)}</div>`);

  // ---------------------------------------------------------------- 3 propósito y promesa
  pg('navy', 'Propósito y promesa', `<div class="cols c2" style="align-items:center">
      <div><span class="kicker">Nuestro propósito</span><p class="lead" style="font-size:clamp(22px,2.6vw,34px)">${D.purpose}</p></div>
      <div style="border-left:2px solid var(--lime);padding-left:clamp(18px,3vw,36px)"><span class="kicker">Nuestra promesa</span><p class="lead" style="font-size:clamp(20px,2.2vw,28px)">“${D.promise}”</p></div>
    </div>
    <div class="wv" style="right:-6%;bottom:-16%;width:34%;opacity:.07">${logo(R, 'symbolM', { m: C.ivory })}</div>`);

  // ---------------------------------------------------------------- 4 más que eventos
  pg('lime', 'Cómo trabajamos', `<div class="cols c2" style="flex:0 0 auto"><div><span class="kicker">Soluciones integrales para empresas</span><h2 class="h2">Más que eventos, creamos experiencias.</h2></div><p class="lead" style="align-self:end">${D.integral}</p></div>
    <div class="steps">${D.process.map(([t, d], i) => `<div class="step"><b>0${i + 1}</b><div><div class="h3" style="color:var(--ivory)">${t}</div><span>${d}</span></div></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 5 niveles de servicio
  pg('', 'Portafolio de servicios', `<span class="kicker">Portafolio de servicios</span><h2 class="h2">Todo lo que su evento necesita, en un solo aliado.</h2>
    <div class="cols c3" style="margin-top:10px">${D.tiers.map(([t, d, items], i) => `<div class="tier ${['', 'mid', 'top'][i]}"><span class="kicker" style="margin:0;color:inherit;opacity:.7">Servicios</span><div class="h3" style="font-size:clamp(22px,2.2vw,30px)">${t}</div><span style="font-size:14px;opacity:.75">${d}</span><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 6 índice de líneas
  pg('', 'Líneas de negocio', `<div style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;position:relative;z-index:2"><div><span class="kicker">Líneas de negocio</span><h2 class="h2" style="margin:0">11 formas de crear una experiencia.</h2></div><p class="muted" style="max-width:34ch;margin:0">Combínenlas como quieran: diseñamos el plan completo o la pieza que les haga falta.</p></div>
    <div class="lines" style="margin-top:18px">${D.lines.map((l) => `<a href="#linea-${l.id}"><div class="ic">${ic(l.icon)}</div><span>LÍNEA ${String(l.n).padStart(2, '0')}</span><b>${l.name}</b></a>`).join('')}<a class="cta" href="#contacto"><div class="ic" style="color:var(--lime)">${ic('btl').replace(/<path[^>]*\/>/g, '')}<svg viewBox="0 0 48 48" class="ico" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 24h28M28 14l10 10-10 10"/></svg></div><span>HABLEMOS</span><b>Cotiza tu experiencia</b></a></div>`);

  // ---------------------------------------------------------------- 7–17 una página por línea
  const styles = [
    { cls: '', side: C.navy, sfg: C.ivory, sacc: C.lime },
    { cls: 'navy', side: C.lime, sfg: C.navy, sacc: C.navy },
    { cls: 'white', side: C.navy, sfg: C.ivory, sacc: C.lime },
  ];
  D.lines.forEach((l, i) => {
    const S = styles[i % 3];
    const sideInk = S.side === C.lime ? C.navy : C.ivory;
    pg(S.cls, `Línea ${String(l.n).padStart(2, '0')} · ${l.short}`, `<span id="linea-${l.id}"></span><div class="cols c12">
      <div class="ln-side" style="background:${S.side};color:${sideInk}">
        <div class="wv" style="left:0;right:0;bottom:0;height:42%">${waves(S.side, S.sfg, S.sacc, 6, 13, S.side === C.lime ? 0.22 : 0.16)}</div>
        <div style="position:relative;display:flex;justify-content:space-between;align-items:flex-start"><div class="ln-ic">${ic(l.icon)}</div><span style="font-size:10.5px;letter-spacing:.2em;font-weight:700;opacity:.7">LÍNEA</span></div>
        <div class="ln-num" style="position:relative">${String(l.n).padStart(2, '0')}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;justify-content:center">
        <div><h2 class="h2" style="margin-bottom:8px">${l.name}</h2><p class="lead">${l.line}</p></div>
        <p class="muted" style="margin:0;max-width:52ch">${l.desc}</p>
        <div><span class="kicker">Qué incluye</span><div class="chips">${l.items.map((x) => `<span>${x}</span>`).join('')}</div></div>
        <div><span class="kicker">Ideal para</span><div class="goals">${l.goals.map((g) => `<div>${g}</div>`).join('')}</div></div>
      </div></div>`);
  });

  // ---------------------------------------------------------------- 18 objetivos
  pg('navy', 'Objetivos empresariales', `<div style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap;position:relative;z-index:2"><div><span class="kicker">Objetivos que podemos atender</span><h2 class="h2" style="margin:0">Cada experiencia empieza con un para qué.</h2></div><p style="max-width:36ch;margin:0;opacity:.75">Partimos del objetivo de su empresa y diseñamos la experiencia que lo hace posible.</p></div>
    <div class="objs" style="margin-top:18px">${D.objectives.map((o, i) => `<div class="obj"><b>${String(i + 1).padStart(2, '0')}</b><span>${o}</span></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 19 antes, durante, después
  pg('', 'Nuestra promesa', `<span class="kicker">Cada evento tiene un pulso propio</span><h2 class="h2">Antes, durante y después.</h2>
    <div class="moments" style="margin-top:8px">
      <div class="mo"><span class="tg">Antes</span><div class="h3">Diseñamos</div><ul><li>Escuchamos el objetivo y al público.</li><li>Proponemos el concepto y el plan.</li><li>Coordinamos proveedores, lugar y logística.</li></ul></div>
      <div class="mo" style="background:var(--navy);color:var(--ivory);box-shadow:none"><span class="tg" style="color:var(--lime)">Durante</span><div class="h3">Lo hacemos vivir</div><ul><li>Montaje, producción y ambientación.</li><li>Equipo en sitio de principio a fin.</li><li>Cada detalle cuidado para los invitados.</li></ul></div>
      <div class="mo" style="background:var(--lime);box-shadow:none"><span class="tg" style="color:var(--navy)">Después</span><div class="h3">Lo hacemos durar</div><ul><li>Contenido y recordación del encuentro.</li><li>Medición y retroalimentación.</li><li>Ideas para el próximo encuentro.</li></ul></div>
    </div>`);

  // ---------------------------------------------------------------- 20 contacto
  pg('navy', 'Contacto', `<span id="contacto"></span>${band(C.navy, C.ivory, C.lime, '38%')}
    <div class="cols c2" style="align-items:center;padding-bottom:8%">
      <div><span class="kicker">Hablemos</span><h2 class="h1" style="font-size:clamp(34px,4.6vw,62px)">Diseñemos juntos su próxima experiencia.</h2></div>
      <div class="contact">
        <a href="https://wa.me/${D.contact.wa}" target="_blank" rel="noopener"><i>☏</i>${D.contact.phones[0]}</a>
        <a href="tel:+57${D.contact.phones[1].replace(/\s/g, '')}"><i>☏</i>${D.contact.phones[1]}</a>
        <a href="mailto:${D.contact.email}"><i>@</i>${D.contact.email}</a>
        <div class="noprint" style="margin-top:12px"><a class="btn" href="https://wa.me/${D.contact.wa}?text=${encodeURIComponent('Hola Latidos, quiero cotizar una experiencia para mi empresa.')}" target="_blank" rel="noopener" style="font-family:Manrope;font-size:15px">Cotizar por WhatsApp →</a></div>
      </div>
    </div>
    <div style="position:relative;z-index:2;width:min(220px,40%)">${logo(R, 'primary', dark)}</div>`, { noFoot: true });

  // ---------------------------------------------------------------- render
  const TOTAL = pages.length;
  document.getElementById('doc').innerHTML = pages.map((p, i) => `<section class="pg ${p.cls}" id="p${i + 1}">
      ${p.o.noHead ? '' : `<div class="hd"><span>${p.title}</span><span>Latidos · Portafolio comercial</span></div>`}
      ${p.body}
      ${p.o.noFoot ? '' : `<div class="ft"><span>Latidos · Experiencias corporativas</span><span>${String(i + 1).padStart(2, '0')} / ${TOTAL}</span></div>`}
    </section>`).join('');
  document.getElementById('barlogo').innerHTML = logo(R, 'wordmark', dark);
  window.LAT.wireCommon();
})();
