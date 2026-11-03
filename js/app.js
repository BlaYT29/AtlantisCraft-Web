/* Formulario de postulación AtlantisCraft.
   En modo preview no envía datos a Supabase. */
(() => {
  "use strict";

  const config = window.ATLANTIS_CONFIG;
  const modal = document.getElementById("beta-modal");
  const openButton = document.getElementById("open-beta");
  const closeButton = document.getElementById("close-beta");
  const form = document.getElementById("beta-form");
  const submitButton = document.getElementById("submit-beta");
  const notice = document.getElementById("preview-notice");
  const message = document.getElementById("form-message");
  const captchaContainer = document.getElementById("turnstile-container");

  const ready = Boolean(
    config &&
    !config.previewMode &&
    config.supabasePublishableKey &&
    config.turnstileSiteKey &&
    config.functionUrl
  );

  let widgetId = null;
  let challengeToken = "";
  let sending = false;

  function showMessage(text, state = "") {
    message.textContent = text;
    if (state) message.dataset.state = state;
    else delete message.dataset.state;
  }

  function updateButton() {
    submitButton.disabled = !ready || sending || !challengeToken;
  }

  function resetChallenge() {
    challengeToken = "";
    if (widgetId !== null && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  }

  function loadTurnstile() {
    return new Promise((resolve, reject) => {
      if (window.turnstile) {
        resolve();
        return;
      }

      const existing = document.querySelector("script[data-atlantis-turnstile]");
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.dataset.atlantisTurnstile = "true";
      script.async = true;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function prepareTurnstile() {
    if (!ready || widgetId !== null) return;

    try {
      await loadTurnstile();
      widgetId = window.turnstile.render(captchaContainer, {
        sitekey: config.turnstileSiteKey,
        theme: "dark",
        callback: (token) => {
          challengeToken = token;
          updateButton();
          showMessage("Verificación completada. Ya puedes enviar tu solicitud.");
        },
        "expired-callback": () => {
          challengeToken = "";
          updateButton();
          showMessage("La verificación venció. Inténtalo nuevamente.", "error");
        },
        "error-callback": () => {
          challengeToken = "";
          updateButton();
          showMessage("No se pudo completar la verificación.", "error");
        },
      });
    } catch {
      showMessage("No se pudo cargar la verificación de seguridad.", "error");
    }
  }

  function openModal() {
    modal.showModal();
    window.atlantisSound?.("open");

    if (ready) {
      prepareTurnstile();
    } else {
      showMessage("Las postulaciones aún están cerradas en esta vista previa.");
    }

    updateButton();
  }

  function closeModal() {
    modal.close();
    window.atlantisSound?.("close");
  }

  openButton.addEventListener("click", openModal);
  closeButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  modal.addEventListener("close", () => showMessage(""));
  notice.hidden = ready;
  updateButton();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!ready || sending) return;

    const username = document.getElementById("minecraft-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const accepted = document.getElementById("privacy").checked;

    if (!/^[A-Za-z0-9_]{3,16}$/.test(username) ||
        !/^\S+@\S+\.\S+$/.test(email) ||
        !accepted) {
      showMessage("Revisa los datos y acepta la política de privacidad.", "error");
      return;
    }

    if (!challengeToken) {
      showMessage("Completa la verificación de seguridad.", "error");
      return;
    }

    sending = true;
    updateButton();
    showMessage("Enviando solicitud…");

    try {
      const response = await fetch(config.functionUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          apikey: config.supabasePublishableKey,
        },
        body: JSON.stringify({
          minecraft_username: username,
          email,
          privacy_accepted: accepted,
          turnstile_token: challengeToken,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `No se pudo enviar (HTTP ${response.status}).`);
      }

      showMessage(data.message || "Solicitud registrada correctamente.", "success");
      form.reset();
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Ocurrió un error al enviar la solicitud.",
        "error"
      );
    } finally {
      sending = false;
      resetChallenge();
      updateButton();
    }
  });
})();
