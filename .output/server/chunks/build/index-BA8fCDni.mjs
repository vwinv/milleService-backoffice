import { defineComponent, reactive, ref, watch, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
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

const chartXMin = 20;
const chartXMax = 790;
const chartYMin = 20;
const chartYMax = 240;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchAdminApi } = useAdminFetch();
    const stats = reactive({
      clientsActifs: 0,
      prestatairesActifs: 0,
      credit: 0,
      metiers: 0
    });
    const evolution = reactive({
      labels: [],
      clients: [],
      prestataires: []
    });
    const transactions = ref([]);
    const selectedMonths = ref(12);
    async function loadEvolution() {
      try {
        const response = await fetchAdminApi("/admin/evolution", {
          query: { months: selectedMonths.value }
        });
        const payload = response?.data;
        evolution.labels = payload?.labels ?? [];
        evolution.clients = payload?.clients ?? [];
        evolution.prestataires = payload?.prestataires ?? [];
      } catch (error) {
        console.error("Erreur chargement evolution admin:", error);
        evolution.labels = [];
        evolution.clients = [];
        evolution.prestataires = [];
      }
    }
    watch(selectedMonths, () => {
      loadEvolution();
    });
    const chartMaxValue = computed(
      () => Math.max(1, ...evolution.clients, ...evolution.prestataires)
    );
    function xForIndex(index) {
      const total = evolution.labels.length;
      if (total <= 1) return (chartXMin + chartXMax) / 2;
      const ratio = index / (total - 1);
      return chartXMin + ratio * (chartXMax - chartXMin);
    }
    function yForValue(value) {
      const ratio = value / chartMaxValue.value;
      return chartYMax - ratio * (chartYMax - chartYMin);
    }
    function pointsFromSeries(series) {
      if (!series.length) return "";
      if (series.length === 1) {
        const y = yForValue(series[0] ?? 0);
        return `${chartXMin},${y} ${chartXMax},${y}`;
      }
      return series.map((value, index) => `${xForIndex(index)},${yForValue(value)}`).join(" ");
    }
    const prestatairesPoints = computed(
      () => pointsFromSeries(evolution.prestataires)
    );
    const clientsPoints = computed(() => pointsFromSeries(evolution.clients));
    function formatInt(value) {
      return new Intl.NumberFormat("fr-FR").format(value ?? 0);
    }
    function formatMoney(value) {
      return `${new Intl.NumberFormat("fr-FR").format(value ?? 0)} XOF`;
    }
    function formatDate(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return value;
      return date.toLocaleDateString("fr-FR");
    }
    function statusClass(statut) {
      if (statut.toLowerCase().includes("depot")) return "text-emerald-600";
      if (statut.toLowerCase().includes("retrait")) return "text-rose-500";
      if (statut.toLowerCase().includes("attente")) return "text-amber-500";
      return "text-slate-500";
    }
    useHead({
      title: "Tableau de bord"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Clients actifs</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).clientsActifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Prestataires Actifs</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).prestatairesActifs))}</p><p class="mt-2 text-xs text-slate-400">Comptes actuellement actifs</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Crédit</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatMoney(unref(stats).credit))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Métiers</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).metiers))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-2xl font-semibold text-slate-700">Prestataires - Clients</h2><div class="flex items-center gap-4 text-xs font-medium text-slate-500"><span class="inline-flex items-center gap-2"><span class="h-1.5 w-4 rounded-full bg-emerald-500"></span> Prestataires</span><span class="inline-flex items-center gap-2"><span class="h-1.5 w-4 rounded-full bg-yellow-400"></span> Clients</span><select class="rounded-lg bg-[#020B51] px-3 py-1.5 text-white outline-none" aria-label="Période en mois"><option${ssrRenderAttr("value", 1)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedMonths)) ? ssrLooseContain(unref(selectedMonths), 1) : ssrLooseEqual(unref(selectedMonths), 1)) ? " selected" : ""}>Sur le Mois</option><option${ssrRenderAttr("value", 3)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedMonths)) ? ssrLooseContain(unref(selectedMonths), 3) : ssrLooseEqual(unref(selectedMonths), 3)) ? " selected" : ""}>3 Mois</option><option${ssrRenderAttr("value", 6)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedMonths)) ? ssrLooseContain(unref(selectedMonths), 6) : ssrLooseEqual(unref(selectedMonths), 6)) ? " selected" : ""}>6 Mois</option><option${ssrRenderAttr("value", 12)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedMonths)) ? ssrLooseContain(unref(selectedMonths), 12) : ssrLooseEqual(unref(selectedMonths), 12)) ? " selected" : ""}>12 Mois</option></select></div></div><div class="overflow-hidden rounded-xl bg-slate-50/80 p-4"><svg viewBox="0 0 900 280" class="h-[240px] w-full" aria-label="Courbe d&#39;évolution"><g stroke="#d8dee7" stroke-width="1" stroke-dasharray="4 6"><line x1="0" y1="40" x2="900" y2="40"></line><line x1="0" y1="90" x2="900" y2="90"></line><line x1="0" y1="140" x2="900" y2="140"></line><line x1="0" y1="190" x2="900" y2="190"></line><line x1="0" y1="240" x2="900" y2="240"></line></g><polyline fill="none" stroke="#1eac3f" stroke-width="4"${ssrRenderAttr("points", unref(prestatairesPoints))}></polyline><polyline fill="none" stroke="#e5c21a" stroke-width="4"${ssrRenderAttr("points", unref(clientsPoints))}></polyline><g fill="#6b7280" font-size="12"><!--[-->`);
      ssrRenderList(unref(evolution).labels, (label, i) => {
        _push(`<text${ssrRenderAttr("x", xForIndex(i))} y="270" text-anchor="middle">${ssrInterpolate(label)}</text>`);
      });
      _push(`<!--]--></g></svg></div></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="mb-4 flex items-center justify-between"><h2 class="text-2xl font-semibold text-slate-700">Transaction</h2><button type="button" class="text-sm font-medium text-slate-500 hover:text-[#020B51]"> Voir tout </button></div><div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Date</th><th class="px-4 py-3 font-medium">Prestataires</th><th class="px-4 py-3 font-medium">Montant</th><th class="px-4 py-3 font-medium">Wallet</th><th class="px-4 py-3 font-medium">Statut</th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-600">`);
      if (!unref(transactions).length) {
        _push(`<tr><td colspan="5" class="px-4 py-6 text-center text-slate-400"> Aucune transaction disponible. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(transactions), (tx) => {
        _push(`<tr><td class="px-4 py-3">${ssrInterpolate(formatDate(tx.date))}</td><td class="px-4 py-3">${ssrInterpolate(tx.prestataireNom)}</td><td class="px-4 py-3">${ssrInterpolate(tx.montant == null ? "—" : formatMoney(tx.montant))}</td><td class="px-4 py-3">${ssrInterpolate(tx.wallet)}</td><td class="${ssrRenderClass([statusClass(tx.statut), "px-4 py-3 font-medium"])}">${ssrInterpolate(tx.statut)}</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BA8fCDni.mjs.map
