// =====================================================================
// BASE DE DATOS DE CARRERAS - IESTP "Manuel Seoane Corrales"
// FUENTE: inventario preliminar de sílabos recibidos para I, III y V (Día/Noche).
// Los PDF recibidos están integrados en documentos/silabos; la validación de cada documento se realiza por búsqueda y consulta.
// Esta es la ÚNICA fuente de datos: la web, el chat y el servidor la leen.
// =====================================================================

const INSTITUTO = {
  nombre: "IESTP Manuel Seoane Corrales",
  ubicacion: "Av. Fernando Wiesse, cuadra 44 (cerca de la estación Bayóvar), San Juan de Lurigancho, Lima",
  web: "https://seoane.edu.pe",
  gratuito: true,
  duracion: "3 años (6 semestres)",
  turnos: "Diurno y nocturno"
};

// Cursos transversales que aparecen en los sílabos de varias carreras (V semestre 2025-I)
const TRANSVERSALES = {
  comunicacion: { curso: "Comunicación Empresarial", tipo: "transversal", enfoque: "Redacción técnica (informes, memorandos, solicitudes), comunicación oral y escrita, exposición de proyectos y resolución de conflictos." },
  etica: { curso: "Comportamiento Ético", tipo: "transversal", enfoque: "Ética profesional, responsabilidad social, dilemas éticos y conducta transparente en el trabajo." },
  empresas: { curso: "Organización y Constitución de Empresas", tipo: "transversal", enfoque: "Pasos legales y tributarios (SUNAT, licencias) para formalizar una MYPE, plan de negocio, presupuesto y gestión de recursos." }
};

const SEMESTRE_PENDIENTE = "Pendiente: aún no se cargan los sílabos de este semestre. Se completará cuando se tengan los documentos oficiales.";

const CARRERAS_DATA = [
  // ---------------------------------------------------------------- DSI
  {
    id: "dsi", nombre: "Desarrollo de Sistemas de Información", categoria: "tecnologia", imagen: "img/plana-anime/dsi.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-laptop-code", emoji: "💻", logo: "DSI", polo: "#2563eb", pelo: "#1e1b4b", estilo: "corto",
    resumen: "Diseña y administra sitios y sistemas web, trabaja con multimedia y animación de gráficos y aprende a gestionar plataformas web y a emprender en tecnología.",
    perfil: "Egresado capaz de diseñar páginas y sistemas web, producir contenido multimedia, administrar y mantener plataformas web, comunicarse con claridad y crear su propia empresa de servicios digitales.",
    ideal: ["Te gusta la computadora, el diseño y resolver problemas lógicos.", "Quieres crear páginas, apps o contenido digital.", "Te interesa trabajar por proyectos, incluso a distancia."],
    noIdeal: ["No te gusta sentarte a practicar y aprender cosas nuevas constantemente.", "Esperas resultados sin esfuerzo: programar requiere mucha práctica."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.etica, TRANSVERSALES.empresas,
        { curso: "Herramientas Multimedia / Animación de Gráficos", tipo: "especialidad", enfoque: "Producción de material multimedia y animación de gráficos para web y medios digitales." },
        { curso: "Diseño Web", tipo: "especialidad", enfoque: "Diseño y maquetación de sitios web (estructura, estilos, usabilidad y diseño centrado en el usuario)." },
        { curso: "Gestión y Administración Web", tipo: "especialidad", enfoque: "Publicación, mantenimiento y administración de sitios y plataformas web." }
      ],
      nota: "Los sílabos recibidos de DSI son 6. Otros temas de la carrera (programación, bases de datos, redes) están en otros semestres cuyos sílabos aún no se han cargado."
    },
    campoLaboral: ["Diseñador/a web", "Administrador/a de sitios web", "Soporte técnico informático", "Diseño multimedia y animación", "Emprendimiento de servicios digitales"],
    herramientasIA: ["Asistentes de IA para escribir y revisar código", "IA generativa para imágenes y textos de marketing", "Herramientas de diseño con sugerencias automáticas", "Automatización de tareas repetitivas"],
    mercado: "El trabajo digital sigue creciendo (comercio electrónico, páginas para negocios, soporte). La IA acelera tareas, pero las empresas siguen necesitando personas que entiendan qué construir, lo revisen y lo mantengan.",
    guiaPadres: {
      convieneHijo: "Conviene si a su hijo/a le gusta la tecnología, el diseño o los videojuegos y disfruta crear cosas en la computadora. Una buena señal: ya intenta arreglar equipos, hacer videos o armar páginas por su cuenta.",
      porQueElegir: "Se puede empezar a trabajar o emprender con un portafolio de proyectos, incluso freelance, y los servicios digitales son útiles para casi cualquier negocio.",
      iaTemorOReto: "La IA ya escribe código y genera imágenes, pero necesita a alguien que sepa pedir, revisar, corregir y publicar. El reto real es no quedarse sin aprender: quien domina las herramientas de IA es más productivo, no menos necesario.",
      campoExtendido: "Diseño y administración web, soporte técnico, multimedia, contenido digital, tiendas en línea y servicios para MYPEs."
    }
  },

  // -------------------------------------------------------------- Enfermería
  {
    id: "enfermeria", nombre: "Enfermería Técnica", categoria: "salud", imagen: "img/plana-anime/enfermeria.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-user-nurse", emoji: "🩺", logo: "ENF", polo: "#0d9488", pelo: "#9d174d", estilo: "coletas",
    resumen: "Formación para apoyar la atención de salud: madres y gestantes, niños y adolescentes, adultos mayores y personas con problemas de salud mental, con ética y trato humano.",
    perfil: "Egresado que presta asistencia técnica de enfermería en el cuidado de gestantes, niños, adolescentes, adultos mayores y pacientes con problemas de salud mental, respetando derechos del paciente y secreto profesional.",
    ideal: ["Tienes vocación de servicio y paciencia con las personas.", "Te sientes tranquilo/a ayudando a quien está enfermo o necesita apoyo.", "Puedes trabajar en turnos y bajo presión."],
    noIdeal: ["Te incomoda el contacto con enfermedad, sangre o situaciones emocionalmente duras.", "No te gusta el trabajo en turnos o guardias."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion,
        { curso: "Comportamiento Ético", tipo: "transversal", enfoque: "Ética profesional, bioética, derechos del paciente y secreto profesional del enfermero técnico." },
        { curso: "Organización y Constitución de Empresas", tipo: "transversal", enfoque: "Plan de negocio, SUNAT y trámites para crear servicios técnicos de salud independientes." },
        { curso: "Atención en Salud Materna", tipo: "especialidad", enfoque: "Apoyo en control prenatal, signos de alarma en gestantes, cuidados en parto y puerperio y orientación en planificación familiar." },
        { curso: "Salud del Niño y Adolescente", tipo: "especialidad", enfoque: "Control de crecimiento y desarrollo (CRED), evaluación antropométrica, esquema nacional de vacunación y AIEPI." },
        { curso: "Asistencia al Adulto Mayor", tipo: "especialidad", enfoque: "Valoración geriátrica integral, síndromes geriátricos y prevención de úlceras por presión." },
        { curso: "Asistencia de Enfermería en Salud Mental", tipo: "especialidad", enfoque: "Cuidados en depresión, ansiedad, adicciones y otros trastornos; administración segura de medicamentos y salud mental comunitaria." }
      ]
    },
    campoLaboral: ["Postas y centros de salud", "Clínicas y policlínicos", "Atención domiciliaria y cuidado de adultos mayores", "Programas de vacunación y salud comunitaria"],
    herramientasIA: ["Historias clínicas digitales", "Telesalud y seguimiento a distancia", "Alertas y apoyo a la decisión (no reemplazan al personal)"],
    mercado: "La población envejece y la atención de salud sigue siendo una necesidad constante. La tecnología ayuda con registros y seguimiento, pero el cuidado humano directo no se automatiza.",
    guiaPadres: {
      convieneHijo: "Conviene si su hijo/a es empático/a, responsable y se siente bien ayudando a otros. Antes de decidir, conviene que conozca un centro de salud para saber si tolera el ambiente.",
      porQueElegir: "Es un trabajo con demanda estable y con contacto directo con la comunidad. El título es técnico y permite empezar a trabajar en 3 años.",
      iaTemorOReto: "La IA puede ayudar con registros y alertas, pero no puede tomar la mano de un paciente ni acompañar a un adulto mayor. El reto es aprender a usar bien los sistemas digitales.",
      campoExtendido: "Postas, clínicas, domicilio, vacunación, salud comunitaria y apoyo en salud mental comunitaria."
    }
  },

  // ----------------------------------------------------------- Contabilidad
  {
    id: "contabilidad", nombre: "Contabilidad", categoria: "gestion", imagen: "img/plana-anime/contabilidad.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-calculator", emoji: "📊", logo: "CONT", polo: "#059669", pelo: "#78350f", estilo: "largo",
    resumen: "Aprende a registrar y analizar la información financiera de las empresas: finanzas, evaluación de proyectos, auditoría y contabilidad de entidades financieras.",
    perfil: "Egresado que apoya el registro contable, el análisis financiero, la evaluación de proyectos y la planificación de auditoría, y que puede formalizar y gestionar su propia empresa.",
    ideal: ["Eres ordenado/a, detallista y te llevas bien con los números.", "Te interesa entender cómo funcionan el dinero y las empresas.", "Quieres trabajar en oficinas o ofrecer servicios a pequeños negocios."],
    noIdeal: ["Te cuesta mantener la atención en tareas repetitivas y de mucho detalle.", "No te gusta trabajar con plazos y normas que cambian."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.etica, TRANSVERSALES.empresas,
        { curso: "Fundamentos de Finanzas", tipo: "especialidad", enfoque: "Conceptos básicos de finanzas de la empresa: dinero en el tiempo, financiamiento e indicadores." },
        { curso: "Formulación y Evaluación de Proyectos", tipo: "especialidad", enfoque: "Cómo plantear un proyecto de inversión y evaluar si es viable económicamente." },
        { curso: "Planeamiento de Auditoría", tipo: "especialidad", enfoque: "Planificación del trabajo de auditoría: objetivos, riesgos y programa de revisión." },
        { curso: "Contabilidad de Entidades Financieras", tipo: "especialidad", enfoque: "Registro contable propio de bancos, cajas y otras entidades financieras." }
      ],
      nota: "En el material recibido faltó el sílabo N.° 4 de este semestre. También se recibieron sílabos de otros semestres (aún por ubicar): Contabilidad Gubernamental I, Contabilidad de Costos, Sociedad y Economía en la Globalización, Aplicativos Informáticos e Investigación e Innovación Tecnológica."
    },
    campoLaboral: ["Asistente contable", "Auxiliar tributario y de planillas", "Apoyo en auditoría", "Contabilidad para pequeños negocios y emprendimientos", "Atención en entidades financieras"],
    herramientasIA: ["Lectura automática de facturas y comprobantes (OCR)", "Conciliación bancaria asistida", "Hojas de cálculo y reportes con ayuda de IA", "Sistemas de facturación electrónica"],
    mercado: "Toda empresa formal necesita llevar su contabilidad y cumplir con SUNAT. Las tareas repetitivas se automatizan, por lo que gana valor quien interpreta, asesora y entiende la norma.",
    guiaPadres: {
      convieneHijo: "Conviene si su hijo/a es ordenado/a, responsable y tiene facilidad con los números. Es una carrera tranquila, de oficina, y también permite ofrecer servicios a negocios de la zona.",
      porQueElegir: "Todas las empresas y negocios formales necesitan contabilidad. Se puede trabajar en una empresa o por cuenta propia con pequeños clientes.",
      iaTemorOReto: "La IA automatiza el registro de comprobantes y cálculos repetitivos. Lo que no reemplaza es el criterio, la asesoría y la responsabilidad profesional: el reto es pasar de 'digitar' a 'analizar'.",
      campoExtendido: "Empresas, estudios contables, entidades financieras, auditoría de apoyo y asesoría a MYPEs."
    }
  },

  // ----------------------------------------------------------- Electrotecnia
  {
    id: "electrotecnia", nombre: "Electricidad Industrial / Electrotecnia Industrial", categoria: "ingenieria", imagen: "img/plana-anime/electricidad.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-bolt", emoji: "⚡", logo: "ELEC", polo: "#ea580c", pelo: "#ca8a04", estilo: "puas",
    resumen: "Aprende control automático, electrónica de potencia, y electroneumática y electrohidráulica para instalar, operar y mantener sistemas eléctricos y automatizados.",
    perfil: "Egresado que modela, programa y regula sistemas automatizados, trabaja con variadores y convertidores de potencia y diseña e implementa circuitos de mando eléctrico, neumático e hidráulico.",
    ideal: ["Te gusta entender cómo funcionan las máquinas y los circuitos.", "Eres cuidadoso/a y respetas las normas de seguridad.", "Prefieres trabajo práctico en planta, taller u obra."],
    noIdeal: ["No te sientes cómodo con riesgos eléctricos ni con seguir procedimientos de seguridad al pie de la letra.", "Prefieres trabajo solo de escritorio."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.etica, TRANSVERSALES.empresas,
        { curso: "Sistema de Control Automático", tipo: "especialidad", enfoque: "Estudio, modelado, programación y regulación de sistemas automatizados en entornos industriales." },
        { curso: "Electrónica de Potencia Aplicada", tipo: "especialidad", enfoque: "Dispositivos de conmutación de alta potencia, convertidores, variadores de velocidad y control de carga eléctrica industrial." },
        { curso: "Electroneumática y Electrohidráulica", tipo: "especialidad", enfoque: "Diseño, simulación e implementación de circuitos de mando neumático e hidráulico con control eléctrico y automatismos." }
      ]
    },
    campoLaboral: ["Técnico en mantenimiento eléctrico industrial", "Operador/a de sistemas automatizados", "Instalador/a de tableros y circuitos de mando", "Técnico en variadores y control de motores"],
    herramientasIA: ["Mantenimiento predictivo con sensores", "Simuladores de circuitos y automatización", "Sistemas de supervisión de planta (SCADA/PLC)"],
    mercado: "Las plantas industriales, edificios y servicios necesitan mantener sistemas eléctricos y automatizados. Con más sensores y automatización, crece la necesidad de técnicos que sepan diagnosticarlos.",
    guiaPadres: {
      convieneHijo: "Conviene si su hijo/a es curioso/a con aparatos, cuidadoso/a y disciplinado/a con la seguridad. Es una carrera práctica, con mucho taller.",
      porQueElegir: "Los sistemas eléctricos y automatizados se necesitan en fábricas, edificios y servicios, y exigen técnicos con criterio y práctica.",
      iaTemorOReto: "La IA ayuda a predecir fallas, pero no cambia un variador ni revisa un tablero. El reto es aprender automatización moderna además de lo básico.",
      campoExtendido: "Industria, mantenimiento, automatización, instalaciones y servicios técnicos."
    }
  },

  // ----------------------------------------------------------- Automotriz
  {
    id: "automotriz", nombre: "Mecatrónica Automotriz", categoria: "ingenieria", imagen: "img/plana-anime/mecatronica.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-car-side", emoji: "🚗", logo: "AUTO", polo: "#dc2626", pelo: "#27272a", estilo: "puas",
    resumen: "Aprende motores de combustión interna a gasolina (ciclo Otto), pruebas en laboratorio de motores y conversión a combustibles alternos como GLP y GNV.",
    perfil: "Egresado que desarma, diagnostica, repara y da mantenimiento a motores, mide tolerancias con instrumentos de precisión y realiza la conversión de vehículos a combustibles alternos.",
    ideal: ["Te apasionan los autos y los motores.", "Eres hábil con las manos y te gusta resolver fallas.", "Te ves trabajando en taller o con tu propio negocio."],
    noIdeal: ["No toleras el trabajo con grasa, ruido y esfuerzo físico.", "No te gusta seguir procedimientos de seguridad en taller."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.etica,
        { curso: "Motores de Combustión Interna Otto", tipo: "especialidad", enfoque: "Estructura, funcionamiento, diagnóstico, desarmado, reparación y mantenimiento de motores a gasolina de ciclo Otto." },
        { curso: "Laboratorio de Motores", tipo: "especialidad", enfoque: "Pruebas de rendimiento, medición de tolerancias, uso de instrumentos de precisión y diagnóstico de fallas del motor." },
        { curso: "Conversión de Motores a Combustibles Alternos", tipo: "especialidad", enfoque: "Instalación, regulación y mantenimiento de sistemas de conversión a GLP, GNV y otros combustibles alternativos." }
      ],
      nota: "En el listado recibido apareció también 'Atención en Salud Materna' para esta carrera; parece un error de archivo (es un curso de Enfermería) y no se incluyó. Conviene confirmarlo con el área académica."
    },
    campoLaboral: ["Mecánico/a de talleres y concesionarias", "Técnico en conversión a GLP/GNV", "Mantenimiento de flotas de transporte", "Taller propio"],
    herramientasIA: ["Escáneres de diagnóstico electrónico", "Bases de datos de fallas y manuales digitales", "Telemetría de flotas"],
    mercado: "El parque automotor es grande y siempre necesita mantenimiento. Los autos incorporan más electrónica (y llegan los híbridos y eléctricos), así que el técnico que se actualiza tiene ventaja.",
    guiaPadres: {
      convieneHijo: "Conviene si a su hijo/a le gustan los motores y trabajar con las manos. Es una carrera muy práctica que permite abrir un taller propio con el tiempo.",
      porQueElegir: "Los vehículos necesitan mantenimiento sin importar la economía, y hay opción de emprender con inversión gradual.",
      iaTemorOReto: "La IA ayuda a diagnosticar, pero alguien debe desarmar, reparar y comprobar. El reto es actualizarse en electrónica y vehículos híbridos o eléctricos.",
      campoExtendido: "Talleres, concesionarias, transporte, conversión a gas y emprendimiento propio."
    }
  },

  // ----------------------------------------------------------- Mecánica de Producción
  {
    id: "mecanica-prod", nombre: "Mecánica de Producción Industrial", categoria: "ingenieria", imagen: "img/plana-anime/mecanica-produccion.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-gears", emoji: "⚙️", logo: "MEC", polo: "#475569", pelo: "#44403c", estilo: "corto",
    resumen: "Aprende modelería y fundición, moldes permanentes, matrices para chapa metálica y tratamientos térmicos y ensayos de materiales.",
    perfil: "Egresado que elabora modelos y piezas fundidas, trabaja con moldes y matrices de chapa, aplica tratamientos térmicos y realiza ensayos para controlar la calidad de las piezas.",
    ideal: ["Te gusta fabricar piezas y ver cómo se transforma el metal.", "Eres preciso/a y paciente con las medidas.", "Disfrutas el trabajo de taller."],
    noIdeal: ["No toleras ambientes de taller con calor, ruido y trabajo físico.", "Te cuesta ser preciso con medidas pequeñas."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.empresas,
        { curso: "Modelería y Fundición", tipo: "especialidad", enfoque: "Elaboración de modelos y fundición de piezas metálicas." },
        { curso: "Moldes Permanentes", tipo: "especialidad", enfoque: "Diseño y uso de moldes permanentes para producción de piezas." },
        { curso: "Matrices de Chapas", tipo: "especialidad", enfoque: "Matrices para corte y conformado de chapa metálica." },
        { curso: "Tratamiento Térmico y Ensayos", tipo: "especialidad", enfoque: "Tratamientos térmicos de metales y ensayos para verificar sus propiedades." }
      ],
      nota: "En el material recibido no apareció el sílabo de Comportamiento Ético para esta carrera; puede haber sido omitido."
    },
    campoLaboral: ["Operador/a de fundición y moldes", "Matricero/a en talleres metalmecánicos", "Técnico en tratamientos térmicos y ensayos", "Mantenimiento mecánico industrial", "Taller propio de metalmecánica"],
    herramientasIA: ["Diseño asistido por computadora (CAD/CAM)", "Máquinas CNC", "Control de calidad con inspección automática"],
    mercado: "La industria y la construcción siempre necesitan piezas y reparación. Quien suma CAD/CAM y CNC a la habilidad manual tiene más oportunidades.",
    guiaPadres: {
      convieneHijo: "Conviene si su hijo/a es preciso/a, le gusta fabricar cosas y no le molesta el taller. Es una carrera que forma oficio de alto valor.",
      porQueElegir: "Las fábricas y talleres necesitan técnicos que sepan fabricar y reparar piezas; también permite montar un taller propio.",
      iaTemorOReto: "La automatización cambia las máquinas, pero se requiere gente que las prepare, mantenga y controle. El reto es aprender CNC y diseño digital.",
      campoExtendido: "Metalmecánica, fundición, matricería, mantenimiento industrial y emprendimiento."
    }
  },

  // ----------------------------------------------------------- Química Industrial
  {
    id: "quimica", nombre: "Química Industrial", categoria: "ingenieria", imagen: "img/plana-anime/quimica.jpg",
    duracion: "3 años (6 semestres)", icono: "fa-flask", emoji: "🧪", logo: "QUIM", polo: "#7c3aed", pelo: "#0f766e", estilo: "bob",
    resumen: "Aprende control de calidad de productos inorgánicos, tratamiento de aguas residuales industriales, metrología y sistemas de calidad (ISO 9001 e ISO/IEC 17025).",
    perfil: "Egresado que analiza insumos y productos en laboratorio, opera procesos de tratamiento de efluentes, calibra y verifica equipos y aplica sistemas de calidad con cumplimiento ambiental (LMP y ECA).",
    ideal: ["Te interesan los experimentos, los análisis y la ciencia aplicada.", "Eres ordenado/a, puntual con los procedimientos y cuidas la seguridad.", "Te importa el medio ambiente y la calidad."],
    noIdeal: ["Te incomoda trabajar con reactivos y protocolos estrictos.", "No te gusta registrar datos con mucho detalle."],
    silabos: {
      periodo: "V semestre · turno noche · 2025-I",
      unidades: [
        TRANSVERSALES.comunicacion, TRANSVERSALES.etica, TRANSVERSALES.empresas,
        { curso: "Control de Calidad de Productos Químicos Inorgánicos", tipo: "especialidad", enfoque: "Muestreo, análisis gravimétrico, volumétrico e instrumental, preparación de soluciones y verificación según normas (NTP, ASTM, ISO)." },
        { curso: "Tratamiento de Efluentes Industriales", tipo: "especialidad", enfoque: "Caracterización de aguas residuales (DBO, DQO, SST, pH), sedimentación, neutralización, coagulación-floculación y cumplimiento de LMP y ECA." },
        { curso: "Metrología", tipo: "especialidad", enfoque: "Sistema Internacional de Unidades, incertidumbre de medición, calibración y mantenimiento de balanzas, pH-metros y espectrofotómetros." },
        { curso: "Sistemas de Calidad", tipo: "especialidad", enfoque: "ISO 9001 e ISO/IEC 17025, cartas de control, auditorías internas, procedimientos estandarizados y gestión de no conformidades." }
      ]
    },
    campoLaboral: ["Auxiliar/técnico de laboratorio de control de calidad", "Operador/a de plantas de tratamiento de agua y efluentes", "Técnico en metrología y calibración", "Apoyo en sistemas de gestión de calidad", "Industria de alimentos, bebidas, cosmética, minería y manufactura"],
    herramientasIA: ["Sistemas de gestión de laboratorio (LIMS)", "Análisis estadístico y cartas de control automáticas", "Sensores y monitoreo ambiental"],
    mercado: "Las empresas deben demostrar calidad y cumplir normas ambientales. Eso mantiene la demanda de técnicos de laboratorio, calidad y tratamiento de efluentes.",
    guiaPadres: {
      convieneHijo: "Conviene si su hijo/a es curioso/a por la ciencia, ordenado/a y cuidadoso/a con los procedimientos. Es una carrera menos conocida que puede abrir puertas en industria y control de calidad.",
      porQueElegir: "Todas las industrias deben controlar su calidad y cuidar el ambiente; son puestos técnicos y a menudo estables.",
      iaTemorOReto: "La IA ayuda con datos y estadísticas, pero las muestras se toman, se miden y se verifican en el laboratorio. El reto es dominar equipos y normas de calidad.",
      campoExtendido: "Laboratorios, plantas industriales, tratamiento de agua, calidad y metrología."
    }
  }
];

// Compatibilidad con el modal anterior (mallaDetallada / modulos): se genera con los sílabos reales.
CARRERAS_DATA.forEach(c => {
  c.moduloPrincipal = c.silabos.unidades.filter(u => u.tipo === "especialidad").map(u => u.curso).join(" · ");
  c.mallaDetallada = [
    { semestre: "Semestre V (" + c.silabos.periodo + ")", cursos: c.silabos.unidades.map(u => u.curso) },
    { semestre: "Semestres I, II, III, IV y VI", cursos: [SEMESTRE_PENDIENTE] }
  ];
  c.modulos = c.silabos.unidades.filter(u => u.tipo === "especialidad").map(u => u.curso + ": " + u.enfoque);
});

// Preguntas frecuentes de padres de familia (respuestas prudentes, sin datos inventados)
const PADRES_FAQ = [
  { p: "¿Cuesta dinero estudiar?", r: "El instituto es público: la formación es gratuita. Lo que sí suele haber es un pago por inscripción al examen de admisión y gastos propios (útiles, uniforme, materiales de taller). Los montos cambian cada año: confírmelos en seoane.edu.pe o en secretaría." },
  { p: "¿Qué título se obtiene y cuánto dura?", r: "Son carreras de 3 años (6 semestres) y se obtiene un título técnico a nombre de la Nación. La denominación exacta del título y los requisitos de titulación están en el reglamento del instituto: confírmelos en secretaría." },
  { p: "¿Es mejor una carrera técnica de 3 años que una universitaria?", r: "No es una competencia: son caminos distintos. La carrera técnica es más corta, práctica y orientada a empezar a trabajar antes; la universitaria es más larga y más teórica. Lo importante es que la carrera encaje con los gustos y habilidades de su hijo/a, y que tenga ganas de aprender. Con un título técnico también se puede seguir estudiando después." },
  { p: "¿La inteligencia artificial va a dejar sin trabajo a mi hijo/a?", r: "La IA automatiza tareas repetitivas, pero cambia los trabajos más de lo que los elimina. Lo que más protege es ser alguien que sepa usar la tecnología, tenga práctica en su oficio, criterio y responsabilidad. Por eso conviene elegir una carrera con práctica real y animar a su hijo/a a aprender a usar herramientas de IA en su especialidad." },
  { p: "¿Cómo sé si una carrera le conviene a mi hijo/a?", r: "Pregúntele qué disfruta hacer, qué se le da bien y qué tipo de trabajo imagina. Revise la tarjeta de cada carrera (qué aprende, para quién es y para quién no es) y haga con él/ella el Test Vocacional. Si es posible, visiten el instituto o hablen con egresados." },
  { p: "¿Hay turno noche para quien trabaja?", r: "Los sílabos que hemos revisado corresponden al turno noche, y el instituto atiende en turno diurno y nocturno. La disponibilidad por carrera y turno cambia: confírmela en secretaría." },
  { p: "¿Dónde queda y cómo llego?", r: "Av. Fernando Wiesse, cuadra 44, cerca de la estación Bayóvar de la Línea 1 del Metro de Lima, en San Juan de Lurigancho." }
];
