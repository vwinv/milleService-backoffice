<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Total abonnements</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ stats.total }}</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Actifs</p>
        <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ stats.actifs }}</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Expirés</p>
        <p class="mt-2 text-3xl font-semibold text-amber-600">{{ stats.expires }}</p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div
        v-if="loadError"
        class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
      >
        {{ loadError }}
      </div>

      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 class="text-xl font-semibold text-slate-800">Abonnements prestataires</h2>
        <input
          v-model="search"
          type="search"
          placeholder="Rechercher prestataire…"
          class="h-10 w-full max-w-xs rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-[#020B51] focus:ring-2 focus:ring-[#020B51]/20"
        />
      </div>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="tab in statutTabs"
            :key="tab.value"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold transition"
            :class="
              statutFilter === tab.value
                ? 'bg-[#020B51] text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            "
            @click="statutFilter = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
        <button
          type="button"
          class="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          @click="openCreateModal"
        >
          Créer un abonnement
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Prestataire</th>
              <th class="px-4 py-3 font-medium">Offre</th>
              <th class="px-4 py-3 font-medium">Début</th>
              <th class="px-4 py-3 font-medium">Fin prévue</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Chargement…</td>
            </tr>
            <tr v-else-if="!items.length">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucun abonnement.</td>
            </tr>
            <tr v-for="row in items" :key="row.id">
              <td class="px-4 py-3">
                <p class="font-medium text-slate-800">{{ row.prestataireNom }}</p>
                <p class="text-xs text-slate-500">{{ row.prestataireEmail }}</p>
              </td>
              <td class="px-4 py-3">
                <p class="font-medium">{{ row.offreLibelle }}</p>
                <p class="text-xs text-slate-500">{{ formatMoney(row.offrePrix) }} · {{ row.dureeMois }} mois</p>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(row.dateDebut) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ formatDate(row.dateFin) }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-col items-start gap-1">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    :class="statutBadgeClass(row.statutAffichage)"
                  >
                    {{ statutLabel(row.statutAffichage) }}
                  </span>
                  <span
                    v-if="expireDansLabel(row)"
                    class="text-xs font-medium text-amber-700"
                  >
                    {{ expireDansLabel(row) }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <button
                  v-if="shouldShowRenew(row)"
                  type="button"
                  class="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-50"
                  :disabled="actionId === row.id"
                  @click="openPaymentModal(row)"
                >
                  Renouveler l'abonnement
                </button>
                <span v-else class="text-xs text-slate-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="total > pageSize"
        class="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600"
      >
        <p>{{ total }} résultat(s)</p>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            :disabled="page === 0 || loading"
            @click="page--"
          >
            Précédent
          </button>
          <span class="px-2 py-1.5">Page {{ page + 1 }} / {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-full border border-slate-200 px-3 py-1.5 disabled:opacity-40"
            :disabled="page >= totalPages - 1 || loading"
            @click="page++"
          >
            Suivant
          </button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="createModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        @click.self="closeCreateModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-800">Créer un abonnement</h3>
          <p class="mt-1 text-sm text-slate-500">Choisissez le prestataire à abonner.</p>

          <input
            v-model="createPrestataireSearch"
            type="search"
            placeholder="Rechercher par nom ou e-mail…"
            class="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
          />

          <div class="mt-3 max-h-56 overflow-y-auto rounded-xl border border-slate-200">
            <p v-if="createPrestatairesLoading" class="px-4 py-6 text-center text-sm text-slate-400">
              Chargement…
            </p>
            <p v-else-if="!filteredCreatePrestataires.length" class="px-4 py-6 text-center text-sm text-slate-400">
              Aucun prestataire trouvé.
            </p>
            <button
              v-for="pr in filteredCreatePrestataires"
              :key="pr.id"
              type="button"
              class="flex w-full flex-col items-start border-b border-slate-100 px-4 py-3 text-left text-sm transition last:border-b-0 hover:bg-slate-50"
              :class="createPrestataireId === pr.id ? 'bg-rose-50' : ''"
              @click="createPrestataireId = pr.id"
            >
              <span class="font-medium text-slate-800">{{ pr.nom }}</span>
              <span class="text-xs text-slate-500">{{ pr.email || pr.telephone || '—' }}</span>
            </button>
          </div>

          <p v-if="createModalError" class="mt-3 text-sm text-rose-600">{{ createModalError }}</p>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              @click="closeCreateModal"
            >
              Annuler
            </button>
            <button
              type="button"
              class="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              :disabled="!createPrestataireId"
              @click="confirmCreatePrestataire"
            >
              Continuer
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="paymentModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        @click.self="closePaymentModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-800">
            {{ paymentIsCreate ? 'Créer un abonnement' : "Renouveler l'abonnement" }}
          </h3>
          <p v-if="paymentTarget" class="mt-1 text-sm text-slate-500">
            {{ paymentTarget.prestataireNom }}
          </p>

          <div class="mt-4">
            <label class="mb-2 block text-sm font-medium text-slate-600">Offre</label>
            <select
              v-model="selectedOffreId"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
            >
              <option value="" disabled>Choisir une offre</option>
              <option v-for="o in offresActives" :key="o.id" :value="o.id">
                {{ o.libelle }} — {{ formatMoney(o.prix) }} ({{ o.dureeMois }} mois)
              </option>
            </select>
          </div>

          <div class="mt-4">
            <p class="mb-2 text-sm font-medium text-slate-600">Moyen de paiement</p>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in paymentMethods"
                :key="opt.value"
                type="button"
                class="rounded-xl border px-3 py-2.5 text-sm font-semibold transition"
                :class="
                  paymentMethod === opt.value
                    ? 'border-rose-600 bg-rose-50 text-rose-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                "
                @click="paymentMethod = opt.value"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <div v-if="paymentMethod !== 'cash'" class="mt-4">
            <label class="mb-2 block text-sm font-medium text-slate-600">
              Téléphone {{ paymentMethod === 'wave_sn' ? 'Wave' : 'Orange Money' }}
            </label>
            <input
              v-model="paymentPhone"
              type="tel"
              class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Ex. 771234567"
            />
            <p class="mt-1 text-xs text-slate-500">
              Le prestataire recevra une notification {{ paymentMethod === 'wave_sn' ? 'Wave' : 'Orange Money' }}
              pour confirmer.
            </p>
          </div>

          <p
            v-if="paymentWaiting"
            class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
          >
            En attente de confirmation du paiement sur le téléphone du prestataire…
            <span class="mt-1 block text-xs text-amber-700">
              L’abonnement ne sera activé qu’après validation PayDunya.
            </span>
          </p>
          <p v-if="paymentInfo" class="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {{ paymentInfo }}
          </p>
          <p v-if="paymentError" class="mt-3 text-sm text-rose-600">{{ paymentError }}</p>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              :disabled="paymentSaving || paymentWaiting"
              @click="closePaymentModal"
            >
              {{ paymentInfo || paymentWaiting ? 'Fermer' : 'Annuler' }}
            </button>
            <button
              v-if="!paymentInfo && !paymentWaiting"
              type="button"
              class="rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
              :disabled="paymentSaving || !canSubmitPayment"
              @click="submitPayment"
            >
              {{ paymentSaving ? 'Traitement…' : confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type StatutAffichage = 'ACTIF' | 'EXPIRE' | 'ANNULE'

type AbonnementRow = {
  id: string
  prestataireId: string
  prestataireNom: string
  prestataireEmail: string
  offreId: string
  offreLibelle: string
  offrePrix: number
  dureeMois: number
  dateDebut: string
  dateFin: string
  statutAffichage: StatutAffichage
}

type OffreOption = {
  id: string
  libelle: string
  prix: number
  dureeMois: number
  actif: boolean
}

type PrestataireCreateOption = {
  id: string
  nom: string
  email: string
  telephone: string
}

const statutTabs = [
  { value: 'all' as const, label: 'Tous' },
  { value: 'actif' as const, label: 'Actifs' },
  { value: 'expire' as const, label: 'Expirés' },
]

const items = ref<AbonnementRow[]>([])
const stats = reactive({ total: 0, actifs: 0, expires: 0 })
const total = ref(0)
const loading = ref(true)
const loadError = ref('')
const search = ref('')
const debouncedSearch = ref('')
const statutFilter = ref<'all' | 'actif' | 'expire'>('all')
const page = ref(0)
const pageSize = 25
const actionId = ref<string | null>(null)

/** Jours avant la fin : afficher « Expire dans… » et le bouton de renouvellement. */
const EXPIRING_SOON_DAYS = 7

type PaymentMethod = 'cash' | 'wave_sn' | 'orange_money_sn'

const paymentMethods: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'cash', label: 'Cash' },
  { value: 'wave_sn', label: 'Wave' },
  { value: 'orange_money_sn', label: 'Orange Money' },
]

const offresActives = ref<OffreOption[]>([])
const createModalOpen = ref(false)
const createPrestataires = ref<PrestataireCreateOption[]>([])
const createPrestatairesLoading = ref(false)
const createPrestataireSearch = ref('')
const createPrestataireId = ref('')
const createModalError = ref('')
const paymentIsCreate = ref(false)
const paymentModalOpen = ref(false)
const paymentTarget = ref<AbonnementRow | null>(null)
const selectedOffreId = ref('')
const paymentMethod = ref<PaymentMethod>('cash')
const paymentPhone = ref('')
const paymentSaving = ref(false)
const paymentWaiting = ref(false)
const paymentError = ref('')
const paymentInfo = ref('')
const pendingInvoiceToken = ref('')

const POLL_INTERVAL_MS = 3000
const POLL_MAX_ATTEMPTS = 40
let pollAborted = false

const canSubmitPayment = computed(() => {
  if (!selectedOffreId.value) return false
  if (paymentMethod.value === 'cash') return true
  return paymentPhone.value.replace(/\s+/g, '').length >= 8
})

const confirmLabel = computed(() => {
  if (paymentMethod.value === 'cash') return 'Enregistrer le paiement'
  return 'Lancer le paiement'
})

let searchTimer: ReturnType<typeof setTimeout> | null = null
watch(search, (v) => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    debouncedSearch.value = v.trim()
    page.value = 0
  }, 350)
})

watch([statutFilter, debouncedSearch, page], () => {
  loadAbonnements()
})

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

const filteredCreatePrestataires = computed(() => {
  const q = createPrestataireSearch.value.trim().toLowerCase()
  if (!q) return createPrestataires.value
  return createPrestataires.value.filter((pr) => {
    const hay = `${pr.nom} ${pr.email} ${pr.telephone}`.toLowerCase()
    return hay.includes(q)
  })
})

onMounted(async () => {
  await Promise.all([loadOffres(), loadAbonnements()])
})

function unwrapList<T>(response: unknown): {
  items?: T[]
  stats?: { total?: number; actifs?: number; expires?: number }
  total?: number
} {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as { items?: T[]; stats?: { total?: number; actifs?: number; expires?: number }; total?: number }
  }
  return r as { items?: T[]; stats?: { total?: number; actifs?: number; expires?: number }; total?: number }
}

function extractApiMessage(err: unknown, fallback: string): string {
  const e = err as { data?: { message?: string | string[] }; message?: string }
  const m = e?.data?.message
  if (typeof m === 'string' && m.trim()) return m
  if (Array.isArray(m) && m[0]) return String(m[0])
  if (e?.message && typeof e.message === 'string') return e.message
  return fallback
}

async function loadOffres() {
  try {
    const response = await fetchAdminApi<unknown>('/admin/offres')
    const payload = unwrapList<OffreOption & { actif: boolean }>(response)
    offresActives.value = (payload.items ?? []).filter((o) => o.actif)
  } catch {
    offresActives.value = []
  }
}

async function loadAbonnements() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetchAdminApi<unknown>('/admin/abonnements', {
      query: {
        statut: statutFilter.value,
        limit: pageSize,
        offset: page.value * pageSize,
        ...(debouncedSearch.value ? { search: debouncedSearch.value } : {}),
      },
    })
    const payload = unwrapList<AbonnementRow>(response)
    items.value = Array.isArray(payload.items) ? payload.items : []
    stats.total = payload.stats?.total ?? 0
    stats.actifs = payload.stats?.actifs ?? 0
    stats.expires = payload.stats?.expires ?? 0
    total.value = payload.total ?? items.value.length
  } catch (e) {
    items.value = []
    loadError.value = extractApiMessage(e, 'Impossible de charger les abonnements.')
  } finally {
    loading.value = false
  }
}

function parseDateFin(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  dt.setHours(0, 0, 0, 0)
  return dt
}

function daysUntilEnd(row: AbonnementRow): number | null {
  const fin = parseDateFin(row.dateFin)
  if (!fin) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((fin.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
}

function isExpiringSoon(row: AbonnementRow): boolean {
  if (row.statutAffichage !== 'ACTIF') return false
  const days = daysUntilEnd(row)
  return days !== null && days >= 0 && days <= EXPIRING_SOON_DAYS
}

function shouldShowRenew(row: AbonnementRow): boolean {
  return isExpiringSoon(row) || row.statutAffichage === 'EXPIRE'
}

function expireDansLabel(row: AbonnementRow): string | null {
  if (!isExpiringSoon(row)) return null
  const days = daysUntilEnd(row)
  if (days === null) return null
  if (days === 0) return 'Expire aujourd’hui'
  if (days === 1) return 'Expire demain'
  return `Expire dans ${days} jours`
}

function unwrapApiPayload(response: unknown): Record<string, unknown> {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return inner as Record<string, unknown>
  }
  return r
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function openPaymentModal(row: AbonnementRow) {
  paymentIsCreate.value = false
  paymentTarget.value = row
  selectedOffreId.value = row.offreId
  paymentMethod.value = 'cash'
  paymentPhone.value = ''
  paymentError.value = ''
  paymentInfo.value = ''
  paymentWaiting.value = false
  pendingInvoiceToken.value = ''
  paymentModalOpen.value = true
}

async function loadPrestatairesForCreate() {
  createPrestatairesLoading.value = true
  createModalError.value = ''
  try {
    const response = await fetchAdminApi<unknown>('/admin/prestataires', {
      query: { limit: 500 },
    })
    const payload = unwrapList<{
      id: string
      nom: string
      email?: string
      telephone?: string
      items?: never
    }>(response)
    const rows = Array.isArray(payload.items) ? payload.items : []
    createPrestataires.value = rows.map((row) => ({
      id: row.id,
      nom: row.nom,
      email: row.email ?? '',
      telephone: row.telephone ?? '',
    }))
  } catch (e) {
    createPrestataires.value = []
    createModalError.value = extractApiMessage(e, 'Impossible de charger les prestataires.')
  } finally {
    createPrestatairesLoading.value = false
  }
}

function openCreateModal() {
  createPrestataireId.value = ''
  createPrestataireSearch.value = ''
  createModalError.value = ''
  createModalOpen.value = true
  if (!createPrestataires.value.length) {
    loadPrestatairesForCreate()
  }
}

function closeCreateModal() {
  createModalOpen.value = false
  createPrestataireId.value = ''
  createModalError.value = ''
}

function confirmCreatePrestataire() {
  const selected = createPrestataires.value.find((pr) => pr.id === createPrestataireId.value)
  if (!selected) return
  paymentIsCreate.value = true
  paymentTarget.value = {
    id: '',
    prestataireId: selected.id,
    prestataireNom: selected.nom,
    prestataireEmail: selected.email,
    offreId: '',
    offreLibelle: '',
    offrePrix: 0,
    dureeMois: 0,
    dateDebut: '',
    dateFin: '',
    statutAffichage: 'EXPIRE',
  }
  selectedOffreId.value = offresActives.value[0]?.id ?? ''
  paymentMethod.value = 'cash'
  paymentPhone.value = selected.telephone.replace(/\s+/g, '')
  paymentError.value = ''
  paymentInfo.value = ''
  paymentWaiting.value = false
  pendingInvoiceToken.value = ''
  createModalOpen.value = false
  paymentModalOpen.value = true
}

function closePaymentModal() {
  if (paymentSaving.value) return
  pollAborted = true
  paymentWaiting.value = false
  paymentModalOpen.value = false
  paymentTarget.value = null
  paymentIsCreate.value = false
  paymentInfo.value = ''
  pendingInvoiceToken.value = ''
}

async function pollPaydunyaPayment(prestataireId: string, invoiceToken: string) {
  pollAborted = false
  paymentWaiting.value = true
  paymentError.value = ''
  try {
    for (let i = 0; i < POLL_MAX_ATTEMPTS; i++) {
      if (pollAborted) return
      const response = await fetchAdminApi<unknown>(
        '/admin/abonnements/paydunya-invoice-paid',
        {
          query: { prestataireId, invoiceToken },
        },
      )
      const payload = unwrapApiPayload(response)
      if (payload.paid === true) {
        paymentInfo.value =
          'Paiement confirmé. L’abonnement a été activé pour ce prestataire.'
        await loadAbonnements()
        return
      }
      await sleep(POLL_INTERVAL_MS)
    }
    paymentError.value =
      'Paiement non confirmé. Le prestataire doit valider sur son téléphone, ou réessayez plus tard.'
  } finally {
    paymentWaiting.value = false
    pendingInvoiceToken.value = ''
  }
}

async function submitPayment() {
  if (!paymentTarget.value || !canSubmitPayment.value || paymentSaving.value) return
  paymentSaving.value = true
  paymentError.value = ''
  paymentInfo.value = ''
  actionId.value = paymentTarget.value.id || paymentTarget.value.prestataireId
  const prestataireId = paymentTarget.value.prestataireId
  try {
    const response = await fetchAdminApi<unknown>(
      `/admin/abonnements/${prestataireId}/enregistrer-paiement`,
      {
        body: {
          offreId: selectedOffreId.value,
          method: paymentMethod.value,
          ...(paymentMethod.value !== 'cash'
            ? { telephone: paymentPhone.value.replace(/\s+/g, '') }
            : {}),
        },
      },
      'POST',
    )
    const payload = unwrapApiPayload(response)
    const paymentStatus = String(payload.paymentStatus ?? '')

    if (paymentStatus === 'pending_payment') {
      const invoiceToken = String(payload.invoiceToken ?? '').trim()
      if (!invoiceToken) {
        paymentError.value = 'Réponse PayDunya incomplète (token manquant).'
        return
      }
      pendingInvoiceToken.value = invoiceToken
      paymentSaving.value = false
      await pollPaydunyaPayment(prestataireId, invoiceToken)
      return
    }

    if (paymentStatus === 'completed') {
      paymentInfo.value = 'Paiement cash enregistré. Abonnement activé.'
      await loadAbonnements()
      return
    }

    paymentError.value = 'Réponse serveur inattendue.'
  } catch (e) {
    paymentError.value = extractApiMessage(e, 'Enregistrement impossible.')
  } finally {
    paymentSaving.value = false
    actionId.value = null
  }
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('fr-FR').format(value ?? 0)} XOF`
}

function formatDate(iso: string) {
  if (!iso) return '—'
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}/${m}/${y}`
}

function statutLabel(s: StatutAffichage) {
  if (s === 'ACTIF') return 'Actif'
  if (s === 'ANNULE') return 'Annulé'
  return 'Expiré'
}

function statutBadgeClass(s: StatutAffichage) {
  if (s === 'ACTIF') return 'bg-emerald-100 text-emerald-700'
  if (s === 'ANNULE') return 'bg-slate-100 text-slate-600'
  return 'bg-amber-100 text-amber-800'
}

useHead({ title: 'Abonnements' })
</script>
