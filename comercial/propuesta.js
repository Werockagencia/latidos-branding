/* Latidos · generador de propuestas comerciales (todo en el navegador; se guarda en localStorage y en archivo .json) */
(function () {
  'use strict';
  const { logo } = window.LAT;
  const D = window.LATIDOS_DATA, ic = window.latIcon, PH = D.photos;
  const R = 'r1', C = { navy: '#0B1B3B', lime: '#C6FF3D', ivory: '#F8F5F0' };
  const dark = { w: C.ivory, a: C.lime, d: C.ivory }, light = { w: C.navy, a: C.lime, d: C.navy };
  const KEY = 'latidos-propuesta-v1';
  const $ = (s) => document.querySelector(s);
  const form = $('#form');
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const money = (n) => '$ ' + Math.round(n || 0).toLocaleString('es-CO');
  const num = (v) => +String(v || '').replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.') || 0;
  const today = new Date();
  const fmtDate = (d) => d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });

  const DEFAULT = () => ({
    cliente: '', contacto: '', cargo: '', evento: '', fecha: '', ciudad: '', personas: '', duracion: '',
    objetivo: D.objectives[0], contexto: '', concepto: '',
    lines: ['catering', 'teambuilding', 'locaciones'],
    agenda: [['8:00 a. m.', 'Llegada y bienvenida'], ['9:00 a. m.', 'Actividad central'], ['1:00 p. m.', 'Almuerzo'], ['3:00 p. m.', 'Cierre y reconocimientos']],
    items: [['Logística y coordinación general', 1, 0], ['Alimentación', 1, 0], ['Actividad de integración', 1, 0]],
    iva: true,
    numero: `LAT-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`,
    validez: fmtDate(new Date(today.getTime() + 30 * 864e5)),
    pago: '50 % para reservar la fecha y 50 % antes del evento.',
    notas: 'Valores en pesos colombianos.\nLa fecha se reserva con el primer pago.\nCambios en número de personas hasta 8 días antes.\nIncluye coordinación en sitio durante todo el evento.',
    asesor: '', tel: D.contact.phones[0],
  });
  const EJEMPLO = { cliente: 'Empresa Ejemplo S.A.S.', contacto: 'Laura Gómez', cargo: 'Directora de Talento Humano', evento: 'Encuentro de fin de año 2026', fecha: '12 de diciembre de 2026', ciudad: 'Hacienda en La Calera', personas: '150', duracion: '1 día · 8 horas', objetivo: 'Celebración de logros', contexto: 'Quieren cerrar el año reconociendo a sus colaboradores y celebrando los logros del equipo, con un espacio para compartir en familia.', concepto: 'Un día para celebrar el año, reconocer a las personas y reconectar al equipo.', lines: ['reconocimiento', 'catering', 'teambuilding', 'locaciones', 'transporte', 'gastronomia'], items: [['Logística y coordinación general', 1, 8500000], ['Alimentación (almuerzo y refrigerios)', 150, 65000], ['Rally de integración', 1, 4200000], ['Transporte ida y regreso', 3, 950000]], asesor: 'Nombre del asesor' };
  let S;
  try { S = { ...DEFAULT(), ...(JSON.parse(localStorage.getItem(KEY) || 'null') || {}) }; } catch (e) { S = DEFAULT(); }
  if (/[?&]ejemplo/.test(location.search)) Object.assign(S, EJEMPLO);

  // ---------------------------------------------------------------- formulario
  form.objetivo.innerHTML = D.objectives.map((o) => `<option>${esc(o)}</option>`).join('');
  form.tel.innerHTML = D.contact.phones.map((p) => `<option>${p}</option>`).join('');
  $('#lines').innerHTML = D.lines.map((l) => `<label><input type="checkbox" value="${l.id}"><span class="ico-w">${ic(l.icon)}</span>${l.name}</label>`).join('');
  $('#lines').querySelectorAll('.ico-w').forEach((e) => { e.firstChild.style.width = '22px'; });

  function fillForm() {
    for (const el of form.elements) {
      if (!el.name) continue;
      if (el.type === 'checkbox') el.checked = !!S[el.name]; else el.value = S[el.name] ?? '';
    }
    $('#lines').querySelectorAll('input').forEach((i) => { i.checked = S.lines.includes(i.value); });
    drawRows();
  }
  function drawRows() {
    $('#agenda').innerHTML = S.agenda.map((r, i) => `<div class="r ag"><input data-g="agenda" data-i="${i}" data-j="0" value="${esc(r[0])}" placeholder="Hora"><input data-g="agenda" data-i="${i}" data-j="1" value="${esc(r[1])}" placeholder="Actividad"><button type="button" class="x" data-del="agenda" data-i="${i}">×</button></div>`).join('');
    $('#items').innerHTML = `<div class="r" style="font-size:10.5px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#5A6475"><span>Concepto</span><span>Cant.</span><span>Valor unit.</span><span></span></div>` + S.items.map((r, i) => `<div class="r"><input data-g="items" data-i="${i}" data-j="0" value="${esc(r[0])}" placeholder="Concepto"><input data-g="items" data-i="${i}" data-j="1" value="${esc(r[1])}" inputmode="numeric"><input data-g="items" data-i="${i}" data-j="2" value="${r[2] ? Math.round(r[2]).toLocaleString('es-CO') : ''}" placeholder="0" inputmode="numeric"><button type="button" class="x" data-del="items" data-i="${i}">×</button></div>`).join('');
  }
  let tm;
  function changed() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); $('#status').textContent = 'Guardado en este navegador ✓'; } catch (e) { $('#status').textContent = 'No se pudo guardar en este navegador: usen “Guardar archivo”.'; }
    clearTimeout(tm); tm = setTimeout(render, 120);
  }
  form.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.g) { const v = t.dataset.g === 'items' && t.dataset.j !== '0' ? num(t.value) : t.value; S[t.dataset.g][+t.dataset.i][+t.dataset.j] = v; }
    else if (t.closest('#lines')) S.lines = [...$('#lines').querySelectorAll('input:checked')].map((i) => i.value);
    else if (t.name) S[t.name] = t.type === 'checkbox' ? t.checked : t.value;
    changed();
  });
  form.addEventListener('change', (e) => { if (e.target.dataset.g === 'items' && e.target.dataset.j === '2') drawRows(); });
  form.addEventListener('click', (e) => {
    const a = e.target.closest('[data-add]'), d = e.target.closest('[data-del]');
    if (a) { S[a.dataset.add].push(a.dataset.add === 'items' ? ['', 1, 0] : ['', '']); drawRows(); changed(); }
    if (d) { S[d.dataset.del].splice(+d.dataset.i, 1); drawRows(); changed(); }
  });
  $('#pdf').addEventListener('click', () => { const t = document.title; document.title = `Propuesta Latidos - ${S.cliente || 'cliente'}`; window.print(); setTimeout(() => (document.title = t), 500); });
  $('#save').addEventListener('click', () => {
    const b = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `Propuesta_Latidos_${(S.cliente || 'cliente').replace(/[^\wáéíóúñ]+/gi, '_')}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $('#open').addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { S = { ...DEFAULT(), ...JSON.parse(await f.text()) }; fillForm(); changed(); $('#status').textContent = `Abierta: ${f.name}`; } catch (err) { $('#status').textContent = 'Ese archivo no es una propuesta válida.'; }
    e.target.value = '';
  });
  $('#reset').addEventListener('click', () => { if (confirm('¿Empezar una propuesta nueva? Se borrará la actual de este navegador (guarden el archivo antes si la necesitan).')) { S = DEFAULT(); fillForm(); changed(); } });

  // ---------------------------------------------------------------- documento
  function waves(n = 6, sw = 13, alpha = 0.15) {
    let p = '';
    for (let i = 0; i < n; i++) { const y = 30 + i * 46, hi = i === Math.floor(n / 3); p += `<path d="M-40 ${y + 30} C 120 ${y + 30}, 160 ${y - 20}, 300 ${y - 20} S 480 ${y + 30}, 640 ${y + 30} S 820 ${y - 20}, 980 ${y - 20}" fill="none" stroke="${hi ? C.lime : C.ivory}" stroke-width="${sw}" stroke-linecap="round" opacity="${hi ? 1 : alpha}"/>`; }
    return `<svg viewBox="0 0 940 340" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%">${p}</svg>`;
  }
  const bd = (k) => `<span class="bd">${ic(k)}</span>`;
  const v = (x, ph) => (x && String(x).trim() ? esc(x) : `<span style="opacity:.45">${ph}</span>`);

  function render() {
    const pages = [];
    const cliente = v(S.cliente, 'Empresa cliente');
    const lines = D.lines.filter((l) => S.lines.includes(l.id));
    const subtotal = S.items.reduce((a, r) => a + num(r[1]) * num(r[2]), 0);
    const iva = S.iva ? subtotal * 0.19 : 0;
    const objIcon = D.objectiveIcons[D.objectives.indexOf(S.objetivo)] || 'estrella';

    // 1 portada
    const cover = lines[0] ? lines[0].id : 'portada';
    pages.push(['navy', '', `<div class="bleed"><img src="fotos/${PH[cover] || cover}.jpg" alt=""><i style="background:linear-gradient(100deg,rgba(11,27,59,.96) 0%,rgba(11,27,59,.8) 50%,rgba(11,27,59,.3) 100%)"></i></div>
      <div class="wv">${waves(6, 12, 0.14)}</div>
      <div class="z" style="flex:1;display:flex;flex-direction:column;justify-content:center;gap:2.2em;padding-bottom:8%">
        <div style="width:30%">${logo(R, 'primary', dark)}</div>
        <div><span class="k">Propuesta comercial · ${esc(S.numero)}</span><h1 style="max-width:16ch">${v(S.evento, 'Nombre del evento')}</h1><p style="font-size:1.3em;margin-top:.8em;opacity:.9">Preparada para <b>${cliente}</b></p></div>
      </div>
      <div class="z" style="display:flex;justify-content:space-between;font-size:.9em;opacity:.85"><span>${fmtDate(today)}</span><span>${D.contact.email} · ${esc(S.tel)}</span></div>`, true]);

    // 2 necesidad
    const facts = [['planeacion', 'Fecha', S.fecha], ['locaciones', 'Lugar', S.ciudad], ['teambuilding', 'Personas', S.personas], ['reloj', 'Duración', S.duracion]];
    pages.push(['', 'Lo que entendimos', `<div class="cols c12">
      <div style="display:flex;flex-direction:column;gap:1em;justify-content:center"><span class="k" style="margin:0">Para ${cliente}${S.contacto ? ` · ${esc(S.contacto)}${S.cargo ? `, ${esc(S.cargo)}` : ''}` : ''}</span><h2 style="margin:0">Lo que entendimos de su encuentro.</h2>
        <div class="objbox">${bd(objIcon)}<span class="k" style="color:var(--lime)">Objetivo principal</span><h3 style="font-size:1.5em">${esc(S.objetivo)}</h3></div></div>
      <div style="display:flex;flex-direction:column;gap:1.2em;justify-content:center">
        <p style="font-size:1.12em">${v(S.contexto, 'Aquí va el contexto que nos compartió el cliente: qué quieren lograr, a quién va dirigido y qué esperan del encuentro.')}</p>
        <div class="facts">${facts.map(([k, t, x]) => `<div class="fact">${bd(k)}<div><small>${t}</small><b>${v(x, 'Por definir')}</b></div></div>`).join('')}</div>
      </div></div>`]);

    // 3 experiencia propuesta
    const shown = lines.slice(0, 6);
    pages.push(['', 'La experiencia', `<span class="k">Nuestra propuesta</span><h2 style="max-width:26ch">${v(S.concepto, 'Una experiencia diseñada para su equipo.')}</h2>
      ${shown.length ? `<div class="lcards" style="--n:${Math.min(3, shown.length)}">${shown.map((l) => `<div class="lcard"><img src="fotos/${PH[l.id]}.jpg" alt=""><i></i><span class="bd">${ic(l.icon)}</span><div><h3>${l.name}</h3><ul>${l.items.slice(0, shown.length > 3 ? 3 : 4).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`).join('')}</div>` : '<p style="opacity:.5">Elijan las líneas de servicio en el formulario.</p>'}`]);

    // 4 agenda
    const ag = S.agenda.filter((r) => r[0] || r[1]);
    if (ag.length) pages.push(['', 'Agenda', `<div class="cols c12"><div style="display:flex;flex-direction:column;justify-content:center"><span class="k">Así se vivirá</span><h2>Agenda del encuentro.</h2><p style="opacity:.75">Un ritmo pensado para que cada momento tenga sentido: la llegada, el punto más alto y el recuerdo que queda.</p></div>
      <div class="agenda" style="align-content:center">${ag.map((r) => `<div><b>${esc(r[0])}</b><span>${esc(r[1])}</span></div>`).join('')}</div></div>`]);

    // 5 inversión
    const rows = S.items.filter((r) => r[0] || num(r[2]));
    pages.push(['', 'Inversión', `<span class="k">Propuesta económica</span><h2>Inversión.</h2>
      <table class="inv"><thead><tr><th>Concepto</th><th class="n">Cantidad</th><th class="n">Valor unitario</th><th class="n">Total</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${esc(r[0])}</td><td class="n">${num(r[1])}</td><td class="n">${money(num(r[2]))}</td><td class="n">${money(num(r[1]) * num(r[2]))}</td></tr>`).join('')}</tbody></table>
      <div class="totals"><div><span>Subtotal</span><span>${money(subtotal)}</span></div>${S.iva ? `<div><span>IVA 19 %</span><span>${money(iva)}</span></div>` : ''}<div class="t"><span>Total</span><span>${money(subtotal + iva)}</span></div></div>`]);

    // 6 condiciones y cierre
    const notas = String(S.notas || '').split('\n').map((x) => x.trim()).filter(Boolean);
    pages.push(['navy', 'Condiciones y próximos pasos', `<div class="wv" style="height:22%">${waves(6, 12, 0.12)}</div><div class="cols c2" style="padding-bottom:6%">
      <div><span class="k">Condiciones</span><div class="conds">${[`Propuesta ${esc(S.numero)}, válida hasta ${esc(S.validez)}.`, `Forma de pago: ${esc(S.pago)}`, ...notas.map(esc)].map((x) => `<div>${x}</div>`).join('')}</div></div>
      <div><span class="k">Próximos pasos</span><div class="steps2">${['Revisan la propuesta y nos cuentan sus ajustes.', 'Confirmamos fecha, número de personas y detalles.', 'Reservamos con el primer pago y empezamos a diseñar.'].map((x, i) => `<div><b>0${i + 1}</b><span>${x}</span></div>`).join('')}</div>
        <div class="sign"><span class="bd">${ic('chat')}</span><div><b style="font-family:Sora">${v(S.asesor, 'Asesor comercial')}</b><br><span style="opacity:.75">${esc(S.tel)} · ${D.contact.email}</span></div></div></div>
      </div><div class="z" style="width:18%">${logo(R, 'primary', dark)}</div>`, true]);

    const T = pages.length;
    $('#doc').innerHTML = pages.map(([cls, title, body, noHead], i) => `<section class="pg ${cls}">${noHead ? '' : `<div class="hd"><span>${title}</span><span>Latidos · Propuesta para ${cliente}</span></div>`}${body}${i === 0 ? '' : `<div class="ft"><span>Latidos · Experiencias corporativas</span><span>${String(i + 1).padStart(2, '0')} / ${String(T).padStart(2, '0')}</span></div>`}</section>`).join('');
  }

  fillForm(); render();
})();
