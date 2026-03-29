/**
 * Proxy same-origin vers l’API Nest (évite localhost dans le bundle client en prod).
 * URL client : /__nest/admin/... → backend : {apiBackend}/admin/...
 *
 * Configurer sur l’hébergeur du backoffice : NUXT_API_BACKEND=https://votre-api
 * (ou NUXT_PUBLIC_API_BASE, même valeur côté serveur).
 */
import { getRequestURL, proxyRequest } from 'h3'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const backend = String(config.apiBackend || 'http://127.0.0.1:3001').replace(
    /\/$/,
    '',
  )
  const u = getRequestURL(event)
  let path = u.pathname.replace(/^\/__nest/, '')
  if (!path || path === '') path = '/'
  const target = `${backend}${path}${u.search}`
  return proxyRequest(event, target)
})
