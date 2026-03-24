<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Clients actifs</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.clientsActifs) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Prestataires Actifs</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.prestatairesActifs) }}</p>
        <p class="mt-2 text-xs text-slate-400">Comptes actuellement actifs</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Crédit</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatMoney(stats.credit) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Métiers</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.metiers) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-2xl font-semibold text-slate-700">Prestataires - Clients</h2>
        <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
          <span class="inline-flex items-center gap-2"><span class="h-1.5 w-4 rounded-full bg-emerald-500" /> Prestataires</span>
          <span class="inline-flex items-center gap-2"><span class="h-1.5 w-4 rounded-full bg-yellow-400" /> Clients</span>
          <select
            v-model.number="selectedMonths"
            class="rounded-lg bg-[#020B51] px-3 py-1.5 text-white outline-none"
            aria-label="Période en mois"
          >
            <option :value="1">Sur le Mois</option>
            <option :value="3">3 Mois</option>
            <option :value="6">6 Mois</option>
            <option :value="12">12 Mois</option>
          </select>
        </div>
      </div>
      <div class="overflow-hidden rounded-xl bg-slate-50/80 p-4">
        <svg viewBox="0 0 900 280" class="h-[240px] w-full" aria-label="Courbe d'évolution">
          <g stroke="#d8dee7" stroke-width="1" stroke-dasharray="4 6">
            <line x1="0" y1="40" x2="900" y2="40" />
            <line x1="0" y1="90" x2="900" y2="90" />
            <line x1="0" y1="140" x2="900" y2="140" />
            <line x1="0" y1="190" x2="900" y2="190" />
            <line x1="0" y1="240" x2="900" y2="240" />
          </g>
          <polyline
            fill="none"
            stroke="#1eac3f"
            stroke-width="4"
            :points="prestatairesPoints"
          />
          <polyline
            fill="none"
            stroke="#e5c21a"
            stroke-width="4"
            :points="clientsPoints"
          />
          <g fill="#6b7280" font-size="12">
            <text
              v-for="(label, i) in evolution.labels"
              :key="`m-${label}-${i}`"
              :x="xForIndex(i)"
              y="270"
              text-anchor="middle"
            >
              {{ label }}
            </text>
          </g>
        </svg>
      </div>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-2xl font-semibold text-slate-700">Transaction</h2>
        <button type="button" class="text-sm font-medium text-slate-500 hover:text-[#020B51]">
          Voir tout
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Prestataires</th>
              <th class="px-4 py-3 font-medium">Montant</th>
              <th class="px-4 py-3 font-medium">Wallet</th>
              <th class="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600">
            <tr v-if="!transactions.length">
              <td colspan="5" class="px-4 py-6 text-center text-slate-400">
                Aucune transaction disponible.
              </td>
            </tr>
            <tr v-for="tx in transactions" :key="tx.id">
              <td class="px-4 py-3">{{ formatDate(tx.date) }}</td>
              <td class="px-4 py-3">{{ tx.prestataireNom }}</td>
              <td class="px-4 py-3">{{ tx.montant == null ? '—' : formatMoney(tx.montant) }}</td>
              <td class="px-4 py-3">{{ tx.wallet }}</td>
              <td
                class="px-4 py-3 font-medium"
                :class="statusClass(tx.statut)"
              >
                {{ tx.statut }}
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

type AdminStats = {
  clientsActifs: number
  prestatairesActifs: number
  credit: number
  metiers: number
}

type AdminEvolution = {
  labels: string[]
  clients: number[]
  prestataires: number[]
}

type AdminTransaction = {
  id: string
  date: string
  prestataireNom: string
  montant: number | null
  wallet: string
  statut: string
  category: 'PAIEMENT_PRESTATION' | 'RETRAIT_PRESTATAIRE'
}

const stats = reactive<AdminStats>({
  clientsActifs: 0,
  prestatairesActifs: 0,
  credit: 0,
  metiers: 0,
})
const evolution = reactive<AdminEvolution>({
  labels: [],
  clients: [],
  prestataires: [],
})
const transactions = ref<AdminTransaction[]>([])
const selectedMonths = ref(12)

async function loadStats() {
  try {
    const response = await fetchAdminApi<{
      data?: AdminStats
    }>('/admin/stats')

    const payload = response?.data
    if (payload) {
      stats.clientsActifs = payload.clientsActifs ?? 0
      stats.prestatairesActifs = payload.prestatairesActifs ?? 0
      stats.credit = payload.credit ?? 0
      stats.metiers = payload.metiers ?? 0
    }
  } catch (error) {
    console.error('Erreur chargement stats admin:', error)
  }
}

async function loadEvolution() {
  try {
    const response = await fetchAdminApi<{ data?: AdminEvolution }>('/admin/evolution', {
      query: { months: selectedMonths.value },
    })
    const payload = response?.data
    evolution.labels = payload?.labels ?? []
    evolution.clients = payload?.clients ?? []
    evolution.prestataires = payload?.prestataires ?? []
  } catch (error) {
    console.error('Erreur chargement evolution admin:', error)
    evolution.labels = []
    evolution.clients = []
    evolution.prestataires = []
  }
}

onMounted(async () => {
  await loadStats()
  await loadEvolution()
  await loadTransactions()
})

watch(selectedMonths, () => {
  loadEvolution()
})

async function loadTransactions() {
  try {
    const response = await fetchAdminApi<{ data?: AdminTransaction[] }>('/admin/transactions', {
      query: { limit: 20 },
    })
    transactions.value = response?.data ?? []
  } catch (error) {
    console.error('Erreur chargement transactions admin:', error)
    transactions.value = []
  }
}

const chartXMin = 20
const chartXMax = 790
const chartYMin = 20
const chartYMax = 240

const chartMaxValue = computed(() =>
  Math.max(1, ...evolution.clients, ...evolution.prestataires),
)

function xForIndex(index: number) {
  const total = evolution.labels.length
  if (total <= 1) return (chartXMin + chartXMax) / 2
  const ratio = index / (total - 1)
  return chartXMin + ratio * (chartXMax - chartXMin)
}

function yForValue(value: number) {
  const ratio = value / chartMaxValue.value
  return chartYMax - ratio * (chartYMax - chartYMin)
}

function pointsFromSeries(series: number[]) {
  if (!series.length) return ''
  if (series.length === 1) {
    const y = yForValue(series[0] ?? 0)
    return `${chartXMin},${y} ${chartXMax},${y}`
  }
  return series
    .map((value, index) => `${xForIndex(index)},${yForValue(value)}`)
    .join(' ')
}

const prestatairesPoints = computed(() =>
  pointsFromSeries(evolution.prestataires),
)
const clientsPoints = computed(() => pointsFromSeries(evolution.clients))

function formatInt(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('fr-FR').format(value ?? 0)} XOF`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('fr-FR')
}

function statusClass(statut: string) {
  if (statut.toLowerCase().includes('depot')) return 'text-emerald-600'
  if (statut.toLowerCase().includes('retrait')) return 'text-rose-500'
  if (statut.toLowerCase().includes('attente')) return 'text-amber-500'
  return 'text-slate-500'
}

useHead({
  title: 'Tableau de bord',
})
</script>
