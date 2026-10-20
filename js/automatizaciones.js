/* SeoaIA v20: flujos de automatización académica usando el motor IA existente. */
(() => {
  const byId = id => document.getElementById(id);
  const templates = {
    plan: 'Actúa como tutor académico. Diseña un plan de estudio semanal realista, por días, con bloques, descansos, objetivos medibles y una breve revisión al final. No inventes horarios oficiales.',
    pasos: 'Actúa como gestor de tareas. Convierte la tarea en una lista priorizada y numerada con entregables, duración estimada, dependencias, una fecha sugerida si hay fecha límite y una lista de verificación final. No inventes datos que falten; declara tus supuestos.',
    quiz: 'Crea una práctica de 10 preguntas sobre el tema indicado, mezcla selección múltiple y preguntas cortas, incluye respuestas correctas y explicación breve al final. No afirmes que son preguntas oficiales de un examen.',
    documento: 'Redacta un documento formal en español peruano, con asunto/título, destinatario genérico si no se especifica, cuerpo claro y cierre respetuoso. Marca entre corchetes los datos que falten y no inventes nombres, cargos, fechas ni hechos.',
    resumen: 'Prepara un resumen de estudio organizado en: idea central, conceptos clave, explicación sencilla, ejemplo aplicado, cinco puntos que debo recordar y cinco preguntas de autoevaluación con respuestas. Si falta material fuente, adviértelo.',
    proyecto: 'Actúa como asesor de proyectos tecnológicos para una feria estudiantil. Elabora objetivo, problema, usuarios, funciones, arquitectura propuesta, herramientas, plan de trabajo por fases, materiales, pruebas verificables, riesgos, costos solo si se proporcionan y demo de 3 minutos. Distingue propuesta de resultados ya demostrados.'
  };
  let ultimoResultado = '', ultimoTitulo = '';
  function estado(texto, tipo='') { const el=byId('auto-estado'); if(!el)return; el.textContent=texto; el.className='automation-status'+(tipo?' '+tipo:''); }
  function escapar(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function render(t){
    const safe=escapar(t);
    return safe.split(/\n{2,}/).map(par=>{
      if(/^\s*[-*]\s+/m.test(par)) return '<ul>'+par.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>'<li>'+x.replace(/^[-*]\s+/,'')+'</li>').join('')+'</ul>';
      if(/^\s*\d+[.)]\s+/m.test(par)) return '<ol>'+par.split('\n').map(x=>x.trim()).filter(Boolean).map(x=>'<li>'+x.replace(/^\d+[.)]\s+/,'')+'</li>').join('')+'</ol>';
      return '<p>'+par.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')+'</p>';
    }).join('');
  }
  async function generar(){
    const objetivo=byId('auto-objetivo').value.trim();
    if(!objetivo){byId('auto-objetivo').focus();estado('Falta el tema','error');return;}
    const tipo=byId('auto-tipo').value, carrera=byId('auto-carrera').value;
    const horas=byId('auto-horas').value||'no especificado', fecha=byId('auto-fecha').value||'no indicada';
    const prompt=`${templates[tipo]}\n\nContexto: proyecto SeoaIA para el IESTP Manuel Seoane Corrales.\nCarrera: ${carrera}.\nTiempo disponible: ${horas} horas por semana.\nFecha límite: ${fecha}.\nSolicitud del usuario: ${objetivo}\n\nEntrega contenido concreto, accionable, bien estructurado y en español. No asegures que una tarea se ejecutó externamente: solo genera el plan o borrador.`;
    const btn=byId('auto-generar'); btn.disabled=true; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Procesando…';
    estado('Trabajando…','busy'); byId('auto-resultado').innerHTML='<div class="automation-empty"><i class="fa-solid fa-gears fa-spin"></i><p>SeoaIA está preparando el resultado. La automatización no puede adivinar, así que está usando el contexto que proporcionaste.</p></div>';
    try{
      if(typeof responder!=='function') throw new Error('No se pudo iniciar el motor de IA. Recarga la página.');
      const result=await responder({messages:[{role:'user',content:prompt}],texto:prompt,files:[],career:null});
      ultimoResultado=String(result.text||'No se recibió contenido.'); ultimoTitulo=byId('auto-tipo').selectedOptions[0].textContent;
      byId('auto-resultado').innerHTML=result.html?result.text:render(ultimoResultado);
      byId('auto-copiar').disabled=false; byId('auto-guardar').disabled=false;
      estado(result.via||'Generado');
    }catch(e){byId('auto-resultado').innerHTML='<p role="alert">'+escapar(e.message||'No se pudo generar el resultado.')+'</p><p>Comprueba la conexión y que el servidor tenga un proveedor de IA configurado.</p>';estado('No disponible','error');}
    finally{btn.disabled=false;btn.innerHTML='<i class="fa-solid fa-gears"></i> Generar con IA';}
  }
  function guardar(){
    if(!ultimoResultado)return;
    try{const items=JSON.parse(localStorage.getItem('seoaia-automatizaciones')||'[]');items.unshift({titulo:ultimoTitulo,fecha:new Date().toLocaleString('es-PE'),contenido:ultimoResultado});localStorage.setItem('seoaia-automatizaciones',JSON.stringify(items.slice(0,10)));mostrarGuardados();estado('Guardado en este dispositivo');}
    catch(e){estado('No se pudo guardar','error');}
  }
  function mostrarGuardados(){
    const box=byId('auto-guardados');if(!box)return;
    try{const items=JSON.parse(localStorage.getItem('seoaia-automatizaciones')||'[]');if(!items.length){box.hidden=true;return;}box.hidden=false;box.innerHTML='<strong>Últimos resultados guardados en este dispositivo</strong>'+items.map((x,i)=>`<div class="automation-saved-item"><p><strong>${escapar(x.titulo)}</strong><br><small>${escapar(x.fecha)}</small></p><button type="button" class="btn btn-secondary" data-open-saved="${i}">Abrir resultado</button></div>`).join('');box.querySelectorAll('[data-open-saved]').forEach(b=>b.addEventListener('click',()=>{const item=items[Number(b.dataset.openSaved)];if(!item)return;ultimoResultado=item.contenido;ultimoTitulo=item.titulo;byId('auto-resultado').innerHTML=render(ultimoResultado);byId('auto-copiar').disabled=false;byId('auto-guardar').disabled=false;estado('Resultado recuperado');}));}catch(e){box.hidden=true;}
  }
  document.addEventListener('DOMContentLoaded',()=>{
    if(!byId('auto-generar'))return;
    byId('auto-generar').addEventListener('click',generar);
    byId('auto-limpiar').addEventListener('click',()=>{byId('auto-objetivo').value='';byId('auto-resultado').innerHTML='<div class="automation-empty"><i class="fa-solid fa-file-circle-check"></i><p>Describe una tarea para comenzar.</p></div>';ultimoResultado='';byId('auto-copiar').disabled=true;byId('auto-guardar').disabled=true;estado('Listo');});
    byId('auto-copiar').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(ultimoResultado);estado('Copiado');}catch(e){const ta=document.createElement('textarea');ta.value=ultimoResultado;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');estado('Copiado');}catch(_){estado('No se pudo copiar','error');}ta.remove();}});
    byId('auto-guardar').addEventListener('click',guardar);mostrarGuardados();
  });
})();
