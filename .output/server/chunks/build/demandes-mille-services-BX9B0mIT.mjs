import { defineComponent, ref, computed, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderAttr } from 'vue/server-renderer';
import { u as useHead } from './composables-BQSN98B_.mjs';
import { u as useAdminFetch } from './useAdminFetch-Cp0KwdmY.mjs';
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

const PAGE_SIZE = 20;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "demandes-mille-services",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Demande Mille Services" });
    const { fetchAdminApi } = useAdminFetch();
    const emptyStats = () => ({
      total: 0,
      enAttente: 0,
      acceptee: 0,
      enCours: 0,
      terminee: 0,
      payee: 0,
      refusee: 0,
      annulee: 0
    });
    const stats = ref(emptyStats());
    const items = ref([]);
    const listTotal = ref(0);
    const page = ref(0);
    const loading = ref(true);
    const loadError = ref(null);
    const statutFilter = ref("");
    const statCards = [
      { key: "total", label: "Nombre de prestations", colorClass: "text-slate-900" },
      { key: "enAttente", label: "En attente", colorClass: "text-amber-600" },
      { key: "acceptee", label: "Acceptées", colorClass: "text-sky-600" },
      { key: "enCours", label: "En cours", colorClass: "text-indigo-600" },
      { key: "terminee", label: "Terminées", colorClass: "text-emerald-600" },
      { key: "payee", label: "Payées", colorClass: "text-[#020B51]" },
      { key: "refusee", label: "Refusées", colorClass: "text-rose-600" },
      { key: "annulee", label: "Annulées", colorClass: "text-slate-500" }
    ];
    const statutOptions = [
      { value: "EN_ATTENTE", label: "En attente" },
      { value: "ACCEPTEE", label: "Acceptée" },
      { value: "EN_COURS", label: "En cours" },
      { value: "TERMINEE", label: "Terminée" },
      { value: "PAYEE", label: "Payée" },
      { value: "REFUSEE", label: "Refusée" },
      { value: "ANNULEE", label: "Annulée" }
    ];
    const totalPages = computed(
      () => listTotal.value <= 0 ? 1 : Math.ceil(listTotal.value / PAGE_SIZE)
    );
    const pageFirst = computed(
      () => listTotal.value === 0 ? 0 : page.value * PAGE_SIZE + 1
    );
    const pageLast = computed(
      () => Math.min((page.value + 1) * PAGE_SIZE, listTotal.value)
    );
    function formatInt(n) {
      return new Intl.NumberFormat("fr-FR").format(n);
    }
    function formatDate(iso) {
      try {
        const d = new Date(iso);
        return new Intl.DateTimeFormat("fr-FR", {
          dateStyle: "short",
          timeStyle: "short"
        }).format(d);
      } catch {
        return iso;
      }
    }
    function unwrapDemandesResponse(response) {
      if (!response || typeof response !== "object") {
        return { stats: emptyStats(), total: 0, items: [] };
      }
      const r = response;
      const inner = r.data;
      if (inner && typeof inner === "object" && !Array.isArray(inner) && ("items" in inner || "stats" in inner)) {
        const p = inner;
        return {
          stats: p.stats ?? emptyStats(),
          total: Number(p.total ?? 0),
          items: p.items ?? []
        };
      }
      if ("stats" in r && "items" in r) {
        const p = r;
        return {
          stats: p.stats ?? emptyStats(),
          total: Number(p.total ?? 0),
          items: p.items ?? []
        };
      }
      return { stats: emptyStats(), total: 0, items: [] };
    }
    function badgeClass(statut) {
      switch (statut) {
        case "EN_ATTENTE":
          return "bg-amber-100 text-amber-900";
        case "ACCEPTEE":
          return "bg-sky-100 text-sky-900";
        case "EN_COURS":
          return "bg-indigo-100 text-indigo-900";
        case "TERMINEE":
          return "bg-emerald-100 text-emerald-900";
        case "PAYEE":
          return "bg-[#020B51]/10 text-[#020B51]";
        case "REFUSEE":
          return "bg-rose-100 text-rose-900";
        case "ANNULEE":
          return "bg-slate-100 text-slate-700";
        default:
          return "bg-slate-100 text-slate-800";
      }
    }
    async function load() {
      loading.value = true;
      loadError.value = null;
      try {
        const query = {
          limit: PAGE_SIZE,
          offset: page.value * PAGE_SIZE
        };
        if (statutFilter.value) {
          query.statut = statutFilter.value;
        }
        const raw = await fetchAdminApi("/admin/demandes-mille-services", {
          query
        });
        const res = unwrapDemandesResponse(raw);
        stats.value = res.stats;
        listTotal.value = res.total;
        items.value = res.items ?? [];
      } catch (e) {
        const msg = e && typeof e === "object" && "message" in e ? String(e.message) : "Erreur de chargement";
        loadError.value = msg;
        items.value = [];
      } finally {
        loading.value = false;
      }
    }
    watch(page, () => {
      void load();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6" }, _attrs))}><div><h1 class="text-2xl font-bold text-slate-900 sm:text-3xl"> Demande Mille Services </h1><p class="mt-1 text-sm text-slate-600"> Liste des prestations demandées par les clients et suivi des statuts. </p></div><section class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><!--[-->`);
      ssrRenderList(statCards, (card) => {
        _push(`<article class="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">${ssrInterpolate(card.label)}</p><p class="${ssrRenderClass([card.colorClass, "mt-2 text-2xl font-semibold tabular-nums"])}">${ssrInterpolate(formatInt(stats.value[card.key]))}</p></article>`);
      });
      _push(`<!--]--></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"><h2 class="text-lg font-semibold text-slate-800">Liste des prestations</h2><div class="flex flex-wrap items-center gap-3"><label class="flex items-center gap-2 text-sm text-slate-600"><span>Filtrer par statut</span><select class="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/40"><option value=""${ssrIncludeBooleanAttr(Array.isArray(statutFilter.value) ? ssrLooseContain(statutFilter.value, "") : ssrLooseEqual(statutFilter.value, "")) ? " selected" : ""}>Tous</option><!--[-->`);
      ssrRenderList(statutOptions, (opt) => {
        _push(`<option${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(statutFilter.value) ? ssrLooseContain(statutFilter.value, opt.value) : ssrLooseEqual(statutFilter.value, opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
      });
      _push(`<!--]--></select></label><span class="text-sm text-slate-600">`);
      if (listTotal.value > 0) {
        _push(`<!--[-->${ssrInterpolate(pageFirst.value)}-${ssrInterpolate(pageLast.value)} sur ${ssrInterpolate(formatInt(listTotal.value))}<!--]-->`);
      } else {
        _push(`<!--[-->Aucun résultat<!--]-->`);
      }
      _push(`</span><div class="flex gap-1"><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value <= 0 || loading.value) ? " disabled" : ""} aria-label="Page précédente"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"></path></svg></button><button type="button" class="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-40"${ssrIncludeBooleanAttr(page.value >= totalPages.value - 1 || loading.value) ? " disabled" : ""} aria-label="Page suivante"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"></path></svg></button></div></div></div>`);
      if (loadError.value) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(loadError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-3 py-3 font-medium sm:px-4">Date</th><th class="px-3 py-3 font-medium sm:px-4">Client</th><th class="px-3 py-3 font-medium sm:px-4">Prestataire</th><th class="px-3 py-3 font-medium sm:px-4">Service</th><th class="px-3 py-3 font-medium sm:px-4">Type / tâche</th><th class="px-3 py-3 font-medium sm:px-4">Statut</th><th class="px-3 py-3 font-medium sm:px-4 text-right">Budget</th></tr></thead><tbody class="divide-y divide-slate-100">`);
      if (loading.value) {
        _push(`<tr class="bg-white"><td colspan="7" class="px-4 py-8 text-center text-slate-500"> Chargement… </td></tr>`);
      } else if (!items.value.length) {
        _push(`<tr class="bg-white"><td colspan="7" class="px-4 py-8 text-center text-slate-500"> Aucune prestation pour ce filtre. </td></tr>`);
      } else {
        _push(`<!--[-->`);
        ssrRenderList(items.value, (row) => {
          _push(`<tr class="bg-white hover:bg-slate-50/80"><td class="whitespace-nowrap px-3 py-3 text-slate-700 sm:px-4">${ssrInterpolate(formatDate(row.createdAt))}</td><td class="px-3 py-3 text-slate-800 sm:px-4"><div class="font-medium">${ssrInterpolate(row.particulier.nomComplet)}</div>`);
          if (row.particulier.telephone) {
            _push(`<div class="text-xs text-slate-500">${ssrInterpolate(row.particulier.telephone)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="px-3 py-3 text-slate-800 sm:px-4"><div class="font-medium">${ssrInterpolate(row.prestataire.nom)}</div>`);
          if (row.prestataire.telephone) {
            _push(`<div class="text-xs text-slate-500">${ssrInterpolate(row.prestataire.telephone)}</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td><td class="max-w-[10rem] truncate px-3 py-3 text-slate-700 sm:px-4"${ssrRenderAttr("title", row.serviceLibelle ?? "")}>${ssrInterpolate(row.serviceLibelle ?? "—")}</td><td class="max-w-[12rem] px-3 py-3 text-slate-700 sm:px-4"><span class="line-clamp-2">${ssrInterpolate(row.typeDeTache ?? "—")}</span></td><td class="px-3 py-3 sm:px-4"><span class="${ssrRenderClass([badgeClass(row.statut), "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"])}">${ssrInterpolate(row.statutLabel)}</span></td><td class="whitespace-nowrap px-3 py-3 text-right text-slate-700 sm:px-4">${ssrInterpolate(row.budget != null ? `${formatInt(row.budget)} FCFA` : "—")}</td></tr>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</tbody></table></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/demandes-mille-services.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=demandes-mille-services-BX9B0mIT.mjs.map
