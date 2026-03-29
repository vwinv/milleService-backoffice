import { defineComponent, reactive, ref, computed, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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
  __name: "demandes",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchAdminApi } = useAdminFetch();
    function statusLabel(s) {
      switch (s) {
        case "EN_ATTENTE":
          return "En attente";
        case "REFUSE":
          return "Rejeté";
        case "TRAITE":
          return "Accepté";
        default:
          return s;
      }
    }
    function statusClass(s) {
      switch (s) {
        case "EN_ATTENTE":
          return "text-amber-600";
        case "REFUSE":
          return "text-rose-600";
        case "TRAITE":
          return "text-emerald-600";
        default:
          return "text-slate-500";
      }
    }
    function unwrapApi(response) {
      if (!response || typeof response !== "object") return void 0;
      const r = response;
      if ("data" in r && r.data !== void 0 && r.data !== null) return r.data;
      return response;
    }
    const summary = reactive({
      totalSolde: 0,
      credit: 0,
      soldeMilleServices: 0,
      soldesPrestataires: 0,
      retraitTotal: 0
    });
    const rows = ref([]);
    const listTotal = ref(0);
    const loading = ref(true);
    const loadError = ref("");
    const actionError = ref("");
    const actingId = ref(null);
    const paymentModalOpen = ref(false);
    const paymentRow = ref(null);
    const selectedPayout = ref("ORANGE_MONEY");
    const cardNumber = ref("");
    const cardExpiry = ref("");
    const cardCvv = ref("");
    const paymentSubmitting = ref(false);
    const payoutOptions = [
      { value: "ORANGE_MONEY", label: "Orange Money", class: "bg-black text-white" },
      { value: "WAVE", label: "Wave", class: "bg-sky-400 text-white" },
      {
        value: "FREE_MONEY",
        label: "Free Money",
        class: "border-2 border-red-500 bg-white text-slate-900"
      },
      {
        value: "RIB",
        label: "Carte bancaire",
        class: "border border-slate-300 bg-slate-100 text-slate-800"
      }
    ];
    const currentPage = ref(1);
    const totalPages = computed(() => Math.max(1, Math.ceil(listTotal.value / pageSize)));
    watch(currentPage, () => {
      loadRequests();
    });
    async function loadRequests() {
      loading.value = true;
      loadError.value = "";
      try {
        const offset = (currentPage.value - 1) * pageSize;
        const response = await fetchAdminApi("/admin/wallet/withdrawal-requests", {
          query: { limit: pageSize, offset }
        });
        const payload = unwrapApi(response);
        listTotal.value = payload?.total ?? 0;
        const items = Array.isArray(payload?.items) ? payload.items : [];
        rows.value = items.map((it) => ({
          ...it,
          method: it.method ?? "ORANGE_MONEY",
          status: it.status ?? "EN_ATTENTE"
        }));
      } catch (e) {
        console.error(e);
        rows.value = [];
        listTotal.value = 0;
        loadError.value = extractApiMessage(e, "Impossible de charger les demandes.");
      } finally {
        loading.value = false;
      }
    }
    function extractApiMessage(err, fallback) {
      const e = err;
      const m = e?.data?.message;
      if (typeof m === "string" && m.trim()) return m;
      if (Array.isArray(m) && m[0]) return String(m[0]);
      if (e?.message && typeof e.message === "string") return e.message;
      return fallback;
    }
    function formatFcfa(value) {
      const n = value ?? 0;
      const sign = n < 0 ? "−" : "";
      return `${sign}${new Intl.NumberFormat("fr-FR").format(Math.abs(n))} XOF`;
    }
    function formatDate(value) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    watch(listTotal, (n) => {
      const max = Math.max(1, Math.ceil(n / pageSize));
      if (currentPage.value > max) currentPage.value = max;
    });
    useHead({
      title: "Demandes de retraits"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Total solde</p><p class="mt-2 text-2xl font-semibold text-slate-800 sm:text-3xl">${ssrInterpolate(formatFcfa(unref(summary).totalSolde))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Crédit</p><p class="mt-2 text-2xl font-semibold text-emerald-600 sm:text-3xl">${ssrInterpolate(formatFcfa(unref(summary).credit))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5"></path></svg></span></div></article><article class="rounded-2xl bg-white p-5 shadow-sm"><div class="flex items-start justify-between gap-3"><div><p class="text-xs font-semibold uppercase text-slate-500">Retrait</p><p class="mt-2 text-2xl font-semibold text-rose-600 sm:text-3xl">${ssrInterpolate(formatFcfa(unref(summary).retraitTotal))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></div><span class="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600" aria-hidden="true"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-3h6a3 3 0 1 0 0-6H9a3 3 0 1 1 0-6h7.5"></path></svg></span></div></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">`);
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
      _push(`<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-xl font-semibold text-slate-800">Demandes de retraits</h2><div class="flex items-center gap-2 text-sm text-slate-600"><span class="font-medium">${ssrInterpolate(pageSize)} pour ${ssrInterpolate(unref(listTotal))}</span><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr(unref(currentPage) <= 1 || unref(loading)) ? " disabled" : ""} aria-label="Page précédente"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m15 18-6-6 6-6"></path></svg></button><button type="button" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"${ssrIncludeBooleanAttr(unref(currentPage) >= unref(totalPages) || unref(loading)) ? " disabled" : ""} aria-label="Page suivante"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="m9 18 6-6-6-6"></path></svg></button></div></div><div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Date</th><th class="px-4 py-3 font-medium">Prestataires</th><th class="px-4 py-3 font-medium">Montant</th><th class="px-4 py-3 font-medium">Wallet</th><th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium text-right">Action</th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-600">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Chargement…</td></tr>`);
      } else if (!unref(rows).length) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucune demande de retrait.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(rows), (row) => {
        _push(`<tr><td class="whitespace-nowrap px-4 py-3">${ssrInterpolate(formatDate(row.date))}</td><td class="px-4 py-3 font-medium text-slate-800">${ssrInterpolate(row.prestataireNom)}</td><td class="px-4 py-3">${ssrInterpolate(row.montant == null ? "—" : formatFcfa(row.montant))}</td><td class="px-4 py-3">${ssrInterpolate(row.wallet)}</td><td class="px-4 py-3"><span class="${ssrRenderClass([statusClass(row.status), "text-sm font-semibold"])}">${ssrInterpolate(statusLabel(row.status))}</span></td><td class="px-4 py-3 text-right">`);
        if (row.status === "EN_ATTENTE") {
          _push(`<div class="inline-flex flex-wrap justify-end gap-2"><button type="button" class="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(actingId) === row.id || unref(paymentModalOpen)) ? " disabled" : ""}> Accepter </button><button type="button" class="rounded-full bg-rose-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-50"${ssrIncludeBooleanAttr(unref(actingId) === row.id || unref(paymentModalOpen)) ? " disabled" : ""}> Rejeté </button></div>`);
        } else {
          _push(`<span class="text-sm text-slate-400">—</span>`);
        }
        _push(`</td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(paymentModalOpen) && unref(paymentRow)) {
          _push2(`<div class="fixed inset-0 z-[70] flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="paiement-modal-title"><div class="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div class="flex items-start justify-between gap-3"><h2 id="paiement-modal-title" class="text-lg font-semibold text-slate-900">Paiement</h2><button type="button" class="rounded-full p-1 text-rose-500 transition hover:bg-rose-50" aria-label="Fermer"><svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"></path></svg></button></div><div class="mt-5 space-y-5"><div><label class="text-sm font-medium text-slate-700">Montant</label><input type="text" readonly class="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800"${ssrRenderAttr("value", unref(paymentRow).montant == null ? "—" : formatFcfa(unref(paymentRow).montant))}></div><div><p class="text-sm font-medium text-slate-700">Wallet</p><div class="mt-2 flex flex-wrap gap-2"><!--[-->`);
          ssrRenderList(payoutOptions, (opt) => {
            _push2(`<button type="button" class="${ssrRenderClass([[
              opt.class,
              unref(selectedPayout) === opt.value ? "ring-2 ring-[#020B51] ring-offset-2" : "opacity-90 hover:opacity-100"
            ], "flex min-h-[44px] flex-1 items-center justify-center rounded-full px-3 py-2 text-xs font-semibold transition sm:text-sm"])}">${ssrInterpolate(opt.label)}</button>`);
          });
          _push2(`<!--]--></div></div><div><p class="text-sm font-medium text-slate-700">Carte Bancaire</p><input${ssrRenderAttr("value", unref(cardNumber))} type="text" inputmode="numeric" autocomplete="off" placeholder="Numéro de la carte" class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"><div class="mt-2 grid grid-cols-2 gap-2"><input${ssrRenderAttr("value", unref(cardExpiry))} type="text" autocomplete="off" placeholder="Date d&#39;expiration" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"><input${ssrRenderAttr("value", unref(cardCvv))} type="text" inputmode="numeric" autocomplete="off" placeholder="CVV" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-[#020B51]/40"></div></div></div><div class="mt-8 flex justify-center"><button type="button" class="w-full max-w-xs rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"${ssrIncludeBooleanAttr(unref(paymentSubmitting)) ? " disabled" : ""}>${ssrInterpolate(unref(paymentSubmitting) ? "Traitement…" : "Payer")}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/wallet/demandes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=demandes-9FJDrfA3.mjs.map
