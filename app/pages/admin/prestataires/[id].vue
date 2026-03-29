<template>
  <div class="space-y-4">
    <NuxtLink
      to="/admin/prestataires"
      class="inline-flex items-center gap-2 text-sm font-medium text-[#020B51] hover:underline"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Retour
    </NuxtLink>

    <div
      v-if="loadError"
      class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
    >
      {{ loadError }}
    </div>

    <div v-if="loading" class="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
      Chargement…
    </div>

    <template v-else-if="p">
      <!-- En-tête prestataire -->
      <section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div
              class="mx-auto flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 text-sky-500 sm:mx-0"
            >
              <img
                v-if="p.avatarUrl && !headerAvatarFailed"
                :src="p.avatarUrl"
                alt=""
                class="h-full w-full object-cover"
                @error="headerAvatarFailed = true"
              />
              <svg v-else class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div class="min-w-0 text-center sm:text-left">
              <h1 class="text-2xl font-bold text-[#020B51] sm:text-3xl">{{ p.nom }}</h1>
              <p class="mt-1 text-amber-500">
                {{ renderStars(p.noteMoyenne) }}
                <span class="text-slate-400">({{ p.nbAvis }})</span>
              </p>
              <div class="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <p class="flex items-center justify-center gap-2 sm:justify-start">
                  <span class="text-slate-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  {{ p.telephone?.trim() || '—' }}
                </p>
                <p class="flex items-center justify-center gap-2 sm:justify-start">
                  <span class="text-slate-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span class="truncate">{{ p.email }}</span>
                </p>
                <p class="flex items-center justify-center gap-2 sm:justify-start sm:col-span-2">
                  <span class="text-slate-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <span><span class="font-semibold text-slate-800">Métier :</span> {{ p.metier }}</span>
                </p>
                <p class="flex items-center justify-center gap-2 sm:justify-start sm:col-span-2">
                  <span class="text-slate-400">
                    <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span><span class="font-semibold text-slate-800">Date d'adhésion :</span> {{ formatDate(p.dateAdhesion) }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col items-center gap-4 sm:flex-row lg:flex-col lg:items-end">
            <div class="flex items-center gap-3">
              <span class="text-sm font-semibold text-slate-700">{{ p.actif ? 'Actif' : 'Inactif' }}</span>
              <button
                type="button"
                role="switch"
                :aria-checked="p.actif"
                :disabled="prestataireToggleLoading"
                class="relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020B51] disabled:opacity-50"
                :class="p.actif ? 'bg-emerald-500' : 'bg-slate-300'"
                @click="togglePrestataireActif"
              >
                <span
                  class="absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all"
                  :class="p.actif ? 'left-7' : 'left-1'"
                ></span>
              </button>
            </div>
            <div class="flex items-center gap-3">
              <a
                v-if="phoneDigits(p.telephone)"
                :href="telHref(p.telephone!)"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-md hover:bg-amber-500"
                title="Appeler"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <a
                v-if="phoneDigits(p.telephone)"
                :href="smsHref(p.telephone!)"
                class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600"
                title="SMS"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p v-if="actifToggleError" class="mt-4 text-sm text-amber-800">{{ actifToggleError }}</p>
      </section>

      <!-- Wallet + Documents (pas de code promo / bon d'achat) -->
      <div class="grid gap-4 lg:grid-cols-2">
        <article
          class="flex flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6"
          :class="walletManageOpen ? 'lg:col-span-2' : ''"
        >
          <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 class="text-lg font-semibold text-slate-800">Wallet</h2>
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="rounded-full px-3 py-1.5 text-xs font-semibold text-[#020B51] hover:bg-slate-100"
                @click="toggleWalletManage"
              >
                {{ walletManageOpen ? 'Masquer' : 'Gérer' }}
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                :title="walletBalanceVisible ? 'Masquer le solde' : 'Afficher le solde'"
                @click="walletBalanceVisible = !walletBalanceVisible"
              >
                <svg
                  v-if="walletBalanceVisible"
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.289m-2.06 2.06l5.303 5.304M12 12h.01M18 12h.01M21 12c-1.274 4.057-5.064 7-9.542 7-1.259 0-2.47-.23-3.59-.646m-4.888-1.438A9.953 9.953 0 013 12c0-1.37.276-2.68.775-3.87" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-xl bg-[#020B51] px-4 py-8 text-center text-white">
            <p class="text-2xl font-bold tracking-tight sm:text-3xl">
              <template v-if="walletBalanceVisible">{{ formatMoney(p.walletBalance) }}</template>
              <template v-else>••••••</template>
            </p>
            <p class="mt-1 text-xs text-white/70">Solde prestataire</p>
            <p
              class="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="
                p.walletStatutPrestataire === 'BLOQUE'
                  ? 'bg-amber-400/90 text-amber-950'
                  : 'bg-emerald-400/90 text-emerald-950'
              "
            >
              Wallet : {{ walletStatutLabel(p.walletStatutPrestataire) }}
            </p>
            <p v-if="p.walletBalancePlafond != null" class="mt-1 max-w-[280px] text-xs text-white/80">
              Solde maximal : {{ formatMoney(p.walletBalancePlafond) }} (le solde ne peut pas le dépasser)
            </p>
          </div>
          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="rounded-full bg-[#020B51] px-4 py-2 text-xs font-semibold text-white hover:bg-[#020B51]/90"
              @click="openPlafondModal"
            >
              Plafonner
            </button>
            <button
              type="button"
              class="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
              :disabled="walletStatutSaving"
              @click="toggleWalletGel"
            >
              {{ p.walletStatutPrestataire === 'BLOQUE' ? 'Dégeler' : 'Geler' }}
            </button>
          </div>

          <div
            v-show="walletManageOpen"
            class="mt-5 border-t border-slate-200 pt-5"
          >
            <h3 class="mb-3 text-sm font-semibold text-slate-800">Transactions (paiements particuliers)</h3>
            <div
              v-if="walletTxLoading"
              class="py-8 text-center text-sm text-slate-500"
            >
              Chargement…
            </div>
            <div
              v-else-if="walletTxError"
              class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
            >
              {{ walletTxError }}
            </div>
            <div
              v-else-if="!walletTxRows.length"
              class="py-6 text-center text-sm text-slate-500"
            >
              Aucune transaction pour ce prestataire.
            </div>
            <div
              v-else
              class="max-h-[min(420px,55vh)] overflow-auto rounded-lg border border-slate-200"
            >
              <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead class="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th class="whitespace-nowrap px-3 py-2">Date</th>
                    <th class="whitespace-nowrap px-3 py-2">Client</th>
                    <th class="min-w-[8rem] px-3 py-2">Prestation</th>
                    <th class="whitespace-nowrap px-3 py-2 text-right">Montant</th>
                    <th class="whitespace-nowrap px-3 py-2">Statut</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 bg-white">
                  <tr v-for="row in walletTxRows" :key="row.id" class="text-slate-700">
                    <td class="whitespace-nowrap px-3 py-2 text-slate-600">{{ formatDateTime(row.date) }}</td>
                    <td class="max-w-[10rem] truncate px-3 py-2" :title="row.clientNom">{{ row.clientNom }}</td>
                    <td class="max-w-[14rem] truncate px-3 py-2" :title="row.serviceLibelle">{{ row.serviceLibelle }}</td>
                    <td class="whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums">{{ formatMoney(row.montant) }}</td>
                    <td class="whitespace-nowrap px-3 py-2">
                      <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">{{ row.statut }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p v-if="walletTxTotal > walletTxRows.length" class="mt-2 text-xs text-slate-500">
              Affichage de {{ walletTxRows.length }} sur {{ walletTxTotal }} écriture(s).
            </p>
          </div>
        </article>

        <article class="flex flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 class="mb-4 text-lg font-semibold text-slate-800">Documents</h2>
          <div
            class="flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-xl bg-[#020B51]/95 px-4 py-8 text-white"
          >
            <svg class="h-16 w-16 text-white/90" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-2 text-sm text-white/80">{{ p.documents.length }} fichier(s)</p>
          </div>
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#020B51] px-4 py-2 text-xs font-semibold text-white hover:bg-[#020B51]/90 sm:flex-initial"
              @click="documentsPanelOpen = !documentsPanelOpen"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Voir
            </button>
            <button
              type="button"
              class="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 sm:flex-initial"
              @click="showDocumentsForDelete"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Supprimer
            </button>
          </div>
          <p v-if="documentsPanelOpen && deleteHint" class="mt-2 text-xs text-slate-500">
            Sélectionnez un document ci-dessous puis supprimez-le avec l’icône corbeille.
          </p>
        </article>
      </div>

      <!-- Liste documents (validation admin) -->
      <section
        v-show="documentsPanelOpen"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <h3 class="mb-4 text-base font-semibold text-slate-800">Gestion des documents</h3>
        <div v-if="!p.documents.length" class="text-sm text-slate-500">Aucun document enregistré.</div>
        <div v-else class="space-y-2">
          <article
            v-for="doc in p.documents"
            :key="doc.id"
            class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3"
          >
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-slate-800">{{ doc.typeLibelle }}</p>
              <p class="truncate text-xs text-slate-500">{{ doc.nomFichier || doc.fichierUrl }}</p>
              <button
                type="button"
                class="mt-1 text-left text-xs font-medium text-[#020B51] underline-offset-2 hover:underline"
                @click="openDocumentPreview(doc)"
              >
                Voir le document
              </button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="rounded-full px-2.5 py-1 text-xs font-semibold" :class="statusChipClass(doc.statut)">
                {{ doc.statut }}
              </span>
              <button
                type="button"
                class="rounded-full border border-emerald-600 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                :disabled="doc.statut === 'VALIDE' || docActionLoadingId === doc.id"
                @click="validateDocument(doc.id)"
              >
                {{ validatingDocumentId === doc.id ? '…' : 'Valider' }}
              </button>
              <button
                type="button"
                class="rounded-full border border-rose-600 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-50"
                :disabled="doc.statut === 'VALIDE' || docActionLoadingId === doc.id"
                @click="openRejectDocumentModal(doc)"
              >
                Rejeter
              </button>
              <button
                type="button"
                class="rounded-full p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                title="Supprimer ce document"
                :disabled="deletingDocumentId === doc.id"
                @click="deleteDocument(doc)"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </article>
        </div>
      </section>
    </template>

    <!-- Refus document -->
    <div
      v-if="rejectDocumentModalOpen"
      class="fixed inset-0 z-[75] flex items-center justify-center bg-[#140C44]/50 px-4 py-6 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      @click.self="closeRejectDocumentModal"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h4 class="text-base font-semibold text-slate-900">Rejeter le document</h4>
        <p class="mt-1 text-sm text-slate-500">Motif de refus (min. 3 caractères).</p>
        <textarea
          v-model="rejectDocumentMotif"
          rows="4"
          class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"
        ></textarea>
        <p v-if="rejectDocumentError" class="mt-2 text-sm text-rose-600">{{ rejectDocumentError }}</p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            :disabled="rejectDocumentSubmitting"
            @click="closeRejectDocumentModal"
          >
            Annuler
          </button>
          <button
            type="button"
            class="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            :disabled="rejectDocumentSubmitting"
            @click="confirmRejectDocument"
          >
            {{ rejectDocumentSubmitting ? 'Envoi…' : 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="isDocumentPreviewOpen"
        class="fixed inset-0 z-[10050] flex items-center justify-center bg-[#140C44]/50 px-2 py-6 backdrop-blur-md sm:px-4"
        @click.self="closeDocumentPreview"
      >
        <div class="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
            <h4 class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">{{ documentPreviewTitle }}</h4>
            <button
              type="button"
              class="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
              @click="closeDocumentPreview"
            >
              Fermer
            </button>
          </div>
          <div class="min-h-[50vh] flex-1 overflow-auto bg-slate-100">
            <div v-if="documentPreviewLoading" class="flex min-h-[50vh] items-center justify-center text-sm text-slate-600">
              Chargement…
            </div>
            <p v-else-if="documentPreviewError" class="px-4 py-10 text-center text-sm text-rose-600">{{ documentPreviewError }}</p>
            <template v-else>
              <img
                v-if="documentPreviewKind === 'image'"
                :src="documentPreviewUrl"
                :alt="documentPreviewTitle"
                class="mx-auto block max-h-[85vh] w-auto object-contain"
              />
              <iframe
                v-else-if="documentPreviewKind === 'pdf'"
                :src="documentPreviewSrc"
                class="min-h-[min(85vh,800px)] h-[min(85vh,800px)] w-full border-0 bg-white"
                title="Aperçu PDF"
              />
              <iframe
                v-else
                :src="documentPreviewSrc"
                class="h-[min(85vh,800px)] min-h-[40vh] w-full border-0 bg-white"
                title="Aperçu"
              ></iframe>
            </template>
          </div>
          <div v-if="documentPreviewOpenTabUrl && !documentPreviewLoading" class="border-t border-slate-200 bg-white px-4 py-3 text-center">
            <a
              :href="documentPreviewOpenTabUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="text-sm font-medium text-[#020B51] underline"
            >
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div
        v-if="plafondModalOpen"
        class="fixed inset-0 z-[10040] flex items-center justify-center bg-[#140C44]/50 px-4 py-8 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="plafond-modal-title"
        @click.self="closePlafondModal"
      >
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <h2 id="plafond-modal-title" class="text-lg font-semibold text-slate-900">Plafonner</h2>
            <button
              type="button"
              class="rounded-full p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Fermer"
              @click="closePlafondModal"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <label class="mt-5 block">
            <span class="text-sm font-medium text-slate-700">Solde maximal du wallet (FCFA)</span>
            <input
              v-model="plafondInput"
              type="text"
              inputmode="decimal"
              autocomplete="off"
              placeholder="500 000"
              class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#020B51]/40"
              @keydown.enter.prevent="submitPlafond"
            />
            <span class="mt-1 block text-xs text-slate-500">
              Après un crédit (prestation, etc.), le solde ne pourra jamais dépasser ce montant.
            </span>
          </label>
          <p v-if="plafondModalError" class="mt-3 text-sm text-rose-600">{{ plafondModalError }}</p>
          <button
            type="button"
            class="mt-6 w-full rounded-full bg-[#020B51] py-3 text-sm font-semibold text-white hover:bg-[#020B51]/90 disabled:opacity-50"
            :disabled="plafondSaving"
            @click="submitPlafond"
          >
            {{ plafondSaving ? 'Envoi…' : 'Appliquer' }}
          </button>
          <button
            v-if="p?.walletBalancePlafond != null"
            type="button"
            class="mt-3 w-full text-center text-sm font-medium text-slate-600 underline-offset-2 hover:text-rose-600 hover:underline disabled:opacity-50"
            :disabled="plafondSaving"
            @click="removePlafond"
          >
            Retirer le plafond
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { fetchAdminApi } = useAdminFetch()

type PrestataireDocument = {
  id: string
  typeCode: string
  typeLibelle: string
  obligatoire: boolean
  statut: 'EN_ATTENTE' | 'VALIDE' | 'REFUSE'
  motifRefus?: string | null
  fichierUrl: string
  nomFichier?: string | null
  updatedAt: string
}

type PrestataireDetails = {
  id: string
  nom: string
  email: string
  telephone: string
  adresse: string
  bio: string
  avatarUrl: string | null
  actif: boolean
  statutVerification: string
  dateAdhesion: string
  metier: string
  noteMoyenne: number
  nbAvis: number
  walletBalance: number
  walletStatutPrestataire?: 'ACTIF' | 'BLOQUE'
  walletBalancePlafond?: number | null
  services: Array<{ id: string; libelle: string }>
  documents: PrestataireDocument[]
}

const id = computed(() => String(route.params.id || ''))

const loading = ref(true)
const loadError = ref('')
const p = ref<PrestataireDetails | null>(null)
const headerAvatarFailed = ref(false)
const walletBalanceVisible = ref(true)
const walletManageOpen = ref(false)
type WalletPrestationTxRow = {
  id: string
  date: string
  montant: number
  clientNom: string
  serviceLibelle: string
  statut: string
}
const walletTxRows = ref<WalletPrestationTxRow[]>([])
const walletTxTotal = ref(0)
const walletTxLoading = ref(false)
const walletTxError = ref('')
const walletStatutSaving = ref(false)
const plafondModalOpen = ref(false)
const plafondInput = ref('')
const plafondSaving = ref(false)
const plafondModalError = ref('')
const documentsPanelOpen = ref(false)
const deleteHint = ref(false)

const actifToggleError = ref('')
const prestataireToggleLoading = ref(false)

const validatingDocumentId = ref<string | null>(null)
const deletingDocumentId = ref<string | null>(null)
const rejectDocumentModalOpen = ref(false)
const rejectDocumentTargetId = ref<string | null>(null)
const rejectDocumentMotif = ref('')
const rejectDocumentError = ref('')
const rejectDocumentSubmitting = ref(false)

const docActionLoadingId = computed(() => {
  if (validatingDocumentId.value) return validatingDocumentId.value
  if (rejectDocumentSubmitting.value && rejectDocumentTargetId.value) return rejectDocumentTargetId.value
  if (deletingDocumentId.value) return deletingDocumentId.value
  return null
})

async function loadDetail() {
  if (!id.value) return
  loading.value = true
  loadError.value = ''
  try {
    const response = await fetchAdminApi<{ data?: PrestataireDetails } | PrestataireDetails>(
      `/admin/prestataires/${id.value}`,
    )
    const raw = (response as { data?: PrestataireDetails })?.data ?? (response as PrestataireDetails)
    const statut = raw.walletStatutPrestataire === 'BLOQUE' ? 'BLOQUE' : 'ACTIF'
    const plafondRaw = raw.walletBalancePlafond
    let walletBalancePlafond: number | null = null
    if (plafondRaw != null && plafondRaw !== '') {
      const x = Number(plafondRaw)
      walletBalancePlafond = Number.isFinite(x) ? x : null
    }
    p.value = {
      ...raw,
      avatarUrl: raw.avatarUrl ?? null,
      walletBalance: Number(raw.walletBalance ?? 0),
      walletStatutPrestataire: statut,
      walletBalancePlafond,
      noteMoyenne: Number(raw.noteMoyenne ?? 0),
      nbAvis: Number(raw.nbAvis ?? 0),
      metier: raw.metier ?? '—',
      documents: raw.documents ?? [],
    }
  } catch (e) {
    console.error(e)
    p.value = null
    loadError.value =
      extractApiMessage(e) || 'Prestataire introuvable ou erreur de chargement.'
  } finally {
    loading.value = false
  }
}

function unwrapPrestataireTransactionsPayload(response: unknown): {
  total?: number
  items?: WalletPrestationTxRow[]
} {
  if (!response || typeof response !== 'object') return {}
  const r = response as Record<string, unknown>
  const inner = r.data
  if (inner && typeof inner === 'object' && !Array.isArray(inner) && ('items' in inner || 'total' in inner)) {
    return inner as { total?: number; items?: WalletPrestationTxRow[] }
  }
  if ('items' in r || 'total' in r) {
    return r as { total?: number; items?: WalletPrestationTxRow[] }
  }
  return {}
}

async function loadWalletTransactions() {
  if (!p.value?.id) return
  walletTxLoading.value = true
  walletTxError.value = ''
  try {
    const response = await fetchAdminApi<unknown>(`/admin/prestataires/${p.value.id}/transactions`, {
      query: { limit: 100 },
    })
    const payload = unwrapPrestataireTransactionsPayload(response)
    const items = payload.items ?? []
    walletTxRows.value = items.map((row) => ({
      ...row,
      clientNom: row.clientNom?.trim() || '—',
      serviceLibelle: row.serviceLibelle?.trim() || '—',
      statut: row.statut || 'Payé',
    }))
    walletTxTotal.value = payload.total ?? items.length
  } catch (e) {
    console.error(e)
    walletTxError.value = 'Impossible de charger les transactions.'
    walletTxRows.value = []
    walletTxTotal.value = 0
  } finally {
    walletTxLoading.value = false
  }
}

function toggleWalletManage() {
  walletManageOpen.value = !walletManageOpen.value
}

watch(walletManageOpen, (open) => {
  if (open && p.value) {
    loadWalletTransactions()
  }
})

watch(id, () => {
  headerAvatarFailed.value = false
  walletManageOpen.value = false
  walletTxRows.value = []
  walletTxTotal.value = 0
  walletTxError.value = ''
  documentsPanelOpen.value = false
  deleteHint.value = false
  loadDetail()
}, { immediate: true })

function canActivate(): boolean {
  return p.value?.statutVerification === 'VERIFIE'
}

async function togglePrestataireActif() {
  if (!p.value || prestataireToggleLoading.value) return
  const next = !p.value.actif
  if (next && !canActivate()) {
    actifToggleError.value = 'Activation possible uniquement si le statut de vérification est « VERIFIE ».'
    return
  }
  actifToggleError.value = ''
  prestataireToggleLoading.value = true
  try {
    await fetchAdminApi(`/admin/prestataires/${p.value.id}/actif`, { body: { actif: next } }, 'PATCH')
    p.value.actif = next
  } catch (e) {
    actifToggleError.value = extractApiMessage(e) || 'Impossible de modifier le statut.'
  } finally {
    prestataireToggleLoading.value = false
  }
}

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

function formatDate(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('fr-FR')
}

function formatDateTime(value: string) {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

function formatMoney(value: number) {
  return `${new Intl.NumberFormat('fr-FR').format(value ?? 0)} FCFA`
}

function renderStars(note: number) {
  const rounded = Math.max(0, Math.min(5, Math.round(note || 0)))
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`
}

function walletStatutLabel(s: 'ACTIF' | 'BLOQUE' | undefined) {
  return s === 'BLOQUE' ? 'Bloqué' : 'Actif'
}

function formatMontantHintForInput(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n).replace(/\u202f/g, ' ')
}

function parseFcfaInput(s: string): number {
  const t = s
    .replace(/\s/g, '')
    .replace(/\u00a0/g, '')
    .replace(/\u202f/g, '')
    .replace(',', '.')
    .trim()
  return Number(t)
}

function openPlafondModal() {
  plafondModalError.value = ''
  plafondModalOpen.value = true
  if (p.value?.walletBalancePlafond != null && !Number.isNaN(p.value.walletBalancePlafond)) {
    plafondInput.value = formatMontantHintForInput(p.value.walletBalancePlafond)
  } else {
    plafondInput.value = ''
  }
}

function closePlafondModal() {
  plafondModalOpen.value = false
  plafondModalError.value = ''
}

async function submitPlafond() {
  if (!p.value) return
  const n = parseFcfaInput(plafondInput.value)
  if (!Number.isFinite(n) || n < 0) {
    plafondModalError.value = 'Saisissez un montant valide (≥ 0).'
    return
  }
  const bal = Math.round((p.value.walletBalance ?? 0) * 100) / 100
  if (n < bal) {
    plafondModalError.value = `Le solde actuel est ${formatMoney(bal)}. Le plafond doit être au moins égal au solde pour rester cohérent.`
    return
  }
  plafondSaving.value = true
  plafondModalError.value = ''
  try {
    await fetchAdminApi(
      `/admin/prestataires/${p.value.id}/wallet/plafond`,
      { body: { montantMax: n } },
      'PATCH',
    )
    p.value.walletBalancePlafond = n
    closePlafondModal()
  } catch (e) {
    plafondModalError.value = extractApiMessage(e) || 'Impossible d’enregistrer le plafond.'
  } finally {
    plafondSaving.value = false
  }
}

async function removePlafond() {
  if (!p.value) return
  plafondSaving.value = true
  plafondModalError.value = ''
  try {
    await fetchAdminApi(
      `/admin/prestataires/${p.value.id}/wallet/plafond`,
      { body: { montantMax: null } },
      'PATCH',
    )
    p.value.walletBalancePlafond = null
    closePlafondModal()
  } catch (e) {
    plafondModalError.value = extractApiMessage(e) || 'Impossible de retirer le plafond.'
  } finally {
    plafondSaving.value = false
  }
}

async function toggleWalletGel() {
  if (!p.value || walletStatutSaving.value) return
  const next = p.value.walletStatutPrestataire === 'BLOQUE' ? 'ACTIF' : 'BLOQUE'
  walletStatutSaving.value = true
  try {
    await fetchAdminApi(
      `/admin/prestataires/${p.value.id}/wallet/statut`,
      { body: { statut: next } },
      'PATCH',
    )
    p.value.walletStatutPrestataire = next
  } catch (e) {
    window.alert(extractApiMessage(e) || 'Impossible de modifier le gel du wallet.')
  } finally {
    walletStatutSaving.value = false
  }
}

function showDocumentsForDelete() {
  documentsPanelOpen.value = true
  deleteHint.value = true
}

function statusChipClass(statut: PrestataireDocument['statut']) {
  if (statut === 'VALIDE') return 'bg-emerald-100 text-emerald-700'
  if (statut === 'REFUSE') return 'bg-rose-100 text-rose-700'
  return 'bg-amber-100 text-amber-700'
}

function extractApiMessage(e: unknown): string {
  if (typeof e !== 'object' || e === null) return ''
  const any = e as Record<string, unknown>
  const payload = any.data
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const m = (payload as { message?: string | string[] }).message
    if (Array.isArray(m)) return m.filter(Boolean).join(' ')
    if (typeof m === 'string' && m.trim()) return m
  }
  if (typeof any.message === 'string' && any.message.trim()) {
    const msg = any.message.trim()
    if (!msg.startsWith('[')) return msg
  }
  return ''
}

function inferDocumentKind(fichierUrl: string, nomFichier?: string | null): 'image' | 'pdf' | 'other' {
  const name = (nomFichier || '').toLowerCase()
  const url = fichierUrl.toLowerCase()
  const candidates = name ? [name, url] : [url]
  const test = (re: RegExp) => candidates.some((s) => s && re.test(s))
  if (test(/\.pdf(\?|#|$|\/)/)) return 'pdf'
  if (test(/\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$|\/)/)) return 'image'
  if (url.includes('/raw/upload/')) return 'pdf'
  return 'other'
}

function toInlineDeliveryUrl(url: string, kind: 'image' | 'pdf' | 'other') {
  if (kind === 'image') return url
  try {
    const u = new URL(url)
    if (!u.hostname.includes('cloudinary.com')) return url
    if (u.pathname.includes('/raw/upload/') && !u.pathname.includes('/fl_inline/')) {
      u.pathname = u.pathname.replace('/raw/upload/', '/raw/upload/fl_inline/')
      return u.toString()
    }
    if (kind === 'pdf' && u.pathname.includes('/image/upload/') && !u.pathname.includes('/fl_inline/')) {
      u.pathname = u.pathname.replace('/image/upload/', '/image/upload/fl_inline/')
      return u.toString()
    }
  } catch {
    /* ignore */
  }
  return url
}

const isDocumentPreviewOpen = ref(false)
const documentPreviewLoading = ref(false)
const documentPreviewError = ref('')
const documentPreviewUrl = ref('')
const documentPreviewOpenTabUrl = ref('')
const documentPreviewObjectUrl = ref<string | null>(null)
const documentPreviewTitle = ref('')
const documentPreviewKind = ref<'image' | 'pdf' | 'other'>('pdf')

const documentPreviewSrc = computed(() => {
  const base = documentPreviewUrl.value
  if (!base) return ''
  const isBlob = base.startsWith('blob:')
  // Pas de hash sur l’URL du proxy (/api/document-preview?url=...) : casse la requête.
  const hash =
    documentPreviewKind.value === 'pdf' && !isBlob && !base.includes('/api/document-preview')
      ? '#toolbar=0'
      : ''
  return `${base}${hash}`
})

async function openDocumentPreview(doc: PrestataireDocument) {
  documentPreviewError.value = ''
  documentPreviewLoading.value = true
  isDocumentPreviewOpen.value = true
  if (documentPreviewObjectUrl.value) {
    URL.revokeObjectURL(documentPreviewObjectUrl.value)
    documentPreviewObjectUrl.value = null
  }
  const rawUrl = (doc.fichierUrl || '').trim()
  documentPreviewTitle.value = doc.typeLibelle || doc.nomFichier || 'Document'
  if (!rawUrl) {
    documentPreviewKind.value = 'other'
    documentPreviewUrl.value = ''
    documentPreviewOpenTabUrl.value = ''
    documentPreviewError.value = 'URL du document manquante.'
    documentPreviewLoading.value = false
    return
  }
  const kind = inferDocumentKind(rawUrl, doc.nomFichier)
  const deliveryUrl = kind === 'image' ? rawUrl : toInlineDeliveryUrl(rawUrl, kind)
  documentPreviewKind.value = kind
  documentPreviewOpenTabUrl.value = rawUrl
  try {
    if (kind === 'image') {
      documentPreviewUrl.value = rawUrl
    } else if (kind === 'pdf' && import.meta.client) {
      // Proxy même origine, puis Blob typé application/pdf : le lecteur PDF intégré
      // à Chrome rejette souvent une iframe directe sur /api ou un blob sans MIME.
      const proxyUrl = `/api/document-preview?url=${encodeURIComponent(rawUrl)}`
      const res = await fetch(proxyUrl, { credentials: 'same-origin' })
      if (!res.ok) {
        throw new Error(`Proxy document ${res.status}`)
      }
      const ab = await res.arrayBuffer()
      if (ab.byteLength === 0) throw new Error('Fichier vide')
      const blob = new Blob([ab], { type: 'application/pdf' })
      const objectUrl = URL.createObjectURL(blob)
      documentPreviewObjectUrl.value = objectUrl
      documentPreviewUrl.value = objectUrl
    } else if (import.meta.client) {
      const res = await fetch(deliveryUrl, { mode: 'cors', credentials: 'omit' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      documentPreviewObjectUrl.value = objectUrl
      documentPreviewUrl.value = objectUrl
    } else {
      documentPreviewUrl.value = deliveryUrl
    }
  } catch (e) {
    console.warn('Aperçu document indisponible:', e)
    documentPreviewUrl.value = ''
    if (documentPreviewKind.value === 'pdf') {
      documentPreviewError.value =
        'Impossible de charger l’aperçu du PDF. Utilisez « Ouvrir dans un nouvel onglet » ci-dessous (le fichier est valide si le téléchargement fonctionne).'
    } else {
      documentPreviewUrl.value = deliveryUrl
    }
  } finally {
    documentPreviewLoading.value = false
  }
}

function closeDocumentPreview() {
  isDocumentPreviewOpen.value = false
  documentPreviewLoading.value = false
  documentPreviewError.value = ''
  if (documentPreviewObjectUrl.value) {
    URL.revokeObjectURL(documentPreviewObjectUrl.value)
    documentPreviewObjectUrl.value = null
  }
  documentPreviewUrl.value = ''
  documentPreviewOpenTabUrl.value = ''
  documentPreviewTitle.value = ''
}

function openRejectDocumentModal(doc: PrestataireDocument) {
  if (doc.statut === 'VALIDE') return
  rejectDocumentTargetId.value = doc.id
  rejectDocumentMotif.value = doc.motifRefus?.trim() ? String(doc.motifRefus) : ''
  rejectDocumentError.value = ''
  rejectDocumentModalOpen.value = true
}

function closeRejectDocumentModal() {
  rejectDocumentModalOpen.value = false
  rejectDocumentTargetId.value = null
  rejectDocumentMotif.value = ''
  rejectDocumentError.value = ''
  rejectDocumentSubmitting.value = false
}

async function confirmRejectDocument() {
  if (!p.value || !rejectDocumentTargetId.value) return
  const motif = rejectDocumentMotif.value.trim()
  if (motif.length < 3) {
    rejectDocumentError.value = 'Le motif doit contenir au moins 3 caractères.'
    return
  }
  rejectDocumentError.value = ''
  rejectDocumentSubmitting.value = true
  try {
    await fetchAdminApi(
      `/admin/prestataires/${p.value.id}/documents/${rejectDocumentTargetId.value}/reject`,
      { body: { motif } },
      'PATCH',
    )
    closeRejectDocumentModal()
    await loadDetail()
  } catch (e) {
    rejectDocumentError.value = extractApiMessage(e) || 'Impossible de rejeter ce document.'
  } finally {
    rejectDocumentSubmitting.value = false
  }
}

async function validateDocument(documentId: string) {
  if (!p.value) return
  validatingDocumentId.value = documentId
  try {
    await fetchAdminApi(`/admin/prestataires/${p.value.id}/documents/${documentId}/validate`, {}, 'PATCH')
    await loadDetail()
  } catch (error) {
    console.error('Erreur validation document:', error)
  } finally {
    validatingDocumentId.value = null
  }
}

async function deleteDocument(doc: PrestataireDocument) {
  if (!p.value) return
  const ok = window.confirm(`Supprimer définitivement le document « ${doc.typeLibelle} » ?`)
  if (!ok) return
  deletingDocumentId.value = doc.id
  try {
    await fetchAdminApi(`/admin/prestataires/${p.value.id}/documents/${doc.id}`, {}, 'DELETE')
    await loadDetail()
  } catch (e) {
    console.error(e)
    window.alert('Suppression impossible.')
  } finally {
    deletingDocumentId.value = null
  }
}

onUnmounted(() => {
  if (documentPreviewObjectUrl.value) {
    URL.revokeObjectURL(documentPreviewObjectUrl.value)
  }
})

const pageTitle = computed(() => (p.value?.nom ? p.value.nom : 'Prestataire'))
useHead({
  title: pageTitle,
})
</script>