export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return

  const isLoginPage = to.path === '/admin/login'

  if (import.meta.client) {
    hydrateAdminSessionFromStorage()
  }

  const authenticated = isAdminAuthenticated()

  if (!authenticated && !isLoginPage) {
    return navigateTo('/admin/login', { replace: true })
  }

  if (authenticated && isLoginPage) {
    return navigateTo('/admin', { replace: true })
  }
})
