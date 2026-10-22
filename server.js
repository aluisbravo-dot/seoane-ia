// =====================================================================
// SERVIDOR (sin dependencias, solo Node 18+). Sirve la web y conecta la IA.
// Proveedores: Groq (preferido), Claude (Anthropic), ChatGPT (OpenAI),
// Gemini (Google), DeepSeek y APIs compatibles con OpenAI.
// Si uno falla o no tiene saldo, prueba automáticamente con el siguiente.
// =====================================================================
const http = require('http'), fs = require('fs'), path = require('path'), vm = require('vm');
let pdfParse = null; try { pdfParse = require('pdf-parse'); } catch (e) {}
const SYLLABI_DIR = path.join(__dirname, 'documentos', 'silabos');
const pdfTextCache = new Map();
function listarSilabos() { const out=[]; const walk=(dir)=>{ for(const ent of fs.readdirSync(dir,{withFileTypes:true})){ const full=path.join(dir,ent.name); if(ent.isDirectory()) walk(full); else if(ent.name.toLowerCase().endsWith('.pdf')) { const rel=path.relative(__dirname,full).split(path.sep).join('/'); const parts=path.relative(SYLLABI_DIR,full).split(path.sep); out.push({career:parts[0]||'',semester:parts[1]||'',turn:parts[2]||'',name:ent.name,path:'/'+rel,bytes:fs.statSync(full).size}); } } }; if(fs.existsSync(SYLLABI_DIR)) walk(SYLLABI_DIR); return out; }
const silabos = listarSilabos();
const QUIZ_TOPICS = ['Perú y ciudadanía', 'Ciencia y ambiente', 'Tecnología y cultura', 'Historia y geografía', 'Matemática y lógica', 'Comunicación', 'Ética y convivencia', 'Carreras técnicas'];
const quizCache = new Map(), quizRequests = new Map();
const QUIZ_CACHE_MS = 6 * 60 * 60 * 1000;
async function textoPdf(item){ if(!pdfParse) return ''; if(pdfTextCache.has(item.path)) return pdfTextCache.get(item.path); try { const b=fs.readFileSync(path.join(__dirname,item.path)); const d=await pdfParse(b); const t=(d.text||'').slice(0,18000); pdfTextCache.set(item.path,t); return t; } catch(e){ return ''; } }
async function buscarSilabos(q,career,semester,turn,withText=false){ const aliases={'Desarrollo de Sistemas de Información':'desarrollo-sistemas-informacion','Enfermería Técnica':'enfermeria-tecnica','Contabilidad':'contabilidad','Electricidad Industrial / Electrotecnia Industrial':'electricidad-industrial','Electricidad Industrial':'electricidad-industrial','Electrotecnia Industrial':'electricidad-industrial','Mecatrónica Automotriz':'mecatronica-automotriz','Mecánica de Producción Industrial':'mecanica-produccion-industrial','Química Industrial':'quimica-industrial'}; career=aliases[career]||career; let arr=silabos.filter(x=>(!career||x.career===career)&&(!semester||x.semester.toUpperCase()===semester.toUpperCase())&&(!turn||x.turn.toUpperCase()===turn.toUpperCase())); const terms=(q||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/).filter(Boolean); if(terms.length){ const scored=[]; const candidates=withText?arr.slice(0,70):arr; for(const x of candidates){ const base=(x.name+' '+x.career+' '+x.semester+' '+x.turn).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); let score=terms.reduce((n,t)=>n+(base.includes(t)?2:0),0); let excerpt=''; if(withText&&pdfParse&&score<terms.length*2&&scored.length<12){ excerpt=await textoPdf(x); const body=excerpt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); score+=terms.reduce((n,t)=>n+(body.includes(t)?1:0),0); } if(score>0) scored.push({...x,score,excerpt:withText?excerpt.slice(0,700):undefined}); } scored.sort((a,b)=>b.score-a.score); arr=scored; } else arr=arr.map(x=>({...x,score:0})); return arr.slice(0,40); }

// ---- .env ----
try {
  fs.readFileSync(path.join(__dirname, '.env'), 'utf8').split(/\r?\n/).forEach(l => {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  });
} catch (e) {}
const E = process.env, PORT = E.PORT || 3000;
const real = v => v && !/^pega_|^tu_clave|^xxx/i.test(v);

// ---- proveedores ----
const PROVEEDORES = {
  groq:      { nombre: 'Groq', ok: () => real(E.GROQ_API_KEY), llamar: llamarGroq },
  anthropic: { nombre: 'Claude', ok: () => real(E.ANTHROPIC_API_KEY), llamar: llamarAnthropic },
  openai:    { nombre: 'ChatGPT', ok: () => real(E.OPENAI_API_KEY), llamar: (a) => llamarOpenAI(a, 'https://api.openai.com/v1', E.OPENAI_API_KEY, E.OPENAI_MODEL || 'gpt-4o-mini', true) },
  gemini:    { nombre: 'Gemini', ok: () => real(E.GEMINI_API_KEY), llamar: llamarGemini },
  deepseek:  { nombre: 'DeepSeek', ok: () => real(E.DEEPSEEK_API_KEY), llamar: (a) => llamarOpenAI(a, 'https://api.deepseek.com', E.DEEPSEEK_API_KEY, E.DEEPSEEK_MODEL || 'deepseek-chat', false) },
  custom:    { nombre: E.CUSTOM_NAME || 'Otro', ok: () => !!E.CUSTOM_BASE_URL && !!E.CUSTOM_MODEL, llamar: (a) => llamarOpenAI(a, E.CUSTOM_BASE_URL, E.CUSTOM_API_KEY || 'sin-clave', E.CUSTOM_MODEL, false) }
};
const ORDEN = (E.PROVIDER_ORDER || 'groq').split(',').map(s => s.trim()).filter(s => PROVEEDORES[s]);
const disponibles = () => ORDEN.filter(p => PROVEEDORES[p].ok());

// ---- conocimiento del instituto (se lee de js/carreras.js: una sola fuente de datos) ----
function conocimiento() {
  try {
    const code = fs.readFileSync(path.join(__dirname, 'js', 'carreras.js'), 'utf8') + '\n;({INSTITUTO, CARRERAS_DATA, PADRES_FAQ})';
    const d = vm.runInNewContext(code);
    return 'CARRERAS Y SÍLABOS (V semestre 2025-I, turno noche):\n' + d.CARRERAS_DATA.map(c =>
      `## ${c.nombre}\nResumen: ${c.resumen}\nPerfil: ${c.perfil}\nCursos: ${c.silabos.unidades.map(u => `${u.curso} (${u.enfoque})`).join('; ')}\nCampo laboral: ${c.campoLaboral.join(', ')}\nIA en la carrera: ${c.guiaPadres.iaTemorOReto}\nEs para quien: ${c.ideal.join(' ')}\nNo es para quien: ${c.noIdeal.join(' ')}` + (c.silabos.nota ? `\nNota: ${c.silabos.nota}` : '')
    ).join('\n\n') + '\n\nPREGUNTAS DE PADRES:\n' + d.PADRES_FAQ.map(f => `- ${f.p} ${f.r}`).join('\n');
  } catch (e) { return ''; }
}
const SYSTEM = () => `Eres "SeoaIA", el asistente virtual con IA del IESTP Manuel Seoane Corrales (San Juan de Lurigancho, Lima, Perú).
Hablas en español peruano claro, cercano y respetuoso. Atiendes a postulantes, estudiantes, padres de familia, docentes y jurados de ferias tecnológicas. Eres conversacional: adapta la respuesta a la pregunta exacta, no repitas una presentación fija ni respondas solo temas curriculares.
IDENTIDAD Y ORIGEN DEL PROYECTO: SeoaIA es un asistente creado como proyecto innovador tecnológico para la XXVIII ExpoTec – III Feria Empresarial 2026 del IESTP Manuel Seoane Corrales. El proyecto se titula “Implementación de IA en la web del instituto Seoane”. Su objetivo general declarado por el equipo es optimizar las consultas de los estudiantes en un 50%; es una meta del proyecto, no un resultado ya demostrado. Objetivos específicos: informar sobre las 7 carreras, la admisión y los requisitos mediante un asistente disponible también sin internet; responder consultas académicas y de orientación vocacional; reducir consultas repetitivas en secretaría. La descripción del proyecto incluye mostrar carreras, recursos y campo laboral, una guía para padres, un test vocacional, análisis de imágenes y archivos y respuestas rápidas sin conexión.
Si preguntan quiénes desarrollaron el proyecto, menciona con respeto los nombres escritos en la ficha de inscripción: Luis Ángel Bravo Tumba, Ángel Raúl Candia Molina, Emanuel Teo De la Cruz Evangelista y Juan Vicente Sueldo Alanzo. La ficha indica como asesor a Dennys Sánchez. No inventes cargos individuales ni afirmes que una persona hizo una parte específica si no está documentado. Si preguntan cómo fuiste creada, explica que eres una aplicación web que integra interfaz HTML/CSS/JavaScript, un servidor Node.js y proveedores de IA configurables; también puede incluir respuestas desde una base de conocimiento y un modelo local compatible. Aclara que las capacidades concretas dependen de la versión desplegada y de las claves/servicios configurados. No afirmes que tú misma entrenaste un modelo desde cero.
PRIVACIDAD: no asegures que guardar información es completamente seguro. Explica que no deben compartirse contraseñas, datos bancarios ni datos sensibles; el almacenamiento, retención y acceso dependen de la configuración y política publicada. No digas que recuerdas a un estudiante matriculado ni que consultas notas o registros institucionales salvo que exista autenticación e integración autorizada comprobable. El modo público puede atender sin iniciar sesión; la memoria personal requiere cuenta y consentimiento.
PUEDES RESPONDER CUALQUIER TEMA (tareas, matemáticas desde 1+1, programación, ciencias, historia, ética, redacción, CV, entrevistas, tecnología, cultura general, consejos): da respuestas correctas, completas y bien ordenadas (listas o pasos cuando ayuden). Si te adjuntan un archivo o imagen, analízalo. Para preguntas simples responde breve.
SOBRE EL INSTITUTO (verificado): instituto público, formación gratuita de 3 años (6 semestres), título técnico a nombre de la Nación, turnos diurno y nocturno, ubicado en la Av. Fernando Wiesse cdra. 44 cerca de la estación Bayóvar (Metro Línea 1). Web oficial: seoane.edu.pe. Siete carreras: Desarrollo de Sistemas de Información, Enfermería Técnica, Contabilidad, Electricidad Industrial (denominación por confirmar frente a Electrotecnia Industrial), Mecatrónica Automotriz, Mecánica de Producción Industrial y Química Industrial.
REGLAS: (1) Para preguntas de sílabos, usa los resultados recuperados de los PDF adjuntos al contexto. El repositorio contiene archivos recibidos para I, III y V de varias carreras; no afirmes que hay sílabos de II, IV o VI si no aparece un documento. Si no hay un resultado recuperado, dilo con claridad. (2) NO inventes fechas de admisión, vacantes, costos, teléfonos, correos ni sueldos exactos: si no lo sabes, dilo y envía a seoane.edu.pe o secretaría. (3) Con padres: sé honesto sobre para quién sirve y para quién no una carrera; no presiones. (4) Mercado laboral e IA: habla de tendencias, sin cifras inventadas; sugiere INEI, MTPE y bolsas de empleo. (5) Ética y realidad del Perú: da una explicación equilibrada de causas (corrupción, instituciones débiles, informalidad, desigualdad, educación cívica) sin posición partidaria. (6) Si alguien parece en crisis emocional, responde con empatía y sugiere la Línea 113 (opción 5) en Perú o hablar con alguien de confianza. (7) No ayudes a hacer daño ni a copiar exámenes; sí a aprender.
${conocimiento()}`;

// ---- llamadas ----
async function post(url, headers, body) {
  let r;
  try {
    r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body), signal: AbortSignal.timeout(Number(E.AI_TIMEOUT_MS) || 45000) });
  } catch (e) {
    if (e.name === 'TimeoutError' || e.name === 'AbortError') throw new Error('Tiempo de espera agotado al comunicarse con el proveedor de IA.');
    if (e instanceof TypeError) throw new Error('No se pudo establecer conexión con el proveedor de IA. Comprueba la conexión del servidor.');
    throw e;
  }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const error = new Error((j.error && (j.error.message || j.error)) || ('HTTP ' + r.status));
    error.status = r.status;
    throw error;
  }
  return j;
}
const NOTA_ADJ = f => ({ type: 'text', text: `[No puedo leer el adjunto "${f.name}" con este modelo]` });

async function llamarAnthropic({ system, msgs, files }) {
  const m = msgs.map(x => ({ ...x }));
  const last = m[m.length - 1];
  if (last && last.role === 'user' && files.length) {
    const b = [];
    for (const f of files) {
      if (f.kind === 'text') b.push({ type: 'text', text: `Archivo "${f.name}":\n${f.data}` });
      else if (/^image\/(jpeg|png|gif|webp)$/.test(f.media_type)) b.push({ type: 'image', source: { type: 'base64', media_type: f.media_type, data: f.data } });
      else if (f.media_type === 'application/pdf') b.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: f.data } });
    }
    last.content = [...b, { type: 'text', text: last.content }];
  }
  const j = await post('https://api.anthropic.com/v1/messages', { 'x-api-key': E.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    { model: E.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 1800, system, messages: m });
  return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n');
}
async function llamarOpenAI({ system, msgs, files }, base, key, model, vision) {
  const m = [{ role: 'system', content: system }, ...msgs.map(x => ({ ...x }))];
  const last = m[m.length - 1];
  if (last.role === 'user' && files.length) {
    const b = [];
    for (const f of files) {
      if (f.kind === 'text') b.push({ type: 'text', text: `Archivo "${f.name}":\n${f.data}` });
      else if (vision && /^image\//.test(f.media_type)) b.push({ type: 'image_url', image_url: { url: `data:${f.media_type};base64,${f.data}` } });
      else b.push(NOTA_ADJ(f));
    }
    last.content = [...b, { type: 'text', text: last.content }];
  }
  const j = await post(base.replace(/\/$/, '') + '/chat/completions', { authorization: 'Bearer ' + key }, { model, messages: m, max_tokens: 1800 });
  return j.choices?.[0]?.message?.content || '';
}
async function llamarGroq(args) {
  const model = E.GROQ_MODEL || 'openai/gpt-oss-120b';
  try {
    return await llamarOpenAI(args, 'https://api.groq.com/openai/v1', E.GROQ_API_KEY, model, false);
  } catch (e) {
    if (e.status === 401 || e.status === 403) throw new Error('Groq rechazó GROQ_API_KEY. Revisa que la clave del servidor sea válida y tenga acceso a GroqCloud.');
    if (e.status === 429) throw new Error('Groq alcanzó un límite de solicitudes o de uso. Revisa los límites y la cuota de tu cuenta e inténtalo más tarde.');
    if (e.status === 400 && /model/i.test(e.message)) throw new Error(`Groq no acepta el modelo "${model}". Revisa los modelos habilitados para tu cuenta en https://api.groq.com/openai/v1/models y configura GROQ_MODEL.`);
    throw new Error(`Groq no pudo completar la solicitud${e.status ? ` (HTTP ${e.status})` : ''}: ${e.message}`);
  }
}
async function llamarGemini({ system, msgs, files }) {
  const contents = msgs.map(x => ({ role: x.role === 'assistant' ? 'model' : 'user', parts: [{ text: x.content }] }));
  const last = contents[contents.length - 1];
  if (last.role === 'user') for (const f of files) {
    if (f.kind === 'text') last.parts.unshift({ text: `Archivo "${f.name}":\n${f.data}` });
    else last.parts.unshift({ inlineData: { mimeType: f.media_type, data: f.data } });
  }
  const model = E.GEMINI_MODEL || 'gemini-3.8-flash';
  const j = await post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, { 'x-goog-api-key': E.GEMINI_API_KEY },
    { systemInstruction: { parts: [{ text: system }] }, contents });
  return ((j.candidates && j.candidates[0] && j.candidates[0].content.parts) || []).map(p => p.text || '').join('\n');
}

// ---- límite simple por IP: 25 mensajes cada 10 min ----
const usos = new Map();
const limite = ip => { const n = Date.now(), a = (usos.get(ip) || []).filter(t => n - t < 600000); a.push(n); usos.set(ip, a); return a.length > 25; };
const limiteQuiz = ip => { const n = Date.now(), key = `quiz:${ip}`, a = (usos.get(key) || []).filter(t => n - t < 600000); if (a.length >= 4) { usos.set(key, a); return true; } a.push(n); usos.set(key, a); return false; };
const limiteImagen = ip => { const n = Date.now(), key = `image:${ip}`, a = (usos.get(key) || []).filter(t => n - t < 600000); if (a.length >= 5) { usos.set(key, a); return true; } a.push(n); usos.set(key, a); return false; };

function json(res, code, obj) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); }

const IMAGE_BLOCKED = /(desnud|sexual|porn|erotic|gore|sangre|violaci|suicid|autolesi|nazi|abuso sexual)/i;
function imagenConfigurada() {
  const provider = (E.IMAGE_PROVIDER || 'pollinations').toLowerCase();
  return { provider, configured: provider === 'openai' ? real(E.OPENAI_API_KEY) : provider === 'gemini' ? real(E.GEMINI_API_KEY) : provider === 'pollinations' };
}
function imagenDataUrl(mime, bytes) {
  if (!/^image\/(?:png|jpeg|webp)$/.test(mime) || !bytes.length || bytes.length > 8 * 1024 * 1024) throw new Error('El proveedor devolvió una imagen no válida o demasiado grande.');
  return `data:${mime};base64,${bytes.toString('base64')}`;
}
async function generarImagen(prompt) {
  const { provider, configured } = imagenConfigurada();
  if (!['openai', 'gemini', 'pollinations'].includes(provider)) throw new Error('IMAGE_PROVIDER debe ser openai, gemini o pollinations.');
  if (!configured) throw new Error(`Configura la clave del proveedor ${provider} en el servidor.`);
  const signal = AbortSignal.timeout(Number(E.IMAGE_TIMEOUT_MS) || 120000);
  if (provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST', headers: { authorization: `Bearer ${E.OPENAI_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ model: E.OPENAI_IMAGE_MODEL || 'gpt-image-1', prompt, size: '1024x1024' }), signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error?.message || `OpenAI respondió HTTP ${response.status}.`);
    const encoded = result.data?.[0]?.b64_json;
    if (typeof encoded !== 'string') throw new Error('OpenAI no devolvió los datos de la imagen.');
    return { image: imagenDataUrl('image/png', Buffer.from(encoded, 'base64')), provider: 'OpenAI' };
  }
  if (provider === 'gemini') {
    const model = E.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation';
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST', headers: { 'x-goog-api-key': E.GEMINI_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: `Genera una imagen original basada en esta solicitud: ${prompt}` }] }], generationConfig: { responseModalities: ['TEXT', 'IMAGE'] } }), signal
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error?.message || `Gemini respondió HTTP ${response.status}.`);
    const part = result.candidates?.flatMap(candidate => candidate.content?.parts || []).find(item => item.inlineData?.data);
    if (!part) throw new Error('Gemini no devolvió datos de imagen. Verifica que el modelo configurado admita generación de imágenes.');
    return { image: imagenDataUrl(part.inlineData.mimeType || 'image/png', Buffer.from(part.inlineData.data, 'base64')), provider: 'Gemini' };
  }
  if (provider === 'pollinations') {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Pollinations respondió HTTP ${response.status}.`);
    const mime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    const length = Number(response.headers.get('content-length') || 0);
    if (length > 8 * 1024 * 1024) throw new Error('La imagen generada supera el tamaño permitido.');
    return { image: imagenDataUrl(mime, Buffer.from(await response.arrayBuffer())), provider: 'Pollinations' };
  }
}
async function images(req, res) {
  let body = '';
  for await (const chunk of req) { body += chunk; if (body.length > 5000) return json(res, 413, { error: 'La descripción de la imagen es demasiado larga.' }); }
  let data;
  try { data = JSON.parse(body); } catch { return json(res, 400, { error: 'JSON inválido.' }); }
  if (typeof data.prompt !== 'string' || !data.prompt.trim() || data.prompt.length > 1000) return json(res, 400, { error: 'Escribe una descripción de imagen de hasta 1000 caracteres.' });
  if (IMAGE_BLOCKED.test(data.prompt)) return json(res, 400, { error: 'No puedo generar imágenes con ese contenido. Prueba con una idea segura, educativa o creativa.' });
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (limiteImagen(ip)) return json(res, 429, { error: 'Alcanzaste el límite temporal de generación de imágenes. Inténtalo más tarde.' });
  try { return json(res, 200, await generarImagen(data.prompt.trim())); }
  catch (e) { console.warn('Falló la generación de imágenes:', e.message); return json(res, 502, { error: e.message || 'No se pudo generar la imagen.' }); }
}

function validarPreguntasQuiz(texto, tema) {
  const contenido = texto.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  const datos = JSON.parse(contenido);
  if (!Array.isArray(datos) || datos.length !== 5) throw new Error('La IA no devolvió cinco preguntas válidas.');
  const preguntas = datos.map(q => {
    if (!q || typeof q.pregunta !== 'string' || q.pregunta.length < 8 || q.pregunta.length > 300 ||
      !Array.isArray(q.opciones) || q.opciones.length !== 4 ||
      q.opciones.some(o => typeof o !== 'string' || !o.trim() || o.length > 180) ||
      !Number.isInteger(q.correcta) || q.correcta < 0 || q.correcta > 3 ||
      typeof q.explicacion !== 'string' || !q.explicacion.trim() || q.explicacion.length > 600) {
      throw new Error('La IA devolvió una pregunta con formato inválido.');
    }
    return { tema, pregunta: q.pregunta.trim(), opciones: q.opciones.map(o => o.trim()), correcta: q.correcta, explicacion: q.explicacion.trim() };
  });
  if (new Set(preguntas.map(q => q.pregunta.toLocaleLowerCase())).size !== preguntas.length) throw new Error('La IA devolvió preguntas repetidas.');
  return preguntas;
}
async function generarPreguntasQuiz(tema) {
  const cached = quizCache.get(tema);
  if (cached && Date.now() - cached.generatedAt < QUIZ_CACHE_MS) return { ...cached, cached: true };
  if (quizRequests.has(tema)) return quizRequests.get(tema);
  const pending = (async () => {
    const stale = cached;
    const providers = disponibles();
    if (!providers.length) throw new Error('No hay proveedor de IA configurado en el servidor.');
    const prompt = `Crea exactamente cinco preguntas educativas de opción múltiple sobre "${tema}". Cada pregunta debe tener cuatro opciones, una única respuesta correcta y una explicación breve y comprobable. Evita datos de actualidad, fechas o autoridades que cambien; no inventes fuentes ni presentes contenido como oficial. Devuelve únicamente un arreglo JSON válido con objetos de esta forma: {"pregunta":"...","opciones":["...","...","...","..."],"correcta":0,"explicacion":"..."}. El índice correcta va de 0 a 3.`;
    let lastError = '';
    for (const provider of providers) {
      try {
        const answer = await PROVEEDORES[provider].llamar({ system: 'Eres un docente cuidadoso. Responde exclusivamente el JSON solicitado, sin Markdown ni texto adicional.', msgs: [{ role: 'user', content: prompt }], files: [] });
        const result = { tema, questions: validarPreguntasQuiz(answer, tema), generatedAt: Date.now(), cached: false };
        quizCache.set(tema, result);
        return result;
      } catch (e) {
        lastError = `${PROVEEDORES[provider].nombre}: ${e.message}`;
        console.warn('No se pudieron generar preguntas del test:', lastError);
      }
    }
    if (stale) return { ...stale, cached: true, stale: true };
    throw new Error(lastError || 'La IA no pudo generar las preguntas.');
  })().finally(() => quizRequests.delete(tema));
  quizRequests.set(tema, pending);
  return pending;
}
async function quiz(req, res) {
  let body = '';
  for await (const chunk of req) { body += chunk; if (body.length > 2000) return json(res, 413, { error: 'Solicitud demasiado grande.' }); }
  let data;
  try { data = JSON.parse(body); } catch { return json(res, 400, { error: 'JSON inválido.' }); }
  const tema = data.tema;
  if (typeof tema !== 'string' || !QUIZ_TOPICS.includes(tema)) return json(res, 400, { error: 'Elige un tema disponible para el test.' });
  const cached = quizCache.get(tema);
  const cacheFresh = cached && Date.now() - cached.generatedAt < QUIZ_CACHE_MS;
  if (!cacheFresh && limiteQuiz(req.headers['x-forwarded-for'] || req.socket.remoteAddress)) return json(res, 429, { error: 'Se alcanzó el límite de generación. Inténtalo más tarde.' });
  try { return json(res, 200, await generarPreguntasQuiz(tema)); }
  catch (e) { return json(res, 503, { error: e.message || 'No se pudieron actualizar las preguntas.' }); }
}
async function chat(req, res) {
  if (limite(req.headers['x-forwarded-for'] || req.socket.remoteAddress)) return json(res, 429, { error: 'Demasiados mensajes. Espera unos minutos.' });
  let body = '';
  for await (const c of req) { body += c; if (body.length > 25e6) return json(res, 413, { error: 'Archivo demasiado grande' }); }
  let d; try { d = JSON.parse(body); } catch { return json(res, 400, { error: 'JSON inválido' }); }
  const prov = disponibles();
  if (!prov.length) return json(res, 503, { error: 'Falta configurar GROQ_API_KEY en las variables privadas del servidor.' });
  const msgs = (d.messages || []).slice(-20).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 8000) }));
  if (!msgs.length || msgs[msgs.length - 1].role !== 'user') return json(res, 400, { error: 'Falta el mensaje' });
  const files = Array.isArray(d.files) ? d.files.slice(0, 4) : [];
  let retrieval='';
  if(/silab|curso|semestre|malla|asignatura|unidad didactica/i.test(msgs[msgs.length-1].content)){ const hits=await buscarSilabos(msgs[msgs.length-1].content,d.career||'',d.semester||'',d.turn||'',true); if(hits.length){ retrieval='\n\nRESULTADOS RECUPERADOS DE LA BIBLIOTECA PDF (usa solo como evidencia de nombres y texto visible; cita el nombre del archivo):\n'+hits.slice(0,6).map(x=>`Archivo: ${x.name} | Carrera: ${x.career} | Semestre: ${x.semester} | Turno: ${x.turn}\n${x.excerpt||''}`).join('\n\n'); } }
  const system = SYSTEM() + retrieval + (d.career ? `\nEl usuario está viendo la carrera: ${String(d.career).slice(0, 80)}.` : '');
  let ultimoError = '';
  for (const p of prov) {
    try {
      const reply = await PROVEEDORES[p].llamar({ system, msgs, files });
      if (typeof reply === 'string' && reply.trim()) return json(res, 200, { reply, provider: PROVEEDORES[p].nombre });
      ultimoError = `${PROVEEDORES[p].nombre}: el proveedor devolvió una respuesta vacía.`;
    } catch (e) { ultimoError = `${PROVEEDORES[p].nombre}: ${e.message}`; console.warn('Falló', ultimoError); }
  }
  json(res, 502, { error: ultimoError || 'La IA no respondió con contenido.' });
}

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.ico': 'image/x-icon', '.pdf': 'application/pdf', '.mp3': 'audio/mpeg' };
const RUTAS = { '/padres': '/padres.html', '/mercado-laboral': '/mercado-laboral.html', '/balotario': '/balotario.html' };
http.createServer((req, res) => {
  // CORS: permite que la web (ej. GitHub Pages) hable con este servidor. Limita con ALLOWED_ORIGIN.
  res.setHeader('Access-Control-Allow-Origin', E.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }
  if (req.method === 'POST' && req.url === '/api/chat') return chat(req, res);
  if (req.method === 'POST' && req.url === '/api/quiz') return quiz(req, res);
  if (req.method === 'POST' && req.url === '/api/images') return images(req, res);
  if (req.method === 'GET' && req.url.startsWith('/api/silabos')) { const u=new URL(req.url,'http://localhost'); const q=u.searchParams.get('q')||''; const career=u.searchParams.get('career')||''; const semester=u.searchParams.get('semester')||''; const turn=u.searchParams.get('turn')||''; return buscarSilabos(q,career,semester,turn,false).then(results=>json(res,200,{total:silabos.length,results:results.map(({score,...x})=>x),pdfTextSearchAvailable:!!pdfParse})); }
  if (req.method === 'GET' && req.url.split('?')[0] === '/api/status') {
    const providers = disponibles().map(p => PROVEEDORES[p].nombre);
    const configured = providers.length > 0;
    const image = imagenConfigurada();
    return json(res, 200, { ai: false, configured, connection: 'not_checked', providers, imageGeneration: { configured: image.configured, provider: image.provider }, error: configured ? null : 'No hay proveedores de IA configurados en las variables privadas del servidor.', syllabiFiles: silabos.length, pdfTextSearchAvailable: !!pdfParse });
  }
  let p = decodeURIComponent(req.url.split('?')[0]); if (p === '/') p = '/index.html'; if (RUTAS[p]) p = RUTAS[p];
  const f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname) || /(^|[\\/])(\.env|\.git|server\.js|package\.json|node_modules)([\\/]|$)/.test(p)) { res.writeHead(403); return res.end('No permitido'); }
  fs.readFile(f, (e, data) => {
    if (e) { res.writeHead(404); return res.end('No encontrado'); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(data);
  });
}).listen(PORT, () => {
  const d = disponibles();
  console.log(`\n✅ Abre en tu navegador: http://localhost:${PORT}\n   IA en la nube: ${d.length ? 'configurada, conexión no comprobada → ' + d.map(p => PROVEEDORES[p].nombre).join(', ') : 'no configurada (igual funcionan la base sin conexión y la IA local)'}\n`);
});
