export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return

  const isLoginPage = to.path === '/admin/login'

  const accessToken = useCookie<string | null>('admin_access_token')
  const adminRole = useCookie<string | null>('admin_role')

  const isAuthenticated =
    Boolean(accessToken.value) && adminRole.value === 'ADMIN'

  if (!isAuthenticated && !isLoginPage) {
    return navigateTo('/admin/login')
  }

  if (isAuthenticated && isLoginPage) {
    return navigateTo('/admin')
  }
})
