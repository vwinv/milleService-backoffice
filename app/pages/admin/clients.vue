<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Total clients</p>
            <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.total) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Clients actifs</p>
            <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ formatInt(stats.actifs) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-2">
          <div>
            <p class="text-xs font-semibold uppercase text-slate-500">Clients inactifs</p>
            <p class="mt-2 text-3xl font-semibold text-rose-600">{{ formatInt(stats.inactifs) }}</p>
            <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
          </div>
          <span class="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
        </div>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <h2 class="text-xl font-semibold text-slate-800 sm:text-2xl">Clients</h2>
        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <label class="relative block w-full min-w-[220px] max-w-md">
          <span class="sr-only">Rechercher</span>
          <input
            v-model="searchInput"
            type="search"
            placeholder="Rechercher par nom ou e-mail…"
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
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            :disabled="page >= totalPages - 1 || loading"
            aria-label="Page suivante"
            @click="goPage(page + 1)"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
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
              <th class="px-3 py-3 font-medium sm:px-4" aria-label="Avatar"></th>
              <th class="px-3 py-3 font-medium sm:px-4">Date d'adhésion</th>
              <th class="px-3 py-3 font-medium sm:px-4">Nom</th>
              <th class="px-3 py-3 font-medium sm:px-4">E-mail</th>
              <th class="px-3 py-3 font-medium sm:px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-slate-500">Chargement…</td>
            </tr>
            <tr v-else-if="!clients.length">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">Aucun client pour cette recherche.</td>
            </tr>
            <tr v-for="c in clients" :key="c.id">
              <td class="px-3 py-3 sm:px-4">
                <div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-bold text-slate-600">
                  <img
                    v-if="c.avatarUrl && !avatarLoadFailed.has(c.id)"
                    :src="c.avatarUrl"
                    alt=""
                    class="h-full w-full object-cover"
                    @error="markAvatarFailed(c.id)"
                  />
                  <span v-else>{{ initials(c) }}</span>
                </div>
              </td>
              <td class="px-3 py-3 sm:px-4 whitespace-nowrap">{{ formatDate(c.dateAdhesion) }}</td>
              <td class="px-3 py-3 sm:px-4 font-medium text-slate-900">{{ c.nomComplet }}</td>
              <td class="px-3 py-3 sm:px-4">{{ c.email }}</td>
              <td class="px-3 py-3 sm:px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    class="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                    title="Voir le détail"
                    @click="openDetail(c.id)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                  <button
                    type="button"
                    class="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-45"
                    title="Supprimer le client"
                    :disabled="deletingId === c.id"
                    @click="confirmDelete(c)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div
      v-if="detailOpen"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-3 py-6 backdrop-blur-[2px] sm:px-4"
      @click.self="closeDetail"
    >
      <div
        class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="client-modal-title"
      >
        <template v-if="detailLoading">
          <div class="px-6 py-16 text-center text-sm text-slate-500">Chargement…</div>
        </template>
        <template v-else-if="detailClient">
          <!-- En-tête -->
          <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <h3 id="client-modal-title" class="text-base font-semibold text-slate-800">Client</h3>
            <button
              type="button"
              class="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50"
              aria-label="Fermer"
              @click="closeDetail"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 pb-6 pt-4 sm:px-6">
            <!-- Nom + actions appel / message -->
            <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h4 class="text-center text-xl font-bold text-[#020B51] sm:text-left sm:text-2xl">
                {{ detailClient.nomComplet }}
              </h4>
              <div class="flex items-center justify-center gap-3 sm:justify-end">
                <a
                  v-if="phoneDigits(detailClient.telephone)"
                  :href="telHref(detailClient.telephone)"
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-md transition hover:bg-amber-500"
                  title="Appeler"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
                <a
                  v-if="phoneDigits(detailClient.telephone)"
                  :href="smsHref(detailClient.telephone)"
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition hover:bg-emerald-600"
                  title="Envoyer un SMS"
                >
                  <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </a>
              </div>
            </div>

            <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
              <!-- Photo -->
              <div class="mx-auto flex w-28 shrink-0 flex-col sm:mx-0 lg:w-32">
                <div
                  class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400"
                >
                  <img
                    v-if="detailClient.avatarUrl && !detailModalAvatarFailed"
                    :src="detailClient.avatarUrl"
                    alt=""
                    class="h-full w-full object-cover"
                    @error="detailModalAvatarFailed = true"
                  />
                  <svg v-else class="h-14 w-14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              </div>

              <!-- Infos + statut -->
              <div class="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row lg:justify-between">
                <div class="min-w-0 flex-1 space-y-4 text-sm text-slate-700">
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </span>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Téléphone</p>
                      <p class="font-medium text-slate-900">{{ detailClient.telephone?.trim() || '—' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div class="min-w-0">
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">E-mail</p>
                      <p class="break-all font-medium text-slate-900">{{ detailClient.email }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </span>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Mille Services</p>
                      <p class="font-medium text-slate-900">
                        Nombre de Mille Services : {{ formatInt(detailClient.prestationsTotal) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Annulations</p>
                      <p class="font-medium text-slate-900">
                        Mille Services annulés : {{ formatInt(detailClient.prestationsAnnulees) }}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </span>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Adresse</p>
                      <p class="font-medium text-slate-900">{{ detailClient.adresse?.trim() || '—' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </span>
                    <div>
                      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Adhésion</p>
                      <p class="font-medium text-slate-900">
                        Date d'adhésion : {{ formatDate(detailClient.dateAdhesion) }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Statut + interrupteur -->
                <div class="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:w-44 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div class="text-right">
                    <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Statut</p>
                    <p
                      class="mt-1 text-lg font-semibold"
                      :class="detailClient.actif ? 'text-emerald-600' : 'text-amber-600'"
                    >
                      {{ clientStatutLabel(detailClient) }}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="detailClient.actif"
                    :disabled="toggleStatutLoading"
                    class="relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020B51] disabled:opacity-50"
                    :class="detailClient.actif ? 'bg-emerald-500' : 'bg-rose-400'"
                    title="Basculer le statut (compte actif = e-mail vérifié)"
                    @click="toggleClientStatut"
                  >
                    <span
                      class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all"
                      :class="detailClient.actif ? 'left-7' : 'left-1'"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type ClientRow = {
  id: string
  userId: string
  prenom: string
  nom: string
  nomComplet: string
  email: string
  telephone: string
  adresse: string
  avatarUrl: string | null
  dateAdhesion: string
  actif: boolean
  statut: string
}

function clientStatutLabel(c: Pick<ClientRow, 'actif' | 'statut'>) {
  const s = c.statut?.trim()
  if (s) return s
  return c.actif ? 'Actif' : 'Inactif'
}

type ClientDetail = ClientRow & {
  compteCreeLe: string
  misAJourLe: string
  prestationsTotal: number
  prestationsAnnulees: number
}

const stats = reactive({
  total: 0,
  actifs: 0,
  inactifs: 0,
})
const clients = ref<ClientRow[]>([])
const listTotal = ref(0)
const page = ref(0)
const pageSize = 10
const loading = ref(false)
const loadError = ref('')
const deletingId = ref<string | null>(null)
const avatarLoadFailed = ref<Set<string>>(new Set())

function markAvatarFailed(id: string) {
  const next = new Set(avatarLoadFailed.value)
  next.add(id)
  avatarLoadFailed.value = next
}

const searchInput = ref('')
const debouncedSearch = ref('')
let debounceTimer: ReturnType<typeof setTimeout> | null = null

watch(searchInput, (v) => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = v
    page.value = 0
  }, 350)
})

const totalPages = computed(() => Math.max(1, Math.ceil(listTotal.value / pageSize) || 1))
const pageFirst = computed(() => (clients.value.length ? page.value * pageSize + 1 : 0))
const pageLast = computed(() => page.value * pageSize + clients.value.length)

type ClientsListPayload = {
  stats?: { total: number; actifs: number; inactifs: number }
  total?: number
  items?: Array<
    ClientRow & {
      emailVerified?: boolean
    }
  >
}

function unwrapClientsListResponse(response: unknown): ClientsListPayload {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (
    inner &&
    typeof inner === 'object' &&
    !Array.isArray(inner) &&
    ('items' in inner || 'total' in inner || 'stats' in inner)
  ) {
    return inner as ClientsListPayload
  }
  if ('items' in r || 'total' in r || 'stats' in r) {
    return r as ClientsListPayload
  }
  return {}
}

async function loadClients() {
  loading.value = true
  loadError.value = ''
  try {
    const q = debouncedSearch.value.trim()
    const response = await fetchAdminApi<unknown>('/admin/clients', {
      query: {
        limit: pageSize,
        offset: page.value * pageSize,
        ...(q ? { search: q } : {}),
      },
    })
    const payload = unwrapClientsListResponse(response)
    const s = payload?.stats
    if (s) {
      stats.total = s.total ?? 0
      stats.actifs = s.actifs ?? 0
      stats.inactifs = s.inactifs ?? 0
    }
    listTotal.value = payload?.total ?? 0
    avatarLoadFailed.value = new Set()
    clients.value = (payload?.items ?? []).map((row) => {
      const actif = Boolean(row.actif ?? row.emailVerified)
      const statut = row.statut?.trim() ? row.statut.trim() : actif ? 'Actif' : 'Inactif'
      return {
        ...row,
        avatarUrl: row.avatarUrl ?? null,
        actif,
        statut,
      }
    })
  } catch (e) {
    console.error(e)
    loadError.value = 'Impossible de charger les clients.'
    clients.value = []
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  if (p < 0 || p > totalPages.value - 1) return
  page.value = p
}

watch([page, debouncedSearch], () => {
  loadClients()
})

onMounted(() => {
  loadClients()
})

const detailOpen = ref(false)
const detailLoading = ref(false)
const detailClient = ref<ClientDetail | null>(null)
const detailModalAvatarFailed = ref(false)
const toggleStatutLoading = ref(false)

function phoneDigits(phone: string | null | undefined) {
  if (!phone) return ''
  return phone.replace(/\D/g, '')
}

function telHref(phone: string) {
  const d = phoneDigits(phone)
  return d ? `tel:${d}` : '#'
}

function smsHref(phone: string) {
  const d = phoneDigits(phone)
  return d ? `sms:${d}` : '#'
}

async function openDetail(id: string) {
  detailOpen.value = true
  detailLoading.value = true
  detailClient.value = null
  detailModalAvatarFailed.value = false
  try {
    const response = await fetchAdminApi<{ data?: ClientDetail } & ClientDetail>(`/admin/clients/${id}`)
    const dr = response as { data?: ClientDetail }
    const raw = dr?.data ?? (response as ClientDetail)
    detailClient.value = {
      ...raw,
      prestationsTotal: raw.prestationsTotal ?? 0,
      prestationsAnnulees: raw.prestationsAnnulees ?? 0,
    }
  } catch (e) {
    console.error(e)
    detailClient.value = null
  } finally {
    detailLoading.value = false
  }
}

function closeDetail() {
  detailOpen.value = false
  detailClient.value = null
  detailModalAvatarFailed.value = false
}

async function toggleClientStatut() {
  if (!detailClient.value || toggleStatutLoading.value) return
  const next = !detailClient.value.actif
  toggleStatutLoading.value = true
  try {
    await fetchAdminApi(`/admin/clients/${detailClient.value.id}/statut`, { body: { actif: next } }, 'PATCH')
    detailClient.value.actif = next
    detailClient.value.statut = next ? 'Actif' : 'Inactif'
    await loadClients()
  } catch (e) {
    console.error(e)
    window.alert('Impossible de mettre à jour le statut.')
  } finally {
    toggleStatutLoading.value = false
  }
}

async function confirmDelete(c: ClientRow) {
  const ok = window.confirm(
    `Supprimer définitivement le client « ${c.nomComplet} » et son compte ? Cette action est irréversible.`,
  )
  if (!ok) return
  deletingId.value = c.id
  try {
    await fetchAdminApi(`/admin/clients/${c.id}`, {}, 'DELETE')
    if (detailClient.value?.id === c.id) closeDetail()
    await loadClients()
  } catch (e) {
    console.error(e)
    window.alert("Suppression impossible. Réessayez ou vérifiez les dépendances (prestations, etc.).")
  } finally {
    deletingId.value = null
  }
}

function initials(c: ClientRow) {
  const a = (c.prenom?.[0] ?? c.nomComplet?.[0] ?? '?').toUpperCase()
  const b = (c.nom?.[0] ?? '').toUpperCase()
  return (a + b).slice(0, 2)
}

function formatInt(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR')
}

useHead({
  title: 'Clients',
})
</script>
