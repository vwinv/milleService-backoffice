/**
 * Session admin côté navigateur : alignée sur la durée JWT (24h par défaut côté API).
 */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24

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

export function clearAdminSession() {
  if (!import.meta.client) return
  const opts = { path: '/', sameSite: 'lax' as const }
  useCookie<string | null>('admin_access_token', opts).value = null
  useCookie<string | null>('admin_role', opts).value = null
  useCookie<string | null>('admin_display_name', opts).value = null
  localStorage.removeItem('admin_access_token')
  localStorage.removeItem('admin_role')
  localStorage.removeItem('admin_display_name')
}

function resolveAdminApiBases(config: ReturnType<typeof useRuntimeConfig>): string[] {
  const configured = String(config.public.apiBase ?? '').trim()
  if (configured) {
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
  /** Mode proxy : le navigateur appelle uniquement l’origine du backoffice + /__nest */
  if (import.meta.client) {
    return [`${window.location.origin}/__nest`]
  }
  try {
    const u = useRequestURL()
    return [`${u.origin}/__nest`]
  } catch {
    return ['http://127.0.0.1:3000/__nest']
  }
}

export function useAdminFetch() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_access_token', {
    path: '/',
    sameSite: 'lax',
  })

  const apiBases = computed(() => resolveAdminApiBases(config))

  async function fetchAdminApi<T>(
    url: string,
    options?: { query?: Record<string, unknown>; body?: unknown },
    method: 'GET' | 'PATCH' | 'DELETE' | 'POST' = 'GET',
  ): Promise<T> {
    let lastError: unknown = null
    const authToken =
      token.value || (import.meta.client ? localStorage.getItem('admin_access_token') : null)

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
      'En prod : définir NUXT_API_BACKEND (URL Nest) sur l’hébergeur du backoffice, ou NUXT_PUBLIC_API_BASE pour appels directs. Sans proxy ni URL publique, le navigateur n’atteint pas l’API.'
    throw lastError ?? new Error(`API admin indisponible. ${hint}`)
  }

  return { fetchAdminApi, apiBases }
}
