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

    <section class="grid gap-4 lg:grid-cols-2">
      <article class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <p class="text-sm font-semibold text-slate-700">Solde Mille Services</p>
        <div class="mt-4 flex items-center justify-between rounded-2xl bg-[#020B51] px-4 py-5 text-white">
          <span class="text-xl font-semibold tracking-tight sm:text-2xl">
            {{ showSoldeMs ? formatFcfaCompact(summary.soldeMilleServices) : '•••••••' }} FCFA
          </span>
          <button
            type="button"
            class="rounded-full p-2 text-white/90 hover:bg-white/10"
            aria-label="Afficher ou masquer le solde"
            @click="showSoldeMs = !showSoldeMs"
          >
            <svg v-if="showSoldeMs" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Geler
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600"
            @click="openRetraitModal"
          >
            Retirer
          </button>
        </div>
      </article>

      <article class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <p class="text-sm font-semibold text-slate-700">Soldes prestataire</p>
        <div class="mt-4 flex items-center justify-between rounded-2xl bg-[#020B51] px-4 py-5 text-white">
          <span class="text-xl font-semibold tracking-tight sm:text-2xl">
            {{ showSoldePrest ? formatFcfaCompact(summary.soldesPrestataires) : '•••••••' }} FCFA
          </span>
          <button
            type="button"
            class="rounded-full p-2 text-white/90 hover:bg-white/10"
            aria-label="Afficher ou masquer le solde"
            @click="showSoldePrest = !showSoldePrest"
          >
            <svg v-if="showSoldePrest" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
            </svg>
          </button>
        </div>
        <div class="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Geler
          </button>
        </div>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold text-slate-800">Transaction</h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-full px-5 py-2 text-sm font-medium transition"
            :class="
              txTab === 'ms'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            "
            @click="txTab = 'ms'"
          >
            Mille Services
          </button>
          <button
            type="button"
            class="rounded-full px-5 py-2 text-sm font-medium transition"
            :class="
              txTab === 'prestataire'
                ? 'bg-slate-200 text-slate-900'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            "
            @click="txTab = 'prestataire'"
          >
            Prestataire
          </button>
        </div>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Entité</th>
              <th class="px-4 py-3 font-medium">Montant</th>
              <th class="px-4 py-3 font-medium">Wallet</th>
              <th class="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-600">
            <tr v-if="txLoading">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">Chargement…</td>
            </tr>
            <tr v-else-if="!filteredTransactions.length">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                {{ txTab === 'prestataire' ? 'Aucun retrait confirmé.' : 'Aucune transaction.' }}
              </td>
            </tr>
            <tr v-for="tx in filteredTransactions" :key="tx.id">
              <td class="whitespace-nowrap px-4 py-3">{{ formatDate(tx.date) }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ entiteLabel(tx) }}</td>
              <td class="px-4 py-3">{{ tx.montant == null ? '—' : formatFcfa(tx.montant) }}</td>
              <td class="px-4 py-3">{{ tx.wallet }}</td>
              <td class="px-4 py-3 font-medium" :class="statusClass(tx.statut)">
                {{ statutLabel(tx.statut) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <Teleport to="body">
      <div
        v-if="retraitModalOpen"
        class="fixed inset-0 z-[70] flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wallet-retrait-paiement-title"
        @click.self="closeRetraitModal"
      >
        <div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <div class="flex items-start justify-between gap-3">
            <h2 id="wallet-retrait-paiement-title" class="text-lg font-semibold text-slate-900">Paiement</h2>
            <button
              type="button"
              class="rounded-full p-1 text-rose-500 transition hover:bg-rose-50"
              aria-label="Fermer"
              @click="closeRetraitModal"
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
                v-model="retraitMontantStr"
                type="text"
                inputmode="decimal"
                placeholder="Ex. 500 000"
                class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              />
              <p class="mt-1 text-xs text-slate-400">Montant en XOF (solde disponible : {{ formatFcfaCompact(summary.soldeMilleServices) }} FCFA)</p>
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

            <div>
              <p class="text-sm font-medium text-slate-700">Carte Bancaire</p>
              <input
                v-model="cardNumber"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="Numéro de la carte"
                class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"
              />
              <div class="mt-2 grid grid-cols-2 gap-2">
                <input
                  v-model="cardExpiry"
                  type="text"
                  autocomplete="off"
                  placeholder="Date d'expiration"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"
                />
                <input
                  v-model="cardCvv"
                  type="text"
                  inputmode="numeric"
                  autocomplete="off"
                  placeholder="CVV"
                  class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"
                />
              </div>
            </div>
          </div>

          <div class="mt-8 flex justify-center">
            <button
              type="button"
              class="w-full max-w-xs rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              :disabled="retraitSubmitting"
              @click="submitRetraitModal"
            >
              {{ retraitSubmitting ? 'Traitement…' : 'Payer' }}
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

type AdminTransaction = {
  id: string
  date: string
  prestataireNom: string
  montant: number | null
  wallet: string
  statut: string
  category: 'PAIEMENT_PRESTATION' | 'PAIEMENT_ABONNEMENT' | 'RETRAIT_PRESTATAIRE'
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

const transactions = ref<AdminTransaction[]>([])
const txLoading = ref(true)
const txTab = ref<'ms' | 'prestataire'>('ms')
const showSoldeMs = ref(true)
const showSoldePrest = ref(true)

type PayoutMethod = 'ORANGE_MONEY' | 'WAVE' | 'FREE_MONEY' | 'RIB'

const retraitModalOpen = ref(false)
const retraitMontantStr = ref('')
const selectedPayout = ref<PayoutMethod>('ORANGE_MONEY')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const retraitSubmitting = ref(false)

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

function parseMontantXof(raw: string): number | null {
  const cleaned = raw.replace(/\s/g, '').replace(',', '.').trim()
  if (!cleaned) return null
  const n = Number(cleaned)
  if (!Number.isFinite(n) || n <= 0) return null
  return Math.round(n * 100) / 100
}

function openRetraitModal() {
  retraitMontantStr.value = ''
  selectedPayout.value = 'ORANGE_MONEY'
  cardNumber.value = ''
  cardExpiry.value = ''
  cardCvv.value = ''
  retraitModalOpen.value = true
}

function closeRetraitModal() {
  if (retraitSubmitting.value) return
  retraitModalOpen.value = false
}

async function submitRetraitModal() {
  const amount = parseMontantXof(retraitMontantStr.value)
  if (amount == null) {
    window.alert('Saisissez un montant valide.')
    return
  }
  if (amount > summary.soldeMilleServices) {
    window.alert('Le montant dépasse le solde Mille Services disponible.')
    return
  }
  retraitSubmitting.value = true
  try {
    await fetchAdminApi(
      '/admin/wallet/general/withdraw',
      {
        body: {
          amount,
          payoutMethod: selectedPayout.value,
        },
      },
      'POST',
    )
    closeRetraitModal()
    await loadSummary()
    await loadTransactions()
  } catch (e) {
    console.error(e)
    const msg =
      (e as { data?: { message?: string } })?.data?.message ??
      (e as Error)?.message ??
      'Retrait impossible pour le moment.'
    window.alert(typeof msg === 'string' ? msg : 'Retrait impossible.')
  } finally {
    retraitSubmitting.value = false
  }
}

/** Prestataire : uniquement retraits confirmés (TRAITE → statut « Retrait »), pas les demandes en attente / refusées. */
const filteredTransactions = computed(() => {
  const list = transactions.value
  if (txTab.value === 'ms') {
    return list.filter(
      (t) => t.category === 'PAIEMENT_PRESTATION' || t.category === 'PAIEMENT_ABONNEMENT',
    )
  }
  return list.filter(
    (t) => t.category === 'RETRAIT_PRESTATAIRE' && t.statut === 'Retrait',
  )
})

onMounted(async () => {
  await Promise.all([loadSummary(), loadTransactions()])
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

async function loadTransactions() {
  txLoading.value = true
  try {
    const response = await fetchAdminApi<unknown>('/admin/transactions', { query: { limit: 50 } })
    const raw = unwrapApi<AdminTransaction[]>(response)
    transactions.value = Array.isArray(raw) ? raw : []
  } catch (e) {
    console.error(e)
    transactions.value = []
  } finally {
    txLoading.value = false
  }
}

function formatFcfa(value: number) {
  const n = value ?? 0
  const sign = n < 0 ? '−' : ''
  return `${sign}${new Intl.NumberFormat('fr-FR').format(Math.abs(n))} XOF`
}

function formatFcfaCompact(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function entiteLabel(tx: AdminTransaction) {
  if (tx.category === 'PAIEMENT_PRESTATION' || tx.category === 'PAIEMENT_ABONNEMENT') {
    return tx.prestataireNom?.trim() || '—'
  }
  return tx.prestataireNom?.trim() || 'Prestataire'
}

function statutLabel(statut: string) {
  const s = statut.toLowerCase()
  if (s.includes('depot')) return 'Dépot'
  if (s.includes('retrait')) return 'Retrait'
  return statut
}

function statusClass(statut: string) {
  const s = statut.toLowerCase()
  if (s.includes('depot')) return 'text-emerald-600'
  if (s.includes('retrait')) return 'text-rose-500'
  if (s.includes('attente')) return 'text-amber-500'
  return 'text-slate-500'
}

useHead({
  title: 'Wallet',
})
</script>
