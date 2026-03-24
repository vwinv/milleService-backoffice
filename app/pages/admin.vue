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
              Clients
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
              Métiers
            </NuxtLink>
            <a
              href="#"
              class="flex items-center gap-3 rounded-full px-4 py-2.5 text-slate-700 transition hover:bg-slate-100"
            >
              Wallet
            </a>
          </nav>

          <button
            type="button"
            class="mt-auto rounded-full px-4 py-2.5 text-left text-sm font-medium text-rose-400 transition hover:bg-rose-50"
            @click="logoutAdmin"
          >
            Logout
          </button>
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
                  class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm"
                  aria-label="Notifications"
                >
                  <span class="h-2 w-2 rounded-full bg-rose-500" />
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
