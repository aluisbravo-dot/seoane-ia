// =====================================================================
// SEOANEBOT IA - motor con 3 niveles (elige solo el mejor disponible):
//   1) NUBE   -> servidor (Claude, ChatGPT/OpenAI, Gemini, DeepSeek u otro compatible)
//   2) LOCAL  -> modelo pequeño dentro del navegador (se descarga una vez; luego sin internet)
//   3) BASE   -> conocimiento incluido en la web (siempre funciona, sin internet)
// =====================================================================
const IA = { modo: "auto", motor: null, cargando: false, nube: false, proveedores: [], modelo: null };
const MODELOS = { ligero: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC", mejor: "Qwen2.5-1.5B-Instruct-q4f16_1-MLC" };
const MOTIVO = { esperando: false, hecho: false };
const API = () => (window.SEOANE_API || "").replace(/\/$/, "");

function sysLocal(career) {
  return "Eres SeoaneBot, asistente virtual del IESTP Manuel Seoane Corrales (San Juan de Lurigancho, Lima, Perú), instituto público y gratuito de 3 años con 7 carreras: " +
    CARRERAS_DATA.map(c => c.nombre).join(", ") + ". Responde SIEMPRE en español, claro, amable y breve; puedes hablar de cualquier tema (tareas, matemáticas, tecnología, cultura general, empleo, ética). No inventes fechas, costos ni sueldos del instituto: sugiere seoane.edu.pe." +
    (career ? ` El usuario ve la carrera: ${career.nombre}.` : "");
}

async function cargarLocal(clave, onProg) {
  if (!navigator.gpu) throw new Error("Tu navegador no soporta WebGPU. Usa Chrome o Edge en una PC o laptop reciente.");
  if (IA.cargando) return;
  IA.cargando = true;
  try {
    const webllm = await import("https://esm.run/@mlc-ai/web-llm");
    IA.motor = await webllm.CreateMLCEngine(MODELOS[clave], { initProgressCallback: p => onProg && onProg(p) });
    IA.modelo = clave; try { localStorage.setItem("modeloLocal", clave); } catch (e) {}
  } finally { IA.cargando = false; }
}

async function viaNube({ messages, career, files }) {
  const r = await fetch(API() + "/api/chat", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, career: career ? career.nombre : "", files }) });
  const j = await r.json(); if (!r.ok) throw new Error(j.error || "error de la nube");
  return { text: j.reply, via: "☁️ IA en la nube" + (j.provider ? " (" + j.provider + ")" : "") };
}
async function viaLocal({ messages, career, files, onToken }) {
  let extra = "";
  (files || []).filter(f => f.kind === "text").forEach(f => extra += `\n\nArchivo "${f.name}":\n${f.data.slice(0, 3000)}`);
  const msgs = [{ role: "system", content: sysLocal(career) }, ...messages.slice(-8)];
  if (extra) msgs[msgs.length - 1] = { role: "user", content: msgs[msgs.length - 1].content + extra };
  const stream = await IA.motor.chat.completions.create({ messages: msgs, stream: true, temperature: 0.7, max_tokens: 600 });
  let t = ""; for await (const ch of stream) { t += (ch.choices[0] && ch.choices[0].delta.content) || ""; onToken && onToken(t); }
  return { text: t, via: "💻 IA local (funciona sin internet)" };
}

async function generar(o) {
  const orden = IA.modo === "auto" ? ["nube", "local", "base"] : IA.modo === "base" ? ["base"] : [IA.modo, "base"];
  for (const m of orden) {
    try {
      if (m === "nube" && IA.nube && navigator.onLine) return await viaNube(o);
      if (m === "local" && IA.motor) return await viaLocal(o);
      if (m === "base") return { text: avisoAdjuntos(o.files) + responderBase(o.texto, o.career), via: "📚 Base sin conexión" };
    } catch (e) { console.warn(m, e); }
  }
  return { text: avisoAdjuntos(o.files) + responderBase(o.texto, o.career), via: "📚 Base sin conexión" };
}
const avisoAdjuntos = f => (f && f.some(x => x.kind !== "text")) ? "⚠️ Para **analizar imágenes o PDF** necesito la IA en la nube (con internet y clave). Sin ella solo puedo leer archivos de texto.\n\n" : "";

// ---- Pregunta de orientación: ¿curiosidad, tarea/proyecto o postular? ----
const esTemaInstituto = t => /(carrera|instituto|seoane|admisi|postul|malla|silabo|curso|semestre|matricula|padre|hijo|hija|turno|gratis|dsi|enfermeria|contabilidad|electrotecnia|automotriz|mecanica|quimica)/.test(norm(t));
function respuestaMotivo(texto) {
  const t = norm(texto);
  if (/(postul|ingres|estudiar aqui|quiero entrar|instituto)/.test(t))
    return "¡Excelente decisión! 🎓 El instituto es público y gratuito, con **7 carreras de 3 años**. Haz el **Test Vocacional** para ver cuál va contigo, revisa la malla de la que más te llame la atención y confirma fechas de admisión en seoane.edu.pe. ¿Qué carrera te interesa?";
  if (/(tarea|proyecto|obra|trabajo|colegio|curso|exposicion|informe)/.test(t))
    return "¡Genial, éxitos con tu tarea o proyecto! 📚 Cuéntame de qué trata y te ayudo a entenderlo, a estructurarlo o a practicar con preguntas. También tengo un **Balotario** con preguntas y respuestas de estudio.";
  if (/(curios|personal|por gusto|saber|nada|probando|probar)/.test(t))
    return "¡Qué bueno tener curiosidad por aprender! 💡 Es el primer paso de todo buen técnico. Si quieres, te cuento cómo se aplica ese conocimiento en alguna de las **7 carreras** del instituto.";
  return null; // no era una respuesta al motivo: se contesta normal
}


// ---- Generación de imágenes ("dibuja ...") con un servicio gratuito externo (Pollinations) ----
const PIDE_IMAGEN = /^\s*(dibuja|dibújame|genera (una )?imagen( de)?|crea (una )?imagen( de)?|imagen de)\s+(.+)/i;
const IMG_PROHIBIDO = /(desnud|sexual|porn|erotic|gore|sangre|violaci|suicid|arma|bomba|droga|nazi)/i;
function pedirImagen(texto) {
  const m = texto.match(PIDE_IMAGEN); if (!m) return null;
  const tema = m[6].trim().slice(0, 200);
  if (IMG_PROHIBIDO.test(norm(tema))) return { html: false, text: "No puedo generar imágenes con ese contenido. Prueba con algo educativo: un laboratorio, un taller, un circuito, un logo…", via: "🎨 Imágenes" };
  if (!navigator.onLine) return { html: false, text: "Para generar imágenes necesito internet. Intenta de nuevo cuando estés en línea.", via: "🎨 Imágenes" };
  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(tema + ", digital art, detailed") + "?width=768&height=480&nologo=true";
  const safe = tema.replace(/[<>&"']/g, "");
  return { html: true, text: `<p>🎨 <b>Imagen generada:</b> <i>${safe}</i></p><img class="gen-img" src="${url}" alt="${safe}" loading="lazy"><p><small>Generada con un servicio externo gratuito de IA; puede tardar unos segundos y el resultado varía.</small></p>`, via: "🎨 Generación de imágenes" };
}

async function responder(o) {
  if (MOTIVO.esperando) {
    MOTIVO.esperando = false;
    const r = respuestaMotivo(o.texto);
    if (r) return { text: r, via: "💬 Orientación" };
  }
  const img = pedirImagen(o.texto);
  if (img) {
    if (!MOTIVO.hecho && img.html) { MOTIVO.hecho = true; MOTIVO.esperando = true; img.text += "<p>💬 <i>Pregunta de SeoaneBot:</i> ¿La imagen es por <b>curiosidad</b>, para una <b>tarea/proyecto</b> o piensas <b>postular</b> al instituto?</p>"; }
    return img;
  }
  const res = await generar(o);
  if (!MOTIVO.hecho && !esTemaInstituto(o.texto) && o.messages.length <= 6 && res.text) {
    MOTIVO.hecho = true; MOTIVO.esperando = true;
    res.text += "\n\n💬 *Pregunta de SeoaneBot:* ¿Lo consultas por **curiosidad personal**, para una **tarea/proyecto/obra**, o estás pensando en **postular** al instituto?";
  }
  return res;
}

function pintaEstado() {
  const el = document.getElementById("ia-estado"); if (!el) return;
  const prov = IA.proveedores.length ? " (" + IA.proveedores.join(", ") + ")" : "";
  const n = IA.nube && navigator.onLine ? "☁️ Nube: lista" + prov : "☁️ Nube: no disponible";
  const l = IA.motor ? "💻 Local: lista" : IA.cargando ? "💻 Local: cargando…" : "💻 Local: sin descargar";
  el.innerHTML = `${n} · ${l} · 📚 Base: siempre lista`;
}
