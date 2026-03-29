<template>
  <div class="space-y-4">
    <section class="grid gap-3 md:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Total Offres</p>
        <p class="mt-2 text-3xl font-semibold text-slate-800">{{ stats.total }}</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Offres Actives</p>
        <p class="mt-2 text-3xl font-semibold text-emerald-600">{{ stats.actifs }}</p>
      </article>
      <article class="rounded-2xl bg-white p-5 shadow-sm">
        <p class="text-xs font-semibold uppercase text-slate-500">Offres Inactives</p>
        <p class="mt-2 text-3xl font-semibold text-rose-600">{{ stats.inactifs }}</p>
      </article>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div v-if="errorMsg" class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
        {{ errorMsg }}
      </div>

      <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold text-slate-800">Offres d'abonnement</h2>
        <button
          type="button"
          class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90"
          @click="openCreateModal"
        >
          Offre +
        </button>
      </div>

      <div class="overflow-x-auto rounded-xl border border-slate-200">
        <table class="min-w-full bg-white text-left text-sm">
          <thead class="bg-[#020B51] text-white">
            <tr>
              <th class="px-4 py-3 font-medium">Code</th>
              <th class="px-4 py-3 font-medium">Libellé</th>
              <th class="px-4 py-3 font-medium">Prix</th>
              <th class="px-4 py-3 font-medium">Durée</th>
              <th class="px-4 py-3 font-medium">Statut</th>
              <th class="px-4 py-3 font-medium text-right"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 text-slate-700">
            <tr v-if="loading">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Chargement…</td>
            </tr>
            <tr v-else-if="!items.length">
              <td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucune offre.</td>
            </tr>
            <tr v-for="row in items" :key="row.id">
              <td class="px-4 py-3">{{ row.code }}</td>
              <td class="px-4 py-3 font-medium text-slate-800">{{ row.libelle }}</td>
              <td class="px-4 py-3">{{ formatMoney(row.prix) }}</td>
              <td class="px-4 py-3">{{ row.dureeMois }} mois</td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="row.actif ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                >
                  {{ row.actif ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-4 py-3 text-right">
                <div class="inline-flex items-center gap-2">
                  <button
                    type="button"
                    class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    @click="openEditModal(row)"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    class="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                    :class="row.actif ? 'border-rose-300 bg-rose-50 text-rose-700' : 'border-emerald-300 bg-emerald-50 text-emerald-700'"
                    :disabled="togglingId === row.id"
                    @click="toggleActif(row)"
                  >
                    {{ togglingId === row.id ? '…' : row.actif ? 'Désactiver' : 'Activer' }}
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
        @click.self="closeModal"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <h3 class="text-lg font-semibold text-slate-800">
            {{ editingId ? "Modifier l'offre" : 'Nouvelle offre' }}
          </h3>
          <div class="mt-4 grid gap-3">
            <input v-model="form.libelle" type="text" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Libellé" />
            <input v-model="form.prix" type="number" min="0" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Prix (XOF)" />
            <input v-model="form.dureeMois" type="number" min="1" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Durée (mois)" />
            <input v-model="form.code" type="text" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Code (optionnel)" />
            <textarea v-model="form.description" rows="3" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Description (optionnel)" />
          </div>
          <div class="mt-6 flex justify-end gap-2">
            <button type="button" class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="closeModal">
              Annuler
            </button>
            <button
              type="button"
              class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              :disabled="saving || !form.libelle.trim() || !form.prix || !form.dureeMois"
              @click="submitModal"
            >
              {{ saving ? 'Enregistrement…' : editingId ? 'Mettre à jour' : 'Enregistrer' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const { fetchAdminApi } = useAdminFetch()

type OffreRow = {
  id: string
  code: string
  libelle: string
  description: string
  prix: number
  dureeMois: number
  actif: boolean
  ordre: number
  createdAt: string
}

const items = ref<OffreRow[]>([])
const loading = ref(true)
const errorMsg = ref('')
const togglingId = ref<string | null>(null)
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref<string | null>(null)
const form = reactive({
  code: '',
  libelle: '',
  description: '',
  prix: '',
  dureeMois: '',
})

const stats = computed(() => ({
  total: items.value.length,
  actifs: items.value.filter((o) => o.actif).length,
  inactifs: items.value.filter((o) => !o.actif).length,
}))

onMounted(() => {
  loadOffres()
})

function unwrapList(response: unknown): { items?: OffreRow[] } {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner) && 'items' in inner) {
    return inner as { items?: OffreRow[] }
  }
  if ('items' in r) return r as { items?: OffreRow[] }
  return {}
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
  loading.value = true
  errorMsg.value = ''
  try {
    const response = await fetchAdminApi<unknown>('/admin/offres')
    const payload = unwrapList(response)
    items.value = Array.isArray(payload.items) ? payload.items : []
  } catch (e) {
    items.value = []
    errorMsg.value = extractApiMessage(e, 'Impossible de charger les offres.')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  editingId.value = null
  form.code = ''
  form.libelle = ''
  form.description = ''
  form.prix = ''
  form.dureeMois = ''
  modalOpen.value = true
}

function openEditModal(row: OffreRow) {
  editingId.value = row.id
  form.code = row.code
  form.libelle = row.libelle
  form.description = row.description || ''
  form.prix = String(row.prix)
  form.dureeMois = String(row.dureeMois)
  modalOpen.value = true
}

function closeModal() {
  if (saving.value) return
  modalOpen.value = false
}

async function submitCreate() {
  if (saving.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    await fetchAdminApi('/admin/offres', {
      body: {
        code: form.code.trim() || undefined,
        libelle: form.libelle.trim(),
        description: form.description.trim() || undefined,
        prix: Number(form.prix),
        dureeMois: Number(form.dureeMois),
      },
    }, 'POST')
    modalOpen.value = false
    await loadOffres()
  } catch (e) {
    errorMsg.value = extractApiMessage(e, 'Création impossible.')
  } finally {
    saving.value = false
  }
}

async function submitModal() {
  if (editingId.value) {
    await submitEdit()
    return
  }
  await submitCreate()
}

async function submitEdit() {
  if (saving.value || !editingId.value) return
  saving.value = true
  errorMsg.value = ''
  try {
    await fetchAdminApi(`/admin/offres/${editingId.value}`, {
      body: {
        code: form.code.trim() || undefined,
        libelle: form.libelle.trim(),
        description: form.description.trim() || undefined,
        prix: Number(form.prix),
        dureeMois: Number(form.dureeMois),
      },
    }, 'PATCH')
    modalOpen.value = false
    editingId.value = null
    await loadOffres()
  } catch (e) {
    errorMsg.value = extractApiMessage(e, 'Mise à jour impossible.')
  } finally {
    saving.value = false
  }
}

async function toggleActif(row: OffreRow) {
  if (togglingId.value) return
  togglingId.value = row.id
  errorMsg.value = ''
  try {
    await fetchAdminApi(`/admin/offres/${row.id}`, { body: { actif: !row.actif } }, 'PATCH')
    row.actif = !row.actif
  } catch (e) {
    errorMsg.value = extractApiMessage(e, 'Mise à jour impossible.')
  } finally {
    togglingId.value = null
  }
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('fr-FR').format(value ?? 0)} XOF`
}

useHead({
  title: 'Offres',
})
</script>
