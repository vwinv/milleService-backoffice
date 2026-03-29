import { defineComponent, ref, reactive, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrRenderAttr } from 'vue/server-renderer';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "offres",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminFetch();
    const items = ref([]);
    const loading = ref(true);
    const errorMsg = ref("");
    const togglingId = ref(null);
    const modalOpen = ref(false);
    const saving = ref(false);
    const editingId = ref(null);
    const form = reactive({
      code: "",
      libelle: "",
      description: "",
      prix: "",
      dureeMois: ""
    });
    const stats = computed(() => ({
      total: items.value.length,
      actifs: items.value.filter((o) => o.actif).length,
      inactifs: items.value.filter((o) => !o.actif).length
    }));
    function formatMoney(value) {
      return `${new Intl.NumberFormat("fr-FR").format(value ?? 0)} XOF`;
    }
    useHead({
      title: "Offres"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Total Offres</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(unref(stats).total)}</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Offres Actives</p><p class="mt-2 text-3xl font-semibold text-emerald-600">${ssrInterpolate(unref(stats).actifs)}</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Offres Inactives</p><p class="mt-2 text-3xl font-semibold text-rose-600">${ssrInterpolate(unref(stats).inactifs)}</p></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">`);
      if (unref(errorMsg)) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 class="text-xl font-semibold text-slate-800">Offres d&#39;abonnement</h2><button type="button" class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#020B51]/90"> Offre + </button></div><div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Code</th><th class="px-4 py-3 font-medium">Libellé</th><th class="px-4 py-3 font-medium">Prix</th><th class="px-4 py-3 font-medium">Durée</th><th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium text-right"></th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700">`);
      if (unref(loading)) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Chargement…</td></tr>`);
      } else if (!unref(items).length) {
        _push(`<tr><td colspan="6" class="px-4 py-8 text-center text-slate-400">Aucune offre.</td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(items), (row) => {
        _push(`<tr><td class="px-4 py-3">${ssrInterpolate(row.code)}</td><td class="px-4 py-3 font-medium text-slate-800">${ssrInterpolate(row.libelle)}</td><td class="px-4 py-3">${ssrInterpolate(formatMoney(row.prix))}</td><td class="px-4 py-3">${ssrInterpolate(row.dureeMois)} mois</td><td class="px-4 py-3"><span class="${ssrRenderClass([row.actif ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700", "inline-flex rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(row.actif ? "Active" : "Inactive")}</span></td><td class="px-4 py-3 text-right"><div class="inline-flex items-center gap-2"><button type="button" class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"> Modifier </button><button type="button" class="${ssrRenderClass([row.actif ? "border-rose-300 bg-rose-50 text-rose-700" : "border-emerald-300 bg-emerald-50 text-emerald-700", "rounded-full border px-3 py-1.5 text-xs font-semibold transition"])}"${ssrIncludeBooleanAttr(unref(togglingId) === row.id) ? " disabled" : ""}>${ssrInterpolate(unref(togglingId) === row.id ? "…" : row.actif ? "Désactiver" : "Activer")}</button></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(modalOpen)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center bg-[#140C44]/50 p-4 backdrop-blur-md"><div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><h3 class="text-lg font-semibold text-slate-800">${ssrInterpolate(unref(editingId) ? "Modifier l'offre" : "Nouvelle offre")}</h3><div class="mt-4 grid gap-3"><input${ssrRenderAttr("value", unref(form).libelle)} type="text" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Libellé"><input${ssrRenderAttr("value", unref(form).prix)} type="number" min="0" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Prix (XOF)"><input${ssrRenderAttr("value", unref(form).dureeMois)} type="number" min="1" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Durée (mois)"><input${ssrRenderAttr("value", unref(form).code)} type="text" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Code (optionnel)"><textarea rows="3" class="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none" placeholder="Description (optionnel)">${ssrInterpolate(unref(form).description)}</textarea></div><div class="mt-6 flex justify-end gap-2"><button type="button" class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"> Annuler </button><button type="button" class="rounded-full bg-[#020B51] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"${ssrIncludeBooleanAttr(unref(saving) || !unref(form).libelle.trim() || !unref(form).prix || !unref(form).dureeMois) ? " disabled" : ""}>${ssrInterpolate(unref(saving) ? "Enregistrement…" : unref(editingId) ? "Mettre à jour" : "Enregistrer")}</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/offres.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=offres-BZ39x15i.mjs.map
