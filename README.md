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
- `css/`: estilos y tokens visuales.
- `js/`: lógica de interfaz, conocimiento e IA.
- `documentos/silabos/`: sílabos PDF e inventario.
- `server.js`: servidor y API.
- `render.yaml`: configuración de referencia para Render.

## Comprobación
Abre `/api/status`. El servicio debe responder HTTP 200. El indicador de IA en la nube depende de que exista una clave válida y de la cuota del proveedor. El paquete contiene 319 archivos PDF de sílabos, pero esto no demuestra que el inventario académico esté completo o actualizado.

## Notas de esta revisión
Se corrigió la metadata de `package.json` para que identifique la versión 20. Se actualizaron estas instrucciones para reflejar la estructura real del paquete. No se incorporan documentos Word de exposición o revisión dentro de la aplicación.
