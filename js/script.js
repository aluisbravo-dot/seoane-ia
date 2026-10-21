// =====================================================================
// SCRIPT PRINCIPAL (portal + páginas internas). Cada bloque solo actúa si su sección existe.
// =====================================================================
const $ = id => document.getElementById(id);
const LS = { get: k => { try { return window.localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { window.localStorage.setItem(k, v); } catch (e) {} } };
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
let chatHistory = [], chatFiles = [], chatCarrera = null;

document.addEventListener("DOMContentLoaded", () => {
  // Cada bloque va protegido: si uno falla, los demás siguen funcionando.
  const seguro = f => { try { f(); } catch (e) { console.warn("Error en", f.name, e); } };
  seguro(() => renderCarreras(CARRERAS_DATA));
  seguro(initMascotVoice);
  [initFilters, initSearch, initModal, initChat, initQuiz, initTheme, renderPadres, renderMercado, renderBalotario, registerSW].forEach(seguro);
});

// ---------- Carreras ----------
function renderCarreras(data) {
  const container = $("carreras-grid"); if (!container) return;
  container.innerHTML = "";
  if (!data.length) { container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-muted);">No se encontraron carreras con ese criterio.</p>`; return; }
  data.forEach(c => {
    const card = document.createElement("div");
    card.className = "carrera-card";
    card.innerHTML = `
      <div>
        ${c.imagen ? `<img class="carrera-cover" src="${c.imagen}" alt="Avatar anime representativo de ${c.nombre}" loading="lazy">` : `<div class="carrera-cover-placeholder" aria-label="Ilustración representativa de ${c.nombre}"><i class="fa-solid ${c.icono}"></i></div>`}
        <div class="carrera-char" data-id="${c.id}"></div>
        <h3 class="carrera-title"><i class="fa-solid ${c.icono}"></i> ${c.nombre}</h3>
        <div class="carrera-meta"><span><i class="fa-solid fa-clock"></i> ${c.duracion}</span><span><i class="fa-solid fa-graduation-cap"></i> Gratuito</span></div>
        <p class="carrera-desc">${c.resumen}</p>
      </div>
      <button class="card-btn" onclick="verDetalleCarrera('${c.id}')"><i class="fa-solid fa-circle-info"></i> Ver malla y detalles</button>`;
    container.appendChild(card);
    montarPersonaje(card.querySelector(".carrera-char"), c);
  });
}
function initFilters() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach(btn => btn.addEventListener("click", () => {
    buttons.forEach(b => b.classList.remove("active")); btn.classList.add("active");
    const cat = btn.getAttribute("data-cat");
    renderCarreras(cat === "all" ? CARRERAS_DATA : CARRERAS_DATA.filter(c => c.categoria === cat));
  }));
}
function initSearch() {
  const input = $("search-input"); if (!input) return;
  input.addEventListener("input", e => {
    const term = norm(e.target.value.trim());
    renderCarreras(CARRERAS_DATA.filter(c => norm([c.nombre, c.resumen, c.perfil, c.silabos.unidades.map(u => u.curso + " " + u.enfoque).join(" "), c.campoLaboral.join(" ")].join(" ")).includes(term)));
  });
}

// ---------- Modal de detalle ----------
function initModal() {
  const modal = $("modal-carrera"), closeBtn = $("modal-close");
  if (closeBtn && modal) {
    closeBtn.onclick = () => modal.classList.remove("active");
    window.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("active"); });
  }
}
function verDetalleCarrera(id) {
  const c = CARRERAS_DATA.find(x => x.id === id); if (!c) return;
  const li = (arr, icon, color) => arr.map(x => `<li style="margin:6px 0;"><i class="fa-solid ${icon}" style="color:${color};"></i> ${x}</li>`).join("");
  $("modal-body").innerHTML = `
    <div class="modal-head"><div class="modal-char" id="modal-char"></div>
      <div><h2><i class="fa-solid ${c.icono}"></i> ${c.nombre}</h2>
      <p><strong>Duración:</strong> ${c.duracion} · Instituto público gratuito · Título técnico a nombre de la Nación</p></div></div>
    <hr class="sep">
    <h3>Perfil del egresado</h3><p>${c.perfil}</p>
    <h3 class="mt">Sílabos revisados (${c.silabos.periodo})</h3>
    <ul class="unidades">${c.silabos.unidades.map(u => `<li><span class="tag ${u.tipo}">${u.tipo}</span> <strong>${u.curso}</strong><br><small>${u.enfoque}</small></li>`).join("")}</ul>
    <p class="aviso"><i class="fa-solid fa-circle-info"></i> ${SEMESTRE_PENDIENTE.replace("Pendiente: ", "Otros semestres (I–IV y VI): ")}</p>
    ${c.silabos.nota ? `<p class="aviso"><i class="fa-solid fa-triangle-exclamation"></i> ${c.silabos.nota}</p>` : ""}
    <h3 class="mt">¿Es para ti?</h3>
    <ul>${li(c.ideal, "fa-check-circle", "#10b981")}</ul>
    <ul>${li(c.noIdeal, "fa-circle-xmark", "#f87171")}</ul>
    <h3 class="mt">Campo laboral</h3><ul>${li(c.campoLaboral, "fa-briefcase", "#38bdf8")}</ul>
    <h3 class="mt">La IA en esta carrera</h3><p>${c.guiaPadres.iaTemorOReto}</p>
    <p><small>Herramientas: ${c.herramientasIA.join(" · ")}</small></p>
    <div class="modal-actions">
      <button class="btn btn-primary" onclick="preguntarCarrera('${c.id}')"><i class="fa-solid fa-comments"></i> Preguntar a SeoaneBot sobre esta carrera</button>
      <a class="btn btn-secondary" href="padres.html#${c.id}"><i class="fa-solid fa-people-roof"></i> Guía para padres</a>
    </div>`;
  montarPersonaje($("modal-char"), c);
  $("modal-carrera").classList.add("active");
}
function preguntarCarrera(id) {
  $("modal-carrera").classList.remove("active");
  chatCarrera = CARRERAS_DATA.find(c => c.id === id) || null;
  if ($("chat-carrera")) $("chat-carrera").value = id;
  actualizarAvatarChat();
  if ($("seccion-ia")) { $("seccion-ia").scrollIntoView({ behavior: "smooth" }); $("chat-input").focus(); }
}

// ---------- Chat ----------
function md(t) {
  const parts = String(t).split(/```/);
  return parts.map((p, i) => {
    if (i % 2) return `<pre><code>${esc(p.replace(/^\w*\n/, ""))}</code></pre>`;
    const h = esc(p).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/_([^_\n]+)_/g, "<i>$1</i>").replace(/\*([^*\n]+)\*/g, "<i>$1</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
    return h.split(/\n{2,}/).map(b => {
      const L = b.split("\n");
      if (L.every(l => /^\s*[-*•]\s+/.test(l))) return "<ul>" + L.map(l => `<li>${l.replace(/^\s*[-*•]\s+/, "")}</li>`).join("") + "</ul>";
      if (L.every(l => /^\s*\d+[.)]\s+/.test(l))) return "<ol>" + L.map(l => `<li>${l.replace(/^\s*\d+[.)]\s+/, "")}</li>`).join("") + "</ol>";
      if (/^-{3,}$/.test(b.trim())) return "<hr>";
      return "<p>" + b.replace(/^#+\s*(.+)$/gm, "<b>$1</b>").replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }).join("");
}
function addMsg(html, who) {
  const box = $("chat-box"), d = document.createElement("div");
  d.className = "message " + who; d.innerHTML = html; box.appendChild(d); box.scrollTop = box.scrollHeight; return d;
}
function actualizarAvatarChat() {
  const av = $("chat-avatar"); if (!av) return;
  if (chatCarrera) montarPersonaje(av, chatCarrera);
  else av.innerHTML = '<img src="img/seoaia-mascota.png" alt="Mascota de SeoaIA" class="seoaia-avatar">';
}
async function enviarChat(texto) {
  if (!texto && !chatFiles.length) return;
  const nombres = chatFiles.map(f => f.name);
  addMsg(`<p>${esc(texto || "(archivo adjunto)")}${nombres.length ? "<br>📎 " + nombres.map(esc).join("<br>📎 ") : ""}</p>`, "user");
  chatHistory.push({ role: "user", content: (texto || "Analiza el archivo adjunto.") + (nombres.length ? "\n[Adjuntos: " + nombres.join(", ") + "]" : "") });
  const adj = chatFiles; chatFiles = []; pintarAdjuntos();
  const typing = addMsg("<p>SeoaIA está preparando una respuesta…</p>", "bot"); $("chat-send").disabled = true;
  try {
    const r = await responder({ messages: chatHistory, texto, files: adj, career: chatCarrera, onToken: t => { typing.innerHTML = md(t); $("chat-box").scrollTop = $("chat-box").scrollHeight; } });
    typing.innerHTML = (r.html ? r.text : md(r.text)) + `<small class="via">${r.via}</small>`;
    if ($("voice-read")?.checked) hablarRespuesta(r.text);
    if (/(?:qui[eé]n(?:es)? (?:te )?(?:cre[oó]|desarroll[oó]|program[oó]|diseñ[oó]|hicieron|crearon)|(?:qui[eé]n|cu[aá]les son) (?:son )?(?:tus )?(?:creadores|desarrolladores|autores)|tus creadores|equipo creador|personas que te crearon|qui[eé]n est[aá] detr[aá]s de ti|de d[oó]nde vienes|origen de seoaia)/i.test(texto || "")) mostrarEquipoCreador();
    chatHistory.push({ role: "assistant", content: r.html ? "[imagen generada]" : r.text });
  } catch (e) {
    if (chatHistory.length && chatHistory[chatHistory.length - 1].role === "user") chatHistory.pop();
    typing.innerHTML = `<p role="alert">⚠️ ${esc(e.message || "No se pudo obtener una respuesta de la IA.")}</p>`;
  } finally {
    $("chat-send").disabled = false; $("chat-box").scrollTop = $("chat-box").scrollHeight;
  }
}
function pintarAdjuntos() {
  const c = $("chat-adjuntos"); if (!c) return; c.innerHTML = "";
  chatFiles.forEach((f, i) => { const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = "📎 " + f.name + " ✕"; b.onclick = () => { chatFiles.splice(i, 1); pintarAdjuntos(); }; c.appendChild(b); });
}
let reconocimientoVoz = null;
// Voz del navegador: prioriza voces españolas con nombres habitualmente femeninos.
// La disponibilidad depende del sistema operativo y del navegador del visitante.
function vozEspanolFemenina() {
  if (!("speechSynthesis" in window)) return null;
  const voces = window.speechSynthesis.getVoices() || [];
  const es = voces.filter(v => /^es([_-]|$)/i.test(v.lang || ""));
  const nombresFemeninos = /helena|sabina|laura|monica|mónica|paulina|elena|lucia|lucía|sofia|sofía|carmen|female|femenina|paloma|aria|jenny|ana/i;
  return es.find(v => /^es-PE$/i.test(v.lang) && nombresFemeninos.test(v.name))
    || es.find(v => nombresFemeninos.test(v.name))
    || es.find(v => /^es-PE$/i.test(v.lang))
    || es.find(v => /natural|online|neural/i.test(v.name))
    || es[0] || voces.find(v => /^es/i.test(v.lang || "")) || null;
}
function textoParaVoz(texto) {
  let t = String(texto || "");
  t = t.replace(/```[\s\S]*?```/g, "Se ha omitido un bloque de código.")
       .replace(/`([^`]+)`/g, "$1")
       .replace(/<[^>]*>/g, " ")
       .replace(/https?:\/\/\S+/g, "enlace web")
       .replace(/\b(\d+)\s*[x×]\s*(\d+)\b/gi, "$1 por $2")
       .replace(/\b(\d+)\s*\+\s*(\d+)\b/g, "$1 más $2")
       .replace(/[#*_~>|{}\[\]\\]/g, " ")
       .replace(/\s+/g, " ").trim();
  return t.slice(0, 4500);
}
function hablarRespuesta(texto) {
  const st = $("voice-status");
  if (!("speechSynthesis" in window)) { if (st) st.textContent = "Este navegador no permite leer respuestas en voz alta. Prueba Chrome o Edge."; return; }
  const limpio = textoParaVoz(texto);
  if (!limpio) { if (st) st.textContent = "No hay texto para leer."; return; }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(limpio);
  u.lang = "es-PE"; u.rate = 0.92; u.pitch = 1.12; u.volume = 1;
  const voz = vozEspanolFemenina(); if (voz) u.voice = voz;
  if (st) st.textContent = voz ? "Leyendo con la voz en español disponible…" : "Leyendo con la voz predeterminada del navegador…";
  u.onend = () => { if (st) st.textContent = "Respuesta terminada."; };
  u.onerror = () => { if (st) st.textContent = "No se pudo reproducir la voz. Revisa el volumen del equipo."; };
  window.speechSynthesis.speak(u);
}
function mostrarEquipoCreador() {
  const box = $("chat-box"); if (!box || box.querySelector(".creator-card")) return;
  const d = document.createElement("div"); d.className = "message bot creator-card";
  d.innerHTML = '<div class="creator-inline"><img src="img/creadores-referencia.png" alt="Avatar compartido como imagen de referencia del equipo creador"><div><strong>Equipo creador de SeoaIA</strong><p>Luis Ángel Bravo Tumba · Ángel Raúl Candia Molina · Emanuel Teo De la Cruz Evangelista · Juan Vicente Sueldo Alanzo</p><small>Asesor consignado en la ficha ExpoTec 2026: Dennys Sánchez</small><p>Proyecto: “Implementación de IA en la web del instituto Seoane”. Objetivo general declarado: optimizar las consultas de los estudiantes en un 50%; es una meta propuesta, no un resultado medido.</p></div></div>';
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}
function iniciarVoz() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const st = $("voice-status"), start = $("voice-start"), stop = $("voice-stop");
  if (!SR) { if (st) st.textContent = "Tu navegador no admite dictado por voz. Prueba Chrome o Edge y permite el micrófono."; return; }
  if (reconocimientoVoz) reconocimientoVoz.stop();
  reconocimientoVoz = new SR(); reconocimientoVoz.lang = "es-PE"; reconocimientoVoz.continuous = false; reconocimientoVoz.interimResults = true;
  reconocimientoVoz.onstart = () => { if (st) st.textContent = "Te escucho… habla ahora."; if (start) start.disabled = true; if (stop) stop.disabled = false; };
  reconocimientoVoz.onresult = ev => { let final = "", parcial = ""; for (let i=ev.resultIndex;i<ev.results.length;i++) { const t=ev.results[i][0].transcript; if(ev.results[i].isFinal) final += t; else parcial += t; } if ($("chat-input")) $("chat-input").value = (final || parcial).trim(); if (final.trim()) { const q=final.trim(); $("chat-input").value=""; enviarChat(q); } };
  reconocimientoVoz.onerror = ev => { if (st) st.textContent = ev.error === "not-allowed" ? "Permite el acceso al micrófono en el navegador." : "No pude escuchar bien. Inténtalo otra vez."; };
  reconocimientoVoz.onend = () => { if (start) start.disabled = false; if (stop) stop.disabled = true; if (st && /Te escucho/.test(st.textContent)) st.textContent = "Micrófono listo."; };
  reconocimientoVoz.start();
}

function initMascotVoice() {
 const toggle=$("mascot-voice-toggle"), trigger=$("seoaia-mascot-trigger"), status=$("mascot-voice-status");
 if(!toggle||!trigger)return;
 const key="seoaia-voz-bienvenida", saved=localStorage.getItem(key)==="on";
 const render=on=>{toggle.setAttribute("aria-pressed",String(on));toggle.innerHTML=on?'<i class="fa-solid fa-volume-high"></i> Voz activada':'<i class="fa-solid fa-volume-xmark"></i> Voz desactivada';if(status)status.textContent=on?"Voz activada. Toca el personaje para escuchar la bienvenida.":"Voz desactivada. No se reproducirá audio al tocar el personaje.";};
 render(saved);
 toggle.addEventListener("click",()=>{const on=toggle.getAttribute("aria-pressed")!=="true";localStorage.setItem(key,on?"on":"off");render(on);if(!on&&"speechSynthesis"in window)window.speechSynthesis.cancel();});
 const speak=(text, pitch=1.05)=>{if(toggle.getAttribute("aria-pressed")!=="true"){if(status)status.textContent="Activa primero el botón de voz.";return;}if(!("speechSynthesis"in window)){if(status)status.textContent="Este navegador no admite voz sintética. Prueba Chrome o Edge.";return;}window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="es-PE";u.rate=.92;u.pitch=Math.max(1.08,pitch);u.volume=1;const v=vozEspanolFemenina();if(v)u.voice=v;u.onstart=()=>{if(status)status.textContent="SeoaIA está hablando…";trigger.classList.add("is-speaking");};u.onend=()=>{if(status)status.textContent="Listo. Puedes volver a tocar el personaje.";trigger.classList.remove("is-speaking");};u.onerror=()=>{if(status)status.textContent="No se pudo reproducir la voz. Revisa el sonido del navegador.";trigger.classList.remove("is-speaking");};window.speechSynthesis.speak(u);};
 trigger.addEventListener("click",()=>speak("¡Hola! Te doy la bienvenida a SeoaIA, el asistente académico del Instituto de Educación Superior Tecnológico Público Manuel Seoane Corrales. Puedes explorar las siete carreras, consultar sílabos y hacer preguntas académicas. Pulsa el chat cuando quieras conversar conmigo."));
 document.addEventListener("click",e=>{const av=e.target.closest(".carrera-char, .modal-char");if(!av)return;const c=(window.CARRERAS_DATA||[]).find(x=>x.id===av.dataset.id);if(c)speak("Hola, soy el personaje guía de "+c.nombre+". Pulsa ver malla y detalles para conocer esta carrera.",1.08);});
}

function initChat() {
  const input = $("chat-input"), btn = $("chat-send"); if (!input || !btn) return;
  if ($("voice-start")) $("voice-start").onclick = iniciarVoz;
  if ($("voice-stop")) $("voice-stop").onclick = () => { if (reconocimientoVoz) reconocimientoVoz.stop(); if ("speechSynthesis" in window) window.speechSynthesis.cancel(); };
  if ($("voice-read")) $("voice-read").onchange = e => { if (!e.target.checked && "speechSynthesis" in window) window.speechSynthesis.cancel(); };
  document.querySelectorAll(".chat-suggestions [data-prompt]").forEach(b => b.addEventListener("click", () => { input.value = b.dataset.prompt || ""; input.focus(); }));
  // selector de carrera
  const sel = $("chat-carrera");
  if (sel) {
    sel.innerHTML = `<option value="">Todas las carreras</option>` + CARRERAS_DATA.map(c => `<option value="${c.id}">${c.nombre}</option>`).join("");
    sel.onchange = e => { chatCarrera = CARRERAS_DATA.find(c => c.id === e.target.value) || null; actualizarAvatarChat(); };
  }
  btn.onclick = () => { const v = input.value.trim(); input.value = ""; enviarChat(v); };
  input.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); btn.click(); } };
  // sugerencias
  const chips = $("chat-chips");
  if (chips) ["¿Qué carreras hay?", "¿Cómo postulo?", "¿Le conviene Contabilidad a mi hijo?", "¿Por qué el Perú está en crisis según Ética?", "¿Cómo está el mercado laboral hoy?", "1+1"].forEach(s => {
    const b = document.createElement("button"); b.className = "chip"; b.textContent = s; b.onclick = () => enviarChat(s); chips.appendChild(b);
  });
  // adjuntos
  const file = $("chat-file");
  if (file) file.onchange = async e => {
    for (const f of e.target.files) {
      if (chatFiles.length >= 4) break;
      if (f.size > 4 * 1024 * 1024) { alert(f.name + " pesa más de 4 MB"); continue; }
      if (/^text\/|\.(md|csv|json|txt)$/i.test(f.type + f.name)) chatFiles.push({ name: f.name, kind: "text", data: await f.text() });
      else chatFiles.push({ name: f.name, kind: "b64", media_type: f.type, data: await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result.split(",")[1]); fr.readAsDataURL(f); }) });
    }
    e.target.value = ""; pintarAdjuntos();
  };
  // modo y IA local
  if ($("chat-modo")) $("chat-modo").onchange = e => { IA.modo = e.target.value; };
  if ($("chat-limpiar")) $("chat-limpiar").onclick = () => { chatHistory = []; MOTIVO.esperando = false; MOTIVO.hecho = false; $("chat-box").innerHTML = ""; addMsg(bienvenida(), "bot"); };
  const bajar = $("chat-bajar");
  if (bajar) bajar.onclick = async () => {
    const p = $("chat-prog"); p.hidden = false; bajar.disabled = true;
    try { await cargarLocal($("chat-modelo").value, x => { p.value = x.progress || 0; bajar.textContent = "Descargando… " + Math.round((x.progress || 0) * 100) + "%"; }); addMsg("<p>✅ IA local lista. Ya puedo responder aunque no tengas internet 💻</p>", "bot"); }
    catch (e) { addMsg("<p>No pude activar la IA local: " + esc(e.message) + "</p>", "bot"); }
    p.hidden = true; bajar.disabled = false; bajar.innerHTML = '<i class="fa-solid fa-download"></i> Descargar IA local'; pintaEstado();
  };
  window.addEventListener("online", pintaEstado); window.addEventListener("offline", pintaEstado);
  (typeof fetch === "function" ? fetch(API() + "/api/status") : Promise.reject()).then(async r => {
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
    IA.nube = j.configured === true; IA.proveedores = j.providers || []; IA.error = j.error || null;
  }).catch(() => {
    IA.nube = false; IA.error = "no se pudo consultar el servidor";
  }).finally(pintaEstado);
  const guardado = LS.get("modeloLocal");
  if (guardado && navigator.gpu) { if ($("chat-modelo")) $("chat-modelo").value = guardado; cargarLocal(guardado).then(pintaEstado).catch(() => {}); }
  addMsg(bienvenida(), "bot"); actualizarAvatarChat();
}
const bienvenida = () => "<p>¡Hola! Soy <strong>SeoaneBot</strong>, la inteligencia artificial del IESTP Manuel Seoane Corrales. Puedo hablarte de las <strong>7 carreras</strong> (mallas, empleo, si le conviene a tu hijo/a), de <strong>admisión</strong>, y también de <strong>cualquier otro tema</strong>: tareas, matemáticas, tecnología, ética, cultura general. También puedes adjuntar fotos, PDF o archivos de texto 📎</p>";

// ---------- Test vocacional ----------
let currentQuestionIndex = 0, scoreMap = {};
function initQuiz() {
  const s = $("quiz-start"); if (!s) return;
  s.onclick = () => { currentQuestionIndex = 0; scoreMap = {}; mostrarPreguntaQuiz(); };
}
function mostrarPreguntaQuiz() {
  const c = $("quiz-container");
  if (currentQuestionIndex >= QUIZ_PREGUNTAS.length) return mostrarResultadoQuiz();
  const q = QUIZ_PREGUNTAS[currentQuestionIndex];
  c.innerHTML = `<h3>Pregunta ${currentQuestionIndex + 1} de ${QUIZ_PREGUNTAS.length}</h3>
    <p style="font-size:1.2rem;margin:20px 0;">${q.pregunta}</p>
    <div>${q.opciones.map((o, i) => `<button class="quiz-option-btn" onclick="responderQuiz('${o.carrera}')">${i + 1}. ${o.texto}</button>`).join("")}</div>`;
}
function responderQuiz(id) { scoreMap[id] = (scoreMap[id] || 0) + 1; currentQuestionIndex++; mostrarPreguntaQuiz(); }
function mostrarResultadoQuiz() {
  const orden = Object.entries(scoreMap).sort((a, b) => b[1] - a[1]);
  const top = CARRERAS_DATA.find(c => c.id === (orden[0] || ["dsi"])[0]) || CARRERAS_DATA[0];
  const segunda = orden[1] && orden[1][1] === orden[0][1] ? CARRERAS_DATA.find(c => c.id === orden[1][0]) : null;
  $("quiz-container").innerHTML = `
    <div class="quiz-char" id="quiz-char"></div>
    <h2>¡Resultado de tu Test Vocacional!</h2>
    <p style="margin:12px 0;">Según tus respuestas, la carrera que más encaja contigo es:</p>
    <h3 style="font-size:1.8rem;color:#38bdf8;margin-bottom:10px;">${top.nombre}</h3>
    ${segunda ? `<p style="color:var(--text-muted)">También encajas con: <strong>${segunda.nombre}</strong></p>` : ""}
    <p style="color:var(--text-muted);margin:12px 0 20px;">${top.resumen}</p>
    <button class="btn btn-primary" onclick="verDetalleCarrera('${top.id}')"><i class="fa-solid fa-eye"></i> Ver malla y detalles</button>
    <button class="btn btn-secondary" onclick="initQuizReiniciar()"><i class="fa-solid fa-rotate"></i> Repetir</button>
    <p class="aviso" style="margin-top:14px;">Este test es orientativo: no reemplaza hablar con tu familia ni conocer el instituto.</p>`;
  montarPersonaje($("quiz-char"), top);
}
function initQuizReiniciar() { currentQuestionIndex = 0; scoreMap = {}; mostrarPreguntaQuiz(); }

// ---------- Tema y PWA ----------
function initTheme() {
  const toggle = $("theme-toggle"); if (!toggle) return;
  if (LS.get("tema") === "light") { document.body.setAttribute("data-theme", "light"); toggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; }
  toggle.onclick = () => {
    const light = document.body.getAttribute("data-theme") === "light";
    if (light) { document.body.removeAttribute("data-theme"); toggle.innerHTML = '<i class="fa-solid fa-moon"></i>'; LS.set("tema", "dark"); }
    else { document.body.setAttribute("data-theme", "light"); toggle.innerHTML = '<i class="fa-solid fa-sun"></i>'; LS.set("tema", "light"); }
  };
}
function updateConnectionStatus() {
  const el = document.getElementById("connection-banner"); if (!el) return;
  const online = navigator.onLine;
  el.classList.toggle("is-offline", !online); el.classList.toggle("is-limited", online && !window.SEOANE_API);
  const strong = el.querySelector("strong"), detail = el.querySelector(".connection-detail");
  if (!online) { strong.textContent = "Sin conexión · Modo local"; detail.textContent = "Carreras, guía y respuestas frecuentes disponibles; nube y datos en vivo pausados."; }
  else if (!window.SEOANE_API) { strong.textContent = "Conectado · Respaldo local activo"; detail.textContent = "La IA en la nube depende de la configuración del servidor."; }
  else { strong.textContent = "Conectado · SeoaIA en línea"; detail.textContent = "La disponibilidad de la IA se comprueba al enviar una consulta."; }
}
function registerSW() {
  updateConnectionStatus(); window.addEventListener("online", updateConnectionStatus); window.addEventListener("offline", updateConnectionStatus);
  if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").then(() => { if (navigator.serviceWorker.controller) updateConnectionStatus(); }).catch(err => console.log("SW Error:", err));
}

// ---------- Guía para padres (padres.html) ----------
function renderPadres() {
  const grid = $("padres-carreras-grid"); if (!grid) return;
  grid.innerHTML = CARRERAS_DATA.map(c => `
    <article class="padres-card" id="${c.id}">
      <div class="padres-head"><div class="carrera-char" data-id="${c.id}"></div><div><h3><i class="fa-solid ${c.icono}"></i> ${c.nombre}</h3><p class="mu">${c.resumen}</p></div></div>
      <h4>¿Le conviene a mi hijo/a?</h4><p>${c.guiaPadres.convieneHijo}</p>
      <div class="dos-col"><div><h4>✅ Es para quien…</h4><ul>${c.ideal.map(x => `<li>${x}</li>`).join("")}</ul></div>
      <div><h4>⚠️ Quizá no sea para quien…</h4><ul>${c.noIdeal.map(x => `<li>${x}</li>`).join("")}</ul></div></div>
      <h4>¿Por qué elegirla?</h4><p>${c.guiaPadres.porQueElegir}</p>
      <h4>¿Y la inteligencia artificial?</h4><p>${c.guiaPadres.iaTemorOReto}</p>
      <h4>¿Dónde puede trabajar?</h4><p>${c.guiaPadres.campoExtendido}</p>
      <h4>¿Qué aprende? <small>(sílabos 2025-I, V semestre)</small></h4><p>${c.silabos.unidades.filter(u => u.tipo === "especialidad").map(u => u.curso).join(" · ")}</p>
    </article>`).join("");
  grid.querySelectorAll(".carrera-char").forEach(el => montarPersonaje(el, CARRERAS_DATA.find(c => c.id === el.dataset.id)));
  const faq = $("padres-faq");
  if (faq) faq.innerHTML = PADRES_FAQ.map(f => `<details class="acordeon"><summary>${f.p}</summary><p>${f.r}</p></details>`).join("");
}

// ---------- Mercado laboral (mercado-laboral.html) ----------
function renderMercado() {
  const t = $("mercado-tendencias"); if (!t) return;
  $("mercado-aviso").textContent = MERCADO_GENERAL.aviso;
  t.innerHTML = MERCADO_GENERAL.tendencias.map(x => `<div class="mini-card"><h4>${x.t}</h4><p>${x.d}</p></div>`).join("");
  $("mercado-carreras").innerHTML = CARRERAS_DATA.map(c => `
    <article class="padres-card"><h3><i class="fa-solid ${c.icono}"></i> ${c.nombre}</h3>
    <p>${c.mercado}</p><h4>Puestos posibles</h4><ul>${c.campoLaboral.map(x => `<li>${x}</li>`).join("")}</ul>
    <h4>La IA en esta carrera</h4><ul>${c.herramientasIA.map(x => `<li>${x}</li>`).join("")}</ul></article>`).join("");
  $("mercado-fuentes").innerHTML = MERCADO_GENERAL.fuentes.map(f => `<li><strong>${f.n}:</strong> ${f.d}</li>`).join("");
}

// ---------- Balotario (balotario.html) ----------
function renderBalotario() {
  const cont = $("balotario-lista"); if (!cont) return;
  const nombreCat = { etica: "Ética y realidad nacional", comunicacion: "Comunicación empresarial", empresas: "Organización de empresas", carrera: "Por carrera", ia: "IA y trabajo" };
  let cat = "all", term = "";
  const pintar = () => {
    const lista = BALOTARIO.filter(b => (cat === "all" || b.cat === cat || b.carrera === cat) && (!term || norm(b.p + " " + b.r).includes(term)));
    cont.innerHTML = lista.length ? lista.map(b => `<details class="acordeon"><summary><span class="tag ${b.cat}">${nombreCat[b.cat]}${b.carrera ? " · " + (CARRERAS_DATA.find(c => c.id === b.carrera) || {}).nombre : ""}</span> ${b.p}</summary><div class="resp">${md(b.r)}</div></details>`).join("") : "<p class='mu'>No hay preguntas con ese criterio.</p>";
  };
  const fb = $("balotario-filtros");
  fb.innerHTML = [["all", "Todas"], ["etica", "Ética"], ["comunicacion", "Comunicación"], ["empresas", "Empresas"], ["ia", "IA"], ...CARRERAS_DATA.map(c => [c.id, c.nombre])].map(([k, n]) => `<button class="filter-btn ${k === "all" ? "active" : ""}" data-k="${k}">${n}</button>`).join("");
  fb.querySelectorAll("button").forEach(b => b.onclick = () => { fb.querySelectorAll("button").forEach(x => x.classList.remove("active")); b.classList.add("active"); cat = b.dataset.k; pintar(); });
  $("balotario-buscar").oninput = e => { term = norm(e.target.value.trim()); pintar(); };
  pintar();
}


// Biblioteca documental de sílabos: búsqueda por nombre, carrera, semestre y turno.
(function initSyllabusSearch(){
 const career=document.getElementById('syllabus-career'), semester=document.getElementById('syllabus-semester'), turn=document.getElementById('syllabus-turn'), query=document.getElementById('syllabus-query'), btn=document.getElementById('syllabus-search-btn'), results=document.getElementById('syllabus-results');
 if(!career||!btn||!results) return;
 const names={contabilidad:'Contabilidad', 'desarrollo-sistemas-informacion':'Desarrollo de Sistemas de Información','electricidad-industrial':'Electricidad Industrial / Electrotecnia Industrial','enfermeria-tecnica':'Enfermería Técnica','mecanica-produccion-industrial':'Mecánica de Producción Industrial','mecatronica-automotriz':'Mecatrónica Automotriz','quimica-industrial':'Química Industrial'};
 Object.entries(names).forEach(([v,label])=>{const o=document.createElement('option');o.value=v;o.textContent=label;career.appendChild(o)});
 const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 async function run(){ results.innerHTML='<span class="syllabus-hint">Buscando en la biblioteca…</span>'; const p=new URLSearchParams({q:query.value.trim(),career:career.value,semester:semester.value,turn:turn.value}); let found=[]; try{ if(navigator.onLine){const r=await fetch((window.SEOANE_API||'')+'/api/silabos?'+p.toString()); if(!r.ok) throw new Error('Servidor no disponible'); const d=await r.json(); found=d.results||[];} else { throw new Error('offline'); } }catch(e){ try{const r=await fetch('js/silabos-offline.json'); if(!r.ok) throw e; const all=await r.json(); const normText=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); const q=normText(query.value.trim()); found=all.filter(x=>(!career.value||x.career===career.value)&&(!semester.value||x.semester.toUpperCase()===semester.value.toUpperCase())&&(!turn.value||x.turn===turn.value)&&(!q||normText(x.name+' '+x.career+' '+x.semester+' '+x.turn).includes(q))).slice(0,40); }catch(err){results.innerHTML='<span class="syllabus-hint">No se pudo abrir la biblioteca guardada. Conéctate una vez a Internet y vuelve a intentarlo.</span>';return;} } if(!found.length){results.innerHTML='<span class="syllabus-hint">No hay coincidencias con esos filtros. Prueba otro nombre o semestre.</span>';return;} results.innerHTML=(navigator.onLine?'':'<p class="offline-note">Modo sin conexión: búsqueda por nombre de archivo. Para buscar dentro del contenido del PDF se necesita el servidor.</p>')+found.map(x=>`<div class="syllabus-result"><div><strong>${esc(x.name)}</strong><small>${esc(names[x.career]||x.career)} · Semestre ${esc(x.semester)} · ${esc(x.turn==='DIA'?'Día':x.turn==='NOCHE'?'Noche':x.turn)}</small></div><a href="${esc(x.path)}" target="_blank" rel="noopener">Abrir PDF <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>`).join(''); }
 btn.addEventListener('click',run); query.addEventListener('keydown',e=>{if(e.key==='Enter')run()}); [career,semester,turn].forEach(el=>el.addEventListener('change',()=>{if(query.value.trim())run()}));
})();
