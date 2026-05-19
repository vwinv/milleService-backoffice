import {
  ADMIN_SESSION_MAX_AGE_SEC,
  clearAdminSession,
  getAdminAccessToken,
} from './useAdminSession'

export { ADMIN_SESSION_MAX_AGE_SEC, clearAdminSession }

function isUnauthorized(err: unknown): boolean {
  const e = err as {
    statusCode?: number
    status?: number
    response?: { status?: number }
  }
  return e?.statusCode === 401 || e?.status === 401 || e?.response?.status === 401
}

function shouldRedirectOn401(): boolean {
  if (!import.meta.client) return false
  const path = window.location.pathname
  return path.startsWith('/admin') && path !== '/admin/login'
}

function resolveAdminApiBases(config: ReturnType<typeof useRuntimeConfig>): string[] {
  const configured = String(config.public.apiBase ?? '').trim()
  if (!configured) {
    return import.meta.dev
      ? ['http://127.0.0.1:3001', 'http://localhost:3001', 'http://[::1]:3001']
      : ['https://milleservice-backend-aacp.onrender.com']
  }
  if (configured.startsWith('https://')) {
    return [configured]
  }
  return [
    configured,
    'http://127.0.0.1:3001',
    'http://localhost:3001',
    'http://[::1]:3001',
  ]
}

export function useAdminFetch() {
  const config = useRuntimeConfig()
  const apiBases = computed(() => resolveAdminApiBases(config))

  async function fetchAdminApi<T>(
    url: string,
    options?: { query?: Record<string, unknown>; body?: unknown },
    method: 'GET' | 'PATCH' | 'DELETE' | 'POST' = 'GET',
  ): Promise<T> {
    let lastError: unknown = null
    const authToken = getAdminAccessToken()

    const bases = resolveAdminApiBases(config)
    for (const base of bases) {
      try {
        if (import.meta.dev) {
          // eslint-disable-next-line no-console
          console.debug('[admin API]', method, base + url)
        }
        return await $fetch<T>(url, {
          method,
          baseURL: base,
          query: options?.query,
          body: options?.body,
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        })
      } catch (error) {
        lastError = error
        if (import.meta.dev) {
          // eslint-disable-next-line no-console
          console.warn('[admin API] échec sur', base, error)
        }
        if (isUnauthorized(error) && shouldRedirectOn401()) {
          clearAdminSession()
          /** Rechargement complet : évite tout résidu de l’UI admin (barre latérale / layout). */
          window.location.assign('/admin/login')
          throw error
        }
      }
    }
    const hint =
      'Vérifiez que le backend Nest est démarré et que NUXT_PUBLIC_API_BASE pointe vers l’API (CORS_ORIGINS sur le backend).'
    throw lastError ?? new Error(`API admin indisponible. ${hint}`)
  }

  return { fetchAdminApi, apiBases }
}
