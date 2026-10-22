// =====================================================================
// CONOCIMIENTO: test vocacional, balotario, mercado laboral y base general
// (funciona SIN internet; la IA de la nube/local lo complementa)
// =====================================================================

// ---------------- TEST VOCACIONAL (cubre las 7 carreras) ----------------
const QUIZ_PREGUNTAS = [
  { pregunta: "¿Qué actividad disfrutas más?", opciones: [
    { texto: "Crear páginas, diseñar y trabajar con la computadora", carrera: "dsi" },
    { texto: "Ayudar y cuidar a otras personas", carrera: "enfermeria" },
    { texto: "Ordenar cuentas, números y presupuestos", carrera: "contabilidad" },
    { texto: "Arreglar motores y averiguar por qué un auto falla", carrera: "automotriz" } ] },
  { pregunta: "¿Con qué herramientas te sentirías más cómodo/a?", opciones: [
    { texto: "Programas de diseño y editores web", carrera: "dsi" },
    { texto: "Multímetro, tableros y circuitos", carrera: "electrotecnia" },
    { texto: "Torno, moldes y trabajo con metales", carrera: "mecanica-prod" },
    { texto: "Tubos de ensayo, reactivos y balanzas", carrera: "quimica" } ] },
  { pregunta: "¿En qué ambiente te ves trabajando?", opciones: [
    { texto: "Oficina o a distancia con mi laptop", carrera: "dsi" },
    { texto: "Posta, clínica o atención a pacientes", carrera: "enfermeria" },
    { texto: "Laboratorio de análisis y calidad", carrera: "quimica" },
    { texto: "Planta industrial con máquinas automáticas", carrera: "electrotecnia" } ] },
  { pregunta: "¿Qué problema te gustaría resolver?", opciones: [
    { texto: "Que una página web o sistema funcione mejor", carrera: "dsi" },
    { texto: "Que una empresa lleve bien sus cuentas e impuestos", carrera: "contabilidad" },
    { texto: "Que un vehículo vuelva a funcionar", carrera: "automotriz" },
    { texto: "Que una pieza metálica salga con la medida exacta", carrera: "mecanica-prod" } ] },
  { pregunta: "¿Cuál describe mejor tu forma de ser?", opciones: [
    { texto: "Paciente y empático/a", carrera: "enfermeria" },
    { texto: "Metódico/a y ordenado/a con datos", carrera: "contabilidad" },
    { texto: "Curioso/a: me gusta experimentar y medir", carrera: "quimica" },
    { texto: "Práctico/a: me gusta armar y probar", carrera: "electrotecnia" } ] },
  { pregunta: "En un trabajo en grupo sueles...", opciones: [
    { texto: "Encargarme de lo digital y el diseño", carrera: "dsi" },
    { texto: "Cuidar que todos estén bien y se escuchen", carrera: "enfermeria" },
    { texto: "Llevar el control de plazos y gastos", carrera: "contabilidad" },
    { texto: "Construir o armar la parte física", carrera: "mecanica-prod" } ] },
  { pregunta: "¿Qué te emociona más aprender?", opciones: [
    { texto: "Automatizar procesos con sensores, motores y control", carrera: "electrotecnia" },
    { texto: "Cómo funciona un motor de combustión", carrera: "automotriz" },
    { texto: "Cómo se limpia el agua contaminada de una fábrica", carrera: "quimica" },
    { texto: "Cómo cuidar a niños, gestantes y adultos mayores", carrera: "enfermeria" } ] },
  { pregunta: "¿Qué futuro te atrae más?", opciones: [
    { texto: "Trabajar por proyectos y ofrecer servicios digitales", carrera: "dsi" },
    { texto: "Tener mi propio taller", carrera: "automotriz" },
    { texto: "Asesorar a negocios con sus cuentas", carrera: "contabilidad" },
    { texto: "Trabajar en el laboratorio de calidad de una empresa", carrera: "quimica" } ] }
];

// ---------------- CULTURA GENERAL (preguntas educativas y de actualidad) ----------------
const QUIZ_CULTURA = [
  { tema: "Perú y ciudadanía", pregunta: "¿Qué organismo constitucional autónomo administra justicia electoral y proclama resultados oficiales?", opciones: ["Jurado Nacional de Elecciones", "Ministerio de Economía", "SUNAT", "INDECOPI"], correcta: 0, explicacion: "El Jurado Nacional de Elecciones fiscaliza la legalidad del proceso electoral y proclama los resultados oficiales." },
  { tema: "Perú y ciudadanía", pregunta: "¿Cuál es la capital constitucional del Perú?", opciones: ["Cusco", "Arequipa", "Lima", "Trujillo"], correcta: 2, explicacion: "Lima es la capital del Perú." },
  { tema: "Perú y ciudadanía", pregunta: "¿Qué institución organiza los procesos electorales en el Perú?", opciones: ["ONPE", "SUNAT", "INEI", "INDECOPI"], correcta: 0, explicacion: "La ONPE organiza y ejecuta los procesos electorales y las consultas populares." },
  { tema: "Perú y ciudadanía", pregunta: "¿Cuántos poderes independientes reconoce la organización del Estado peruano?", opciones: ["Dos", "Tres", "Cuatro", "Cinco"], correcta: 1, explicacion: "Se reconocen los poderes Ejecutivo, Legislativo y Judicial." },
  { tema: "Perú y ciudadanía", pregunta: "¿Qué océano baña la costa del Perú?", opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"], correcta: 2, explicacion: "La costa peruana se encuentra junto al océano Pacífico." },
  { tema: "Ciencia y ambiente", pregunta: "¿Qué gas absorben principalmente las plantas durante la fotosíntesis?", opciones: ["Oxígeno", "Dióxido de carbono", "Nitrógeno", "Helio"], correcta: 1, explicacion: "Las plantas usan dióxido de carbono, agua y energía solar para producir azúcares y liberar oxígeno." },
  { tema: "Ciencia y ambiente", pregunta: "¿Cuál es el planeta más cercano al Sol?", opciones: ["Venus", "Marte", "Mercurio", "Júpiter"], correcta: 2, explicacion: "Mercurio es el planeta más cercano al Sol." },
  { tema: "Ciencia y ambiente", pregunta: "¿A qué temperatura hierve el agua aproximadamente al nivel del mar?", opciones: ["50 °C", "80 °C", "100 °C", "120 °C"], correcta: 2, explicacion: "Al nivel del mar, el agua hierve cerca de los 100 °C; la altitud puede modificar ese valor." },
  { tema: "Ciencia y ambiente", pregunta: "¿Qué órgano bombea la sangre por el cuerpo humano?", opciones: ["Pulmón", "Hígado", "Corazón", "Riñón"], correcta: 2, explicacion: "El corazón impulsa la sangre a través del sistema circulatorio." },
  { tema: "Ciencia y ambiente", pregunta: "¿Cuál de estas fuentes de energía es renovable?", opciones: ["Carbón", "Petróleo", "Solar", "Gas natural"], correcta: 2, explicacion: "La energía solar proviene de una fuente que se renueva naturalmente." },
  { tema: "Tecnología y cultura", pregunta: "¿Qué significa la sigla CPU en una computadora?", opciones: ["Unidad Central de Procesamiento", "Control Personal de Usuario", "Conexión Principal Universal", "Código de Programa Único"], correcta: 0, explicacion: "CPU significa Unidad Central de Procesamiento; ejecuta instrucciones de los programas." },
  { tema: "Tecnología y cultura", pregunta: "¿Cuál es una buena práctica para proteger tus cuentas en internet?", opciones: ["Usar la misma clave en todas partes", "Compartir la clave con amistades", "Activar la verificación en dos pasos", "Publicar la clave en un mensaje"], correcta: 2, explicacion: "La verificación en dos pasos agrega una capa de seguridad además de la contraseña." },
  { tema: "Tecnología y cultura", pregunta: "¿Qué formato se usa habitualmente para compartir documentos conservando su diseño?", opciones: ["PDF", "MP3", "PNG", "CSV"], correcta: 0, explicacion: "PDF permite compartir documentos conservando de forma consistente su presentación." },
  { tema: "Tecnología y cultura", pregunta: "¿Qué componente almacena temporalmente los datos que usa una computadora mientras está encendida?", opciones: ["Memoria RAM", "Monitor", "Teclado", "Impresora"], correcta: 0, explicacion: "La memoria RAM guarda temporalmente datos e instrucciones en uso; su contenido se pierde al apagar el equipo." },
  { tema: "Tecnología y cultura", pregunta: "¿Qué instrumento permite medir la temperatura?", opciones: ["Barómetro", "Termómetro", "Brújula", "Dinamómetro"], correcta: 1, explicacion: "El termómetro sirve para medir la temperatura." },
  { tema: "Historia y geografía", pregunta: "¿En qué continente se encuentra el Perú?", opciones: ["Asia", "Europa", "América del Sur", "África"], correcta: 2, explicacion: "El Perú está ubicado en América del Sur." },
  { tema: "Historia y geografía", pregunta: "¿Cuál fue la capital del Imperio inca?", opciones: ["Lima", "Cusco", "Quito", "Puno"], correcta: 1, explicacion: "Cusco fue el centro político y administrativo del Imperio inca." },
  { tema: "Historia y geografía", pregunta: "¿Qué cordillera atraviesa gran parte del territorio peruano?", opciones: ["Los Alpes", "Los Andes", "El Himalaya", "Los Urales"], correcta: 1, explicacion: "La cordillera de los Andes atraviesa el territorio peruano de norte a sur." },
  { tema: "Historia y geografía", pregunta: "¿Qué lengua originaria es, junto con el castellano, idioma oficial donde predomina?", opciones: ["Quechua", "Italiano", "Francés", "Alemán"], correcta: 0, explicacion: "El quechua es idioma oficial en las zonas donde predomina, de acuerdo con la Constitución peruana." },
  { tema: "Historia y geografía", pregunta: "¿Qué ciudadela inca es Patrimonio Mundial de la UNESCO?", opciones: ["Chan Chan", "Machu Picchu", "Caral", "Kuélap"], correcta: 1, explicacion: "El Santuario Histórico de Machu Picchu forma parte del Patrimonio Mundial." },
  { tema: "Matemática y lógica", pregunta: "¿Cuánto es el 15 % de 200?", opciones: ["15", "20", "30", "45"], correcta: 2, explicacion: "El 15 % de 200 es 0,15 × 200 = 30." },
  { tema: "Matemática y lógica", pregunta: "Si 3 cuadernos cuestan 12 soles, ¿cuánto cuestan 5 al mismo precio unitario?", opciones: ["15 soles", "18 soles", "20 soles", "24 soles"], correcta: 2, explicacion: "Cada cuaderno cuesta 4 soles; cinco cuestan 5 × 4 = 20 soles." },
  { tema: "Matemática y lógica", pregunta: "¿Qué número continúa la secuencia 2, 4, 8, 16…?", opciones: ["18", "24", "30", "32"], correcta: 3, explicacion: "Cada término se obtiene duplicando el anterior; después de 16 sigue 32." },
  { tema: "Matemática y lógica", pregunta: "Un rectángulo mide 6 cm de largo y 4 cm de ancho. ¿Cuál es su área?", opciones: ["10 cm²", "20 cm²", "24 cm²", "28 cm²"], correcta: 2, explicacion: "El área de un rectángulo es largo por ancho: 6 × 4 = 24 cm²." },
  { tema: "Matemática y lógica", pregunta: "¿Cuál es el promedio de 6, 8 y 10?", opciones: ["7", "8", "9", "10"], correcta: 1, explicacion: "El promedio es la suma dividida entre la cantidad de datos: (6 + 8 + 10) ÷ 3 = 8." },
  { tema: "Comunicación", pregunta: "¿Cuál es el propósito principal de un texto instructivo?", opciones: ["Narrar una aventura", "Explicar pasos para realizar algo", "Describir un paisaje", "Defender una opinión"], correcta: 1, explicacion: "Un texto instructivo organiza indicaciones o pasos para realizar una tarea." },
  { tema: "Comunicación", pregunta: "¿Qué signo se usa para cerrar una pregunta directa en español?", opciones: ["Punto y coma", "Signo de interrogación", "Dos puntos", "Guion"], correcta: 1, explicacion: "Las preguntas directas se escriben entre signos de interrogación de apertura y cierre." },
  { tema: "Comunicación", pregunta: "¿Cuál es un sinónimo de «preciso» en el sentido de exacto?", opciones: ["Impreciso", "Exacto", "Lejano", "Ruidoso"], correcta: 1, explicacion: "«Exacto» puede funcionar como sinónimo de «preciso» cuando significa que algo está definido sin error." },
  { tema: "Comunicación", pregunta: "¿Qué elemento presenta el tema principal de un párrafo?", opciones: ["La idea principal", "Una cita secundaria", "El pie de página", "El título del libro"], correcta: 0, explicacion: "La idea principal comunica el asunto central que desarrolla el párrafo." },
  { tema: "Comunicación", pregunta: "Antes de compartir una noticia en redes, ¿qué acción ayuda a verificarla?", opciones: ["Reenviarla de inmediato", "Revisar fecha, autor y fuentes confiables", "Confiar solo en el titular", "Cambiar el titular"], correcta: 1, explicacion: "Contrastar fecha, autor y fuentes confiables ayuda a detectar información falsa o desactualizada." },
  { tema: "Ética y convivencia", pregunta: "¿Qué acción demuestra respeto en un trabajo en equipo?", opciones: ["Interrumpir a los demás", "Escuchar opiniones distintas", "Apropiarse de las ideas", "Ignorar los acuerdos"], correcta: 1, explicacion: "Escuchar y considerar opiniones distintas facilita una convivencia respetuosa." },
  { tema: "Ética y convivencia", pregunta: "Si encuentras un error en un informe grupal, ¿qué es lo más responsable?", opciones: ["Ocultarlo", "Avisar al equipo y corregirlo", "Culpar a otra persona", "Borrar todo el informe"], correcta: 1, explicacion: "Informar el error y colaborar para corregirlo demuestra responsabilidad." },
  { tema: "Ética y convivencia", pregunta: "¿Qué significa reconocer la autoría de una idea ajena?", opciones: ["Presentarla como propia", "Citar la fuente", "Eliminar el nombre del autor", "Cambiar algunas palabras y omitir la fuente"], correcta: 1, explicacion: "Citar la fuente reconoce el trabajo de otras personas y evita el plagio." },
  { tema: "Ética y convivencia", pregunta: "Ante un desacuerdo, ¿qué estrategia favorece una solución pacífica?", opciones: ["Dialogar y buscar acuerdos", "Publicar insultos", "Amenazar al grupo", "Dejar de escuchar"], correcta: 0, explicacion: "El diálogo respetuoso permite comprender las diferencias y encontrar acuerdos." },
  { tema: "Ética y convivencia", pregunta: "¿Cuál es una práctica responsable al usar inteligencia artificial para una tarea?", opciones: ["Entregar todo sin revisarlo", "Verificar la información y reconocer el apoyo usado", "Inventar fuentes", "Compartir datos personales"], correcta: 1, explicacion: "Es importante verificar las respuestas de la IA, respetar las fuentes y cuidar la privacidad." },
  { tema: "Carreras técnicas", pregunta: "¿Qué actividad se relaciona principalmente con Desarrollo de Sistemas de Información?", opciones: ["Diseñar y mantener aplicaciones", "Cultivar plantas", "Atender exclusivamente en farmacia", "Construir carreteras"], correcta: 0, explicacion: "La carrera se enfoca en crear, probar y mantener sistemas y aplicaciones informáticas." },
  { tema: "Carreras técnicas", pregunta: "¿Qué práctica es esencial antes de trabajar con un circuito eléctrico?", opciones: ["Desconocer el plano", "Aplicar medidas de seguridad y verificar la energía", "Tocar cables para probarlos", "Retirar los equipos de protección"], correcta: 1, explicacion: "La seguridad eléctrica exige procedimientos, equipos de protección y verificación antes de intervenir." },
  { tema: "Carreras técnicas", pregunta: "¿Qué tarea es propia del control de calidad en un laboratorio?", opciones: ["Registrar y analizar resultados", "Cambiar datos para que coincidan", "Mezclar muestras sin identificarlas", "Omitir los procedimientos"], correcta: 0, explicacion: "El control de calidad requiere registrar y analizar resultados siguiendo procedimientos establecidos." },
  { tema: "Carreras técnicas", pregunta: "¿Qué documento ayuda a registrar ingresos y gastos de un negocio?", opciones: ["Un registro contable", "Un mapa climático", "Una receta médica", "Un plano eléctrico"], correcta: 0, explicacion: "Los registros contables organizan operaciones económicas como ingresos y gastos." },
  { tema: "Carreras técnicas", pregunta: "¿Qué se debe hacer antes de intervenir una máquina industrial?", opciones: ["Ignorar las instrucciones", "Identificar riesgos y seguir el procedimiento de seguridad", "Retirar las protecciones", "Trabajar sin autorización"], correcta: 1, explicacion: "Identificar los riesgos y seguir el procedimiento de seguridad reduce accidentes durante el mantenimiento." }
];

// ---------------- BALOTARIO (preguntas y respuestas de estudio) ----------------
// cat: etica | comunicacion | empresas | carrera | ia
const BALOTARIO = [
  { cat: "etica", carrera: "", p: "¿Por qué el Perú enfrenta crisis recurrentes (políticas, económicas y sociales)? (enfoque de Ética y Ciudadanía)",
    r: "No hay una sola causa; un curso de ética y ciudadanía suele señalar varias que se refuerzan entre sí:\n- **Corrupción e impunidad:** cuando los fondos públicos se desvían y casi no hay sanción, se pierde dinero para salud, educación y obras, y baja la confianza.\n- **Instituciones débiles e inestabilidad política:** cambios frecuentes y poca continuidad dificultan sostener políticas de largo plazo.\n- **Informalidad:** alrededor de 7 de cada 10 trabajadores no tienen un empleo formal (dato aproximado del INEI; verifícalo), lo que significa menos protección laboral y menos recaudación.\n- **Desigualdad y centralismo:** grandes diferencias entre Lima y las regiones y entre ciudad y campo en el acceso a servicios.\n- **Educación cívica débil y 'criollada':** la cultura de saltarse las normas ('el que no transa no avanza') normaliza pequeñas faltas.\n**Salidas que propone la ética:** honestidad en lo cotidiano, cumplir normas, exigir transparencia, votar informado, formalizarse y valorar el mérito. Es una reflexión académica general, no una posición política." },
  { cat: "etica", carrera: "", p: "¿Qué es la ética y en qué se diferencia de la moral y de la ley?",
    r: "La **ética** es la reflexión sobre qué está bien o mal y por qué; la **moral** son las costumbres y valores de un grupo; la **ley** son normas obligatorias con sanción. Algo puede ser legal pero poco ético (ej. aprovecharse de un vacío legal)." },
  { cat: "etica", carrera: "", p: "¿Qué es un dilema ético? Da un ejemplo laboral.",
    r: "Es una situación en la que debes elegir entre dos opciones con valores en conflicto. Ejemplo: tu jefe te pide 'ajustar' un informe para que una empresa pase una auditoría. Decir la verdad puede costarte el puesto; callar te hace cómplice. Pasos: identificar los hechos, las personas afectadas, las normas aplicables, evaluar opciones y elegir la que respeta la verdad y la dignidad de las personas." },
  { cat: "etica", carrera: "", p: "¿Qué es la corrupción y cómo se combate desde el trabajo diario?",
    r: "Es el abuso de un cargo o poder para obtener un beneficio privado (coimas, favores, uso indebido de recursos). Desde el día a día: no pagar ni aceptar sobornos, registrar con honestidad, reportar irregularidades por los canales formales, no 'prestar' tu firma y exigir comprobantes." },
  { cat: "etica", carrera: "", p: "¿Qué es la responsabilidad social?",
    r: "Es el compromiso de una persona o empresa de cuidar el impacto de sus decisiones en la sociedad y el ambiente: tratar bien a los trabajadores, cuidar el entorno, pagar impuestos y actuar con transparencia." },
  { cat: "etica", carrera: "enfermeria", p: "¿Qué es el secreto profesional y por qué importa en salud?",
    r: "Es la obligación de guardar reserva sobre la información del paciente. Se protege su dignidad y su confianza. Solo se revela con consentimiento o cuando la ley lo exige. No se comenta la salud de un paciente en redes ni con terceros." },
  { cat: "comunicacion", carrera: "", p: "¿Cuáles son las partes de un informe técnico?",
    r: "Portada, índice, introducción (objetivo y alcance), desarrollo (método, datos, resultados), conclusiones, recomendaciones, referencias y anexos. Debe ser claro, ordenado y con datos verificables." },
  { cat: "comunicacion", carrera: "", p: "¿Qué diferencia hay entre un memorando, un oficio y una solicitud?",
    r: "**Memorando:** comunicación interna entre áreas de una misma institución. **Oficio:** comunicación formal hacia otra institución o persona externa. **Solicitud:** documento con el que una persona pide algo a una autoridad (datos personales, petitorio, fecha y firma)." },
  { cat: "comunicacion", carrera: "", p: "¿Qué es la comunicación asertiva?",
    r: "Expresar lo que piensas y necesitas con claridad y respeto, sin ser pasivo (callarte) ni agresivo (imponerte). Fórmula: 'Cuando pasa X, me siento Y; necesito Z'." },
  { cat: "empresas", carrera: "", p: "¿Cuáles son los pasos generales para formalizar una MYPE en el Perú?",
    r: "En términos generales: 1) definir la forma (persona natural con negocio, EIRL, SAC…); 2) si es sociedad, reservar nombre y constituirla en SUNARP; 3) obtener el **RUC** en SUNAT y elegir régimen tributario; 4) tramitar la licencia de funcionamiento en la municipalidad; 5) emitir comprobantes de pago y llevar libros según el régimen. Los trámites y requisitos cambian: confírmalos en gob.pe y SUNAT." },
  { cat: "empresas", carrera: "", p: "¿Qué es un plan de negocio?",
    r: "Un documento que describe tu idea: problema que resuelves, cliente, producto, competencia, precio, costos, inversión, ventas estimadas y riesgos. Sirve para decidir si el negocio es viable y para pedir financiamiento." },
  { cat: "empresas", carrera: "", p: "¿Cuál es la diferencia entre ingreso, costo, gasto y utilidad?",
    r: "**Ingreso:** dinero que entra por ventas. **Costo:** lo que gastas para producir o comprar lo que vendes. **Gasto:** lo que cuesta mantener el negocio (alquiler, luz, sueldos). **Utilidad** = ingresos − costos − gastos." },
  { cat: "carrera", carrera: "quimica", p: "¿Qué significan LMP y ECA?",
    r: "**LMP (Límites Máximos Permisibles):** nivel máximo de contaminantes que una actividad puede descargar en sus efluentes o emisiones. **ECA (Estándares de Calidad Ambiental):** nivel de contaminantes que debe tener el agua, el aire o el suelo para proteger la salud y el ambiente. Los LMP controlan lo que sale de la fábrica; los ECA, cómo queda el ambiente." },
  { cat: "carrera", carrera: "quimica", p: "¿Qué diferencia hay entre DBO y DQO?",
    r: "**DBO:** oxígeno que consumen los microorganismos para degradar la materia orgánica del agua (medida biológica). **DQO:** oxígeno necesario para oxidar químicamente toda la materia oxidable. Normalmente DQO ≥ DBO." },
  { cat: "carrera", carrera: "quimica", p: "¿Qué diferencia hay entre ISO 9001 e ISO/IEC 17025?",
    r: "**ISO 9001:** gestión de calidad para cualquier organización. **ISO/IEC 17025:** requisitos de competencia técnica de laboratorios de ensayo y calibración (resultados válidos y trazables)." },
  { cat: "carrera", carrera: "quimica", p: "¿Qué diferencia hay entre exactitud y precisión? ¿Qué es la incertidumbre?",
    r: "**Exactitud:** qué tan cerca está la medida del valor verdadero. **Precisión:** qué tan parecidas son medidas repetidas. **Incertidumbre:** el rango dentro del cual probablemente está el valor verdadero (se reporta junto al resultado)." },
  { cat: "carrera", carrera: "electrotecnia", p: "¿Qué hace un variador de velocidad?",
    r: "Controla la velocidad de un motor eléctrico de corriente alterna cambiando la frecuencia (y tensión) que recibe. Ahorra energía, permite arranques suaves y protege el motor y la máquina." },
  { cat: "carrera", carrera: "electrotecnia", p: "¿Qué diferencia hay entre control en lazo abierto y en lazo cerrado?",
    r: "**Lazo abierto:** el sistema actúa sin comprobar el resultado (ej. un temporizador de riego). **Lazo cerrado:** usa un sensor para medir el resultado y corregir (ej. un termostato). El lazo cerrado es más preciso." },
  { cat: "carrera", carrera: "electrotecnia", p: "¿Qué diferencia hay entre neumática e hidráulica?",
    r: "La **neumática** usa aire comprimido (más rápida y limpia, menos fuerza). La **hidráulica** usa líquidos (aceite) a alta presión (mucha más fuerza y precisión). La 'electro' indica que válvulas y mandos se controlan eléctricamente." },
  { cat: "carrera", carrera: "automotriz", p: "¿Cuáles son los 4 tiempos de un motor Otto?",
    r: "1) **Admisión** (entra la mezcla aire-combustible), 2) **Compresión**, 3) **Explosión/expansión** (salta la chispa y baja el pistón), 4) **Escape** (salen los gases)." },
  { cat: "carrera", carrera: "automotriz", p: "¿Qué diferencia hay entre GLP y GNV?",
    r: "**GLP:** gas licuado de petróleo (propano/butano), se almacena líquido a presión moderada. **GNV:** gas natural vehicular, principalmente metano, almacenado comprimido a alta presión. Ambos requieren un kit de conversión instalado y revisado por personal autorizado." },
  { cat: "carrera", carrera: "mecanica-prod", p: "¿Qué es un tratamiento térmico y cuáles son los más comunes?",
    r: "Es calentar y enfriar un metal de forma controlada para cambiar sus propiedades. **Temple** (más dureza), **revenido** (reduce fragilidad después del temple), **recocido** (ablanda y alivia tensiones) y **normalizado**." },
  { cat: "carrera", carrera: "mecanica-prod", p: "¿Por qué el modelo de fundición se hace un poco más grande que la pieza final?",
    r: "Porque el metal se **contrae** al enfriarse y solidificar. Se agrega una 'sobremedida por contracción' (y también de mecanizado) para que la pieza termine con la medida correcta." },
  { cat: "carrera", carrera: "contabilidad", p: "¿Cuál es la ecuación contable básica?",
    r: "**Activo = Pasivo + Patrimonio.** Lo que tiene la empresa (activo) se financia con deudas (pasivo) o con aportes y ganancias de los dueños (patrimonio)." },
  { cat: "carrera", carrera: "contabilidad", p: "¿Para qué sirve el planeamiento de una auditoría?",
    r: "Para definir objetivos, alcance, riesgos y procedimientos antes de revisar: qué se va a examinar, cómo, con qué pruebas y en qué plazo. Un buen plan hace la auditoría más eficiente y confiable." },
  { cat: "carrera", carrera: "contabilidad", p: "¿Qué es el valor del dinero en el tiempo?",
    r: "Un sol hoy vale más que un sol mañana, porque hoy se puede invertir y ganar intereses (y por la inflación). Por eso en finanzas y evaluación de proyectos se calcula el valor presente de flujos futuros." },
  { cat: "carrera", carrera: "enfermeria", p: "¿Qué es CRED y AIEPI?",
    r: "**CRED:** Control de Crecimiento y Desarrollo del niño (peso, talla, desarrollo y vacunas). **AIEPI:** Atención Integral de Enfermedades Prevalentes de la Infancia, estrategia para detectar y tratar a tiempo enfermedades comunes en niños." },
  { cat: "carrera", carrera: "enfermeria", p: "¿Cuáles son signos de alarma en una gestante?",
    r: "Sangrado vaginal, pérdida de líquido, dolor de cabeza fuerte, visión borrosa o zumbido de oídos, hinchazón repentina, fiebre, dolor abdominal intenso o disminución de los movimientos del bebé. **Ante cualquiera, acudir de inmediato a un establecimiento de salud.**" },
  { cat: "carrera", carrera: "enfermeria", p: "¿Cómo se previenen las úlceras por presión en adultos mayores?",
    r: "Cambios de posición frecuentes (aprox. cada 2 horas en personas encamadas), piel limpia y seca, hidratación y buena nutrición, superficies blandas y revisar zonas de apoyo (sacro, talones, caderas)." },
  { cat: "carrera", carrera: "dsi", p: "¿Qué es el diseño centrado en el usuario?",
    r: "Diseñar pensando en quién usará la web: investigar sus necesidades, probar prototipos con personas reales y mejorar. Busca que sea fácil, claro y útil (usabilidad)." },
  { cat: "carrera", carrera: "dsi", p: "¿Qué diferencia hay entre dominio y hosting?",
    r: "El **dominio** es la dirección (ej. mipagina.com). El **hosting** es el servidor donde se guardan los archivos del sitio. Necesitas ambos para tener una web publicada." },
  { cat: "ia", carrera: "", p: "¿La inteligencia artificial me va a quitar el trabajo?",
    r: "Probablemente cambie tu trabajo más de lo que lo elimine: automatiza tareas repetitivas y exige nuevas habilidades. Te protege tener práctica en tu oficio, criterio, ética y saber usar la IA como herramienta. Quien la domina rinde más." },
  { cat: "ia", carrera: "", p: "¿Cómo usar la IA para estudiar sin hacer trampa?",
    r: "Úsala para explicar conceptos, practicar con ejercicios, revisar tu redacción y organizar tu estudio. No para entregar trabajos que no entiendes. Prueba: cierra la IA y explícalo con tus palabras. Verifica siempre sus respuestas." }
];

// ---------------- MERCADO LABORAL (tendencias generales, sin cifras inventadas) ----------------
const MERCADO_GENERAL = {
  aviso: "Esta sección resume tendencias generales y no contiene sueldos ni cifras exactas, porque cambian por empresa, zona y experiencia. Para datos al día revisa las fuentes oficiales.",
  tendencias: [
    { t: "Informalidad alta", d: "Una gran parte de los trabajadores en el Perú (alrededor de 7 de cada 10, según el INEI; verifica el dato vigente) no tiene empleo formal. Un título técnico y la formalización ayudan a acceder a mejores condiciones." },
    { t: "Más digitalización", d: "Facturación electrónica, atención por medios digitales, registros digitales y automatización llegan a casi todos los oficios. Saber usar herramientas digitales es cada vez más pedido." },
    { t: "La IA cambia tareas, no solo reemplaza", d: "Automatiza tareas repetitivas (registrar, redactar borradores, clasificar). Gana valor quien sabe revisar, decidir y trabajar con la tecnología." },
    { t: "Habilidades blandas", d: "Comunicación, trabajo en equipo, puntualidad y ética son de las cosas que más valoran los empleadores, junto con la práctica técnica." },
    { t: "Emprender es una ruta real", d: "Muchos técnicos trabajan por cuenta propia (taller, servicios contables, servicios web, atención a domicilio). Por eso el curso de Organización y Constitución de Empresas es importante." },
    { t: "La práctica pesa mucho", d: "Prácticas preprofesionales, portafolio de trabajos y certificaciones cortas suelen ser decisivos para el primer empleo." }
  ],
  fuentes: [
    { n: "INEI (inei.gob.pe)", d: "Estadísticas oficiales de empleo e informalidad." },
    { n: "MTPE (gob.pe/mtpe)", d: "Ministerio de Trabajo: bolsa de empleo y normas laborales." },
    { n: "Bolsas de empleo (Computrabajo, Bumeran, LinkedIn)", d: "Para ver qué ofertas existen hoy y qué piden." },
    { n: "Portal Ponte en Carrera (ponteencarrera.pe)", d: "Información de carreras e ingresos de egresados." }
  ]
};

// ---------------- Temas generales (estudio, trabajo, tecnología, salud, cultura) ----------------
const BASE = [
  // --- Conversación ---
  { t: "saludo", k: ["hola", "buenas", "buenos dias", "buenas tardes", "buenas noches", "hey", "que tal"], a: "¡Hola! Soy SeoaneBot 💜 Puedo ayudarte con tu carrera, estudio, CV, entrevistas, matemáticas, Excel, programación, salud básica, ánimo y más. ¿Qué necesitas?" },
  { t: "quien eres", k: ["quien eres", "como te llamas", "que eres", "tu nombre"], a: "Soy SeoaneBot, la compañera virtual del IESTP Manuel Seoane Corrales. Con internet uso una IA en la nube; sin conexión uso un modelo local (si lo descargaste) o mi base de conocimiento." },
  { t: "gracias", k: ["gracias", "te agradezco", "muchas gracias"], a: "¡De nada! Para eso estoy 💪 Si tienes otra duda, dime." },
  { t: "chiste", k: ["chiste", "hazme reir", "algo gracioso"], a: "¿Por qué los programadores prefieren el modo oscuro? Porque la luz atrae a los bugs 🐛" },
  // --- Estudio ---
  { t: "estudio", k: ["tecnica de estudio", "como estudiar", "estudiar mejor", "metodo de estudio", "pomodoro", "consejos de estudio"], a: "Técnicas que funcionan:\n- **Pomodoro:** 25 min de estudio + 5 de descanso.\n- **Repaso espaciado:** repasa al día siguiente, a los 3 días y a la semana.\n- **Autoexamen:** tapa tus apuntes e intenta explicar con tus palabras.\n- **Mapa mental o resumen en 1 página** por tema.\nDuerme bien: la memoria se consolida durmiendo." },
  { t: "concentracion", k: ["concentrar", "concentracion", "distraigo", "distraccion", "celular me distrae"], a: "Para concentrarte: deja el celular en otra habitación o en modo avión, estudia siempre en el mismo lugar, define una meta pequeña por sesión (ej. 'terminar 5 ejercicios') y usa bloques de 25 minutos." },
  { t: "procrastinar", k: ["procrastin", "dejo todo para despues", "pereza", "flojera", "no tengo ganas de estudiar"], a: "Empieza con la **regla de los 2 minutos**: prométete trabajar solo 2 minutos. Casi siempre seguirás. Divide la tarea en pasos pequeños y empieza por el más fácil." },
  { t: "examen", k: ["examen", "prepararme para un examen", "nervios en el examen", "me va a ir mal"], a: "Antes del examen: repasa con problemas, no solo leyendo; duerme 7-8 horas; desayuna algo ligero. Durante: lee todo, empieza por lo que sabes, administra el tiempo. Si te da ansiedad, respira 4 segundos, sostén 4, suelta 6." },
  { t: "tiempo", k: ["organizar mi tiempo", "organizacion", "horario de estudio", "planificar", "agenda"], a: "Organízate así: 1) anota todas tus tareas y fechas; 2) prioriza lo urgente e importante; 3) asigna bloques fijos en tu semana; 4) deja huecos libres para imprevistos. Una agenda simple en papel o en el celular basta." },
  { t: "exposicion", k: ["exposicion", "exponer", "hablar en publico", "presentacion oral"], a: "Para exponer: 3 ideas principales máximo, diapositivas con poco texto, ensaya en voz alta 2-3 veces, mira al público y respira. Comienza con una pregunta o dato curioso." },
  { t: "informe", k: ["informe", "monografia", "trabajo escrito", "redactar", "redaccion", "ensayo"], a: "Estructura básica: **Portada, Índice, Introducción, Desarrollo, Conclusiones, Referencias**. Escribe frases cortas, un tema por párrafo, y cita tus fuentes (formato APA: Autor, año, título, fuente)." },
  // --- Trabajo ---
  { t: "cv", k: ["cv", "curriculum", "hoja de vida"], a: "Un buen CV (1 página): **Datos de contacto, Perfil breve (2-3 líneas), Formación, Experiencia/prácticas, Habilidades y Cursos**. Usa verbos de acción ('instalé', 'atendí', 'organicé'), correo serio, sin foto exagerada y guárdalo en PDF." },
  { t: "entrevista", k: ["entrevista", "entrevista de trabajo", "me van a entrevistar"], a: "Prepárate: investiga la empresa, ensaya '¿Háblame de ti?' (30-60 s: quién eres, qué estudiaste, qué sabes hacer), llega 10 minutos antes, viste limpio y ordenado, y lleva 2 preguntas para ellos. Sé honesto: no inventes experiencia." },
  { t: "primer empleo", k: ["primer empleo", "buscar trabajo", "practicas preprofesionales", "como consigo trabajo", "empleo"], a: "Para tu primer empleo: arma tu CV, pide prácticas desde el instituto, usa bolsas de empleo (Bumeran, Computrabajo, LinkedIn y el servicio Empleos Perú del MTPE), avisa a tu red de contactos y postula a muchas ofertas. Un portafolio de proyectos ayuda mucho." },
  { t: "emprender", k: ["emprender", "emprendimiento", "negocio propio", "iniciar un negocio", "idea de negocio"], a: "Para empezar un negocio: 1) identifica un problema real; 2) prueba tu idea con pocos clientes; 3) calcula costos y precio; 4) formalízate (RUC) cuando vendas con regularidad; 5) reinvierte las ganancias. Empieza pequeño." },
  { t: "ahorro", k: ["ahorrar", "ahorro", "presupuesto", "finanzas personales", "administrar mi dinero"], a: "Regla 50/30/20: 50% necesidades, 30% gustos, 20% ahorro. Anota tus gastos un mes, ahorra apenas recibas dinero (no lo que sobra) y evita deudas con tarjeta sin necesidad." },
  { t: "ruc", k: ["ruc", "recibo por honorarios", "sunat", "trabajar independiente", "factura"], a: "Si trabajas por tu cuenta puedes sacar tu RUC en SUNAT (gratis, en línea) y emitir recibos por honorarios o boletas según tu caso. Las reglas tributarias cambian: confirma en sunat.gob.pe." },
  // --- Tecnología ---
  { t: "programacion", k: ["programar", "programacion", "aprender a programar", "lenguaje de programacion", "codigo"], a: "Para aprender a programar: 1) empieza con **HTML, CSS y JavaScript** (verás resultados rápido); 2) luego **Python** o Java; 3) practica con mini proyectos (calculadora, lista de tareas); 4) sube todo a GitHub. Lo clave es practicar a diario." },
  { t: "html", k: ["que es html", "html", "css", "javascript", "pagina web"], a: "**HTML** da la estructura de una página, **CSS** el diseño (colores, tamaños) y **JavaScript** la interactividad (botones, chats, cálculos). Juntos forman casi todas las páginas web." },
  { t: "excel", k: ["excel", "formulas de excel", "buscarv", "tabla dinamica", "hoja de calculo"], a: "Fórmulas básicas de Excel:\n- `=SUMA(A1:A10)`\n- `=PROMEDIO(A1:A10)`\n- `=SI(A1>=11;\"Aprobado\";\"Desaprobado\")`\n- `=BUSCARV(valor;rango;columna;0)`\n- `=CONTAR.SI(rango;criterio)`\nEn algunas versiones se separan con coma en vez de punto y coma." },
  { t: "seguridad digital", k: ["contrasena", "clave segura", "hackear", "phishing", "estafa", "me robaron", "virus", "seguridad en internet"], a: "Seguridad digital: usa contraseñas largas y distintas, activa la verificación en 2 pasos, no abras enlaces sospechosos (phishing) y nunca compartas códigos que te lleguen por SMS o WhatsApp. Ningún banco te pide tu clave por mensaje." },
  { t: "ia", k: ["inteligencia artificial", "que es la ia", "chatgpt", "machine learning"], a: "La **inteligencia artificial** son programas que aprenden de datos para tareas como responder preguntas, reconocer imágenes o traducir. Úsala como ayuda para aprender, pero verifica la información y no copies sin entender." },
  { t: "redes", k: ["redes de computadoras", "wifi", "ip", "router", "internet no funciona"], a: "Si el internet falla: 1) reinicia el router (30 s apagado); 2) revisa que otros equipos conecten; 3) acércate al router; 4) prueba otro DNS (8.8.8.8). Una **IP** es la dirección de un equipo en la red." },
  // --- Matemáticas y ciencias ---
  { t: "porcentaje", k: ["porcentaje", "como saco el porcentaje", "descuento", "igv"], a: "**Porcentaje:** (parte ÷ total) × 100. Para el X% de N: N × X ÷ 100. Un descuento del 20% a S/ 150 → 150 × 0.20 = S/ 30, pagas S/ 120. El IGV en Perú es 18% (16% IGV + 2% IPM). Escríbeme algo como '20% de 150' y lo calculo." },
  { t: "regla de tres", k: ["regla de tres", "proporcion", "directamente proporcional"], a: "**Regla de tres simple directa:** si A ↔ B y C ↔ X, entonces X = (B × C) ÷ A. Ej.: 3 kg cuestan S/ 12; 5 kg → (12 × 5) ÷ 3 = S/ 20." },
  { t: "geometria", k: ["area", "perimetro", "volumen", "circulo", "triangulo", "cuadrado", "teorema de pitagoras", "pitagoras"], a: "Fórmulas útiles:\n- Cuadrado: A = l²\n- Rectángulo: A = b × h\n- Triángulo: A = b × h ÷ 2\n- Círculo: A = π r², P = 2 π r\n- Cubo: V = a³; Cilindro: V = π r² h\n- Pitágoras: c² = a² + b²" },
  { t: "ohm", k: ["ley de ohm", "voltaje", "corriente", "resistencia electrica", "potencia electrica", "watts"], a: "**Ley de Ohm:** V = I × R (voltios = amperios × ohmios). **Potencia:** P = V × I. Ej.: 220 V y 5 A → P = 1100 W. Siempre desconecta la energía antes de manipular instalaciones." },
  { t: "ecuaciones", k: ["ecuacion", "despejar", "algebra", "resolver x"], a: "Para resolver una ecuación lineal: agrupa los términos con x de un lado y los números del otro, cambiando de signo al pasar de lado, y divide entre el coeficiente de x. Ej.: 3x + 5 = 20 → 3x = 15 → x = 5. Envíame el ejercicio y lo vemos paso a paso." },
  { t: "metodo cientifico", k: ["metodo cientifico", "hipotesis", "experimento"], a: "**Método científico:** observación → pregunta → hipótesis → experimento → análisis de resultados → conclusión. Una hipótesis debe poder probarse o refutarse." },
  { t: "unidades", k: ["conversion", "convertir", "unidades", "cuantos metros", "cuantos litros", "kilometros"], a: "Equivalencias: 1 km = 1000 m · 1 m = 100 cm · 1 kg = 1000 g · 1 L = 1000 mL · 1 hora = 60 min · 1 pulgada = 2.54 cm · 1 libra ≈ 0.454 kg · °F = °C × 1.8 + 32." },
  // --- Salud y bienestar ---
  { t: "emergencias", k: ["emergencia", "numero de emergencia", "ambulancia", "bomberos", "policia", "samu"], a: "Números en Perú: **Policía 105 · Bomberos 116 · SAMU (ambulancia) 106 · Línea 113 (Minsa, información y salud mental, opción 5) · Línea 100 (violencia familiar y sexual)**. En una emergencia real llama de inmediato." },
  { t: "primeros auxilios", k: ["primeros auxilios", "me quemé", "quemadura", "sangrado", "herida", "desmayo", "se atraganta"], a: "Primeros auxilios básicos: **Quemadura leve:** agua fría corriente 10-20 min, sin hielo ni cremas caseras. **Herida con sangrado:** presiona con gasa limpia y eleva la zona. **Desmayo:** acuesta a la persona con las piernas elevadas. Si es grave, llama al 106 y busca ayuda médica." },
  { t: "sueno", k: ["dormir", "insomnio", "sueno", "no puedo dormir"], a: "Para dormir mejor: horario fijo, sin pantallas 1 hora antes, cuarto oscuro y fresco, y nada de cafeína por la tarde. Dormir 7-8 horas mejora tu memoria y tu ánimo." },
  { t: "alimentacion", k: ["alimentacion", "comer sano", "dieta", "nutricion", "desayuno"], a: "Come variado: verduras, frutas, menestras, proteínas (huevo, pescado, pollo) y agua. Evita saltarte comidas y reduce gaseosas e ultraprocesados. Para algo personalizado consulta a un nutricionista." },
  { t: "estres", k: ["estres", "ansiedad", "estoy nervioso", "me siento agobiado", "presion"], a: "Para bajar el estrés: respira 4-4-6 (inhala 4 s, sostén 4, exhala 6), camina 10 minutos, divide tus pendientes en pasos pequeños y habla con alguien de confianza. Si es constante, busca apoyo profesional; en Perú puedes llamar a la Línea 113 (opción 5)." },
  { t: "animo", k: ["triste", "desanimado", "deprimido", "me siento mal", "no puedo mas", "solo", "sola"], a: "Siento que te sientas así 💜 Lo que sientes importa. Habla con alguien de confianza hoy mismo. Si te sientes muy mal o piensas en hacerte daño, llama a la **Línea 113 (opción 5)** o al 106 en Perú, o acude a una posta. No tienes que cargar esto solo/a." },
  { t: "bullying", k: ["bullying", "acoso", "me molestan", "discriminacion", "hostigamiento"], a: "Nadie merece acoso. Guarda pruebas (mensajes, fechas), cuéntaselo a alguien de confianza y reporta en la oficina de bienestar o dirección del instituto. Si hay violencia o acoso sexual, puedes llamar a la Línea 100." },
  // --- Cultura ---
  { t: "peru", k: ["capital del peru", "independencia del peru", "machu picchu", "moneda del peru", "sobre el peru"], a: "Perú: capital **Lima**, moneda **sol**, independencia proclamada el **28 de julio de 1821**. Tiene 3 regiones naturales (costa, sierra, selva), Machu Picchu es una de las 7 maravillas del mundo moderno y su cocina es de las más reconocidas del mundo." },
  { t: "ingles", k: ["ingles", "english", "como se dice", "aprender ingles"], a: "Para aprender inglés: 10-15 minutos diarios, aprende frases completas (no palabras sueltas), mira series con subtítulos en inglés y habla en voz alta. Básico: Hello (Hola), Thank you (Gracias), How are you? (¿Cómo estás?), I need help (Necesito ayuda)." },
  { t: "lectura", k: ["libro", "leer mas", "habito de lectura", "recomienda un libro"], a: "Para crear el hábito de lectura: 15 páginas al día, a la misma hora y con un libro que te guste. Clásicos peruanos fáciles de empezar: 'Los ríos profundos' (Arguedas) o 'Tradiciones peruanas' (Palma)." },
  // --- Taller y seguridad ---
  { t: "epp", k: ["epp", "seguridad en el taller", "equipo de proteccion", "casco", "guantes", "seguridad industrial"], a: "Seguridad en taller/laboratorio: usa tu **EPP** (lentes, guantes, casco, zapatos de seguridad, mandil según el caso), pelo recogido, sin joyas sueltas, conoce la salida de emergencia y nunca uses una máquina sin autorización. Reporta cualquier condición insegura." },
  // --- Instituto ---
];

// ---------------- Temas del instituto y de orientación (se suman a los generales) ----------------
const BASE_INSTITUTO = [
  { t: "carreras", k: ["carreras", "que carreras", "especialidades", "que ofrece el instituto", "oferta academica"], a: () => "El instituto tiene **7 carreras** de 3 años (6 semestres), gratuitas:\n" + CARRERAS_DATA.map(c => `- ${c.emoji} **${c.nombre}**`).join("\n") + "\nPregúntame por cualquiera: qué se aprende, dónde se trabaja y si le conviene a tu hijo/a." },
  { t: "admision", k: ["admision", "postula", "postular", "como ingresar", "ingreso al instituto", "postulacion", "vacantes", "examen de admision", "inscripcion"], a: "Se ingresa por **examen de admisión** (hay un pago por inscripción). Pasos generales: elegir carrera y turno → inscribirte → rendir el examen → si ingresas, presentar documentos y matricularte. Fechas, vacantes y montos cambian cada año: confírmalos en seoane.edu.pe o en secretaría." },
  { t: "ubicacion", k: ["donde queda", "direccion", "ubicacion", "como llegar", "metro", "bayovar"], a: "Estamos en la Av. Fernando Wiesse, cuadra 44, cerca de la estación Bayóvar de la Línea 1 del Metro de Lima (San Juan de Lurigancho). Confirma la dirección en seoane.edu.pe." },
  { t: "gratis", k: ["gratis", "gratuito", "cuanto cuesta", "pension", "mensualidad", "es publico", "cuanto se paga"], a: "Es un instituto público: la formación es **gratuita** (3 años). Normalmente se paga la inscripción al examen de admisión y los gastos propios (útiles, uniforme, materiales). Confirma los montos vigentes en seoane.edu.pe." },
  { t: "horario", k: ["horario", "turno", "turno noche", "diurno", "nocturno"], a: "Hay turnos diurno y nocturno. El horario exacto lo informa tu coordinador de carrera cada ciclo; la disponibilidad por carrera confírmala en secretaría." },
  { t: "titulo", k: ["titulo", "titulacion", "duracion", "cuantos anos", "egreso", "bachiller"], a: "Las carreras duran 3 años (6 semestres) y se obtiene un título técnico a nombre de la Nación. La denominación exacta y los requisitos de titulación (prácticas, trabajo, etc.) están en el reglamento: confírmalos en secretaría." },
  { t: "padres", k: ["mi hijo", "mi hija", "soy padre", "soy madre", "padre de familia", "le conviene", "le convendria"], a: "Con gusto oriento a padres y madres. Para saber si una carrera le conviene a su hijo/a, vea en cada carrera **para quién es y para quién no**, hagan juntos el Test Vocacional y, si puede, visiten el instituto. Dígame la carrera que le interesa (por ejemplo 'le conviene Contabilidad') y le explico." },
  { t: "etica peru", k: ["peru esta mal", "peru esta jodido", "por que el peru", "crisis del peru", "corrupcion en el peru", "realidad nacional", "peru en crisis", "por que el peru esta"], a: () => BALOTARIO[0].r },
  { t: "mercado laboral", k: ["mercado laboral", "trabajo de hoy", "empleos de hoy", "que se necesita para trabajar", "oferta laboral", "demanda laboral", "salida laboral", "campo laboral"], a: () => "**Mercado laboral hoy (tendencias generales):**\n" + MERCADO_GENERAL.tendencias.map(x => `- **${x.t}:** ${x.d}`).join("\n") + "\n\nNo doy sueldos exactos porque varían; revisa INEI, MTPE y las bolsas de empleo para datos al día." },
  { t: "sueldo", k: ["sueldo", "cuanto gana", "salario", "cuanto ganan", "remuneracion"], a: "Los sueldos varían mucho según la empresa, la zona, la experiencia y si trabajas formal o por cuenta propia, así que no te daré cifras inventadas. Para tener un dato real mira las ofertas actuales en Computrabajo, Bumeran o LinkedIn y las estadísticas del INEI y del MTPE." }
];

// ---------------- utilidades ----------------
const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function coincide(t, k) { k = norm(k); return k.length <= 4 ? new RegExp("(^|[^a-z0-9])" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "([^a-z0-9]|$)").test(t) : t.includes(k); }

const ALIAS = {
  dsi: ["desarrollo de sistemas", "dsi", "sistemas de informacion", "informatica", "computacion", "sistemas"],
  enfermeria: ["enfermeria", "enfermero", "enfermera"],
  contabilidad: ["contabilidad", "contador", "contable"],
  electrotecnia: ["electrotecnia", "electricidad", "electrico", "electrica"],
  automotriz: ["automotriz", "mecatronica", "mecanica automotriz", "mecanico de autos"],
  "mecanica-prod": ["mecanica de produccion", "produccion industrial", "metalmecanica", "fundicion", "matriceria"],
  quimica: ["quimica industrial", "quimica", "quimico"]
};

function calcularTexto(texto) {
  const p = texto.replace(",", ".").match(/(\d+(?:\.\d+)?)\s*%\s*de\s*(\d+(?:\.\d+)?)/i);
  if (p) { const r = (+p[1] * +p[2]) / 100; return `**${p[1]}% de ${p[2]} = ${+r.toFixed(4)}**`; }
  const m = texto.replace(/,/g, ".").match(/[\d(][\d\s+\-*/x×÷^().]*[\d)]/);
  if (m && /\d\s*[+\-*/x×÷^]\s*[\d(]/.test(m[0])) {
    const e = m[0].replace(/[x×]/g, "*").replace(/÷/g, "/").replace(/\^/g, "**");
    if (/^[\d\s+\-*/().]+$/.test(e)) { try { const r = Function('"use strict";return (' + e + ")")(); if (isFinite(r)) return `**${m[0].trim()} = ${+r.toFixed(6)}**`; } catch (_) {} }
  }
  return null;
}

function carrerasMencionadas(t) {
  return CARRERAS_DATA.filter(c => (ALIAS[c.id] || []).some(a => coincide(t, a)) || t.includes(norm(c.nombre)));
}

function fichaCarrera(c, t) {
  if (/(conviene|convendria|para mi hij|para mi hija|apto|sirve para|me recomiend)/.test(t))
    return `**¿Le conviene ${c.nombre}?** ${c.emoji}\n${c.guiaPadres.convieneHijo}\n\n**Es para quien…**\n${c.ideal.map(x => "- " + x).join("\n")}\n\n**Quizá no sea para quien…**\n${c.noIdeal.map(x => "- " + x).join("\n")}\n\n**Sobre la IA:** ${c.guiaPadres.iaTemorOReto}`;
  if (/(malla|curso|silabo|unidad|que llevan|que se aprende|que aprendo|aprender|semestre|plan de estudio)/.test(t))
    return `**${c.nombre}** ${c.emoji} — sílabos ${c.silabos.periodo}\n` + c.silabos.unidades.map(u => `- **${u.curso}:** ${u.enfoque}`).join("\n") + `\n\n_Los sílabos de los demás semestres aún no están cargados en esta web._` + (c.silabos.nota ? `\n_Nota:_ ${c.silabos.nota}` : "");
  if (/(trabaj|empleo|campo laboral|salida laboral|donde puedo|mercado)/.test(t))
    return `**${c.nombre}** ${c.emoji} — dónde se puede trabajar:\n${c.campoLaboral.map(x => "- " + x).join("\n")}\n\n${c.mercado}`;
  if (/(ia\b|inteligencia artificial|reemplaz|robot)/.test(t))
    return `**IA en ${c.nombre}:** ${c.guiaPadres.iaTemorOReto}\n\nHerramientas que se usan: ${c.herramientasIA.join("; ")}.`;
  return `**${c.nombre}** ${c.emoji}\n${c.resumen}\n\n**Perfil del egresado:** ${c.perfil}\n**Dónde trabajar:** ${c.campoLaboral.slice(0, 4).join(", ")}.\n\nPuedes preguntarme por su malla, si le conviene a tu hijo/a, o cómo le afecta la IA.`;
}

function buscarBalotario(t) {
  const STOP = ["que","los","las","del","una","uno","por","para","con","como","cual","cuales","son","sus","mis","tus","ese","esa","eso","hay","mas","ser","segun","entre","sobre","cuando","donde"];
  const palabras = t.split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !STOP.includes(w));
  let best = null, bs = 0;
  for (const b of BALOTARIO) {
    const base = norm(b.p + " " + b.cat);
    let s = 0; for (const w of palabras) if (base.includes(w)) s++;
    if (s > bs) { bs = s; best = b; }
  }
  return bs >= 2 ? best : null;
}

function responderBase(texto, carrera) {
  const t = norm(texto);
  if (/(que hora|que dia es|fecha de hoy|que fecha)/.test(t)) return "Ahora son: " + new Date().toLocaleString("es-PE", { dateStyle: "full", timeStyle: "short" });
  const c = calcularTexto(texto); if (c) return "🧮 " + c + (/1\s*\+\s*1\b/.test(texto) ? "\n¡Matemática básica! Si quieres, te explico cómo se resuelve paso a paso." : "");
  // 1) pregunta puntual del balotario (alta prioridad si coincide bastante)
  const b = buscarBalotario(t); if (b) return `**${b.p}**\n${b.r}`;
  // 2) carreras mencionadas
  const mc = carrerasMencionadas(t);
  if (mc.length) return mc.slice(0, 3).map(x => fichaCarrera(x, t)).join("\n\n---\n\n");
  if (carrera && /(mi carrera|de que trata|que aprendo|que voy a aprender|donde trabaj)/.test(t)) return fichaCarrera(carrera, t);
  // 3) temas del instituto y generales
  let best = null, bs = 0;
  for (const e of [...BASE_INSTITUTO, ...BASE]) { let s = 0; for (const k of e.k) if (coincide(t, k)) s += norm(k).length > 6 ? 3 : 2; if (s > bs) { bs = s; best = e; } }
  if (best && bs >= 2) return typeof best.a === "function" ? best.a() : best.a;
  return "No tengo esa respuesta en mi base sin conexión 🤔. Puedo hablarte de las **7 carreras** (mallas, campo laboral, si le conviene a tu hijo/a), **admisión**, **ética y realidad nacional**, **mercado laboral**, estudio, CV, entrevistas, matemáticas básicas, Excel, programación, salud y ánimo. También hago cálculos (ej. `15*8` o `20% de 150`). Con internet (o la IA local descargada) puedo responder cualquier tema.";
}
