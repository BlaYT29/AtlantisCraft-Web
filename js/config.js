/* Configuración pública de AtlantisCraft.
   NO pongas aquí Turnstile Secret Key ni claves de servicio de Supabase. */
window.ATLANTIS_CONFIG = Object.freeze({
  // Función Edge del proyecto AtlantisCraft (NUNCA Rayckington).
  functionUrl: "https://xguuuulnphqncwmymklz.supabase.co/functions/v1/solicitar-beta",

  // Supabase > AtlantisCraft 2027 > Settings > API Keys > Publishable key.
  supabasePublishableKey: "sb_publishable_HbdN8AoWFlvw9BlZMpMJHQ_zkuYnuCj",

  // Cloudflare Turnstile > AtlantisCraft Beta > Site Key (NO Secret Key).
  turnstileSiteKey: "0x4AAAAAAFwBEhH9x8Xj1L_A",

  // Mantener true hasta revisar la privacidad y probar registro real en dominio.
  previewMode: true,
});
