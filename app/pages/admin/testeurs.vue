<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">Testeurs</h1>
      <p class="mt-1 text-sm text-slate-600">
        Inscriptions via la landing page pour télécharger l’APK Android (version test).
      </p>
    </div>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Total testeurs
        </p>
        <p class="mt-2 text-3xl font-semibold tabular-nums text-[#020B51]">
          {{ formatInt(listTotal) }}
        </p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Liste des testeurs</h2>
        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label class="relative block w-full min-w-[220px] max-w-md">
            <span class="sr-only">Rechercher</span>
            <input
              v-model="searchInput"
              type="search"
              placeholder="Rechercher par nom, email, téléphone…"
              class="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"
            />
            <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path stroke-linecap="round" d="m20 20-3.5-3.5" />
              </svg>
            </span>
          </label>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <span class="text-sm text-slate-600">
              <template v-if="listTotal > 0">
                {{ pageFirst }}-{{ pageLast }} sur {{ formatInt(listTotal) }}
              </template>
              <template v-else>Aucun résultat</template>
            </span>
            <button
              type="button"
              class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              :disabled="page <= 0 || loading"
              aria-label="Page précédente"
              @click="goPage(page - 1)"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
              :disabled="page >= totalPages - 1 || loading"
              aria-label="Page suivante"
              @click="goPage(page + 1)"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="loadError"
        class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
      >
        {{ loadError }}
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-3 py-3 font-medium sm:px-4">Date d'inscription</th>
              <th class="px-3 py-3 font-medium sm:px-4">Prénom</th>
              <th class="px-3 py-3 font-medium sm:px-4">Nom</th>
              <th class="px-3 py-3 font-medium sm:px-4">E-mail</th>
              <th class="px-3 py-3 font-medium sm:px-4">Téléphone</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                Chargement…
              </td>
            </tr>
            <tr v-else-if="!items.length">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                Aucun testeur inscrit pour le moment.
              </td>
            </tr>
            <tr v-for="row in items" :key="row.id">
              <td class="px-3 py-3 whitespace-nowrap sm:px-4">{{ formatDate(row.createdAt) }}</td>
              <td class="px-3 py-3 sm:px-4">{{ row.prenom }}</td>
              <td class="px-3 py-3 sm:px-4">{{ row.nom }}</td>
              <td class="px-3 py-3 sm:px-4">
                <a
                  :href="`mailto:${row.email}`"
                  class="text-[#020B51] underline-offset-2 hover:underline"
                >
                  {{ row.email }}
                </a>
              </td>
              <td class="px-3 py-3 whitespace-nowrap sm:px-4">
                <a
                  v-if="row.telephone"
                  :href="`tel:${row.telephone}`"
                  class="text-[#020B51] underline-offset-2 hover:underline"
                >
                  {{ row.telephone }}
                </a>
                <span v-else>—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type TesteurItem = {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  createdAt: string
  updatedAt: string
}

const PAGE_SIZE = 20

const items = ref<TesteurItem[]>([])
const listTotal = ref(0)
const page = ref(0)
const loading = ref(false)
const loadError = ref<string | null>(null)
const searchInput = ref('')
let searchDebounce: ReturnType<typeof setTimeout> | null = null

const totalPages = computed(() =>
  Math.max(1, Math.ceil(listTotal.value / PAGE_SIZE)),
)

const pageFirst = computed(() =>
  listTotal.value === 0 ? 0 : page.value * PAGE_SIZE + 1,
)

const pageLast = computed(() =>
  Math.min(listTotal.value, (page.value + 1) * PAGE_SIZE),
)

function formatInt(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function unwrapTesteursResponse(raw: unknown): { total: number; items: TesteurItem[] } {
  if (!raw || typeof raw !== 'object') {
    return { total: 0, items: [] }
  }
  const r = raw as Record<string, unknown>
  if ('data' in r && r.data && typeof r.data === 'object') {
    const inner = r.data as Record<string, unknown>
    return {
      total: Number(inner.total ?? 0),
      items: (inner.items as TesteurItem[]) ?? [],
    }
  }
  if ('items' in r) {
    return {
      total: Number(r.total ?? 0),
      items: (r.items as TesteurItem[]) ?? [],
    }
  }
  return { total: 0, items: [] }
}

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const query: Record<string, string | number> = {
      limit: PAGE_SIZE,
      offset: page.value * PAGE_SIZE,
    }
    const q = searchInput.value.trim()
    if (q) query.q = q

    const raw = await fetchAdminApi<unknown>('/admin/testeurs', { query })
    const res = unwrapTesteursResponse(raw)
    listTotal.value = res.total
    items.value = res.items ?? []
  } catch (e: unknown) {
    const msg =
      e && typeof e === 'object' && 'message' in e
        ? String((e as Error).message)
        : 'Erreur de chargement'
    loadError.value = msg
    items.value = []
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  page.value = Math.max(0, Math.min(p, totalPages.value - 1))
}

watch(page, () => {
  void load()
})

watch(searchInput, () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    if (page.value !== 0) {
      page.value = 0
    } else {
      void load()
    }
  }, 350)
})

onMounted(() => {
  void load()
})

onUnmounted(() => {
  if (searchDebounce) clearTimeout(searchDebounce)
})

useHead({
  title: 'Testeurs',
})
</script>
