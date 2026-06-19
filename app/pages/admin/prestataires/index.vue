<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Total Prestataires</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ formatInt(stats.total) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Prestataires Actifs</p>
        <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ formatInt(stats.actifs) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Prestataires inactifs</p>
        <p class="mt-2 text-3xl font-semibold text-rose-600">{{ formatInt(stats.inactifs) }}</p>
        <p class="mt-2 text-xs text-slate-400">Total cumulé</p>
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
        v-if="actifToggleError"
        class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
      >
        {{ actifToggleError }}
      </div>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-full px-6 py-2 text-sm font-medium transition"
            :class="activeTab === 'actifs' ? 'bg-[#020B51] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="activeTab = 'actifs'"
          >
            Actifs
          </button>
          <button
            type="button"
            class="rounded-full px-6 py-2 text-sm font-medium transition"
            :class="activeTab === 'inactifs' ? 'bg-[#020B51] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="activeTab = 'inactifs'"
          >
            Inactifs
          </button>

          <details ref="serviceFilterDetailsRef" class="relative">
            <summary
              class="list-none cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 [&::-webkit-details-marker]:hidden"
            >
              <span class="inline-flex items-center gap-2">
                Métier(s)
                <span
                  v-if="selectedServiceFilterIds.length"
                  class="rounded-full bg-[#020B51] px-2 py-0.5 text-xs text-white"
                >
                  {{ selectedServiceFilterIds.length }}
                </span>
              </span>
            </summary>
            <div
              class="absolute left-0 z-20 mt-2 w-[min(100vw-2rem,280px)] rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
            >
              <p v-if="serviceFilterLoading" class="px-2 py-3 text-sm text-slate-500">Chargement…</p>
              <p v-else-if="serviceFilterError" class="px-2 py-2 text-sm text-rose-600">{{ serviceFilterError }}</p>
              <div v-else class="max-h-56 overflow-y-auto">
                <label
                  v-for="opt in serviceFilterOptions"
                  :key="opt.id"
                  class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input v-model="selectedServiceFilterIds" type="checkbox" class="rounded border-slate-300" :value="opt.id" />
                  <span>{{ opt.libelle }}</span>
                </label>
                <p v-if="!serviceFilterOptions.length" class="px-2 py-3 text-sm text-slate-400">Aucun service.</p>
              </div>
              <div class="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-2">
                <button
                  v-if="selectedServiceFilterIds.length"
                  type="button"
                  class="w-full rounded-lg py-2 text-center text-xs font-medium text-[#020B51] hover:bg-slate-50"
                  @click="clearServiceFilter"
                >
                  Réinitialiser le filtre
                </button>
                <button
                  type="button"
                  class="w-full rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  @click="closeServiceFilterDropdown"
                >
                  Fermer
                </button>
              </div>
            </div>
          </details>
        </div>

        <button
          type="button"
          class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90"
          @click="openCreateModal"
        >
          Ajouter un prestataire
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Prestataires</th>
              <th class="px-4 py-3 font-medium">E-mail</th>
              <th class="px-4 py-3 font-medium">Téléphone</th>
              <th class="px-4 py-3 font-medium">Métier</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="!filteredPrestataires.length">
              <td colspan="6" class="px-4 py-6 text-center text-slate-400">
                Aucun prestataire pour ce filtre.
              </td>
            </tr>
            <tr v-for="p in filteredPrestataires" :key="p.id">
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-800">{{ p.nom }}</p>
                <p class="text-xs text-amber-500">
                  {{ renderStars(p.noteMoyenne) }}
                  <span class="text-slate-400">({{ p.nbAvis }})</span>
                </p>
              </td>
              <td class="px-4 py-3">{{ p.email || '—' }}</td>
              <td class="px-4 py-3">{{ p.telephone || '—' }}</td>
              <td class="px-4 py-3">
                <p>{{ p.metier }}</p>
                <p class="text-xs text-slate-400">Docs: {{ p.documentsValides }}/{{ p.documentsTotal }}</p>
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-col items-start gap-1">
                  <span
                    class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                    :class="p.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                  >
                    {{ p.statut }}
                  </span>
                  <span class="text-[11px] text-slate-500">{{ p.statutVerification }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    class="rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
                    :class="
                      p.actif
                        ? 'border border-slate-400 text-slate-700 hover:bg-slate-100'
                        : 'border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white'
                    "
                    :disabled="
                      togglingPrestataireId === p.id || (!p.actif && !canActivatePrestataire(p))
                    "
                    :title="
                      !p.actif && !canActivatePrestataire(p)
                        ? 'Activation possible uniquement si le statut de vérification est « VERIFIE ».'
                        : undefined
                    "
                    @click="togglePrestataireActif(p)"
                  >
                    {{ togglingPrestataireId === p.id ? '…' : p.actif ? 'Désactiver' : 'Activer' }}
                  </button>
                  <NuxtLink
                    :to="`/admin/prestataires/${p.id}`"
                    class="inline-flex rounded-full border border-[#020B51] px-3 py-1 text-xs font-semibold text-[#020B51] transition hover:bg-[#020B51] hover:text-white"
                  >
                    Voir
                  </NuxtLink>
                  <button
                    type="button"
                    class="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 disabled:opacity-45"
                    title="Supprimer le prestataire"
                    :disabled="deletingId === p.id"
                    @click="confirmDelete(p)"
                  >
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
        v-if="createModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"
        @click.self="closeCreateModal"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-800">Nouveau prestataire</h3>
          <p class="mt-1 text-xs text-slate-500">
            Le compte sera créé en statut « Inactif » et devra être vérifié.
          </p>

          <div class="mt-4 grid gap-3">
            <input
              v-model="createForm.name"
              type="text"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Nom ou raison sociale *"
            />
            <input
              v-model="createForm.telephone"
              type="tel"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Téléphone *"
            />
            <input
              v-model="createForm.adresse"
              type="text"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Adresse *"
            />
            <input
              v-model="createForm.email"
              type="email"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Email (optionnel)"
            />
            <input
              v-model="createForm.password"
              type="text"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Mot de passe initial * (min 8 caractères)"
            />
            <textarea
              v-model="createForm.bio"
              rows="2"
              class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]"
              placeholder="Bio (optionnel)"
            />

            <div>
              <p class="mb-2 text-xs font-medium text-slate-600">Métier(s)</p>
              <div class="grid max-h-40 grid-cols-2 gap-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                <label
                  v-for="opt in serviceFilterOptions"
                  :key="opt.id"
                  class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <input
                    v-model="createForm.serviceIds"
                    type="checkbox"
                    :value="opt.id"
                    class="rounded border-slate-300"
                  />
                  <span>{{ opt.libelle }}</span>
                </label>
              </div>
            </div>
          </div>

          <p v-if="createError" class="mt-3 text-sm text-rose-600">{{ createError }}</p>

          <div class="mt-6 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              :disabled="creating"
              @click="closeCreateModal"
            >
              Annuler
            </button>
            <button
              type="button"
              class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50"
              :disabled="creating || !canSubmitCreate"
              @click="submitCreate"
            >
              {{ creating ? 'Création…' : 'Créer le prestataire' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type PrestataireItem = {
  id: string
  nom: string
  email: string
  telephone: string
  metier: string
  serviceIds: string[]
  statut: 'Actif' | 'Inactif'
  actif: boolean
  statutVerification: string
  noteMoyenne: number
  nbAvis: number
  documentsTotal: number
  documentsValides: number
}

const stats = reactive({
  total: 0,
  actifs: 0,
  inactifs: 0,
})
const prestataires = ref<PrestataireItem[]>([])
const activeTab = ref<'actifs' | 'inactifs'>('actifs')

type ServiceFilterOption = {
  id: string
  libelle: string
}

const serviceFilterOptions = ref<ServiceFilterOption[]>([])
const serviceFilterLoading = ref(false)
const serviceFilterError = ref('')
const selectedServiceFilterIds = ref<string[]>([])
const serviceFilterDetailsRef = ref<HTMLDetailsElement | null>(null)

const loadError = ref('')
const actifToggleError = ref('')
const togglingPrestataireId = ref<string | null>(null)
const deletingId = ref<string | null>(null)

const createModalOpen = ref(false)
const creating = ref(false)
const createError = ref('')
const createForm = reactive({
  name: '',
  telephone: '',
  adresse: '',
  email: '',
  password: '',
  bio: '',
  serviceIds: [] as string[],
})

const canSubmitCreate = computed(() => {
  return (
    createForm.name.trim().length > 0 &&
    createForm.telephone.trim().length > 0 &&
    createForm.adresse.trim().length >= 3 &&
    createForm.password.trim().length >= 8
  )
})

function openCreateModal() {
  createError.value = ''
  createForm.name = ''
  createForm.telephone = ''
  createForm.adresse = ''
  createForm.email = ''
  createForm.password = ''
  createForm.bio = ''
  createForm.serviceIds = []
  createModalOpen.value = true
}

function closeCreateModal() {
  if (creating.value) return
  createModalOpen.value = false
}

async function submitCreate() {
  if (!canSubmitCreate.value || creating.value) return
  creating.value = true
  createError.value = ''
  try {
    await fetchAdminApi(
      '/admin/prestataires',
      {
        body: {
          role: 'PRESTATAIRE',
          name: createForm.name.trim(),
          telephone: createForm.telephone.trim(),
          adresse: createForm.adresse.trim(),
          password: createForm.password,
          email: createForm.email.trim() || undefined,
          bio: createForm.bio.trim() || undefined,
          serviceIds: createForm.serviceIds.length
            ? createForm.serviceIds
            : undefined,
        },
      },
      'POST',
    )
    createModalOpen.value = false
    await loadPrestataires()
  } catch (e) {
    const status =
      typeof e === 'object' && e && 'statusCode' in e
        ? Number((e as { statusCode?: number }).statusCode)
        : 0
    if (status === 404) {
      createError.value =
        'Route API absente sur le serveur (POST /admin/prestataires). Redémarrez le backend en local (npm run build && npm run start) ou redéployez l’API sur Render.'
    } else {
      createError.value =
        extractApiMessage(e) || 'Création impossible. Vérifiez les informations saisies.'
    }
  } finally {
    creating.value = false
  }
}

async function loadPrestataires() {
  try {
    loadError.value = ''
    const response = await fetchAdminApi<{
      data?: { stats?: { total: number; actifs: number; inactifs: number }; items?: PrestataireItem[] }
      stats?: { total: number; actifs: number; inactifs: number }
      items?: PrestataireItem[]
    }>('/admin/prestataires', { query: { limit: 500 } })

    const payload = response?.data ?? response
    stats.total = payload?.stats?.total ?? 0
    stats.actifs = payload?.stats?.actifs ?? 0
    stats.inactifs = payload?.stats?.inactifs ?? 0
    prestataires.value = (payload?.items ?? []).map((row) => ({
      ...row,
      serviceIds: Array.isArray(row.serviceIds) ? row.serviceIds : [],
    }))
  } catch (error) {
    console.error('Erreur chargement prestataires admin:', error)
    const message =
      typeof error === 'object' && error && 'statusMessage' in error
        ? String((error as { statusMessage?: string }).statusMessage || '')
        : ''
    loadError.value = message
      ? `Chargement impossible (${message}).`
      : 'Chargement impossible. Vérifie que le backend admin est démarré.'
    stats.total = 0
    stats.actifs = 0
    stats.inactifs = 0
    prestataires.value = []
  }
}

onMounted(() => {
  loadPrestataires()
  loadServiceFilterOptions()
})

const filteredPrestataires = computed(() => {
  let list =
    activeTab.value === 'actifs'
      ? prestataires.value.filter((p) => p.actif)
      : prestataires.value.filter((p) => !p.actif)
  const ids = selectedServiceFilterIds.value
  if (ids.length > 0) {
    const set = new Set(ids)
    list = list.filter((p) => (p.serviceIds ?? []).some((sid) => set.has(sid)))
  }
  return list
})

async function loadServiceFilterOptions() {
  serviceFilterLoading.value = true
  serviceFilterError.value = ''
  try {
    const response = await fetchAdminApi<{
      data?: { items?: Array<{ id: string; libelle: string }> }
      items?: Array<{ id: string; libelle: string }>
    }>('/admin/services')
    const payload =
      (response as { data?: { items?: Array<{ id: string; libelle: string }> } })?.data ?? response
    const items = payload?.items ?? []
    serviceFilterOptions.value = items.map((s) => ({ id: s.id, libelle: s.libelle })).sort((a, b) =>
      a.libelle.localeCompare(b.libelle, 'fr'),
    )
  } catch (e) {
    console.error('Erreur chargement liste métiers (filtre):', e)
    serviceFilterOptions.value = []
    serviceFilterError.value = 'Impossible de charger les métiers.'
  } finally {
    serviceFilterLoading.value = false
  }
}

function clearServiceFilter() {
  selectedServiceFilterIds.value = []
  if (serviceFilterDetailsRef.value) {
    serviceFilterDetailsRef.value.open = false
  }
}

function closeServiceFilterDropdown() {
  if (serviceFilterDetailsRef.value) {
    serviceFilterDetailsRef.value.open = false
  }
}

function formatInt(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value ?? 0)
}

function renderStars(note: number) {
  const rounded = Math.max(0, Math.min(5, Math.round(note || 0)))
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`
}

function canActivatePrestataire(p: PrestataireItem) {
  return p.statutVerification === 'VERIFIE'
}

function extractApiMessage(e: unknown): string {
  if (typeof e === 'object' && e && 'data' in e) {
    const data = (e as { data?: { message?: string | string[] } }).data
    const m = data?.message
    if (Array.isArray(m)) return m.filter(Boolean).join(' ')
    if (typeof m === 'string') return m
  }
  return ''
}

async function togglePrestataireActif(p: PrestataireItem) {
  const next = !p.actif
  if (next && !canActivatePrestataire(p)) return
  actifToggleError.value = ''
  togglingPrestataireId.value = p.id
  try {
    await fetchAdminApi(`/admin/prestataires/${p.id}/actif`, { body: { actif: next } }, 'PATCH')
    await loadPrestataires()
  } catch (e) {
    console.error(e)
    actifToggleError.value = extractApiMessage(e) || 'Impossible de modifier le statut actif.'
  } finally {
    togglingPrestataireId.value = null
  }
}

async function confirmDelete(p: PrestataireItem) {
  const ok = window.confirm(
    `Supprimer définitivement le prestataire « ${p.nom} » et son compte ? Cette action est irréversible.`,
  )
  if (!ok) return
  deletingId.value = p.id
  try {
    await fetchAdminApi(`/admin/prestataires/${p.id}`, {}, 'DELETE')
    await loadPrestataires()
  } catch (e) {
    console.error(e)
    window.alert(
      'Suppression impossible. Réessayez ou vérifiez les dépendances (prestations, abonnements, etc.).',
    )
  } finally {
    deletingId.value = null
  }
}

useHead({
  title: 'Prestataires',
})
</script>
