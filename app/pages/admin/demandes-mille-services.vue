<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-900 sm:text-3xl">
        Demande Mille Services
      </h1>
      <p class="mt-1 text-sm text-slate-600">
        Liste des prestations demandées par les clients et suivi des statuts.
      </p>
    </div>

    <section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="card in statCards"
        :key="card.key"
        class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {{ card.label }}
        </p>
        <p
          class="mt-2 text-2xl font-semibold tabular-nums"
          :class="card.colorClass"
        >
          {{ formatInt(stats[card.key]) }}
        </p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 class="text-lg font-semibold text-slate-800">Liste des prestations</h2>
        <div class="flex flex-wrap items-center gap-3">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <span>Filtrer par statut</span>
            <select
              v-model="statutFilter"
              class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              @change="onStatutFilterChange"
            >
              <option value="">Tous</option>
              <option
                v-for="opt in statutOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </option>
            </select>
          </label>
          <span class="text-sm text-slate-600">
            <template v-if="listTotal > 0">
              {{ pageFirst }}-{{ pageLast }} sur {{ formatInt(listTotal) }}
            </template>
            <template v-else>Aucun résultat</template>
          </span>
          <div class="flex gap-1">
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
              <th class="px-3 py-3 font-medium sm:px-4">Date</th>
              <th class="px-3 py-3 font-medium sm:px-4">Client</th>
              <th class="px-3 py-3 font-medium sm:px-4">Prestataire</th>
              <th class="px-3 py-3 font-medium sm:px-4">Service</th>
              <th class="px-3 py-3 font-medium sm:px-4">Type / tâche</th>
              <th class="px-3 py-3 font-medium sm:px-4">Statut</th>
              <th class="px-3 py-3 font-medium sm:px-4 text-right">Budget</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-if="loading" class="bg-white">
              <td colspan="7" class="px-4 py-8 text-center text-slate-500">
                Chargement…
              </td>
            </tr>
            <tr v-else-if="!items.length" class="bg-white">
              <td colspan="7" class="px-4 py-8 text-center text-slate-500">
                Aucune prestation pour ce filtre.
              </td>
            </tr>
            <tr
              v-for="row in items"
              v-else
              :key="row.id"
              class="bg-white hover:bg-slate-50/80"
            >
              <td class="whitespace-nowrap px-3 py-3 text-slate-700 sm:px-4">
                {{ formatDate(row.createdAt) }}
              </td>
              <td class="px-3 py-3 text-slate-800 sm:px-4">
                <div class="font-medium">{{ row.particulier.nomComplet }}</div>
                <div v-if="row.particulier.telephone" class="text-xs text-slate-500">
                  {{ row.particulier.telephone }}
                </div>
              </td>
              <td class="px-3 py-3 text-slate-800 sm:px-4">
                <div class="font-medium">{{ row.prestataire.nom }}</div>
                <div v-if="row.prestataire.telephone" class="text-xs text-slate-500">
                  {{ row.prestataire.telephone }}
                </div>
              </td>
              <td class="max-w-[10rem] truncate px-3 py-3 text-slate-700 sm:px-4" :title="row.serviceLibelle ?? ''">
                {{ row.serviceLibelle ?? '—' }}
              </td>
              <td class="max-w-[12rem] px-3 py-3 text-slate-700 sm:px-4">
                <span class="line-clamp-2">{{ row.typeDeTache ?? '—' }}</span>
              </td>
              <td class="px-3 py-3 sm:px-4">
                <span
                  class="inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  :class="badgeClass(row.statut)"
                >
                  {{ row.statutLabel }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-3 text-right text-slate-700 sm:px-4">
                {{ row.budget != null ? `${formatInt(row.budget)} FCFA` : '—' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

definePageMeta({
  layout: false,
})

useHead({ title: 'Demande Mille Services' })

const { fetchAdminApi } = useAdminFetch()

const PAGE_SIZE = 20

interface DemandeStats {
  total: number
  enAttente: number
  acceptee: number
  enCours: number
  terminee: number
  payee: number
  refusee: number
  annulee: number
}

interface DemandeItem {
  id: string
  statut: string
  statutLabel: string
  typeDeTache: string | null
  budget: number | null
  createdAt: string
  serviceLibelle: string | null
  particulier: { nomComplet: string; telephone: string | null }
  prestataire: { nom: string; telephone: string | null }
}

const emptyStats = (): DemandeStats => ({
  total: 0,
  enAttente: 0,
  acceptee: 0,
  enCours: 0,
  terminee: 0,
  payee: 0,
  refusee: 0,
  annulee: 0,
})

const stats = ref<DemandeStats>(emptyStats())

const items = ref<DemandeItem[]>([])
const listTotal = ref(0)
const page = ref(0)
const loading = ref(true)
const loadError = ref<string | null>(null)
const statutFilter = ref('')

const statCards = [
  { key: 'total' as const, label: 'Nombre de prestations', colorClass: 'text-slate-900' },
  { key: 'enAttente' as const, label: 'En attente', colorClass: 'text-amber-600' },
  { key: 'acceptee' as const, label: 'Acceptées', colorClass: 'text-sky-600' },
  { key: 'enCours' as const, label: 'En cours', colorClass: 'text-indigo-600' },
  { key: 'terminee' as const, label: 'Terminées', colorClass: 'text-emerald-600' },
  { key: 'payee' as const, label: 'Payées', colorClass: 'text-[#020B51]' },
  { key: 'refusee' as const, label: 'Refusées', colorClass: 'text-rose-600' },
  { key: 'annulee' as const, label: 'Annulées', colorClass: 'text-slate-500' },
]

const statutOptions = [
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'ACCEPTEE', label: 'Acceptée' },
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'TERMINEE', label: 'Terminée' },
  { value: 'PAYEE', label: 'Payée' },
  { value: 'REFUSEE', label: 'Refusée' },
  { value: 'ANNULEE', label: 'Annulée' },
]

const totalPages = computed(() =>
  listTotal.value <= 0 ? 1 : Math.ceil(listTotal.value / PAGE_SIZE),
)

const pageFirst = computed(() =>
  listTotal.value === 0 ? 0 : page.value * PAGE_SIZE + 1,
)

const pageLast = computed(() =>
  Math.min((page.value + 1) * PAGE_SIZE, listTotal.value),
)

function formatInt(n: number) {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(d)
  } catch {
    return iso
  }
}

/** Réponse brute ou enveloppée `{ data: { stats, items, total } }` (intercepteur Nest). */
function unwrapDemandesResponse(response: unknown): {
  stats: DemandeStats
  total: number
  items: DemandeItem[]
} {
  if (!response || typeof response !== 'object') {
    return { stats: emptyStats(), total: 0, items: [] }
  }
  const r = response as Record<string, unknown>
  const inner = r.data
  if (
    inner &&
    typeof inner === 'object' &&
    !Array.isArray(inner) &&
    ('items' in inner || 'stats' in inner)
  ) {
    const p = inner as Record<string, unknown>
    return {
      stats: (p.stats as DemandeStats) ?? emptyStats(),
      total: Number(p.total ?? 0),
      items: (p.items as DemandeItem[]) ?? [],
    }
  }
  if ('stats' in r && 'items' in r) {
    const p = r as Record<string, unknown>
    return {
      stats: (p.stats as DemandeStats) ?? emptyStats(),
      total: Number(p.total ?? 0),
      items: (p.items as DemandeItem[]) ?? [],
    }
  }
  return { stats: emptyStats(), total: 0, items: [] }
}

function badgeClass(statut: string) {
  switch (statut) {
    case 'EN_ATTENTE':
      return 'bg-amber-100 text-amber-900'
    case 'ACCEPTEE':
      return 'bg-sky-100 text-sky-900'
    case 'EN_COURS':
      return 'bg-indigo-100 text-indigo-900'
    case 'TERMINEE':
      return 'bg-emerald-100 text-emerald-900'
    case 'PAYEE':
      return 'bg-[#020B51]/10 text-[#020B51]'
    case 'REFUSEE':
      return 'bg-rose-100 text-rose-900'
    case 'ANNULEE':
      return 'bg-slate-100 text-slate-700'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

async function load() {
  loading.value = true
  loadError.value = null
  try {
    const query: Record<string, string | number> = {
      limit: PAGE_SIZE,
      offset: page.value * PAGE_SIZE,
    }
    if (statutFilter.value) {
      query.statut = statutFilter.value
    }
    const raw = await fetchAdminApi<unknown>('/admin/demandes-mille-services', {
      query,
    })
    const res = unwrapDemandesResponse(raw)
    stats.value = res.stats
    listTotal.value = res.total
    items.value = res.items ?? []
  } catch (e: unknown) {
    const msg = e && typeof e === 'object' && 'message' in e ? String((e as Error).message) : 'Erreur de chargement'
    loadError.value = msg
    items.value = []
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  const next = Math.max(0, Math.min(p, totalPages.value - 1))
  page.value = next
}

function onStatutFilterChange() {
  if (page.value !== 0) {
    page.value = 0
  } else {
    void load()
  }
}

watch(page, () => {
  void load()
})

onMounted(() => {
  void load()
})
</script>
