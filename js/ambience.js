/* Movimiento lento del mundo y partículas submarinas.
   No cambia ninguna función del formulario ni utiliza acceso al micrófono. */
(() => {
  const scene = document.getElementById("scene-image");
  const particles = document.getElementById("particles");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!scene || !particles || reduceMotion) return;

  // Las partículas son decorativas; no capturan clics ni bloquean el contenido.
  const count = Math.min(30, Math.max(16, Math.round(window.innerWidth / 65)));
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < count; index += 1) {
    const bubble = document.createElement("span");
    bubble.className = "particle";
    bubble.style.left = `${(index * 37 + Math.random() * 23) % 100}%`;
    bubble.style.setProperty("--size", `${3 + Math.random() * 7}px`);
    bubble.style.setProperty("--duration", `${13 + Math.random() * 18}s`);
    bubble.style.setProperty("--delay", `-${Math.random() * 24}s`);
    bubble.style.setProperty("--drift", `${-35 + Math.random() * 70}px`);
    fragment.appendChild(bubble);
  }

  particles.appendChild(fragment);

  // Parallax mínimo para no marear ni distraer del botón de postulación.
  let nextX = 0;
  let nextY = 0;
  let currentX = 0;
  let currentY = 0;
  let frame = null;

  function tick() {
    currentX += (nextX - currentX) * 0.035;
    currentY += (nextY - currentY) * 0.035;
    scene.style.setProperty("--parallax-x", `${currentX.toFixed(2)}px`);
    scene.style.setProperty("--parallax-y", `${currentY.toFixed(2)}px`);
    frame = requestAnimationFrame(tick);
  }

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;
    nextX = ((event.clientX / window.innerWidth) - 0.5) * -12;
    nextY = ((event.clientY / window.innerHeight) - 0.5) * -8;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    } else if (!document.hidden && frame === null) {
      frame = requestAnimationFrame(tick);
    }
  });

  frame = requestAnimationFrame(tick);
})();
