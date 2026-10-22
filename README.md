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
In Render, open the web service, go to **Environment**, and add `GROQ_API_KEY` with your GroqCloud API key. Keep it as a server-side environment variable; never put the key in GitHub, HTML, JavaScript, or documents. The configured model is `openai/gpt-oss-120b`; verify that it is available to your account using Groq's authenticated model catalog at `https://api.groq.com/openai/v1/models`, and set `GROQ_MODEL` in Render if you need to select another model from that list. `/api/status` reports configuration only, not a verified Groq connection; send a chat request to test the connection.

## Estructura principal
- `index.html`: página principal institucional.
- `padres.html`: página de orientación para familias.
- `mercado-laboral.html`: información del mercado laboral.
- `balotario.html`: balotario/cuestionario.
- `css/`: estilos y tokens visuales.
- `js/`: lógica de interfaz, conocimiento e IA.
- `documentos/silabos/`: sílabos PDF e inventario.
- `server.js`: servidor y API.
- `render.yaml`: configuración de referencia para Render.

## Comprobación
Abre `/api/status`. El servicio debe responder HTTP 200. El indicador de IA en la nube depende de que exista una clave válida y de la cuota del proveedor. El paquete contiene 319 archivos PDF de sílabos, pero esto no demuestra que el inventario académico esté completo o actualizado.

El test de cultura general genera cinco preguntas por tema mediante el proveedor de IA configurado en el servidor (`POST /api/quiz`). Las preguntas se guardan en caché en memoria durante seis horas y se vuelven a generar cuando alguien solicita ese tema después de vencer la caché. Si la IA no está disponible, la web utiliza las preguntas locales; el test también incluye lectura por voz del navegador, reto con tiempo y repaso de errores.

## Notas de esta revisión
Se corrigió la metadata de `package.json` para que identifique la versión 20. Se actualizaron estas instrucciones para reflejar la estructura real del paquete. No se incorporan documentos Word de exposición o revisión dentro de la aplicación.
