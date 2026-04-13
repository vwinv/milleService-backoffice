<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Total solde</p>
            <p class="mt-2 text-2xl font-semibold text-slate-800 sm:text-3xl">{{ formatFcfa(summary.totalSolde) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600" aria-hidden="true">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5" />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Crédit</p>
            <p class="mt-2 text-2xl font-semibold text-emerald-600 sm:text-3xl">{{ formatFcfa(summary.credit) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600" aria-hidden="true">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5" />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Retrait</p>
            <p class="mt-2 text-2xl font-semibold text-rose-600 sm:text-3xl">{{ formatFcfa(summary.retraitTotal) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600" aria-hidden="true">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5" />
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
        <h2 class="text-xl font-semibold text-slate-800">Demandes de retraits</h2>
        <div class="flex items-center gap-2 text-sm text-slate-600">
          <span class="font-medium">{{ pageSize }} pour {{ listTotal }}</span>
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
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Prestataires</th>
              <th class="px-4 py-3 font-medium">Montant</th>
              <th class="px-4 py-3 font-medium">Wallet</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Chargement…</td>
            </tr>
            <tr v-else-if="!rows.length">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucune demande de retrait.</td>
            </tr>
            <tr v-for="row in rows" :key="row.id">
              <td class="whitespace-nowrap px-4 py-3">{{ formatDate(row.date) }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ row.prestataireNom }}</td>
              <td class="px-4 py-3">{{ row.montant == null ? '—' : formatFcfa(row.montant) }}</td>
              <td class="px-4 py-3">{{ row.wallet }}</td>
              <td class="px-4 py-3">
                <span class="text-sm font-semibold" :class="statusClass(row.status)">
                  {{ statusLabel(row.status) }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div v-if="row.status === 'EN_ATTENTE'" class="inline-flex flex-wrap justify-end gap-2">
                  <button
                    type="button"
                    class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="actingId === row.id || paymentModalOpen"
                    @click="openPaymentModal(row)"
                  >
                    Accepter
                  </button>
                  <button
                    type="button"
                    class="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="actingId === row.id || paymentModalOpen"
                    @click="rejectRequest(row)"
                  >
                    Rejeté
                  </button>
                </div>
                <span v-else class="text-sm text-slate-400">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="paymentModalOpen && paymentRow"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="paiement-modal-title"
        @click.self="closePaymentModal"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <div class="flex items-start justify-between gap-3">
            <h2 id="paiement-modal-title" class="text-lg font-semibold text-slate-900">Valider la demande</h2>
            <button
              type="button"
              class="rounded-full p-1 text-rose-500 transition hover:bg-rose-50"
              aria-label="Fermer"
              @click="closePaymentModal"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="mt-5 space-y-5">
            <div>
              <label class="text-sm font-medium text-slate-700">Montant</label>
              <input
                type="text"
                readonly
                class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"
                :value="paymentRow.montant == null ? '—' : formatFcfa(paymentRow.montant)"
              />
            </div>

            <div>
              <p class="text-sm font-medium text-slate-700">Wallet</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <button
                  v-for="opt in payoutOptions"
                  :key="opt.value"
                  type="button"
                  class="flex min-h-[44px] flex-1 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm"
                  :class="[
                    opt.class,
                    selectedPayout === opt.value
                      ? 'ring-2 ring-[#020B51] ring-offset-2'
                      : 'opacity-90 hover:opacity-100',
                  ]"
                  @click="selectedPayout = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <label class="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <input
                v-model="payWithPaydunya"
                type="checkbox"
                class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]"
                :disabled="selectedPayout === 'RIB'"
              />
              <span class="text-sm leading-snug text-slate-700">
                <span class="font-semibold text-slate-900">Envoyer via PayDunya</span>
                (débit du compte marchand PayDunya, API PUSH). Incompatible avec « Carte bancaire ».
              </span>
            </label>

            <div v-if="payWithPaydunya">
              <label class="text-sm font-medium text-slate-700">Téléphone bénéficiaire</label>
              <input
                v-model="accountAliasStr"
                type="text"
                inputmode="tel"
                autocomplete="tel"
                placeholder="Ex. 77 123 45 67 (défaut : téléphone du profil)"
                class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              />
              <p v-if="paymentRow?.prestataireTelephone" class="mt-1 text-xs text-slate-500">
                Profil : {{ paymentRow.prestataireTelephone }}
              </p>
            </div>

            <p class="rounded-xl bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600">
              <template v-if="payWithPaydunya">
                PayDunya envoie les fonds sur le mobile money choisi, puis le wallet prestataire est débité
                (ou la demande reste en attente si l’opérateur confirme plus tard).
              </template>
              <template v-else>
                Après avoir versé les fonds au prestataire (Orange Money, Wave, etc.), validez ici : le
                solde de son wallet sera débité et la demande passera en
                <span class="font-semibold text-slate-800">Accepté</span>.
              </template>
            </p>
          </div>

          <div class="mt-8 flex justify-center">
            <button
              type="button"
              class="w-full max-w-xs rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              :disabled="paymentSubmitting"
              @click="submitPaymentModal"
            >
              {{ paymentSubmitting ? 'Traitement…' : 'Valider le versement' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type WalletSummary = {
  totalSolde: number
  credit: number
  soldeMilleServices: number
  soldesPrestataires: number
  retraitTotal: number
}

type PayoutMethod = 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | 'RIB'

type WithdrawalRequestStatus = 'EN_ATTENTE' | 'TRAITE' | 'REFUSE'

type WithdrawalRow = {
  id: string
  date: string
  prestataireId: string
  prestataireNom: string
  prestataireTelephone?: string | null
  montant: number | null
  wallet: string
  method: PayoutMethod
  status: WithdrawalRequestStatus
}

function statusLabel(s: WithdrawalRequestStatus): string {
  switch (s) {
    case 'EN_ATTENTE':
      return 'En attente'
    case 'REFUSE':
      return 'Rejeté'
    case 'TRAITE':
      return 'Accepté'
    default:
      return s
  }
}

function statusClass(s: WithdrawalRequestStatus): string {
  switch (s) {
    case 'EN_ATTENTE':
      return 'text-amber-600'
    case 'REFUSE':
      return 'text-rose-600'
    case 'TRAITE':
      return 'text-emerald-600'
    default:
      return 'text-slate-500'
  }
}

function unwrapApi<T>(response: unknown): T | undefined {
  if (!response || typeof response !== 'object') return undefined
  const r = response as Record<string, unknown>
  if ('data' in r && r.data !== undefined && r.data !== null) return r.data as T
  return response as T
}

const summary = reactive<WalletSummary>({
  totalSolde: 0,
  credit: 0,
  soldeMilleServices: 0,
  soldesPrestataires: 0,
  retraitTotal: 0,
})

const rows = ref<WithdrawalRow[]>([])
const listTotal = ref(0)
const loading = ref(true)
const loadError = ref('')
const actionError = ref('')
const actingId = ref<string | null>(null)

const paymentModalOpen = ref(false)
const paymentRow = ref<WithdrawalRow | null>(null)
const selectedPayout = ref<PayoutMethod>('ORANGE_MONEY')
const paymentSubmitting = ref(false)
const payWithPaydunya = ref(false)
const accountAliasStr = ref('')

const payoutOptions: { value: PayoutMethod; label: string; class: string }[] = [
  { value: 'ORANGE_MONEY', label: 'Orange Money', class: 'bg-black text-white' },
  { value: 'WAVE', label: 'Wave', class: 'bg-sky-400 text-white' },
  {
    value: 'FREE_MONEY',
    label: 'Free Money',
    class: 'border-2 border-red-500 bg-white text-slate-900',
  },
  {
    value: 'RIB',
    label: 'Carte bancaire',
    class: 'border border-slate-300 bg-slate-100 text-slate-800',
  },
]

const pageSize = 14
const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(listTotal.value / pageSize)))

watch(currentPage, () => {
  loadRequests()
})

onMounted(async () => {
  await loadSummary()
  await loadRequests()
})

async function loadSummary() {
  try {
    const response = await fetchAdminApi<unknown>('/admin/wallet/summary')
    const payload = unwrapApi<WalletSummary>(response)
    if (payload) {
      summary.totalSolde = payload.totalSolde ?? 0
      summary.credit = payload.credit ?? 0
      summary.soldeMilleServices = payload.soldeMilleServices ?? 0
      summary.soldesPrestataires = payload.soldesPrestataires ?? 0
      summary.retraitTotal = payload.retraitTotal ?? 0
    }
  } catch (e) {
    console.error(e)
  }
}

async function loadRequests() {
  loading.value = true
  loadError.value = ''
  try {
    const offset = (currentPage.value - 1) * pageSize
    const response = await fetchAdminApi<unknown>('/admin/wallet/withdrawal-requests', {
      query: { limit: pageSize, offset },
    })
    const payload = unwrapApi<{ total?: number; items?: WithdrawalRow[] }>(response)
    listTotal.value = payload?.total ?? 0
    const items = Array.isArray(payload?.items) ? payload.items : []
    rows.value = items.map((it) => ({
      ...it,
      method: (it.method as PayoutMethod) ?? 'ORANGE_MONEY',
      status: (it.status as WithdrawalRequestStatus) ?? 'EN_ATTENTE',
    }))
  } catch (e) {
    console.error(e)
    rows.value = []
    listTotal.value = 0
    loadError.value = extractApiMessage(e, 'Impossible de charger les demandes.')
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

function openPaymentModal(row: WithdrawalRow) {
  actionError.value = ''
  paymentRow.value = row
  selectedPayout.value = row.method && payoutOptions.some((o) => o.value === row.method) ? row.method : 'ORANGE_MONEY'
  payWithPaydunya.value = false
  accountAliasStr.value = ''
  paymentModalOpen.value = true
}

watch(selectedPayout, (m) => {
  if (m === 'RIB') payWithPaydunya.value = false
})

function closePaymentModal() {
  if (paymentSubmitting.value) return
  paymentModalOpen.value = false
  paymentRow.value = null
}

async function submitPaymentModal() {
  const row = paymentRow.value
  if (!row || paymentSubmitting.value) return
  if (payWithPaydunya.value && selectedPayout.value === 'RIB') {
    actionError.value = 'PayDunya ne prend pas en charge le RIB / carte bancaire.'
    return
  }
  paymentSubmitting.value = true
  actionError.value = ''
  actingId.value = row.id
  try {
    const response = await fetchAdminApi<unknown>(
      `/admin/wallet/withdrawal-requests/${row.id}`,
      {
        body: {
          decision: 'accept',
          payoutMethod: selectedPayout.value,
          payWithPaydunya: payWithPaydunya.value,
          ...(accountAliasStr.value.trim()
            ? { accountAlias: accountAliasStr.value.trim() }
            : {}),
        },
      },
      'PATCH',
    )
    const payload = unwrapApi<{
      paydunyaStatus?: string
      message?: string
      status?: string
    }>(response)
    if (payload?.paydunyaStatus === 'pending' && payload.message) {
      window.alert(payload.message)
    }
    paymentModalOpen.value = false
    paymentRow.value = null
    await loadRequests()
    await loadSummary()
  } catch (e) {
    console.error(e)
    actionError.value = extractApiMessage(e, 'Validation / acceptation impossible.')
  } finally {
    paymentSubmitting.value = false
    actingId.value = null
  }
}

async function rejectRequest(row: WithdrawalRow) {
  if (actingId.value || paymentModalOpen.value) return
  const ok = window.confirm('Rejeter cette demande de retrait ?')
  if (!ok) return
  actingId.value = row.id
  actionError.value = ''
  try {
    await fetchAdminApi(
      `/admin/wallet/withdrawal-requests/${row.id}`,
      { body: { decision: 'reject' } },
      'PATCH',
    )
    await loadRequests()
    await loadSummary()
  } catch (e) {
    console.error(e)
    actionError.value = extractApiMessage(e, 'Action impossible.')
  } finally {
    actingId.value = null
  }
}

function formatFcfa(value: number) {
  const n = value ?? 0
  const sign = n < 0 ? '−' : ''
  return `${sign}${new Intl.NumberFormat('fr-FR').format(Math.abs(n))} XOF`
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

watch(listTotal, (n) => {
  const max = Math.max(1, Math.ceil(n / pageSize))
  if (currentPage.value > max) currentPage.value = max
})

useHead({
  title: 'Demandes de retraits',
})
</script>
