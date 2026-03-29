<template>
  <div
    class="min-h-screen"
    :class="isAdminLogin ? '' : 'bg-[#f3f3f3] text-slate-900'"
  >
    <template v-if="isAdminLogin">
      <NuxtPage />
    </template>

    <template v-else>
      <div class="flex min-h-screen">
        <aside
          class="hidden w-[230px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex"
        >
          <div class="mb-8 flex justify-center">
            <img
              src="/images/logo.png"
              alt="Mille Services"
              class="h-16 w-auto object-contain"
              width="72"
              height="72"
            />
          </div>

          <nav class="space-y-2 text-sm font-medium">
            <NuxtLink
              to="/admin"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path === '/admin'
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25a2.25 2.25 0 0 1-2.25 2.25H15.75a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
              Home
            </NuxtLink>
            <NuxtLink
              to="/admin/prestataires"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/prestataires')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655-5.653a2.548 2.548 0 0 1-.016-3.286l3.5-4.17a2.548 2.548 0 0 1 3.59-.02l4.17 3.5a2.548 2.548 0 0 1 .02 3.59l-4.17 3.5a2.548 2.548 0 0 1-3.286.016l-5.653-4.655Z" />
              </svg>
              Prestataires
            </NuxtLink>
            <NuxtLink
              to="/admin/clients"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/clients')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              Clients
            </NuxtLink>
            <NuxtLink
              to="/admin/demandes-mille-services"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/demandes-mille-services')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.845 2.01 9 2.973 9 4.108V15.75a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V4.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08Z" />
              </svg>
              Demande Mille Services
            </NuxtLink>
            <NuxtLink
              to="/admin/notifications"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/notifications')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg
                class="h-5 w-5 shrink-0 opacity-90"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.5 14.158V11a6.5 6.5 0 10-13 0v3.159c0 .538-.214 1.055-.595 1.437L3 17h5m8 0a3 3 0 11-6 0m6 0H9"
                />
              </svg>
              Notifications
            </NuxtLink>
            <NuxtLink
              to="/admin/services"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/services')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z" />
              </svg>
              Métiers
            </NuxtLink>
            <NuxtLink
              to="/admin/offres"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 transition"
              :class="
                route.path.startsWith('/admin/offres')
                  ? 'bg-[#020B51] text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              "
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-2.21 0-4 .895-4 2s1.79 2 4 2 4 .895 4 2-1.79 2-4 2m0-10V6m0 12v-2m9-4a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              Offres
            </NuxtLink>
            <div class="space-y-2">
              <NuxtLink
                to="/admin/wallet"
                class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 transition"
                :class="
                  isWalletHome
                    ? 'bg-[#020B51] text-white'
                    : isWalletDemandes
                      ? 'border-2 border-[#020B51] bg-white text-[#020B51]'
                      : 'text-slate-700 hover:bg-slate-100'
                "
              >
                <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0v-1.5a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 10.5V12" />
                </svg>
                Wallet
                <svg
                  class="ml-auto h-4 w-4 shrink-0 opacity-70"
                  :class="isWalletHome ? 'text-white' : ''"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </NuxtLink>
              <NuxtLink
                v-if="inWalletSection"
                to="/admin/wallet/demandes"
                :class="[
                  'flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition',
                  isWalletDemandes
                    ? 'border border-[#020B51] bg-[#020B51] text-white shadow-sm'
                    : 'border border-slate-900 bg-white text-slate-900 hover:bg-slate-50',
                ]"
              >
                Demandes
              </NuxtLink>
            </div>
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm font-medium text-rose-400 transition hover:bg-rose-50"
              @click="logoutAdmin"
            >
              <svg class="h-5 w-5 shrink-0 opacity-90" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </nav>
        </aside>

        <div ref="dashboardExportRef" class="flex min-w-0 flex-1 flex-col">
          <header class="px-4 pb-2 pt-4 sm:px-6 lg:px-8">
            <div
              class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-transparent"
            >
              <label class="relative block min-w-[220px] flex-1 max-w-xl">
                <input
                  type="search"
                  placeholder="Search"
                  class="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#020B51]/30"
                />
                <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.8"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path stroke-linecap="round" d="m20 20-3.5-3.5" />
                  </svg>
                </span>
              </label>

              <div class="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  class="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="Notifications"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75v-.109V9.75c0-5.591-3.5-10.5-8.25-10.5S1.5 4.159 1.5 9.75v.109a8.967 8.967 0 0 1-2.311 6.022 23.848 23.848 0 0 0 5.454 1.31m4.714 0a8.967 8.967 0 0 1-5.454 1.31m4.714 0 3.042 3.042 0 0 1-5.454 0" />
                  </svg>
                  <span class="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-medium text-white shadow-sm"
                >
                  <img
                    src="/images/logo.png"
                    alt=""
                    class="h-6 w-6 rounded-full bg-white object-contain p-0.5"
                    width="24"
                    height="24"
                  />
                  {{ adminDisplayName }}
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                  :disabled="isExportingPdf"
                  @click="exportDashboardPdf"
                >
                  {{ isExportingPdf ? 'Export...' : 'Exporter' }}
                </button>
              </div>
            </div>
          </header>

          <main class="px-4 pb-6 pt-2 sm:px-6 lg:px-8">
            <NuxtPage />
          </main>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const inWalletSection = computed(() => route.path.startsWith('/admin/wallet'))
const isWalletHome = computed(
  () => route.path === '/admin/wallet' || route.path === '/admin/wallet/',
)
const isWalletDemandes = computed(() => route.path.startsWith('/admin/wallet/demandes'))
const isAdminLogin = computed(() => route.path === '/admin/login')
const adminDisplayNameCookie = useCookie<string | null>('admin_display_name')
const dashboardExportRef = ref<HTMLElement | null>(null)
const isExportingPdf = ref(false)

const adminDisplayName = computed(() => {
  const raw = adminDisplayNameCookie.value?.trim()
  if (!raw) return 'Admin'
  const base = raw.includes('@') ? raw.split('@')[0] || raw : raw
  return base
    .replace(/[._-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})

onMounted(() => {
  const accessTokenCookie = useCookie<string | null>('admin_access_token').value
  const roleCookie = useCookie<string | null>('admin_role').value
  const nameCookie = useCookie<string | null>('admin_display_name').value

  if (process.client) {
    if (accessTokenCookie && !localStorage.getItem('admin_access_token')) {
      localStorage.setItem('admin_access_token', accessTokenCookie)
    }
    if (roleCookie && !localStorage.getItem('admin_role')) {
      localStorage.setItem('admin_role', roleCookie)
    }
    if (nameCookie && !localStorage.getItem('admin_display_name')) {
      localStorage.setItem('admin_display_name', nameCookie)
    }
  }
})

function logoutAdmin() {
  clearAdminSession()
  router.push('/admin/login')
}

async function exportDashboardPdf() {
  if (isExportingPdf.value || !dashboardExportRef.value) return
  isExportingPdf.value = true
  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ])

    const element = dashboardExportRef.value
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f3f3f3',
    })

    const imageData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height)
    const imgWidth = canvas.width * ratio
    const imgHeight = canvas.height * ratio
    const x = (pageWidth - imgWidth) / 2
    const y = 8

    pdf.addImage(imageData, 'PNG', x, y, imgWidth, imgHeight)
    pdf.save(`dashboard-admin-${new Date().toISOString().slice(0, 10)}.pdf`)
  } catch (error) {
    console.error('Erreur export PDF:', error)
  } finally {
    isExportingPdf.value = false
  }
}

useHead({
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} — Admin Mille Services` : 'Admin — Mille Services',
})
</script>
