import { _ as __nuxt_component_0 } from './nuxt-link-DLOJWgKQ.mjs';
import { defineComponent, reactive, ref, computed, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderAttr, ssrRenderComponent } from 'vue/server-renderer';
import { u as useAdminFetch } from './useAdminFetch-Cp0KwdmY.mjs';
import { u as useHead } from './composables-BQSN98B_.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import './server.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useAdminFetch();
    const stats = reactive({
      total: 0,
      actifs: 0,
      inactifs: 0
    });
    const prestataires = ref([]);
    const activeTab = ref("actifs");
    const serviceFilterOptions = ref([]);
    const serviceFilterLoading = ref(false);
    const serviceFilterError = ref("");
    const selectedServiceFilterIds = ref([]);
    ref(null);
    const loadError = ref("");
    const actifToggleError = ref("");
    const togglingPrestataireId = ref(null);
    const filteredPrestataires = computed(() => {
      let list = activeTab.value === "actifs" ? prestataires.value.filter((p) => p.actif) : prestataires.value.filter((p) => !p.actif);
      const ids = selectedServiceFilterIds.value;
      if (ids.length > 0) {
        const set = new Set(ids);
        list = list.filter((p) => (p.serviceIds ?? []).some((sid) => set.has(sid)));
      }
      return list;
    });
    function formatInt(value) {
      return new Intl.NumberFormat("fr-FR").format(value ?? 0);
    }
    function renderStars(note) {
      const rounded = Math.max(0, Math.min(5, Math.round(note || 0)));
      return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
    }
    function canActivatePrestataire(p) {
      return p.statutVerification === "VERIFIE";
    }
    useHead({
      title: "Prestataires"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><section class="grid gap-3 md:grid-cols-3"><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Total Prestataires</p><p class="mt-2 text-3xl font-semibold text-slate-800">${ssrInterpolate(formatInt(unref(stats).total))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Prestataires Actifs</p><p class="mt-2 text-3xl font-semibold text-emerald-600">${ssrInterpolate(formatInt(unref(stats).actifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article><article class="rounded-2xl bg-white p-5 shadow-sm"><p class="text-xs font-semibold uppercase text-slate-500">Prestataires inactifs</p><p class="mt-2 text-3xl font-semibold text-rose-600">${ssrInterpolate(formatInt(unref(stats).inactifs))}</p><p class="mt-2 text-xs text-slate-400">Total cumulé</p></article></section><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6">`);
      if (unref(loadError)) {
        _push(`<div class="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(actifToggleError)) {
        _push(`<div class="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">${ssrInterpolate(unref(actifToggleError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="mb-4 flex flex-wrap items-center justify-between gap-3"><div class="flex flex-wrap items-center gap-2"><button type="button" class="${ssrRenderClass([unref(activeTab) === "actifs" ? "bg-[#020B51] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200", "rounded-full px-6 py-2 text-sm font-medium transition"])}"> Actifs </button><button type="button" class="${ssrRenderClass([unref(activeTab) === "inactifs" ? "bg-[#020B51] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200", "rounded-full px-6 py-2 text-sm font-medium transition"])}"> Inactifs </button><details class="relative"><summary class="list-none cursor-pointer rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 [&amp;::-webkit-details-marker]:hidden"><span class="inline-flex items-center gap-2"> Métier(s) `);
      if (unref(selectedServiceFilterIds).length) {
        _push(`<span class="rounded-full bg-[#020B51] px-2 py-0.5 text-xs text-white">${ssrInterpolate(unref(selectedServiceFilterIds).length)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span></summary><div class="absolute left-0 z-20 mt-2 w-[min(100vw-2rem,280px)] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">`);
      if (unref(serviceFilterLoading)) {
        _push(`<p class="px-2 py-3 text-sm text-slate-500">Chargement…</p>`);
      } else if (unref(serviceFilterError)) {
        _push(`<p class="px-2 py-2 text-sm text-rose-600">${ssrInterpolate(unref(serviceFilterError))}</p>`);
      } else {
        _push(`<div class="max-h-56 overflow-y-auto"><!--[-->`);
        ssrRenderList(unref(serviceFilterOptions), (opt) => {
          _push(`<label class="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-slate-700 hover:bg-slate-50"><input${ssrIncludeBooleanAttr(Array.isArray(unref(selectedServiceFilterIds)) ? ssrLooseContain(unref(selectedServiceFilterIds), opt.id) : unref(selectedServiceFilterIds)) ? " checked" : ""} type="checkbox" class="rounded border-slate-300"${ssrRenderAttr("value", opt.id)}><span>${ssrInterpolate(opt.libelle)}</span></label>`);
        });
        _push(`<!--]-->`);
        if (!unref(serviceFilterOptions).length) {
          _push(`<p class="px-2 py-3 text-sm text-slate-400">Aucun service.</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`<div class="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-2">`);
      if (unref(selectedServiceFilterIds).length) {
        _push(`<button type="button" class="w-full rounded-lg py-2 text-center text-xs font-medium text-[#020B51] hover:bg-slate-50"> Réinitialiser le filtre </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="button" class="w-full rounded-lg border border-slate-200 bg-white py-2 text-center text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"> Fermer </button></div></div></details></div><button type="button" class="rounded-full bg-[#020B51] px-5 py-2.5 text-sm font-semibold text-white shadow-sm"> Ajouter un prestataire </button></div><div class="overflow-x-auto rounded-xl border border-slate-200"><table class="min-w-full bg-white text-left text-sm"><thead class="bg-[#020B51] text-white"><tr><th class="px-4 py-3 font-medium">Prestataires</th><th class="px-4 py-3 font-medium">E-mail</th><th class="px-4 py-3 font-medium">Téléphone</th><th class="px-4 py-3 font-medium">Métier</th><th class="px-4 py-3 font-medium">Statut</th><th class="px-4 py-3 font-medium"></th></tr></thead><tbody class="divide-y divide-slate-200 text-slate-700">`);
      if (!unref(filteredPrestataires).length) {
        _push(`<tr><td colspan="6" class="px-4 py-6 text-center text-slate-400"> Aucun prestataire pour ce filtre. </td></tr>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(filteredPrestataires), (p) => {
        _push(`<tr><td class="px-4 py-3"><p class="font-semibold text-slate-800">${ssrInterpolate(p.nom)}</p><p class="text-xs text-amber-500">${ssrInterpolate(renderStars(p.noteMoyenne))} <span class="text-slate-400">(${ssrInterpolate(p.nbAvis)})</span></p></td><td class="px-4 py-3">${ssrInterpolate(p.email || "—")}</td><td class="px-4 py-3">${ssrInterpolate(p.telephone || "—")}</td><td class="px-4 py-3"><p>${ssrInterpolate(p.metier)}</p><p class="text-xs text-slate-400">Docs: ${ssrInterpolate(p.documentsValides)}/${ssrInterpolate(p.documentsTotal)}</p></td><td class="px-4 py-3"><div class="flex flex-col items-start gap-1"><span class="${ssrRenderClass([p.actif ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700", "inline-flex rounded-full px-3 py-1 text-xs font-semibold"])}">${ssrInterpolate(p.statut)}</span><span class="text-[11px] text-slate-500">${ssrInterpolate(p.statutVerification)}</span></div></td><td class="px-4 py-3 text-right"><div class="flex flex-col items-end gap-2"><button type="button" class="${ssrRenderClass([
          p.actif ? "border border-slate-400 text-slate-700 hover:bg-slate-100" : "border border-emerald-600 text-emerald-700 hover:bg-emerald-600 hover:text-white",
          "rounded-full px-3 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
        ])}"${ssrIncludeBooleanAttr(
          unref(togglingPrestataireId) === p.id || !p.actif && !canActivatePrestataire(p)
        ) ? " disabled" : ""}${ssrRenderAttr(
          "title",
          !p.actif && !canActivatePrestataire(p) ? "Activation possible uniquement si le statut de vérification est « VERIFIE »." : void 0
        )}>${ssrInterpolate(unref(togglingPrestataireId) === p.id ? "…" : p.actif ? "Désactiver" : "Activer")}</button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/admin/prestataires/${p.id}`,
          class: "inline-flex rounded-full border border-[#020B51] px-3 py-1 text-xs font-semibold text-[#020B51] transition hover:bg-[#020B51] hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Voir `);
            } else {
              return [
                createTextVNode(" Voir ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/prestataires/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CxkLdHI1.mjs.map
