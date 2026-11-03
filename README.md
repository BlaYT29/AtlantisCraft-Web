# AtlantisCraft Beta V9 — cierre visual

Este proyecto contiene una versión completa de la web Beta, basada en V8, sin mezclarla con los otros proyectos (`AtlantiscraftWeb`, `AtlantiscraftOficial`) ni con Rayckington.

## Instalar en Visual Studio Code
1. Haz una copia de respaldo de la carpeta `AtlantiscraftBeta` del escritorio.
2. Descomprime el ZIP. Entra a `AtlantiscraftBeta_V9` y copia **su contenido** (`index.html`, `css/`, `js/`, `assets/`, etc.) a tu carpeta `AtlantiscraftBeta`.
3. Reemplaza archivos anteriores con los mismos nombres.
4. Abre el proyecto en Visual Studio Code y ejecuta `index.html` mediante Live Server; recarga con Ctrl+F5.

## Novedades
- Antorcha alineada sobre la pequeña llama del personaje (aprox. coordenadas 571,728 de la imagen base de 1672x941).
- Música ambiental con botones `ACTIVAR SONIDO` y `PAUSAR SONIDO` y control de volumen del 0 al 100%, compartido con los FX. Se guarda tu preferencia localmente cuando el navegador lo permite.
- Nuevos sonidos originales: clic breve tipo menú de juego, hover sutil, efecto suave de desenvainar espada para el botón principal, cierre discreto. **No se utilizan archivos sonoros originales de Minecraft.**
- Barrido dorado más visible en el botón de beta, periódico y más rápido al pasar el cursor.
- Respeto a preferencias de movimiento reducido.

## Importante para las inscripciones
- El archivo `js/config.js` permanece como estaba en V8, con `previewMode: true` y sin claves.
- No se envían formularios, no se modifican tablas ni funciones en Supabase.
- Después del cierre visual faltará preparar origen web/CORS, revisar privacidad y conectar las claves **públicas** antes de probar una solicitud real.
- **Nunca** guardes `TURNSTILE_SECRET_KEY` o la clave de servicio de Supabase en los archivos de la web.

Audio de UI sintetizado para este proyecto, inspirado en menús de videojuegos. No utiliza pistas protegidas de Minecraft ni audio procedente de terceros.
