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

export function useAdminFetch() {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('admin_access_token', {
    path: '/',
    sameSite: 'lax',
  })

  const apiBases = computed(() => {
    const configured = (config.public.apiBase as string) || 'http://[::1]:3001'
    return [
      configured,
      'http://[::1]:3001',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ]
  })

  async function fetchAdminApi<T>(
    url: string,
    options?: { query?: Record<string, unknown>; body?: unknown },
    method: 'GET' | 'PATCH' | 'DELETE' | 'POST' = 'GET',
  ): Promise<T> {
    let lastError: unknown = null
    const authToken =
      token.value || (import.meta.client ? localStorage.getItem('admin_access_token') : null)

    for (const base of apiBases.value) {
      try {
        return await $fetch<T>(url, {
          method,
          baseURL: base,
          query: options?.query,
          body: options?.body,
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
        })
      } catch (error) {
        lastError = error
        if (isUnauthorized(error) && shouldRedirectOn401()) {
          clearAdminSession()
          await navigateTo('/admin/login')
          throw error
        }
      }
    }
    throw lastError ?? new Error('API admin indisponible')
  }

  return { fetchAdminApi, apiBases }
}
