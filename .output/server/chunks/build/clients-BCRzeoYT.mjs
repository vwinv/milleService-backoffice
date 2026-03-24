import { defineComponent, reactive, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { u as useAdminFetch } from './useAdminFetch-CWUrSCJc.mjs';
import { u as useHead } from './composables-CM5oTO8Z.mjs';
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

const pageSize = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "clients",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchAdminApi } = useAdminFetch();
    const stats = reactive({
      total: 0,
      actifs: 0,
      inactifs: 0
    });
    const clients = ref([]);
    const listTotal = ref(0);
    const page = ref(0);
    const loading = ref(false);
    const loadError = ref("");
    const deletingId = ref(null);
    const avatarLoadFailed = ref(/* @__PURE__ */ new Set());
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
    const pageFirst = computed(() => clients.value.length ? page.value * pageSize + 1 : 0);
    const pageLast = computed(() => page.value * pageSize + clients.value.length);
    async function loadClients() {
      loading.value = true;
      loadError.value = "";
      try {
        const q = debouncedSearch.value.trim();
        const response = await fetchAdminApi("/admin/clients", {
          query: {
            limit: pageSize,
            offset: page.value * pageSize,
            ...q ? { search: q } : {}
          }
        });
        const r = response;
        const payload = r?.data ?? response;
        const s = payload?.stats;
        if (s) {
          stats.total = s.total ?? 0;
          stats.actifs = s.actifs ?? 0;
          stats.inactifs = s.inactifs ?? 0;
        }
        listTotal.value = payload?.total ?? 0;
        avatarLoadFailed.value = /* @__PURE__ */ new Set();
        clients.value = (payload?.items ?? []).map((row) => ({
          ...row,
          avatarUrl: row.avatarUrl ?? null
        }));
      } catch (e) {
        console.error(e);
        loadError.value = "Impossible de charger les clients.";
        clients.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch([page, debouncedSearch], () => {
      loadClients();
    });
    const detailOpen = ref(false);
    const detailLoading = ref(false);
    const detailClient = ref(null);
    const detailModalAvatarFailed = ref(false);
    const toggleStatutLoading = ref(false);
    function phoneDigits(phone) {
      if (!phone) return "";
      return phone.replace(/\D/g, "");
    }
    function telHref(phone) {
      const d = phoneDigits(phone);
      return d ? `tel:${d}` : "#";
    }
    function smsHref(phone) {
      const d = phoneDigits(phone);
      return d ? `sms:${d}` : "#";
    }
    function initials(c) {
      const a = (c.prenom?.[0] ?? c.nomComplet?.[0] ?? "?").toUpperCase();
      const b = (c.nom?.[0] ?? "").toUpperCase();
      return (a + b).slice(0, 2);
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
      title: "Clients"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-2"><div><p class="text-xs font-semibold uppercase text-slate-500">Total clients</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).total))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-2"><div><p class="text-xs font-semibold uppercase text-slate-500">Clients actifs</p><p class="mt-2 text-3xl font-semibold text-emerald-600">${ssrInterpolate(formatInt(unref(stats).actifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-2"><div><p class="text-xs font-semibold uppercase text-slate-500">Clients inactifs</p><p class="mt-2 text-3xl font-semibold text-rose-600">${ssrInterpolate(formatInt(unref(stats).inactifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-700"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span></div></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><h2 class="text-xl font-semibold text-slate-800 sm:text-2xl">Clients</h2><div class="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end"><label class="relative block w-full min-w-[220px] max-w-md"><span class="sr-only">Rechercher</span><input${ssrRenderAttr("value", unref(searchInput))} type="search" placeholder="Rechercher par nom ou e-mail…" class="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 pl-10 text-sm text-slate-800 outline-none focus:border-[#020B51]/30"><span class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="m20 20-3.5-3.5"></path></svg></span></label><div class="flex flex-wrap items-center justify-end gap-2"><span class="text-sm text-slate-600">`);
      if (unref(listTotal) > 0) {
        _push(`<!--[-->${ssrInterpolate(unref(pageFirst))}-${ssrInterpolate(unref(pageLast))} sur ${ssrInterpolate(formatInt(unref(listTotal)))}<!--]-->`);
      } else {
        _push(`<!--[-->Aucun résultat<!--]-->`);
      }
      _push(`</span><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(page) <= 0 || unref(loading)) ? " disabled" : ""} aria-label="Page précédente"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(page) >= unref(totalPages) - 1 || unref(loading)) ? " disabled" : ""} aria-label="Page suivante"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></div></div>`);
      if (unref(loadError)) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-3 py-3 font-medium sm:px-4"></th><th class="px-3 py-3 font-medium sm:px-4">Date d&#39;adhésion</th><th class="px-3 py-3 font-medium sm:px-4">Nom</th><th class="px-3 py-3 font-medium sm:px-4">E-mail</th><th class="px-3 py-3 font-medium sm:px-4">Statut</th><th class="px-3 py-3 font-medium sm:px-4 text-right">Actions</th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-500">Chargement…</td></tr>`);
      } else if (!unref(clients).length) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucun client pour cette recherche.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(clients), (c) => {
        _push(`<tr><td class="px-3 py-3 sm:px-4"><div class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-bold text-slate-600">`);
        if (c.avatarUrl && !unref(avatarLoadFailed).has(c.id)) {
          _push(`<img${ssrRenderAttr("src", c.avatarUrl)} alt="" class="h-full w-full object-cover">`);
        } else {
          _push(`<span>${ssrInterpolate(initials(c))}</span>`);
        }
        _push(`</div></td><td class="px-3 py-3 sm:px-4 whitespace-nowrap">${ssrInterpolate(formatDate(c.dateAdhesion))}</td><td class="px-3 py-3 sm:px-4 font-medium text-slate-900">${ssrInterpolate(c.nomComplet)}</td><td class="px-3 py-3 sm:px-4">${ssrInterpolate(c.email)}</td><td class="px-3 py-3 sm:px-4"><span class="${ssrRenderClass([c.actif ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800", "inline-flex rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(c.statut)}</span></td><td class="px-3 py-3 sm:px-4 text-right"><div class="flex items-center justify-end gap-1"><button type="button" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Voir le détail"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></button><button type="button" class="rounded-lg p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-45" title="Supprimer le client"${ssrIncludeBooleanAttr(unref(deletingId) === c.id) ? " disabled" : ""}><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section>`);
      if (unref(detailOpen)) {
        _push(`<div class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-3 py-6 backdrop-blur-[2px] sm:px-4"><div class="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="client-modal-title">`);
        if (unref(detailLoading)) {
          _push(`<div class="px-6 py-16 text-center text-sm text-slate-500">Chargement…</div>`);
        } else if (unref(detailClient)) {
          _push(`<!--[--><div class="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><h3 id="client-modal-title" class="text-base font-semibold text-slate-800">Client</h3><button type="button" class="flex h-9 w-9 items-center justify-center rounded-full text-rose-500 transition hover:bg-rose-50" aria-label="Fermer"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><div class="px-5 pb-6 pt-4 sm:px-6"><div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><h4 class="text-center text-xl font-bold text-[#020B51] sm:text-left sm:text-2xl">${ssrInterpolate(unref(detailClient).nomComplet)}</h4><div class="flex items-center justify-center gap-3 sm:justify-end">`);
          if (phoneDigits(unref(detailClient).telephone)) {
            _push(`<a${ssrRenderAttr("href", telHref(unref(detailClient).telephone))} class="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-white shadow-md transition hover:bg-amber-500" title="Appeler"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></a>`);
          } else {
            _push(`<!---->`);
          }
          if (phoneDigits(unref(detailClient).telephone)) {
            _push(`<a${ssrRenderAttr("href", smsHref(unref(detailClient).telephone))} class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md transition hover:bg-emerald-600" title="Envoyer un SMS"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex flex-col gap-6 lg:flex-row lg:items-start"><div class="mx-auto flex w-28 shrink-0 flex-col sm:mx-0 lg:w-32"><div class="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-400">`);
          if (unref(detailClient).avatarUrl && !unref(detailModalAvatarFailed)) {
            _push(`<img${ssrRenderAttr("src", unref(detailClient).avatarUrl)} alt="" class="h-full w-full object-cover">`);
          } else {
            _push(`<svg class="h-14 w-14" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>`);
          }
          _push(`</div></div><div class="flex min-w-0 flex-1 flex-col gap-6 lg:flex-row lg:justify-between"><div class="min-w-0 flex-1 space-y-4 text-sm text-slate-700"><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></span><div><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Téléphone</p><p class="font-medium text-slate-900">${ssrInterpolate(unref(detailClient).telephone?.trim() || "—")}</p></div></div><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span><div class="min-w-0"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">E-mail</p><p class="break-all font-medium text-slate-900">${ssrInterpolate(unref(detailClient).email)}</p></div></div><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg></span><div><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Mille Services</p><p class="font-medium text-slate-900"> Nombre de Mille Services : ${ssrInterpolate(formatInt(unref(detailClient).prestationsTotal))}</p></div></div><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></span><div><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Annulations</p><p class="font-medium text-slate-900"> Mille Services annulés : ${ssrInterpolate(formatInt(unref(detailClient).prestationsAnnulees))}</p></div></div><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span><div><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Adresse</p><p class="font-medium text-slate-900">${ssrInterpolate(unref(detailClient).adresse?.trim() || "—")}</p></div></div><div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></span><div><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Adhésion</p><p class="font-medium text-slate-900"> Date d&#39;adhésion : ${ssrInterpolate(formatDate(unref(detailClient).dateAdhesion))}</p></div></div></div><div class="flex flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 lg:w-44 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0"><div class="text-right"><p class="text-xs font-medium uppercase tracking-wide text-slate-400">Statut</p><p class="${ssrRenderClass([unref(detailClient).actif ? "text-emerald-600" : "text-amber-600", "mt-1 text-lg font-semibold"])}">${ssrInterpolate(unref(detailClient).statut)}</p></div><button type="button" role="switch"${ssrRenderAttr("aria-checked", unref(detailClient).actif)}${ssrIncludeBooleanAttr(unref(toggleStatutLoading)) ? " disabled" : ""} class="${ssrRenderClass([unref(detailClient).actif ? "bg-emerald-500" : "bg-rose-400", "relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020B51] disabled:opacity-50"])}" title="Basculer le statut (compte actif = e-mail vérifié)"><span class="${ssrRenderClass([unref(detailClient).actif ? "left-7" : "left-1", "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all"])}"></span></button></div></div></div></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/clients.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=clients-BCRzeoYT.mjs.map
