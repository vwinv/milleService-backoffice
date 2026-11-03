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
          {{ formatInt(items.length) }}
        </p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4">
        <h2 class="text-lg font-semibold text-slate-800">Liste des testeurs</h2>
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
            <tr v-else-if="!pageItems.length">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                Aucun testeur inscrit pour le moment.
              </td>
            </tr>
            <tr v-for="row in pageItems" :key="row.id">
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
        <AdminListPagination
          :page="page"
          :total-pages="totalPages"
          :total="listTotal"
          :page-size="pageSize"
          @update:page="goToPage"
        />
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

const items = ref<TesteurItem[]>([])
const loading = ref(false)
const loadError = ref<string | null>(null)

const {
  page,
  pageSize,
  pageItems,
  total: listTotal,
  totalPages,
  goToPage,
} = useAdminListQuery(items)

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
    const raw = await fetchAdminApi<unknown>('/admin/testeurs', {
      query: { limit: 1000, offset: 0 },
    })
    const res = unwrapTesteursResponse(raw)
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

onMounted(() => {
  void load()
})

useHead({
  title: 'Testeurs',
})
</script>
