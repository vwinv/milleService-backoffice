/** Durée par défaut alignée sur le JWT Nest (24h). */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24
const ADMIN_SESSION_REMEMBER_MAX_AGE_SEC = 60 * 60 * 24 * 30

const COOKIE_NAMES = {
  token: 'admin_access_token',
  role: 'admin_role',
  displayName: 'admin_display_name',
} as const

function isHttpsContext(): boolean {
  if (import.meta.client && typeof window !== 'undefined') {
    return window.location.protocol === 'https:'
  }
  return process.env.NODE_ENV === 'production'
}

/** Options identiques partout (obligatoire pour que Nuxt persiste les cookies au refresh). */
function adminCookieOptions(maxAge: number) {
  return {
    path: '/',
    sameSite: 'lax' as const,
    secure: isHttpsContext(),
    maxAge,
  }
}

function readTokenFromStorage(): string | null {
  if (!import.meta.client) return null
  return localStorage.getItem(COOKIE_NAMES.token)
}

function readRoleFromStorage(): string | null {
  if (!import.meta.client) return null
  return localStorage.getItem(COOKIE_NAMES.role)
}

export function useAdminSessionCookies(maxAge = ADMIN_SESSION_MAX_AGE_SEC) {
  const opts = adminCookieOptions(maxAge)
  return {
    accessToken: useCookie<string | null>(COOKIE_NAMES.token, opts),
    role: useCookie<string | null>(COOKIE_NAMES.role, opts),
    displayName: useCookie<string | null>(COOKIE_NAMES.displayName, opts),
  }
}

/** Restaure les cookies depuis localStorage (navigation client / refresh SPA). */
export function hydrateAdminSessionFromStorage() {
  if (!import.meta.client) return

  const storedToken = readTokenFromStorage()
  const storedRole = readRoleFromStorage()
  const storedName = localStorage.getItem(COOKIE_NAMES.displayName)

  if (!storedToken || storedRole !== 'ADMIN') return

  const remember =
    localStorage.getItem('admin_session_remember') === '1'
  const maxAge = remember
    ? ADMIN_SESSION_REMEMBER_MAX_AGE_SEC
    : ADMIN_SESSION_MAX_AGE_SEC
  const cookies = useAdminSessionCookies(maxAge)

  if (!cookies.accessToken.value) {
    cookies.accessToken.value = storedToken
  }
  if (!cookies.role.value) {
    cookies.role.value = 'ADMIN'
  }
  if (storedName && !cookies.displayName.value) {
    cookies.displayName.value = storedName
  }
}

export function getAdminAccessToken(): string | null {
  hydrateAdminSessionFromStorage()
  const cookies = useAdminSessionCookies()
  return cookies.accessToken.value || readTokenFromStorage()
}

export function isAdminAuthenticated(): boolean {
  hydrateAdminSessionFromStorage()
  const cookies = useAdminSessionCookies()
  const token = cookies.accessToken.value || readTokenFromStorage()
  const role = cookies.role.value || readRoleFromStorage()
  return Boolean(token) && role === 'ADMIN'
}

export function setAdminSession(params: {
  accessToken: string
  displayName: string
  remember?: boolean
}) {
  const remember = params.remember === true
  const maxAge = remember
    ? ADMIN_SESSION_REMEMBER_MAX_AGE_SEC
    : ADMIN_SESSION_MAX_AGE_SEC
  const cookies = useAdminSessionCookies(maxAge)

  cookies.accessToken.value = params.accessToken
  cookies.role.value = 'ADMIN'
  cookies.displayName.value = params.displayName

  if (import.meta.client) {
    localStorage.setItem(COOKIE_NAMES.token, params.accessToken)
    localStorage.setItem(COOKIE_NAMES.role, 'ADMIN')
    localStorage.setItem(COOKIE_NAMES.displayName, params.displayName)
    localStorage.setItem('admin_session_remember', remember ? '1' : '0')
  }
}

export function clearAdminSession() {
  const cookies = useAdminSessionCookies(0)
  cookies.accessToken.value = null
  cookies.role.value = null
  cookies.displayName.value = null

  if (import.meta.client) {
    localStorage.removeItem(COOKIE_NAMES.token)
    localStorage.removeItem(COOKIE_NAMES.role)
    localStorage.removeItem(COOKIE_NAMES.displayName)
    localStorage.removeItem('admin_session_remember')
  }
}
