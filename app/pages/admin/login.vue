<template>
  <section
    class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f2f2] px-4 py-10"
    aria-labelledby="admin-login-heading"
  >
    <!-- Decorative corners -->
    <div
      class="pointer-events-none absolute right-0 top-0 h-[45vh] w-[44vw] min-h-[250px] min-w-[280px] bg-[#020B51]"
      style="
        clip-path: polygon(
          36% 0%,
          100% 0%,
          100% 72%,
          84% 60%,
          71% 50%,
          56% 40%,
          45% 31%,
          38% 22%,
          35% 10%
        );
      "
      aria-hidden="true"
    />
    <div
      class="pointer-events-none absolute bottom-0 left-0 h-[40vh] w-[52vw] min-h-[250px] min-w-[320px] bg-[#020B51]"
      style="
        clip-path: polygon(
          0% 0%,
          0% 100%,
          76% 100%,
          66% 90%,
          57% 82%,
          47% 74%,
          36% 66%,
          24% 58%,
          11% 50%,
          4% 44%,
          0% 36%
        );
      "
      aria-hidden="true"
    />

    <div class="relative z-10 w-full max-w-md">
      <form
        class="rounded-2xl bg-transparent p-2 sm:p-4"
        @submit.prevent="submitLogin"
      >
        <div class="mb-10 flex flex-col items-center">
          <img
            src="/images/logo.png"
            alt="Mille Services"
            class="h-20 w-auto object-contain"
            width="90"
            height="90"
            loading="eager"
          />
          <h1
            id="admin-login-heading"
            class="mt-10 text-center text-3xl font-semibold tracking-tight text-[#111a4d]"
          >
            Connectez-vous
          </h1>
        </div>

        <div class="space-y-5">
          <div>
            <label
              for="email"
              class="mb-2 block text-sm font-medium text-slate-500"
            >
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="alma.lawson@example.com"
              class="h-12 w-full rounded-full border border-slate-300 bg-white px-5 text-sm text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-slate-400 focus:border-[#020B51] focus:ring-2 focus:ring-[#020B51]/20"
              autocomplete="email"
              required
            />
          </div>

          <div>
            <label
              for="password"
              class="mb-2 block text-sm font-medium text-slate-500"
            >
              Mot de passe
            </label>
            <div class="relative">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="********"
                class="h-12 w-full rounded-full border border-slate-300 bg-white px-5 pr-12 text-sm text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-slate-400 focus:border-[#020B51] focus:ring-2 focus:ring-[#020B51]/20"
                autocomplete="current-password"
                required
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 hover:text-[#020B51]"
                aria-label="Afficher ou masquer le mot de passe"
                @click="showPassword = !showPassword"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="mt-6 flex items-center justify-between gap-4 text-sm">
          <label class="inline-flex items-center gap-2 text-slate-500">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]"
            />
            <span>Se souvenir moi</span>
          </label>
          <a
            href="#"
            class="font-medium text-[#c58f73] transition hover:text-[#b47d61]"
          >
            Mot de passe oublié?
          </a>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="mx-auto mt-10 inline-flex h-12 w-full max-w-[220px] items-center justify-center rounded-full bg-[#020B51] px-6 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(2,11,81,0.22)] transition hover:bg-[#07146a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2"
        >
          {{ isSubmitting ? 'Connexion...' : 'Connexion' }}
        </button>
        <p
          v-if="errorMessage"
          class="mt-4 text-center text-sm font-medium text-red-500"
        >
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

type LoginApiResponse = {
  access_token?: string
  data?: { access_token?: string; user?: { role?: string; email?: string } }
  user?: { role?: string; email?: string }
}

async function tryAdminLogin(baseURL: string): Promise<LoginApiResponse> {
  return $fetch<LoginApiResponse>('/auth/login', {
    method: 'POST',
    baseURL,
    body: {
      email: email.value,
      password: password.value,
      role: 'ADMIN',
    },
  })
}

async function submitLogin() {
  if (isSubmitting.value) return
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const configuredBase =
      (config.public.apiBase as string) || 'http://localhost:3000'
    const candidateBases = [
      configuredBase,
      'http://[::1]:3001',
      'http://localhost:3001',
      'http://127.0.0.1:3001',
    ]
    let response: LoginApiResponse | null = null
    let lastError: unknown = null

    for (const base of candidateBases) {
      try {
        response = await tryAdminLogin(base)
        break
      } catch (err) {
        lastError = err
      }
    }

    if (!response) throw lastError ?? new Error('Aucune API disponible')

    const accessToken = response.access_token ?? response.data?.access_token
    const userRole = response.user?.role ?? response.data?.user?.role
    const userEmail = response.user?.email ?? response.data?.user?.email

    if (!accessToken || userRole !== 'ADMIN') {
      throw new Error('Connexion admin invalide')
    }

    const oneDay = 60 * 60 * 24
    const cookieMaxAge = rememberMe.value ? 60 * 60 * 24 * 30 : oneDay

    useCookie('admin_access_token', {
      sameSite: 'lax',
      secure: false,
      maxAge: cookieMaxAge,
      path: '/',
    }).value = accessToken

    useCookie('admin_role', {
      sameSite: 'lax',
      secure: false,
      maxAge: cookieMaxAge,
      path: '/',
    }).value = 'ADMIN'

    const displayName = userEmail?.trim() || email.value.trim() || 'Admin'
    useCookie('admin_display_name', {
      sameSite: 'lax',
      secure: false,
      maxAge: cookieMaxAge,
      path: '/',
    }).value = displayName

    if (process.client) {
      localStorage.setItem('admin_access_token', accessToken)
      localStorage.setItem('admin_role', 'ADMIN')
      localStorage.setItem('admin_display_name', displayName)
    }

    await router.push('/admin')
  } catch (err: unknown) {
    errorMessage.value =
      'Connexion impossible. Vérifiez les identifiants et que l’API backend est démarrée.'
    console.error(err)
  } finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'Connexion',
})
</script>
