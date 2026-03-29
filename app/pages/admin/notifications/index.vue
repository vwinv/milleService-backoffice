<template>
  <div class="space-y-4">
    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div
        class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <h2 class="text-xl font-semibold text-slate-800 sm:text-2xl">
          Notifications
        </h2>

        <div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            <span>Audience</span>
            <select
              v-model="audience"
              class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"
            >
              <option value="TOUT">Tout</option>
              <option value="PARTICULIER">Particuliers</option>
              <option value="PRESTATAIRE">Prestataires</option>
            </select>
          </label>

          <label class="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" v-model="unreadOnly" />
            <span>Non lues uniquement</span>
          </label>

          <button
            type="button"
            class="rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="createSubmitting"
            @click="openCreateNotificationModal"
          >
            Créer une notification
          </button>
        </div>
      </div>

      <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label class="relative block w-full min-w-[220px] max-w-md">
          <span class="sr-only">Rechercher</span>
          <input
            v-model="searchInput"
            type="search"
            placeholder="Rechercher par titre, type ou e-mail…"
            class="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"
          />
          <span
            class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
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

        <div class="flex flex-wrap items-center justify-end gap-2">
          <label class="text-sm text-slate-600">
            <span class="sr-only">Type</span>
            <input
              v-model="typeFilter"
              type="text"
              placeholder="Type (optionnel)"
              class="w-56 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"
            />
          </label>

          <span class="text-sm text-slate-600">
            <template v-if="listTotal > 0">
              {{ pageFirst }}-{{ pageLast }} sur {{ formatInt(listTotal) }}
            </template>
            <template v-else>Aucune notification</template>
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

      <div
        v-if="sendSuccess"
        class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
      >
        {{ sendSuccess }}
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
              <th class="px-4 py-3 font-medium">Date</th>
              <th class="px-4 py-3 font-medium">Cible</th>
              <th class="px-4 py-3 font-medium">Titre</th>
              <th class="px-4 py-3 font-medium">Type</th>
              <th class="px-4 py-3 font-medium">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-8 text-center text-slate-500">
                Chargement…
              </td>
            </tr>
            <tr v-else-if="!notifications.length">
              <td colspan="5" class="px-4 py-8 text-center text-slate-400">
                Aucune notification.
              </td>
            </tr>
            <tr v-for="n in notifications" :key="n.id">
              <td class="whitespace-nowrap px-4 py-3">{{ formatDate(n.createdAt) }}</td>
              <td class="px-4 py-3">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-slate-900">{{ n.displayName }}</span>
                  <span
                    class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"
                    :class="n.userRole === 'PARTICULIER' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
                  >
                    {{ n.userRole === 'PARTICULIER' ? 'Particulier' : 'Prestataire' }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="max-w-[420px] truncate" :title="n.body ? `${n.title}: ${n.body}` : n.title">
                  {{ n.title }}
                </div>
              </td>
              <td class="px-4 py-3">{{ n.type ?? '—' }}</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="n.lu ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'"
                >
                  {{ n.lu ? 'Lu' : 'Non lu' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>

  <Teleport to="body">
    <div
      v-if="createModalOpen"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-[#140C44]/50 p-3 backdrop-blur-md sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-notification-title"
      @click.self="closeCreateNotificationModal"
    >
      <div
        class="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <div class="flex items-start justify-between gap-3 border-b border-slate-100 p-6">
          <div>
            <h3
              id="create-notification-title"
              class="text-lg font-semibold text-slate-900"
            >
              Créer une notification
            </h3>
            <p class="mt-1 text-sm text-slate-600">
              Envoi à tous ou ciblé sur une sélection (particuliers + prestataires).
            </p>
          </div>
          <button
            type="button"
            class="rounded-full p-1 text-rose-500 transition hover:bg-rose-50"
            aria-label="Fermer"
            @click="closeCreateNotificationModal"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="grid gap-4 md:grid-cols-2">
            <div class="md:col-span-1">
              <label class="text-sm font-medium text-slate-700">Titre</label>
              <input
                v-model="createTitle"
                type="text"
                placeholder="Ex: Mise à jour importante"
                class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              />
            </div>
            <div class="md:col-span-1">
              <label class="text-sm font-medium text-slate-700">Type (optionnel)</label>
              <input
                v-model="createType"
                type="text"
                placeholder="Ex: general_message"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              />
            </div>

            <div class="md:col-span-2">
              <label class="text-sm font-medium text-slate-700">Message</label>
              <textarea
                v-model="createBody"
                rows="4"
                placeholder="Votre message…"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              />
            </div>
          </div>

          <div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm font-semibold text-slate-900">Cible</p>
                <p class="text-xs text-slate-600" v-if="createAudienceMode !== 'SELECTION'">
                  Envoi à :
                  {{
                    createAudienceMode === 'TOUT'
                      ? 'Tout le monde'
                      : createAudienceMode === 'PARTICULIER'
                        ? 'Tous les particuliers'
                        : 'Tous les prestataires'
                  }}
                </p>
                <p class="text-xs text-slate-600" v-else>
                  {{ selectedClientsUserIds.length + selectedPrestatairesUserIds.length }} sélectionné(s)
                </p>
              </div>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <button
                  v-if="createAudienceMode === 'SELECTION'"
                  type="button"
                  class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                  :disabled="createClientsLoading || createPrestatairesLoading"
                  @click="clearSelectedUsers"
                >
                  Effacer sélection
                </button>
              </div>
            </div>

            <div class="mt-4">
              <label class="text-sm font-medium text-slate-700">Audience</label>
              <select
                v-model="createAudienceMode"
                class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
              >
                <option value="SELECTION">Sélection (particuliers + prestataires)</option>
                <option value="TOUT">Tous les utilisateurs</option>
                <option value="PARTICULIER">Tous les particuliers</option>
                <option value="PRESTATAIRE">Tous les prestataires</option>
              </select>
            </div>

            <div
              v-if="createAudienceMode !== 'SELECTION'"
              class="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              Envoi immédiat à l’audience sélectionnée.
            </div>

            <div v-else class="mt-4 grid gap-4 md:grid-cols-2">
              <!-- Particuliers -->
              <div>
                <p class="text-sm font-semibold text-slate-900">Particuliers</p>
                <div class="mt-3">
                  <label class="relative block w-full">
                    <span class="sr-only">Rechercher client</span>
                    <input
                      v-model="createClientSearchInput"
                      type="search"
                      placeholder="Rechercher client (nom ou e-mail)…"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
                    />
                    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <path stroke-linecap="round" d="m20 20-3.5-3.5" />
                      </svg>
                    </span>
                  </label>
                </div>

                <div class="mt-3 max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white">
                  <div v-if="createClientsLoading" class="px-4 py-6 text-center text-sm text-slate-500">
                    Chargement…
                  </div>
                  <div
                    v-else-if="createClients.length === 0"
                    class="px-4 py-6 text-center text-sm text-slate-400"
                  >
                    Aucun client trouvé.
                  </div>
                  <div v-else class="divide-y divide-slate-100">
                    <label
                      v-for="c in createClients"
                      :key="c.userId"
                      class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <span class="min-w-0">
                        <span class="block truncate text-sm font-semibold text-slate-900">
                          {{ c.nomComplet }}
                        </span>
                        <span class="block truncate text-xs text-slate-600">
                          {{ c.email }}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        :checked="isClientSelected(c.userId)"
                        @change="toggleClientSelection(c.userId)"
                        class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]/30"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <!-- Prestataires -->
              <div>
                <p class="text-sm font-semibold text-slate-900">Prestataires</p>
                <div class="mt-3">
                  <label class="relative block w-full">
                    <span class="sr-only">Rechercher prestataire</span>
                    <input
                      v-model="createPrestataireSearchInput"
                      type="search"
                      placeholder="Rechercher prestataire (nom ou e-mail)…"
                      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
                    />
                    <span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="7" />
                        <path stroke-linecap="round" d="m20 20-3.5-3.5" />
                      </svg>
                    </span>
                  </label>
                </div>

                <div class="mt-3 max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white">
                  <div v-if="createPrestatairesLoading" class="px-4 py-6 text-center text-sm text-slate-500">
                    Chargement…
                  </div>
                  <div
                    v-else-if="filteredPrestataires.length === 0"
                    class="px-4 py-6 text-center text-sm text-slate-400"
                  >
                    Aucun prestataire trouvé.
                  </div>
                  <div v-else class="divide-y divide-slate-100">
                    <label
                      v-for="p in filteredPrestataires"
                      :key="p.userId"
                      class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"
                    >
                      <span class="min-w-0">
                        <span class="block truncate text-sm font-semibold text-slate-900">
                          {{ p.nom }}
                        </span>
                        <span class="block truncate text-xs text-slate-600">
                          {{ p.email }}
                        </span>
                      </span>
                      <input
                        type="checkbox"
                        :checked="isPrestataireSelected(p.userId)"
                        @change="togglePrestataireSelection(p.userId)"
                        class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]/30"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="createNotificationError" class="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {{ createNotificationError }}
          </div>

          <div class="mt-6 flex justify-center gap-3">
            <button
              type="button"
              class="w-full max-w-xs rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
              :disabled="createSubmitting"
              @click="closeCreateNotificationModal"
            >
              Annuler
            </button>
            <button
              type="button"
              class="w-full max-w-xs rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="createSubmitting || (createAudienceMode === 'SELECTION' && selectedClientsUserIds.length + selectedPrestatairesUserIds.length === 0)"
              @click="submitCreateNotification"
            >
              {{ createSubmitting ? 'Envoi…' : 'Envoyer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type AdminNotification = {
  id: string
  createdAt: string
  lu: boolean
  title: string
  body?: string | null
  type?: string | null
  userId: string
  userEmail: string
  userRole: 'PARTICULIER' | 'PRESTATAIRE' | string
  displayName: string
}

type AdminNotificationsPayload = {
  total: number
  items: AdminNotification[]
}

function unwrapApi<T>(response: unknown): T | undefined {
  if (!response || typeof response !== 'object') return undefined
  const r = response as Record<string, unknown>
  if ('data' in r && r.data !== undefined && r.data !== null) return r.data as T
  return response as T
}

function extractApiMessage(err: unknown, fallback: string): string {
  const e = err as { data?: { message?: string | string[] }; message?: string }
  const m = e?.data?.message
  if (typeof m === 'string' && m.trim()) return m
  if (Array.isArray(m) && m[0]) return String(m[0])
  if (e?.message && typeof e.message === 'string') return e.message
  return fallback
}

const notifications = ref<AdminNotification[]>([])
const listTotal = ref(0)
const page = ref(0)
const pageSize = 14
const loading = ref(false)
const loadError = ref('')
/** Message après envoi réussi (push côté mobile = autre sujet : FCM sur le backend). */
const sendSuccess = ref('')

const audience = ref<'TOUT' | 'PARTICULIER' | 'PRESTATAIRE'>('TOUT')
const unreadOnly = ref(false)
const typeFilter = ref('')

// =========================
// Création notification ciblée (multi-clients)
// =========================
const createModalOpen = ref(false)
const createSubmitting = ref(false)
const createNotificationError = ref('')

const createTitle = ref('')
const createBody = ref('')
const createType = ref('')

type CreateAudienceMode = 'SELECTION' | 'TOUT' | 'PARTICULIER' | 'PRESTATAIRE'
const createAudienceMode = ref<CreateAudienceMode>('SELECTION')

type PickClientRow = {
  userId: string
  nomComplet: string
  email: string
}

const createClients = ref<PickClientRow[]>([])
const createClientsLoading = ref(false)
const selectedClientsUserIds = ref<string[]>([])

type PickPrestataireRow = {
  userId: string
  nom: string
  email: string
}

const createPrestataires = ref<PickPrestataireRow[]>([])
const createPrestatairesLoading = ref(false)
const selectedPrestatairesUserIds = ref<string[]>([])

const createClientSearchInput = ref('')
const createClientsDebouncedSearch = ref('')
let createClientsDebounceTimer: ReturnType<typeof setTimeout> | null = null

watch(createClientSearchInput, (v) => {
  if (createClientsDebounceTimer) clearTimeout(createClientsDebounceTimer)
  createClientsDebounceTimer = setTimeout(() => {
    createClientsDebouncedSearch.value = v
    if (createModalOpen.value) loadCreateClients()
  }, 350)
})

const createPrestataireSearchInput = ref('')
const filteredPrestataires = computed(() => {
  const q = createPrestataireSearchInput.value.trim().toLowerCase()
  if (!q) return createPrestataires.value
  return createPrestataires.value.filter((p) => {
    return (
      p.nom.toLowerCase().includes(q) || (p.email ?? '').toLowerCase().includes(q)
    )
  })
})

watch(createAudienceMode, async (mode) => {
  // On ne touche à l’état que lorsque le modal est ouvert.
  if (!createModalOpen.value) return

  if (mode === 'SELECTION') {
    // Charger (ou recharger) pour garantir que les deux listes apparaissent.
    await Promise.all([loadCreateClients(), loadCreatePrestataires()])
  } else {
    // Hors mode sélection, on évite d’induire en erreur avec des checkboxes sélectionnées.
    selectedClientsUserIds.value = []
    selectedPrestatairesUserIds.value = []
  }
})

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
const pageFirst = computed(() => (notifications.value.length ? page.value * pageSize + 1 : 0))
const pageLast = computed(() => page.value * pageSize + notifications.value.length)

watch([page, audience, unreadOnly, typeFilter, debouncedSearch], () => {
  loadNotifications()
})

onMounted(() => {
  loadNotifications()
})

function openCreateNotificationModal() {
  sendSuccess.value = ''
  createModalOpen.value = true
  createSubmitting.value = false
  createNotificationError.value = ''

  createAudienceMode.value = 'SELECTION'
  createTitle.value = ''
  createBody.value = ''
  createType.value = ''

  selectedClientsUserIds.value = []
  selectedPrestatairesUserIds.value = []
  createClientsDebouncedSearch.value = ''
  createClientSearchInput.value = ''
  createPrestataireSearchInput.value = ''

  loadCreateClients()
  loadCreatePrestataires()
}

function closeCreateNotificationModal() {
  if (createSubmitting.value) return
  createModalOpen.value = false
}

function clearSelectedUsers() {
  selectedClientsUserIds.value = []
  selectedPrestatairesUserIds.value = []
}

function isClientSelected(userId: string) {
  return selectedClientsUserIds.value.includes(userId)
}

function toggleClientSelection(userId: string) {
  const idx = selectedClientsUserIds.value.indexOf(userId)
  if (idx >= 0) {
    selectedClientsUserIds.value.splice(idx, 1)
  } else {
    selectedClientsUserIds.value.push(userId)
  }
}

function isPrestataireSelected(userId: string) {
  return selectedPrestatairesUserIds.value.includes(userId)
}

function togglePrestataireSelection(userId: string) {
  const idx = selectedPrestatairesUserIds.value.indexOf(userId)
  if (idx >= 0) {
    selectedPrestatairesUserIds.value.splice(idx, 1)
  } else {
    selectedPrestatairesUserIds.value.push(userId)
  }
}

async function loadCreateClients() {
  createClientsLoading.value = true
  try {
    const response = await fetchAdminApi<unknown>('/admin/clients', {
      query: {
        limit: 20,
        offset: 0,
        ...(createClientsDebouncedSearch.value.trim()
          ? { search: createClientsDebouncedSearch.value.trim() }
          : {}),
      },
    })
    const payload = unwrapApi<{ items?: PickClientRow[] }>(response)
    createClients.value = Array.isArray(payload?.items)
      ? (payload?.items as any[]).map((it) => ({
          userId: String(it.userId),
          nomComplet: String(it.nomComplet ?? ''),
          email: String(it.email ?? ''),
        }))
      : []
  } catch (e) {
    console.error(e)
    createClients.value = []
  } finally {
    createClientsLoading.value = false
  }
}

async function loadCreatePrestataires() {
  createPrestatairesLoading.value = true
  try {
    const response = await fetchAdminApi<unknown>('/admin/prestataires', {
      query: { limit: 200 },
    })
    const payload = unwrapApi<{ items?: PickPrestataireRow[] }>(response)
    createPrestataires.value = Array.isArray(payload?.items)
      ? (payload?.items as any[]).map((it) => ({
          userId: String(it.userId ?? it.user_id ?? ''),
          nom: String(it.nom ?? ''),
          email: String(it.email ?? ''),
        }))
      : []
  } catch (e) {
    console.error(e)
    createPrestataires.value = []
  } finally {
    createPrestatairesLoading.value = false
  }
}

async function submitCreateNotification() {
  if (createSubmitting.value) return
  createNotificationError.value = ''

  const title = createTitle.value.trim()
  const body = createBody.value.trim()
  const type = createType.value.trim()

  if (!title) {
    createNotificationError.value = 'Veuillez saisir un titre.'
    return
  }

  createSubmitting.value = true
  try {
    if (createAudienceMode.value === 'SELECTION') {
      const ids = [
        ...selectedClientsUserIds.value,
        ...selectedPrestatairesUserIds.value,
      ]
      if (ids.length === 0) {
        createNotificationError.value =
          'Veuillez sélectionner au moins un utilisateur.'
        return
      }

      await Promise.all(
        ids.map((userId) =>
          fetchAdminApi(
            '/admin/notifications/targeted',
            {
              body: {
                userId,
                title,
                body: body || undefined,
                type: type || undefined,
              },
            },
            'POST',
          ),
        ),
      )
      sendSuccess.value = `Notification enregistrée pour ${ids.length} utilisateur(s).`
    } else {
      const res = await fetchAdminApi<{ ok?: boolean; sent?: number }>(
        '/admin/notifications/general',
        {
          body: {
            title,
            body: body || undefined,
            type: type || undefined,
            audience: createAudienceMode.value,
          },
        },
        'POST',
      )
      const payload = unwrapApi<{ ok?: boolean; sent?: number }>(res) ?? res
      const n = Number(payload?.sent ?? 0)
      sendSuccess.value =
        n > 0
          ? `Notification créée pour ${n} utilisateur(s). Push mobile : selon FCM (voir logs serveur [FCM trace]).`
          : `Requête OK mais 0 destinataire en base — aucun particulier/prestataire ne correspond à l’audience.`
    }

    createModalOpen.value = false
    await loadNotifications()
  } catch (e) {
    console.error(e)
    createNotificationError.value = extractApiMessage(
      e,
      'Impossible d\'envoyer la notification.',
    )
  } finally {
    createSubmitting.value = false
  }
}

async function loadNotifications() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetchAdminApi<unknown>('/admin/notifications', {
      query: {
        limit: pageSize,
        offset: page.value * pageSize,
        audience: audience.value,
        ...(unreadOnly.value ? { unreadOnly: 'true' } : {}),
        ...(typeFilter.value.trim() ? { type: typeFilter.value.trim() } : {}),
        ...(debouncedSearch.value.trim() ? { search: debouncedSearch.value.trim() } : {}),
      },
    })

    const payload = unwrapApi<AdminNotificationsPayload>(response)
    listTotal.value = payload?.total ?? 0
    notifications.value = Array.isArray(payload?.items) ? payload.items : []
  } catch (e) {
    console.error(e)
    notifications.value = []
    listTotal.value = 0
    loadError.value = 'Impossible de charger les notifications.'
  } finally {
    loading.value = false
  }
}

function goPage(p: number) {
  if (p < 0 || p > totalPages.value - 1) return
  page.value = p
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
  title: 'Notifications',
})
</script>

