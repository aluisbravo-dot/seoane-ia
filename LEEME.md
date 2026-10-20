# SeoaIA v20 — proyecto web para GitHub y Render

Esta es la carpeta del proyecto web. El documento Word de revisión y exposición se entrega por separado y NO forma parte de este proyecto.

## Ejecución local
- Requisito: Node.js 18 o superior.
- Instalar dependencias: `npm install`
- Iniciar: `npm start`
- Abrir: `http://localhost:3000` (o el puerto que indique la consola).

## Despliegue en Render
- Servicio: Web Service
- Runtime: Node
- Branch: `main`
- Root Directory: dejar vacío si el contenido está en la raíz del repositorio
- Build Command: `npm install`
- Start Command: `npm start`
- Health Check Path: `/api/status`

## Variables de entorno
Configura en Render únicamente las claves que correspondan al proveedor que usarás: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `DEEPSEEK_API_KEY`, y las opciones de modelo/proveedor descritas en `server.js`. No pongas claves reales en GitHub, HTML, JavaScript ni documentos. Usa `.env.example` como referencia y nunca publiques `.env`.

## Estructura principal
- `index.html`: página principal institucional.
- `padres.html`: página de orientación para familias.
- `mercado-laboral.html`: información del mercado laboral.
- `balotario.html`: balotario/cuestionario.
- `js/automatizaciones.js` y `css/automation.css`: centro de automatización académica (planes, tareas, prácticas, borradores y proyectos asistidos por IA).
- `css/`: estilos y tokens visuales.
- `js/`: lógica de interfaz, conocimiento e IA.
- `documentos/silabos/`: sílabos PDF e inventario.
- `server.js`: servidor y API.
- `render.yaml`: configuración de referencia para Render.

## Comprobación
Abre `/api/status`. El servicio debe responder HTTP 200. El indicador de IA en la nube depende de que exista una clave válida y de la cuota del proveedor. El paquete contiene 319 archivos PDF de sílabos, pero esto no demuestra que el inventario académico esté completo o actualizado.

## Notas de esta revisión
Se corrigió la metadata de `package.json` para que identifique la versión 20. Se actualizaron estas instrucciones para reflejar la estructura real del paquete. No se incorporan documentos Word de exposición o revisión dentro de la aplicación.

## Centro de automatización IA (v20 potenciado)
Incluye seis flujos: plan de estudio, desglose de tareas, práctica de evaluación, borrador formal, resumen de estudio y plan de proyecto tecnológico. Los resultados se generan mediante el motor IA existente y se pueden copiar o guardar en el almacenamiento local del navegador. Esto genera contenido y planes; no envía documentos ni ejecuta acciones externas por sí solo. Para IA avanzada se requiere configurar al menos un proveedor en Render; nunca publiques claves en el repositorio.


## Ajustes de voz y presentación (edición preparada)
- La voz usa la síntesis del navegador y prioriza voces en español cuyos nombres sugieren un perfil femenino; la lista real depende del sistema operativo y del navegador.
- La lectura limpia bloques de código, enlaces y símbolos comunes, y convierte operaciones sencillas como `2 x 3` a una frase más natural.
- El botón de voz de la mascota mantiene el encendido/apagado. No requiere una clave de API ni promete una voz neuronal idéntica en todos los equipos.
- Se mantienen las páginas, imágenes anime de carreras, archivos PDF y el servidor del paquete original.
- Para publicar en Render, revisar primero las variables privadas de IA y probar en Codespaces. Nunca subir `.env` al repositorio.
