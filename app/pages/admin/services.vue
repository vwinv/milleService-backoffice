<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Total Métiers</p>
            <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.total) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600"
            aria-hidden="true"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"
              />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Métiers en activités</p>
            <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ formatInt(stats.actifs) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600"
            aria-hidden="true"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"
              />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Métiers en arrêt</p>
            <p class="mt-2 text-3xl font-semibold text-rose-600">{{ formatInt(stats.inactifs) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span
            class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600"
            aria-hidden="true"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"
              />
            </svg>
          </span>
        </div>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div
        v-if="loadError"
        class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
      >
        {{ loadError }}
      </div>
      <div
        v-if="actionError"
        class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
      >
        {{ actionError }}
      </div>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-full px-6 py-2 text-sm font-medium transition"
            :class="
              activeTab === 'tous'
                ? 'bg-[#020B51] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
            @click="activeTab = 'tous'"
          >
            Tous
          </button>
          <button
            type="button"
            class="rounded-full px-6 py-2 text-sm font-medium transition"
            :class="
              activeTab === 'actifs'
                ? 'bg-[#020B51] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
            @click="activeTab = 'actifs'"
          >
            Actifs
          </button>
          <button
            type="button"
            class="rounded-full px-6 py-2 text-sm font-medium transition"
            :class="
              activeTab === 'inactifs'
                ? 'bg-[#020B51] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
            @click="activeTab = 'inactifs'"
          >
            Inactifs
          </button>
        </div>

        <button
          type="button"
          class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90"
          @click="openCreateModal"
        >
          Métiers +
        </button>
      </div>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold text-slate-800">Métiers</h2>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="font-medium">{{ pageSize }} pour {{ filteredTotal }}</span>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage <= 1 || loading"
            aria-label="Page précédente"
            @click="currentPage -= 1"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            :disabled="currentPage >= totalPages || loading"
            aria-label="Page suivante"
            @click="currentPage += 1"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Date d'ajout</th>
              <th class="px-4 py-3 font-medium">Métiers</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="loading">
              <td colspan="4" class="px-4 py-8 text-center text-slate-400">Chargement…</td>
            </tr>
            <tr v-else-if="!paginatedRows.length">
              <td colspan="4" class="px-4 py-8 text-center text-slate-400">
                <template v-if="items.length && !filteredTotal">
                  Aucun résultat pour ce filtre ({{ items.length }} service(s) en base ont un autre statut).
                  Onglet « Tous » pour tout afficher.
                </template>
                <template v-else>
                  Aucun service à afficher.
                </template>
              </td>
            </tr>
            <tr v-for="row in paginatedRows" :key="row.id">
              <td class="whitespace-nowrap px-4 py-3 text-slate-600">{{ formatDate(row.createdAt) }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ row.libelle }}</td>
              <td class="px-4 py-3">
                <button
                  type="button"
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                  :class="
                    row.actif
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                      : 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  "
                  :disabled="togglingId === row.id"
                  @click="toggleActif(row)"
                >
                  {{ togglingId === row.id ? '…' : row.actif ? 'Actifs' : 'En Arrêt' }}
                </button>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="inline-flex flex-wrap items-center justify-end gap-2">
                  <button
                    v-if="row.actif"
                    type="button"
                    class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="deactivatingId === row.id"
                    @click="onClickDesactiver(row)"
                  >
                    {{ deactivatingId === row.id ? '…' : 'Désactiver' }}
                  </button>
                  <button
                    v-else
                    type="button"
                    class="rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="togglingId === row.id"
                    @click="toggleActif(row)"
                  >
                    {{ togglingId === row.id ? '…' : 'Activer' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="modalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        @click.self="closeModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-800">Nouveau métier</h3>
          <label class="mt-4 block text-sm font-medium text-slate-700">Libellé</label>
          <input
            v-model="modalLibelle"
            type="text"
            class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]/40"
            placeholder="Ex. Plomberie"
            @keydown.enter.prevent="submitModal"
          />
          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              @click="closeModal"
            >
              Annuler
            </button>
            <button
              type="button"
              class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              :disabled="modalSaving || !modalLibelle.trim()"
              @click="submitModal"
            >
              {{ modalSaving ? 'Enregistrement…' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="blockedDeactivateOpen"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="blocked-deactivate-title"
        @click.self="blockedDeactivateOpen = false"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 id="blocked-deactivate-title" class="text-lg font-semibold text-slate-800">
            Désactivation impossible
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            Vous ne pouvez pas désactiver le service «
            <span class="font-semibold text-slate-800">{{ blockedDeactivateLibelle }}</span>
            » tant qu’au moins un prestataire y est encore rattaché ({{ blockedDeactivateCount }} actuellement).
          </p>
          <p class="mt-2 text-sm text-slate-600">
            Retirez d’abord ce métier des fiches prestataires concernées ; vous pourrez alors désactiver le service.
          </p>
          <div class="mt-6 flex justify-end">
            <button
              type="button"
              class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white"
              @click="blockedDeactivateOpen = false"
            >
              Compris
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type ServiceRow = {
  id: string
  libelle: string
  slug: string
  actif: boolean
  createdAt: string
  prestatairesCount: number
}

/** L’API Nest enveloppe les réponses dans `{ data: ... }` (ResponseInterceptor). */
function unwrapServicesListResponse(response: unknown): { items?: ServiceRow[] } {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner) && 'items' in inner) {
    return inner as { items?: ServiceRow[] }
  }
  if ('items' in r) {
    return r as { items?: ServiceRow[] }
  }
  return {}
}

const items = ref<ServiceRow[]>([])
const loading = ref(true)
const loadError = ref('')
const actionError = ref('')
const activeTab = ref<'tous' | 'actifs' | 'inactifs'>('tous')
const pageSize = 10
const currentPage = ref(1)

const togglingId = ref<string | null>(null)
const deactivatingId = ref<string | null>(null)

const blockedDeactivateOpen = ref(false)
const blockedDeactivateLibelle = ref('')
const blockedDeactivateCount = ref(0)

const modalOpen = ref(false)
const modalLibelle = ref('')
const modalSaving = ref(false)

const stats = computed(() => {
  const list = items.value
  return {
    total: list.length,
    actifs: list.filter((s) => s.actif).length,
    inactifs: list.filter((s) => !s.actif).length,
  }
})

const filteredRows = computed(() => {
  const list = items.value
  if (activeTab.value === 'tous') return list
  if (activeTab.value === 'actifs') return list.filter((s) => s.actif)
  return list.filter((s) => !s.actif)
})

const filteredTotal = computed(() => filteredRows.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredTotal.value / pageSize)))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRows.value.slice(start, start + pageSize)
})

watch(activeTab, () => {
  currentPage.value = 1
})

watch(filteredTotal, (n) => {
  const max = Math.max(1, Math.ceil(n / pageSize))
  if (currentPage.value > max) currentPage.value = max
})

onMounted(() => {
  loadServices()
})

async function loadServices() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetchAdminApi<unknown>('/admin/services')
    const payload = unwrapServicesListResponse(response)
    const raw = payload.items
    items.value = Array.isArray(raw) ? raw : []
  } catch (e) {
    console.error(e)
    items.value = []
    loadError.value = extractApiMessage(e, 'Impossible de charger les métiers.')
  } finally {
    loading.value = false
  }
}

function extractApiMessage(err: unknown, fallback: string): string {
  const e = err as { data?: { message?: string | string[] }; message?: string }
  const m = e?.data?.message
  if (typeof m === 'string' && m.trim()) return m
  if (Array.isArray(m) && m[0]) return String(m[0])
  if (e?.message && typeof e.message === 'string') return e.message
  return fallback
}

function formatInt(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function openCreateModal() {
  actionError.value = ''
  modalLibelle.value = ''
  modalOpen.value = true
}

function closeModal() {
  if (modalSaving.value) return
  modalOpen.value = false
  modalLibelle.value = ''
}

async function submitModal() {
  const libelle = modalLibelle.value.trim()
  if (!libelle || modalSaving.value) return
  modalSaving.value = true
  actionError.value = ''
  try {
    await fetchAdminApi('/admin/services', { body: { libelle } }, 'POST')
    modalOpen.value = false
    modalLibelle.value = ''
    await loadServices()
  } catch (e) {
    console.error(e)
    actionError.value = extractApiMessage(e, 'Enregistrement impossible.')
  } finally {
    modalSaving.value = false
  }
}

function openBlockedDeactivatePopup(row: ServiceRow) {
  blockedDeactivateLibelle.value = row.libelle
  blockedDeactivateCount.value = row.prestatairesCount
  blockedDeactivateOpen.value = true
}

function onClickDesactiver(row: ServiceRow) {
  if (!row.actif || deactivatingId.value) return
  if (row.prestatairesCount > 0) {
    openBlockedDeactivatePopup(row)
    return
  }
  const ok = window.confirm(
    `Désactiver le service « ${row.libelle} » ?`,
  )
  if (!ok) return
  void runDeactivateService(row)
}

async function runDeactivateService(row: ServiceRow) {
  deactivatingId.value = row.id
  actionError.value = ''
  try {
    await fetchAdminApi(`/admin/services/${row.id}`, { body: { actif: false } }, 'PATCH')
    const cur = items.value.find((x) => x.id === row.id)
    if (cur) cur.actif = false
  } catch (e) {
    console.error(e)
    actionError.value = extractApiMessage(e, 'Impossible de désactiver le service.')
  } finally {
    deactivatingId.value = null
  }
}

async function toggleActif(row: ServiceRow) {
  if (togglingId.value) return
  const next = !row.actif
  if (!next && row.prestatairesCount > 0) {
    openBlockedDeactivatePopup(row)
    return
  }
  togglingId.value = row.id
  actionError.value = ''
  try {
    await fetchAdminApi(`/admin/services/${row.id}`, { body: { actif: next } }, 'PATCH')
    const cur = items.value.find((x) => x.id === row.id)
    if (cur) cur.actif = next
  } catch (e) {
    console.error(e)
    actionError.value = extractApiMessage(e, 'Impossible de mettre à jour le statut.')
  } finally {
    togglingId.value = null
  }
}

useHead({
  title: 'Métiers',
})
</script>
