import { defineComponent, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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

const pageSize = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "services",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminFetch();
    const items = ref([]);
    const loading = ref(true);
    const loadError = ref("");
    const actionError = ref("");
    const activeTab = ref("tous");
    const currentPage = ref(1);
    const togglingId = ref(null);
    const deactivatingId = ref(null);
    const blockedDeactivateOpen = ref(false);
    const blockedDeactivateLibelle = ref("");
    const blockedDeactivateCount = ref(0);
    const modalOpen = ref(false);
    const modalLibelle = ref("");
    const modalSaving = ref(false);
    const stats = computed(() => {
      const list = items.value;
      return {
        total: list.length,
        actifs: list.filter((s) => s.actif).length,
        inactifs: list.filter((s) => !s.actif).length
      };
    });
    const filteredRows = computed(() => {
      const list = items.value;
      if (activeTab.value === "tous") return list;
      if (activeTab.value === "actifs") return list.filter((s) => s.actif);
      return list.filter((s) => !s.actif);
    });
    const filteredTotal = computed(() => filteredRows.value.length);
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredTotal.value / pageSize)));
    const paginatedRows = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      return filteredRows.value.slice(start, start + pageSize);
    });
    watch(activeTab, () => {
      currentPage.value = 1;
    });
    watch(filteredTotal, (n) => {
      const max = Math.max(1, Math.ceil(n / pageSize));
      if (currentPage.value > max) currentPage.value = max;
    });
    function formatInt(value) {
      return new Intl.NumberFormat("fr-FR").format(value ?? 0);
    }
    function formatDate(value) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    useHead({
      title: "Métiers"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Total Métiers</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).total))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Métiers en activités</p><p class="mt-2 text-3xl font-semibold text-emerald-600">${ssrInterpolate(formatInt(unref(stats).actifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Métiers en arrêt</p><p class="mt-2 text-3xl font-semibold text-rose-600">${ssrInterpolate(formatInt(unref(stats).inactifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7h-4V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1ZM9 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9V5Z"></path></svg></span></div></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">`);
      if (unref(loadError)) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(actionError)) {
        _push(`<div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">${ssrInterpolate(unref(actionError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div class="flex flex-wrap items-center gap-2"><button type="button" class="${ssrRenderClass([
        unref(activeTab) === "tous" ? "bg-[#020B51] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        "rounded-full px-6 py-2 text-sm font-medium transition"
      ])}"> Tous </button><button type="button" class="${ssrRenderClass([
        unref(activeTab) === "actifs" ? "bg-[#020B51] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        "rounded-full px-6 py-2 text-sm font-medium transition"
      ])}"> Actifs </button><button type="button" class="${ssrRenderClass([
        unref(activeTab) === "inactifs" ? "bg-[#020B51] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200",
        "rounded-full px-6 py-2 text-sm font-medium transition"
      ])}"> Inactifs </button></div><button type="button" class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90"> Métiers + </button></div><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-xl font-semibold text-slate-800">Métiers</h2><div class="flex items-center gap-2 text-sm text-slate-600"><span class="font-medium">${ssrInterpolate(pageSize)} pour ${ssrInterpolate(unref(filteredTotal))}</span><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr(unref(currentPage) <= 1 || unref(loading)) ? " disabled" : ""} aria-label="Page précédente"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"></path></svg></button><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages) || unref(loading)) ? " disabled" : ""} aria-label="Page suivante"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"></path></svg></button></div></div><div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Date d&#39;ajout</th><th class="px-4 py-3 font-medium">Métiers</th><th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium text-right"></th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">Chargement…</td></tr>`);
      } else if (!unref(paginatedRows).length) {
        _push(`<tr><td colspan="4" class="px-4 py-8 text-center text-slate-400">`);
        if (unref(items).length && !unref(filteredTotal)) {
          _push(`<!--[--> Aucun résultat pour ce filtre (${ssrInterpolate(unref(items).length)} service(s) en base ont un autre statut). Onglet « Tous » pour tout afficher. <!--]-->`);
        } else {
          _push(`<!--[--> Aucun service à afficher. <!--]-->`);
        }
        _push(`</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(paginatedRows), (row) => {
        _push(`<tr><td class="whitespace-nowrap px-4 py-3 text-slate-600">${ssrInterpolate(formatDate(row.createdAt))}</td><td class="px-4 py-3 font-medium text-slate-800">${ssrInterpolate(row.libelle)}</td><td class="px-4 py-3"><button type="button" class="${ssrRenderClass([
          row.actif ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-rose-100 text-rose-700 hover:bg-rose-200",
          "inline-flex rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        ])}"${ssrIncludeBooleanAttr(unref(togglingId) === row.id) ? " disabled" : ""}>${ssrInterpolate(unref(togglingId) === row.id ? "…" : row.actif ? "Actifs" : "En Arrêt")}</button></td><td class="px-4 py-3 text-right"><div class="inline-flex flex-wrap items-center justify-end gap-2">`);
        if (row.actif) {
          _push(`<button type="button" class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(deactivatingId) === row.id) ? " disabled" : ""}>${ssrInterpolate(unref(deactivatingId) === row.id ? "…" : "Désactiver")}</button>`);
        } else {
          _push(`<button type="button" class="rounded-full border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(togglingId) === row.id) ? " disabled" : ""}>${ssrInterpolate(unref(togglingId) === row.id ? "…" : "Activer")}</button>`);
        }
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(modalOpen)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md" role="dialog" aria-modal="true"><div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h3 class="text-lg font-semibold text-slate-800">Nouveau métier</h3><label class="mt-4 block text-sm font-medium text-slate-700">Libellé</label><input${ssrRenderAttr("value", unref(modalLibelle))} type="text" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-[#020B51]/40" placeholder="Ex. Plomberie"><div class="mt-6 flex justify-end gap-2"><button type="button" class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"> Annuler </button><button type="button" class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"${ssrIncludeBooleanAttr(unref(modalSaving) || !unref(modalLibelle).trim()) ? " disabled" : ""}>${ssrInterpolate(unref(modalSaving) ? "Enregistrement…" : "Enregistrer")}</button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(blockedDeactivateOpen)) {
          _push2(`<div class="fixed inset-0 z-[60] flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="blocked-deactivate-title"><div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h3 id="blocked-deactivate-title" class="text-lg font-semibold text-slate-800"> Désactivation impossible </h3><p class="mt-3 text-sm leading-relaxed text-slate-600"> Vous ne pouvez pas désactiver le service « <span class="font-semibold text-slate-800">${ssrInterpolate(unref(blockedDeactivateLibelle))}</span> » tant qu’au moins un prestataire y est encore rattaché (${ssrInterpolate(unref(blockedDeactivateCount))} actuellement). </p><p class="mt-2 text-sm text-slate-600"> Retirez d’abord ce métier des fiches prestataires concernées ; vous pourrez alors désactiver le service. </p><div class="mt-6 flex justify-end"><button type="button" class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white"> Compris </button></div></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=services-oEt7FVOy.mjs.map
