/* AtlantisCraft Beta V9 — audio de interfaz original.
   No utiliza el micrófono. El navegador puede bloquear música automática. */
(() => {
  "use strict";

  const music = document.getElementById("ambient-audio");
  const musicButton = document.getElementById("music-toggle");
  const musicLabel = document.getElementById("music-label");
  const fxButton = document.getElementById("fx-toggle");
  const fxLabel = document.getElementById("fx-label");
  const slider = document.getElementById("audio-volume");
  const volumeLabel = document.getElementById("volume-label");

  if (!music || !musicButton || !fxButton || !slider) return;

  let fxEnabled = true;
  let lastHoverAt = 0;
  let masterVolume = 0.6;

  try {
    const savedVolume = Number(localStorage.getItem("atlantis-audio-volume"));
    if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
      masterVolume = savedVolume;
    }
    fxEnabled = localStorage.getItem("atlantis-fx-enabled") !== "false";
  } catch {
    // Si se bloquea el almacenamiento local, los controles siguen funcionando.
  }

  const sounds = {
    hover: new Audio("assets/audio/ui-hover.ogg"),
    click: new Audio("assets/audio/ui-click-madera.ogg"),
    sword: new Audio("assets/audio/espada-desenvainar.ogg"),
    close: new Audio("assets/audio/ui-cerrar.ogg"),
  };

  const soundLevels = { hover: 0.14, click: 0.43, sword: 0.43, close: 0.31 };

  Object.values(sounds).forEach((audio) => {
    audio.preload = "auto";
  });

  function savePreference(key, value) {
    try { localStorage.setItem(key, value); } catch { /* opcional */ }
  }

  function applyVolume() {
    music.volume = 0.43 * masterVolume;
    slider.value = String(Math.round(masterVolume * 100));
    volumeLabel.value = `${Math.round(masterVolume * 100)}%`;
    Object.entries(sounds).forEach(([name, audio]) => {
      audio.volume = soundLevels[name] * masterVolume;
    });
  }

  function playEffect(name) {
    if (!fxEnabled || !sounds[name] || masterVolume === 0) return;
    if (name === "hover") {
      const now = performance.now();
      if (now - lastHoverAt < 210) return;
      lastHoverAt = now;
    }
    const audio = sounds[name];
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  function updateMusicButton() {
    const playing = !music.paused;
    musicLabel.textContent = playing ? "PAUSAR SONIDO" : "ACTIVAR SONIDO";
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", playing ? "Pausar sonido ambiental" : "Activar sonido ambiental");
  }

  function updateFxButton() {
    fxLabel.textContent = fxEnabled ? "ON" : "OFF";
    fxButton.setAttribute("aria-pressed", String(fxEnabled));
    fxButton.setAttribute("aria-label", fxEnabled ? "Desactivar efectos de interfaz" : "Activar efectos de interfaz");
  }

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const button = event.target.closest("button");
    if (button && !button.disabled && !button.contains(event.relatedTarget)) playEffect("hover");
  });

  // Un botón, un sonido: el CTA lleva la espada, los otros llevan clic de menú.
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled || button.id === "fx-toggle") return;
    if (button.id === "open-beta") playEffect("sword");
    else if (button.id === "close-beta") playEffect("close");
    else playEffect("click");
  });

  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      updateMusicButton();
      return;
    }
    try { await music.play(); } catch { /* gesto del usuario requerido */ }
    updateMusicButton();
  });

  fxButton.addEventListener("click", () => {
    fxEnabled = !fxEnabled;
    savePreference("atlantis-fx-enabled", String(fxEnabled));
    updateFxButton();
    if (fxEnabled) playEffect("click");
  });

  slider.addEventListener("input", () => {
    masterVolume = Math.max(0, Math.min(1, Number(slider.value) / 100));
    applyVolume();
    savePreference("atlantis-audio-volume", String(masterVolume));
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);

  // app.js llama a "open" y "close"; evitamos repetir la espada.
  window.atlantisSound = (name) => {
    if (name === "open" || name === "close") return;
    playEffect(name);
  };

  applyVolume();
  updateFxButton();
  updateMusicButton();
  music.play().then(updateMusicButton).catch(updateMusicButton);
})();
