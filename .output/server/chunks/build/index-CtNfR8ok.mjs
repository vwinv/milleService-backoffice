import { defineComponent, ref, watch, computed, unref, useSSRContext } from 'vue';
import { ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useAdminFetch } from './useAdminFetch-Cp0KwdmY.mjs';
import { u as useHead } from './composables-BQSN98B_.mjs';
import './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const pageSize = 14;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchAdminApi } = useAdminFetch();
    function unwrapApi(response) {
      if (!response || typeof response !== "object") return void 0;
      const r = response;
      if ("data" in r && r.data !== void 0 && r.data !== null) return r.data;
      return response;
    }
    const notifications = ref([]);
    const listTotal = ref(0);
    const page = ref(0);
    const loading = ref(false);
    const loadError = ref("");
    const sendSuccess = ref("");
    const audience = ref("TOUT");
    const unreadOnly = ref(false);
    const typeFilter = ref("");
    const createModalOpen = ref(false);
    const createSubmitting = ref(false);
    const createNotificationError = ref("");
    const createTitle = ref("");
    const createBody = ref("");
    const createType = ref("");
    const createAudienceMode = ref("SELECTION");
    const createClients = ref([]);
    const createClientsLoading = ref(false);
    const selectedClientsUserIds = ref([]);
    const createPrestataires = ref([]);
    const createPrestatairesLoading = ref(false);
    const selectedPrestatairesUserIds = ref([]);
    const createClientSearchInput = ref("");
    const createClientsDebouncedSearch = ref("");
    let createClientsDebounceTimer = null;
    watch(createClientSearchInput, (v) => {
      if (createClientsDebounceTimer) clearTimeout(createClientsDebounceTimer);
      createClientsDebounceTimer = setTimeout(() => {
        createClientsDebouncedSearch.value = v;
        if (createModalOpen.value) loadCreateClients();
      }, 350);
    });
    const createPrestataireSearchInput = ref("");
    const filteredPrestataires = computed(() => {
      const q = createPrestataireSearchInput.value.trim().toLowerCase();
      if (!q) return createPrestataires.value;
      return createPrestataires.value.filter((p) => {
        return p.nom.toLowerCase().includes(q) || (p.email ?? "").toLowerCase().includes(q);
      });
    });
    watch(createAudienceMode, async (mode) => {
      if (!createModalOpen.value) return;
      if (mode === "SELECTION") {
        await Promise.all([loadCreateClients(), loadCreatePrestataires()]);
      } else {
        selectedClientsUserIds.value = [];
        selectedPrestatairesUserIds.value = [];
      }
    });
    const searchInput = ref("");
    const debouncedSearch = ref("");
    let debounceTimer = null;
    watch(searchInput, (v) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debouncedSearch.value = v;
        page.value = 0;
      }, 350);
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(listTotal.value / pageSize) || 1));
    const pageFirst = computed(() => notifications.value.length ? page.value * pageSize + 1 : 0);
    const pageLast = computed(() => page.value * pageSize + notifications.value.length);
    watch([page, audience, unreadOnly, typeFilter, debouncedSearch], () => {
      loadNotifications();
    });
    function isClientSelected(userId) {
      return selectedClientsUserIds.value.includes(userId);
    }
    function isPrestataireSelected(userId) {
      return selectedPrestatairesUserIds.value.includes(userId);
    }
    async function loadCreateClients() {
      createClientsLoading.value = true;
      try {
        const response = await fetchAdminApi("/admin/clients", {
          query: {
            limit: 20,
            offset: 0,
            ...createClientsDebouncedSearch.value.trim() ? { search: createClientsDebouncedSearch.value.trim() } : {}
          }
        });
        const payload = unwrapApi(response);
        createClients.value = Array.isArray(payload?.items) ? (payload?.items).map((it) => ({
          userId: String(it.userId),
          nomComplet: String(it.nomComplet ?? ""),
          email: String(it.email ?? "")
        })) : [];
      } catch (e) {
        console.error(e);
        createClients.value = [];
      } finally {
        createClientsLoading.value = false;
      }
    }
    async function loadCreatePrestataires() {
      createPrestatairesLoading.value = true;
      try {
        const response = await fetchAdminApi("/admin/prestataires", {
          query: { limit: 200 }
        });
        const payload = unwrapApi(response);
        createPrestataires.value = Array.isArray(payload?.items) ? (payload?.items).map((it) => ({
          userId: String(it.userId ?? it.user_id ?? ""),
          nom: String(it.nom ?? ""),
          email: String(it.email ?? "")
        })) : [];
      } catch (e) {
        console.error(e);
        createPrestataires.value = [];
      } finally {
        createPrestatairesLoading.value = false;
      }
    }
    async function loadNotifications() {
      loading.value = true;
      loadError.value = "";
      try {
        const response = await fetchAdminApi("/admin/notifications", {
          query: {
            limit: pageSize,
            offset: page.value * pageSize,
            audience: audience.value,
            ...unreadOnly.value ? { unreadOnly: "true" } : {},
            ...typeFilter.value.trim() ? { type: typeFilter.value.trim() } : {},
            ...debouncedSearch.value.trim() ? { search: debouncedSearch.value.trim() } : {}
          }
        });
        const payload = unwrapApi(response);
        listTotal.value = payload?.total ?? 0;
        notifications.value = Array.isArray(payload?.items) ? payload.items : [];
      } catch (e) {
        console.error(e);
        notifications.value = [];
        listTotal.value = 0;
        loadError.value = "Impossible de charger les notifications.";
      } finally {
        loading.value = false;
      }
    }
    function formatInt(value) {
      return new Intl.NumberFormat("fr-FR").format(value ?? 0);
    }
    function formatDate(value) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("fr-FR");
    }
    useHead({
      title: "Notifications"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="space-y-4"><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><h2 class="text-xl font-semibold text-slate-800 sm:text-2xl"> Notifications </h2><div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end"><label class="flex items-center gap-2 text-sm text-slate-600"><span>Audience</span><select class="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"><option value="TOUT"${ssrIncludeBooleanAttr(Array.isArray(unref(audience)) ? ssrLooseContain(unref(audience), "TOUT") : ssrLooseEqual(unref(audience), "TOUT")) ? " selected" : ""}>Tout</option><option value="PARTICULIER"${ssrIncludeBooleanAttr(Array.isArray(unref(audience)) ? ssrLooseContain(unref(audience), "PARTICULIER") : ssrLooseEqual(unref(audience), "PARTICULIER")) ? " selected" : ""}>Particuliers</option><option value="PRESTATAIRE"${ssrIncludeBooleanAttr(Array.isArray(unref(audience)) ? ssrLooseContain(unref(audience), "PRESTATAIRE") : ssrLooseEqual(unref(audience), "PRESTATAIRE")) ? " selected" : ""}>Prestataires</option></select></label><label class="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(unreadOnly)) ? ssrLooseContain(unref(unreadOnly), null) : unref(unreadOnly)) ? " checked" : ""}><span>Non lues uniquement</span></label><button type="button" class="rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(createSubmitting)) ? " disabled" : ""}> Créer une notification </button></div></div><div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><label class="relative block w-full min-w-[220px] max-w-md"><span class="sr-only">Rechercher</span><input${ssrRenderAttr("value", unref(searchInput))} type="search" placeholder="Rechercher par titre, type ou e-mail…" class="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="m20 20-3.5-3.5"></path></svg></span></label><div class="flex flex-wrap items-center justify-end gap-2"><label class="text-sm text-slate-600"><span class="sr-only">Type</span><input${ssrRenderAttr("value", unref(typeFilter))} type="text" placeholder="Type (optionnel)" class="w-56 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"></label><span class="text-sm text-slate-600">`);
      if (unref(listTotal) > 0) {
        _push(`<!--[-->${ssrInterpolate(unref(pageFirst))}-${ssrInterpolate(unref(pageLast))} sur ${ssrInterpolate(formatInt(unref(listTotal)))}<!--]-->`);
      } else {
        _push(`<!--[-->Aucune notification<!--]-->`);
      }
      _push(`</span><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(page) <= 0 || unref(loading)) ? " disabled" : ""} aria-label="Page précédente"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages) - 1 || unref(loading)) ? " disabled" : ""} aria-label="Page suivante"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></div>`);
      if (unref(sendSuccess)) {
        _push(`<div class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">${ssrInterpolate(unref(sendSuccess))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loadError)) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Date</th><th class="px-4 py-3 font-medium">Cible</th><th class="px-4 py-3 font-medium">Titre</th><th class="px-4 py-3 font-medium">Type</th><th class="px-4 py-3 font-medium">Statut</th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="5" class="px-4 py-8 text-center text-slate-500"> Chargement… </td></tr>`);
      } else if (!unref(notifications).length) {
        _push(`<tr><td colspan="5" class="px-4 py-8 text-center text-slate-400"> Aucune notification. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(notifications), (n) => {
        _push(`<tr><td class="whitespace-nowrap px-4 py-3">${ssrInterpolate(formatDate(n.createdAt))}</td><td class="px-4 py-3"><div class="flex flex-wrap items-center gap-2"><span class="font-medium text-slate-900">${ssrInterpolate(n.displayName)}</span><span class="${ssrRenderClass([n.userRole === "PARTICULIER" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800", "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold"])}">${ssrInterpolate(n.userRole === "PARTICULIER" ? "Particulier" : "Prestataire")}</span></div></td><td class="px-4 py-3"><div class="max-w-[420px] truncate"${ssrRenderAttr("title", n.body ? `${n.title}: ${n.body}` : n.title)}>${ssrInterpolate(n.title)}</div></td><td class="px-4 py-3">${ssrInterpolate(n.type ?? "—")}</td><td class="px-4 py-3"><span class="${ssrRenderClass([n.lu ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700", "inline-flex rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(n.lu ? "Lu" : "Non lu")}</span></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(createModalOpen)) {
          _push2(`<div class="fixed inset-0 z-[70] flex items-center justify-center bg-[#140C44]/50 p-3 backdrop-blur-md sm:p-4" role="dialog" aria-modal="true" aria-labelledby="create-notification-title"><div class="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"><div class="flex items-start justify-between gap-3 border-b border-slate-100 p-6"><div><h3 id="create-notification-title" class="text-lg font-semibold text-slate-900"> Créer une notification </h3><p class="mt-1 text-sm text-slate-600"> Envoi à tous ou ciblé sur une sélection (particuliers + prestataires). </p></div><button type="button" class="rounded-full p-1 text-rose-500 transition hover:bg-rose-50" aria-label="Fermer"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg></button></div><div class="p-6"><div class="grid gap-4 md:grid-cols-2"><div class="md:col-span-1"><label class="text-sm font-medium text-slate-700">Titre</label><input${ssrRenderAttr("value", unref(createTitle))} type="text" placeholder="Ex: Mise à jour importante" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"></div><div class="md:col-span-1"><label class="text-sm font-medium text-slate-700">Type (optionnel)</label><input${ssrRenderAttr("value", unref(createType))} type="text" placeholder="Ex: general_message" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"></div><div class="md:col-span-2"><label class="text-sm font-medium text-slate-700">Message</label><textarea rows="4" placeholder="Votre message…" class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40">${ssrInterpolate(unref(createBody))}</textarea></div></div><div class="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p class="text-sm font-semibold text-slate-900">Cible</p>`);
          if (unref(createAudienceMode) !== "SELECTION") {
            _push2(`<p class="text-xs text-slate-600"> Envoi à : ${ssrInterpolate(unref(createAudienceMode) === "TOUT" ? "Tout le monde" : unref(createAudienceMode) === "PARTICULIER" ? "Tous les particuliers" : "Tous les prestataires")}</p>`);
          } else {
            _push2(`<p class="text-xs text-slate-600">${ssrInterpolate(unref(selectedClientsUserIds).length + unref(selectedPrestatairesUserIds).length)} sélectionné(s) </p>`);
          }
          _push2(`</div><div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">`);
          if (unref(createAudienceMode) === "SELECTION") {
            _push2(`<button type="button" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(createClientsLoading) || unref(createPrestatairesLoading)) ? " disabled" : ""}> Effacer sélection </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div><div class="mt-4"><label class="text-sm font-medium text-slate-700">Audience</label><select class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"><option value="SELECTION"${ssrIncludeBooleanAttr(Array.isArray(unref(createAudienceMode)) ? ssrLooseContain(unref(createAudienceMode), "SELECTION") : ssrLooseEqual(unref(createAudienceMode), "SELECTION")) ? " selected" : ""}>Sélection (particuliers + prestataires)</option><option value="TOUT"${ssrIncludeBooleanAttr(Array.isArray(unref(createAudienceMode)) ? ssrLooseContain(unref(createAudienceMode), "TOUT") : ssrLooseEqual(unref(createAudienceMode), "TOUT")) ? " selected" : ""}>Tous les utilisateurs</option><option value="PARTICULIER"${ssrIncludeBooleanAttr(Array.isArray(unref(createAudienceMode)) ? ssrLooseContain(unref(createAudienceMode), "PARTICULIER") : ssrLooseEqual(unref(createAudienceMode), "PARTICULIER")) ? " selected" : ""}>Tous les particuliers</option><option value="PRESTATAIRE"${ssrIncludeBooleanAttr(Array.isArray(unref(createAudienceMode)) ? ssrLooseContain(unref(createAudienceMode), "PRESTATAIRE") : ssrLooseEqual(unref(createAudienceMode), "PRESTATAIRE")) ? " selected" : ""}>Tous les prestataires</option></select></div>`);
          if (unref(createAudienceMode) !== "SELECTION") {
            _push2(`<div class="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"> Envoi immédiat à l’audience sélectionnée. </div>`);
          } else {
            _push2(`<div class="mt-4 grid gap-4 md:grid-cols-2"><div><p class="text-sm font-semibold text-slate-900">Particuliers</p><div class="mt-3"><label class="relative block w-full"><span class="sr-only">Rechercher client</span><input${ssrRenderAttr("value", unref(createClientSearchInput))} type="search" placeholder="Rechercher client (nom ou e-mail)…" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="m20 20-3.5-3.5"></path></svg></span></label></div><div class="mt-3 max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white">`);
            if (unref(createClientsLoading)) {
              _push2(`<div class="px-4 py-6 text-center text-sm text-slate-500"> Chargement… </div>`);
            } else if (unref(createClients).length === 0) {
              _push2(`<div class="px-4 py-6 text-center text-sm text-slate-400"> Aucun client trouvé. </div>`);
            } else {
              _push2(`<div class="divide-y divide-slate-100"><!--[-->`);
              ssrRenderList(unref(createClients), (c) => {
                _push2(`<label class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">${ssrInterpolate(c.nomComplet)}</span><span class="block truncate text-xs text-slate-600">${ssrInterpolate(c.email)}</span></span><input type="checkbox"${ssrIncludeBooleanAttr(isClientSelected(c.userId)) ? " checked" : ""} class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]/30"></label>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div><div><p class="text-sm font-semibold text-slate-900">Prestataires</p><div class="mt-3"><label class="relative block w-full"><span class="sr-only">Rechercher prestataire</span><input${ssrRenderAttr("value", unref(createPrestataireSearchInput))} type="search" placeholder="Rechercher prestataire (nom ou e-mail)…" class="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="m20 20-3.5-3.5"></path></svg></span></label></div><div class="mt-3 max-h-[260px] overflow-auto rounded-xl border border-slate-200 bg-white">`);
            if (unref(createPrestatairesLoading)) {
              _push2(`<div class="px-4 py-6 text-center text-sm text-slate-500"> Chargement… </div>`);
            } else if (unref(filteredPrestataires).length === 0) {
              _push2(`<div class="px-4 py-6 text-center text-sm text-slate-400"> Aucun prestataire trouvé. </div>`);
            } else {
              _push2(`<div class="divide-y divide-slate-100"><!--[-->`);
              ssrRenderList(unref(filteredPrestataires), (p) => {
                _push2(`<label class="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50"><span class="min-w-0"><span class="block truncate text-sm font-semibold text-slate-900">${ssrInterpolate(p.nom)}</span><span class="block truncate text-xs text-slate-600">${ssrInterpolate(p.email)}</span></span><input type="checkbox"${ssrIncludeBooleanAttr(isPrestataireSelected(p.userId)) ? " checked" : ""} class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]/30"></label>`);
              });
              _push2(`<!--]--></div>`);
            }
            _push2(`</div></div></div>`);
          }
          _push2(`</div>`);
          if (unref(createNotificationError)) {
            _push2(`<div class="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(createNotificationError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mt-6 flex justify-center gap-3"><button type="button" class="w-full max-w-xs rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(createSubmitting)) ? " disabled" : ""}> Annuler </button><button type="button" class="w-full max-w-xs rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(createSubmitting) || unref(createAudienceMode) === "SELECTION" && unref(selectedClientsUserIds).length + unref(selectedPrestatairesUserIds).length === 0) ? " disabled" : ""}>${ssrInterpolate(unref(createSubmitting) ? "Envoi…" : "Envoyer")}</button></div></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/notifications/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CtNfR8ok.mjs.map
