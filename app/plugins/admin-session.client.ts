/**
 * Au démarrage client : recopie localStorage → cookies pour que le middleware
 * et le SSR voient la session après un refresh.
 */
export default defineNuxtPlugin(() => {
  hydrateAdminSessionFromStorage()
})
