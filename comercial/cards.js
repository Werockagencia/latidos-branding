/* Latidos · tarjetas para WhatsApp: ayudaventas (1080×1350) y catálogo (1080×1080).
   window.LATIDOS_CARDS → lista de tarjetas con su HTML, nombre de archivo y mensaje para copiar. */
(function () {
  'use strict';
  const { logo } = window.LAT;
  const D = window.LATIDOS_DATA, ic = window.latIcon, PH = D.photos;
  const R = 'r1';
  const C = { navy: '#0B1B3B', lime: '#C6FF3D', ivory: '#F8F5F0' };
  const dark = { w: C.ivory, a: C.lime, d: C.ivory };
  const two = (n) => String(n).padStart(2, '0');
  const lcList = (a) => a.map((s) => (/^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s)).join(', ');
  const POS = { transporte: '42% 55%', turismo: '50% 70%' };
  const BASE = 'fotos/';

  function waves(fg, acc, n = 6, sw = 13, alpha = 0.16) {
    let p = '';
    for (let i = 0; i < n; i++) {
      const y = 30 + i * 46, hi = i === Math.floor(n / 3);
      p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? acc : fg}" stroke-width="${sw}" stroke-linecap="round" opacity="${hi ? 1 : alpha}"/>`;
    }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">${p}</svg>`;
  }
  const img = (k, style = '') => `<img src="${BASE}${PH[k] || k}.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${POS[k] || 'center'};${style}">`;
  const badge = (k, bg = C.lime, fg = C.navy, s = 96) => `<span style="display:grid;place-items:center;width:${s}px;height:${s}px;border-radius:${s * 0.27}px;background:${bg};color:${fg};padding:${s * 0.2}px;flex:none">${ic(k)}</span>`;
  const foot = (bg = C.lime, fg = C.navy) => `<div style="position:absolute;left:0;right:0;bottom:0;height:120px;background:${bg};color:${fg};display:flex;align-items:center;justify-content:space-between;padding:0 64px;font-family:Manrope;font-weight:800;font-size:30px;letter-spacing:.01em">
      <span style="display:flex;align-items:center;gap:16px"><span style="width:52px;height:52px">${ic('chat')}</span>${D.contact.phones[0]}</span><span style="font-size:24px;letter-spacing:.14em;text-transform:uppercase">Cotiza tu experiencia →</span></div>`;
  const wm = (w = 230) => `<div style="position:absolute;right:64px;top:60px;width:${w}px;z-index:3">${logo(R, 'wordmark', dark)}</div>`;
  const frame = (W, H, bg, inner) => `<div class="card" style="position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${bg};color:${C.ivory};font-family:Manrope">${inner}</div>`;

  const cards = [];
  const msg = {
    intro: `¡Hola! 👋 Te saluda Latidos, experiencias corporativas.\n\nDiseñamos experiencias que conectan personas, fortalecen equipos y generan resultados memorables: integraciones, celebraciones, bienestar, formación y más.\n\n¿Te cuento cómo podemos ayudarte con el próximo encuentro de tu empresa?`,
    proceso: `Nos encargamos de todo, de principio a fin ✨\n\n1. Planeación\n2. Operación\n3. Producción\n4. Ejecución\n5. Seguimiento\n\nTú defines el objetivo; nosotros diseñamos y hacemos vivir la experiencia.`,
    lineas: `Tenemos 11 líneas de servicio para crear la experiencia que tu empresa necesita 👇\n\n${D.lines.map((l) => `${two(l.n)}. ${l.name}`).join('\n')}\n\n¿Cuál te interesa? Te envío el detalle.`,
    objetivos: `Cada experiencia empieza con un para qué 🎯\n\nTe ayudamos con: ${lcList(D.objectives.slice(0, 6))} y mucho más.\n\n¿Qué quieres lograr con tu equipo este año?`,
    cierre: `¡Diseñemos juntos tu próxima experiencia! 🙌\n\n📲 ${D.contact.phones.join(' · ')}\n✉️ ${D.contact.email}\n\nCuéntame la fecha, el número de personas y el objetivo, y te envío una propuesta a la medida.`,
  };

  // ---------------------------------------------------------------- ayudaventas (1080×1350)
  const W = 1080, H = 1350;
  cards.push({ id: 'av-01-presentacion', group: 'av', title: 'Presentación', msg: msg.intro, html: frame(W, H, C.navy, `
    <div style="position:absolute;left:0;right:0;top:0;height:700px">${img('nosotros')}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.92) 0%,rgba(11,27,59,.35) 26%,rgba(11,27,59,.15) 55%,${C.navy})"></i></div>
    <div style="position:absolute;left:0;right:0;top:560px;height:260px">${waves(C.ivory, C.lime)}</div>
    <div style="position:absolute;left:64px;top:64px;width:360px">${logo(R, 'primary', dark)}</div>
    <div style="position:absolute;left:64px;right:64px;top:800px">
      <div style="font-size:24px;letter-spacing:.22em;text-transform:uppercase;font-weight:800;color:${C.lime}">Experiencias corporativas</div>
      <div style="font-family:Sora;font-weight:500;font-size:84px;line-height:.98;letter-spacing:-.04em;margin-top:22px">Diseñamos experiencias que dejan huella.</div>
      <div style="display:flex;gap:16px;margin-top:40px">${['conectar', 'teambuilding', 'estrella'].map((k, i) => `<div style="display:flex;align-items:center;gap:14px;font-size:26px;font-weight:700;line-height:1.15">${badge(k, C.lime, C.navy, 70)}${['Conectamos<br>personas', 'Fortalecemos<br>equipos', 'Creamos<br>recuerdos'][i]}</div>`).join('')}</div>
    </div>${foot()}`) });

  cards.push({ id: 'av-02-como-trabajamos', group: 'av', title: 'Cómo trabajamos', msg: msg.proceso, html: frame(W, H, C.lime, `
    <div style="position:absolute;left:64px;top:64px;width:300px">${logo(R, 'primary', { w: C.navy, a: C.navy, d: C.navy })}</div>
    <div style="position:absolute;left:64px;right:64px;top:250px;color:${C.navy}">
      <div style="font-size:24px;letter-spacing:.22em;text-transform:uppercase;font-weight:800">Soluciones integrales</div>
      <div style="font-family:Sora;font-weight:500;font-size:86px;line-height:.96;letter-spacing:-.04em;margin-top:18px">Más que eventos, creamos experiencias.</div>
    </div>
    <div style="position:absolute;left:64px;right:64px;top:580px;display:grid;gap:14px">${D.process.map(([t, d], i) => `<div style="display:flex;align-items:center;gap:24px;background:${C.navy};border-radius:22px;padding:16px 26px">${badge(D.processIcons[i], C.lime, C.navy, 64)}<div style="flex:1"><div style="font-family:Sora;font-weight:600;font-size:36px;letter-spacing:-.02em">${t}</div><div style="font-size:23px;opacity:.75;margin-top:2px">${d}</div></div><b style="font-family:Sora;font-weight:300;font-size:54px;color:${C.lime}">${two(i + 1)}</b></div>`).join('')}</div>
    ${foot(C.navy, C.lime)}`) });

  cards.push({ id: 'av-03-lineas', group: 'av', title: 'Nuestras 11 líneas', msg: msg.lineas, html: frame(W, H, C.ivory, `
    <div style="position:absolute;right:64px;top:60px;width:230px;z-index:3">${logo(R, 'wordmark', { w: C.navy, a: C.lime })}</div>
    <div style="position:absolute;left:64px;right:64px;top:150px;color:${C.navy}">
      <div style="font-size:24px;letter-spacing:.22em;text-transform:uppercase;font-weight:800;opacity:.6">Líneas de negocio</div>
      <div style="font-family:Sora;font-weight:500;font-size:80px;line-height:.98;letter-spacing:-.04em;margin-top:16px">11 formas de crear una experiencia.</div>
    </div>
    <div style="position:absolute;left:64px;right:64px;top:440px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px">${D.lines.map((l) => `<div style="position:relative;height:174px;border-radius:20px;overflow:hidden">${img(l.id)}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.05),rgba(11,27,59,.9))"></i><div style="position:absolute;left:14px;top:14px">${badge(l.icon, C.lime, C.navy, 50)}</div><div style="position:absolute;left:16px;right:12px;bottom:12px;font-family:Sora;font-weight:600;font-size:23px;line-height:1.1;color:${C.ivory}"><span style="display:block;font-family:Manrope;font-size:16px;letter-spacing:.16em;color:${C.lime}">${two(l.n)}</span>${l.short}</div></div>`).join('')}<div style="height:174px;border-radius:20px;background:${C.navy};display:flex;flex-direction:column;justify-content:space-between;padding:18px">${badge('enlace', C.lime, C.navy, 50)}<div style="font-family:Sora;font-weight:600;font-size:24px;line-height:1.1">¿Cuál te interesa?</div></div></div>
    ${foot()}`) });

  D.lines.forEach((l) => {
    cards.push({ id: `av-${two(l.n + 3)}-${l.id}`, group: 'av', title: l.name, line: l, html: frame(W, H, C.navy, `
      <div style="position:absolute;left:0;right:0;top:0;height:760px">${img(l.id)}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.35),rgba(11,27,59,.05) 30%,rgba(11,27,59,.25) 65%,${C.navy})"></i></div>
      <div style="position:absolute;left:0;right:0;top:620px;height:240px">${waves(C.ivory, C.lime)}</div>
      <div style="position:absolute;left:64px;top:60px;display:flex;align-items:center;gap:20px;z-index:3">${badge(l.icon, C.lime, C.navy, 104)}<span style="font-size:24px;letter-spacing:.2em;font-weight:800;text-transform:uppercase">Línea ${two(l.n)}</span></div>
      ${wm()}
      <div style="position:absolute;left:64px;right:64px;top:780px">
        <div style="font-family:Sora;font-weight:600;font-size:${l.name.length > 24 ? 70 : 84}px;line-height:.98;letter-spacing:-.04em">${l.name}</div>
        <div style="font-family:Sora;font-size:34px;line-height:1.25;letter-spacing:-.015em;margin-top:18px;opacity:.9">${l.line}</div>
        <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:30px">${l.items.slice(0, 6).map((x) => `<span style="display:inline-flex;align-items:center;gap:10px;padding:12px 20px;border-radius:99px;background:rgba(248,245,240,.1);box-shadow:inset 0 0 0 2px rgba(248,245,240,.25);font-size:24px;font-weight:700"><i style="width:10px;height:10px;border-radius:50%;background:${C.lime}"></i>${x}</span>`).join('')}</div>
      </div>${foot()}`),
      msg: `${l.name} ✨\n${l.line}\n\n${l.desc}\n\nIncluye: ${lcList(l.items)}.\n\n¿Te preparo una propuesta a la medida para tu equipo? 📲 ${D.contact.phones[0]}` });
  });

  cards.push({ id: 'av-15-objetivos', group: 'av', title: 'Objetivos que atendemos', msg: msg.objetivos, html: frame(W, H, C.navy, `
    <div style="position:absolute;inset:0">${img('objetivos', 'opacity:.35')}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.75),${C.navy} 45%)"></i></div>
    ${wm()}
    <div style="position:absolute;left:64px;right:64px;top:150px">
      <div style="font-size:24px;letter-spacing:.22em;text-transform:uppercase;font-weight:800;color:${C.lime}">Objetivos que atendemos</div>
      <div style="font-family:Sora;font-weight:500;font-size:80px;line-height:.98;letter-spacing:-.04em;margin-top:16px">Cada experiencia empieza con un para qué.</div>
    </div>
    <div style="position:absolute;left:64px;right:64px;top:520px;display:grid;grid-template-columns:repeat(2,1fr);gap:14px">${D.objectives.map((o, i) => `<div style="display:flex;align-items:center;gap:16px;padding:16px 18px;border-radius:20px;background:rgba(248,245,240,.08);box-shadow:inset 0 0 0 2px rgba(248,245,240,.14);font-family:Sora;font-weight:500;font-size:25px;line-height:1.1">${badge(D.objectiveIcons[i], C.lime, C.navy, 56)}${o}</div>`).join('')}</div>
    ${foot()}`) });

  cards.push({ id: 'av-16-contacto', group: 'av', title: 'Contacto', msg: msg.cierre, html: frame(W, H, C.navy, `
    <div style="position:absolute;inset:0">${img('contacto')}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.55),rgba(11,27,59,.92) 60%)"></i></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:360px">${waves(C.ivory, C.lime)}</div>
    <div style="position:absolute;left:64px;top:64px;width:360px">${logo(R, 'primary', dark)}</div>
    <div style="position:absolute;left:64px;right:64px;top:430px">
      <div style="font-size:24px;letter-spacing:.22em;text-transform:uppercase;font-weight:800;color:${C.lime}">Hablemos</div>
      <div style="font-family:Sora;font-weight:500;font-size:92px;line-height:.96;letter-spacing:-.04em;margin-top:18px">Diseñemos juntos su próxima experiencia.</div>
      <div style="display:grid;gap:18px;margin-top:50px;font-family:Sora;font-weight:500;font-size:40px">${[['chat', D.contact.phones[0]], ['micro', D.contact.phones[1]], ['enlace', D.contact.email]].map(([k, t]) => `<div style="display:flex;align-items:center;gap:20px">${badge(k, C.lime, C.navy, 70)}${t}</div>`).join('')}</div>
    </div>`) });

  // ---------------------------------------------------------------- catálogo WhatsApp Business (1080×1080)
  D.lines.forEach((l) => {
    cards.push({ id: `cat-${two(l.n)}-${l.id}`, group: 'cat', title: l.name, line: l, html: frame(1080, 1080, C.navy, `
      ${img(l.id)}<i style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,27,59,.45) 0%,rgba(11,27,59,0) 28%,rgba(11,27,59,.15) 50%,rgba(11,27,59,.95) 85%)"></i>
      <div style="position:absolute;left:0;right:0;bottom:0;height:110px;opacity:.6">${waves(C.ivory, C.ivory, 4, 12, 0.18)}</div>
      <div style="position:absolute;left:60px;top:56px;display:flex;align-items:center;gap:18px;z-index:3">${badge(l.icon, C.lime, C.navy, 100)}<span style="font-size:24px;letter-spacing:.2em;font-weight:800;text-transform:uppercase">Línea ${two(l.n)}</span></div>
      <div style="position:absolute;right:60px;top:60px;width:230px;z-index:3">${logo(R, 'wordmark', dark)}</div>
      <div style="position:absolute;left:60px;right:60px;bottom:80px;z-index:3">
        <div style="font-family:Sora;font-weight:600;font-size:${l.name.length > 24 ? 72 : 88}px;line-height:.96;letter-spacing:-.04em">${l.name}</div>
        <div style="width:120px;height:8px;border-radius:4px;background:${C.lime};margin-top:26px"></div>
        <div style="font-family:Sora;font-size:34px;line-height:1.25;margin-top:22px;opacity:.92">${l.line}</div>
      </div>`) });
  });

  window.LATIDOS_CARDS = cards;
  window.latLcList = lcList;
})();
