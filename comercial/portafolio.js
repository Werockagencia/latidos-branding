/* Latidos · Portafolio comercial (versión fotográfica) */
(function () {
  'use strict';
  const { logo } = window.LAT;
  const D = window.LATIDOS_DATA, ic = window.latIcon, PH = D.photos;
  const R = 'r1';
  const C = { navy: '#0B1B3B', navy2: '#13244A', lime: '#C6FF3D', ivory: '#F8F5F0' };
  const dark = { w: C.ivory, a: C.lime, d: C.ivory };
  const pages = [];
  const pg = (cls, title, body, o = {}) => pages.push({ cls, title, body, o });
  const two = (n) => String(n).padStart(2, '0');

  function waves(bg, fg, acc, n = 7, sw = 16, alpha = 0.2, transparent) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const y = 30 + i * 46, hi = i === Math.floor(n / 3);
      p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? acc : fg}" stroke-width="${sw}" stroke-linecap="round" opacity="${hi ? 1 : alpha}"/>`;
    }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">${transparent ? '' : `<rect width="940" height="340" fill="${bg}"/>`}${p}</svg>`;
  }
  // foto a sangre con degradado azul para que el texto se lea
  const photo = (k, grad = 'linear-gradient(90deg,rgba(11,27,59,.92) 0%,rgba(11,27,59,.55) 55%,rgba(11,27,59,.15) 100%)', pos = 'center') =>
    `<div class="bleed"><img src="fotos/${PH[k] || k}.jpg" alt="" style="object-position:${pos}"><i style="background:${grad}"></i></div>`;
  const POS = { transporte: '42% 55%', turismo: '50% 70%' };
  const pic = (k, pos = 'center', extra = '') => `<div class="pic" style="${extra}"><img src="fotos/${PH[k] || k}.jpg" alt="" style="object-position:${POS[k] || pos}"></div>`;
  const badge = (k, cls = '') => `<span class="badge ${cls}">${ic(k)}</span>`;

  // ---------------------------------------------------------------- 1 portada
  pg('navy photo', '', `${photo('portada', 'linear-gradient(100deg,rgba(11,27,59,.96) 0%,rgba(11,27,59,.78) 45%,rgba(11,27,59,.25) 100%)')}
    <div class="wv" style="left:0;right:0;bottom:0;height:26%">${waves(C.navy, C.ivory, C.lime, 6, 12, 0.14, true)}</div>
    <div class="z" style="flex:1;display:grid;align-content:center;gap:clamp(22px,4vw,40px);padding-bottom:10%">
      <div style="width:min(420px,70%)">${logo(R, 'primary', dark)}</div>
      <div><span class="kicker">Portafolio comercial · 2026</span><h1 class="h1" style="max-width:14ch">${D.claim}.</h1></div>
      <div class="iconrow">${D.lines.slice(0, 8).map((l) => `<span>${ic(l.icon)}</span>`).join('')}</div>
    </div>
    <div class="z" style="display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-size:13px"><span>${D.contact.email}</span><span>${D.contact.phones.join('  ·  ')}</span></div>`, { noHead: true, noFoot: true });

  // ---------------------------------------------------------------- 2 quiénes somos
  const ATTR = [['conectar', 'Conectamos personas'], ['teambuilding', 'Fortalecemos equipos'], ['estrella', 'Creamos recuerdos']];
  pg('', 'Quiénes somos', `<div class="cols c12">
      ${pic('nosotros', 'center', 'min-height:260px')}
      <div style="display:flex;flex-direction:column;justify-content:center;gap:14px">
        <span class="kicker" style="margin:0">Quiénes somos</span>
        <h2 class="h2" style="margin:0">Diseñamos experiencias corporativas que dejan huella.</h2>
        <p class="muted" style="margin:0">${D.about}</p>
        <div class="attrs">${ATTR.map(([k, t]) => `<div>${badge(k)}<b>${t}</b></div>`).join('')}</div>
      </div></div>`);

  // ---------------------------------------------------------------- 3 propósito y promesa
  pg('navy photo', 'Propósito y promesa', `${photo('proposito', 'linear-gradient(180deg,rgba(11,27,59,.88),rgba(11,27,59,.96))')}
    <div class="cols c2 z" style="align-items:center">
      <div><div class="ptitle">${badge('bandera', 'lime')}<span>Nuestro propósito</span></div><p class="lead" style="font-size:clamp(22px,2.6vw,34px)">${D.purpose}</p></div>
      <div style="border-left:2px solid var(--lime);padding-left:clamp(18px,3vw,36px)"><div class="ptitle">${badge('reloj', 'lime')}<span>Nuestra promesa</span></div><p class="lead" style="font-size:clamp(19px,2.1vw,27px)">“${D.promise}”</p></div>
    </div>`);

  // ---------------------------------------------------------------- 4 más que eventos
  pg('lime', 'Cómo trabajamos', `<div class="cols c21" style="flex:0 0 auto;align-items:end"><div><span class="kicker">Soluciones integrales para empresas</span><h2 class="h2" style="margin:0">Más que eventos, creamos experiencias.</h2></div><p class="lead" style="margin:0;font-size:clamp(16px,1.6vw,20px)">${D.integral}</p></div>
    <div class="steps">${D.process.map(([t, d], i) => `<div class="step"><div style="display:flex;justify-content:space-between;align-items:flex-start">${badge(D.processIcons[i], 'lime')}<b>${two(i + 1)}</b></div><div><div class="h3" style="color:var(--ivory)">${t}</div><span>${d}</span></div></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 18 objetivos
  pg('navy photo', 'Objetivos empresariales', `${photo('objetivos', 'linear-gradient(180deg,rgba(11,27,59,.78),rgba(11,27,59,.95))')}
    <div class="z" style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap"><div><span class="kicker">Objetivos que podemos atender</span><h2 class="h2" style="margin:0">Cada experiencia empieza con un para qué.</h2></div><p style="max-width:36ch;margin:0;opacity:.8">Partimos del objetivo de su empresa y diseñamos la experiencia que lo hace posible.</p></div>
    <div class="objs z" style="margin-top:16px">${D.objectives.map((o, i) => `<div class="obj">${badge(D.objectiveIcons[i], 'lime')}<span>${o}</span></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 5 niveles
  const TI = ['catering', 'gastronomia', 'formacion'];
  pg('', 'Portafolio de servicios', `<div class="cols c12" style="flex:0 0 auto;align-items:end;margin-bottom:14px"><div><h2 class="h2" style="margin:0">Todo lo que su evento necesita, en un solo aliado.</h2></div></div>
    <div class="cols c3">${D.tiers.map(([t, d, items], i) => `<div class="tier ${['', 'mid', 'top'][i]}">${pic(TI[i], 'center', 'height:84px;min-height:0;border-radius:10px;flex:none')}<div style="display:flex;align-items:center;gap:10px;margin-top:4px">${badge(['catering', 'estrella', 'libro'][i], i === 1 ? 'lime' : i === 2 ? 'navy' : '')}<div class="h3" style="font-size:clamp(19px,1.9vw,25px)">${t}</div></div><span style="font-size:13.5px;opacity:.75">${d}</span><ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 6 líneas (mosaico de fotos)
  pg('', 'Líneas de negocio', `<div style="display:flex;justify-content:space-between;align-items:end;gap:20px;flex-wrap:wrap" class="z"><div><h2 class="h2" style="margin:0">11 formas de crear una experiencia.</h2></div><p class="muted" style="max-width:34ch;margin:0">Combínalas a tu medida: diseñamos el plan completo o solo la pieza que te haga falta.</p></div>
    <div class="mosaic">${D.lines.map((l) => `<a href="#linea-${l.id}" class="tile">${pic(l.id)}<i></i><span class="tb">${badge(l.icon, 'lime')}</span><span class="tt"><small>${two(l.n)}</small>${l.name}</span></a>`).join('')}<a href="#contacto" class="tile cta"><span class="tb">${badge('enlace', 'navy')}</span><span class="tt" style="color:var(--navy)"><small>Hablemos</small>Cotiza tu experiencia →</span></a></div>`);

  // ---------------------------------------------------------------- 7–17 una página por línea
  D.lines.forEach((l, i) => {
    const navy = i % 2 === 1;
    pg(navy ? 'navy' : '', `Línea ${two(l.n)} · ${l.short}`, `<span id="linea-${l.id}"></span><div class="cols c11">
      <div class="hero">${pic(l.id)}<i></i>
        <div class="z" style="display:flex;justify-content:space-between;align-items:flex-start">${badge(l.icon, 'lime big')}<span class="kicker" style="color:var(--ivory);opacity:.85;margin:0">Línea</span></div>
        <div class="z ln-num">${two(l.n)}</div>
        <div class="wv" style="left:0;right:0;bottom:0;height:30%">${waves(C.navy, C.ivory, C.lime, 6, 13, 0.16, true)}</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;justify-content:center">
        <div><h2 class="h2" style="margin-bottom:6px">${l.name}</h2><p class="lead" style="margin:0">${l.line}</p></div>
        <p class="muted" style="margin:0;max-width:52ch">${l.desc}</p>
        <div><span class="kicker">Qué incluye</span><div class="chips">${l.items.map((x) => `<span><em></em>${x}</span>`).join('')}</div></div>
        <div><span class="kicker">Ideal para</span><div class="goals">${l.goals.map((g) => `<div>${badge(D.objectiveIcons[D.objectives.indexOf(g)] || 'estrella', navy ? 'ghost-d' : 'ghost')}${g}</div>`).join('')}</div></div>
      </div></div>`);
  });

  // ---------------------------------------------------------------- 19 antes, durante, después
  const MO = [['Antes', 'Diseñamos', 'planeacion', ['Escuchamos el objetivo y al público.', 'Proponemos el concepto y el plan.', 'Coordinamos proveedores, lugar y logística.'], 'proceso'],
    ['Durante', 'Lo hacemos vivir', 'produccion', ['Montaje, producción y ambientación.', 'Equipo en sitio de principio a fin.', 'Cada detalle cuidado para los invitados.'], 'reconocimiento'],
    ['Después', 'Lo hacemos durar', 'seguimiento', ['Contenido y recordación del encuentro.', 'Medición y retroalimentación.', 'Ideas para el próximo encuentro.'], 'teambuilding']];
  pg('', 'Nuestra promesa', `<span class="kicker">Cada evento tiene un pulso propio</span><h2 class="h2">Antes, durante y después.</h2>
    <div class="moments">${MO.map(([tg, t, k, li, ph], i) => `<div class="mo ${['', 'mid', 'top'][i]}">${pic(ph, 'center', 'flex:1;min-height:140px;border-radius:10px')}<div style="display:flex;align-items:center;gap:10px">${badge(k, i === 1 ? 'lime' : i === 2 ? 'navy' : '')}<div><span class="tg">${tg}</span><div class="h3">${t}</div></div></div><ul>${li.map((x) => `<li>${x}</li>`).join('')}</ul></div>`).join('')}</div>`);

  // ---------------------------------------------------------------- 20 contacto
  pg('navy photo', 'Contacto', `<span id="contacto"></span>${photo('contacto', 'linear-gradient(90deg,rgba(11,27,59,.95) 0%,rgba(11,27,59,.75) 60%,rgba(11,27,59,.4) 100%)')}
    <div class="wv" style="left:0;right:0;bottom:0;height:28%">${waves(C.navy, C.ivory, C.lime, 6, 12, 0.14, true)}</div>
    <div class="cols c2 z" style="align-items:center;padding-bottom:8%">
      <div><span class="kicker">Hablemos</span><h2 class="h1" style="font-size:clamp(34px,4.6vw,62px)">Diseñemos juntos su próxima experiencia.</h2></div>
      <div class="contact">
        <a href="https://wa.me/${D.contact.wa}" target="_blank" rel="noopener">${badge('chat', 'lime')}${D.contact.phones[0]}</a>
        <a href="tel:+57${D.contact.phones[1].replace(/\s/g, '')}">${badge('micro', 'lime')}${D.contact.phones[1]}</a>
        <a href="mailto:${D.contact.email}">${badge('enlace', 'lime')}${D.contact.email}</a>
        <div class="noprint" style="margin-top:12px"><a class="btn" href="https://wa.me/${D.contact.wa}?text=${encodeURIComponent('Hola Latidos, quiero cotizar una experiencia para mi empresa.')}" target="_blank" rel="noopener">Cotizar por WhatsApp →</a></div>
      </div>
    </div>
    <div class="z" style="width:min(220px,40%)">${logo(R, 'primary', dark)}</div>`, { noFoot: true });

  // ---------------------------------------------------------------- render
  const TOTAL = pages.length;
  document.getElementById('doc').innerHTML = pages.map((p, i) => `<section class="pg ${p.cls}" id="p${i + 1}">
      ${p.o.noHead ? '' : `<div class="hd"><span>${p.title}</span><span>Latidos · Portafolio comercial</span></div>`}
      ${p.body}
      ${p.o.noFoot ? '' : `<div class="ft"><span>Latidos · Experiencias corporativas</span><span>${two(i + 1)} / ${TOTAL}</span></div>`}
    </section>`).join('');
  document.getElementById('barlogo').innerHTML = logo(R, 'wordmark', dark);
  window.LAT.wireCommon();
})();
