import { _ as __nuxt_component_0 } from './nuxt-link-DLOJWgKQ.mjs';
import { defineComponent, computed, ref, watch, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { u as useRoute } from './server.mjs';
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
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { fetchAdminApi } = useAdminFetch();
    const id = computed(() => String(route.params.id || ""));
    const loading = ref(true);
    const loadError = ref("");
    const p = ref(null);
    const headerAvatarFailed = ref(false);
    const walletBalanceVisible = ref(true);
    const walletManageOpen = ref(false);
    const walletTxRows = ref([]);
    const walletTxTotal = ref(0);
    const walletTxLoading = ref(false);
    const walletTxError = ref("");
    const walletStatutSaving = ref(false);
    const plafondModalOpen = ref(false);
    const plafondInput = ref("");
    const plafondSaving = ref(false);
    const plafondModalError = ref("");
    const documentsPanelOpen = ref(false);
    const deleteHint = ref(false);
    const actifToggleError = ref("");
    const prestataireToggleLoading = ref(false);
    const validatingDocumentId = ref(null);
    const deletingDocumentId = ref(null);
    const rejectDocumentModalOpen = ref(false);
    const rejectDocumentTargetId = ref(null);
    const rejectDocumentMotif = ref("");
    const rejectDocumentError = ref("");
    const rejectDocumentSubmitting = ref(false);
    const docActionLoadingId = computed(() => {
      if (validatingDocumentId.value) return validatingDocumentId.value;
      if (rejectDocumentSubmitting.value && rejectDocumentTargetId.value) return rejectDocumentTargetId.value;
      if (deletingDocumentId.value) return deletingDocumentId.value;
      return null;
    });
    async function loadDetail() {
      if (!id.value) return;
      loading.value = true;
      loadError.value = "";
      try {
        const response = await fetchAdminApi(
          `/admin/prestataires/${id.value}`
        );
        const raw = response?.data ?? response;
        const statut = raw.walletStatutPrestataire === "BLOQUE" ? "BLOQUE" : "ACTIF";
        const plafondRaw = raw.walletBalancePlafond;
        let walletBalancePlafond = null;
        if (plafondRaw != null && plafondRaw !== "") {
          const x = Number(plafondRaw);
          walletBalancePlafond = Number.isFinite(x) ? x : null;
        }
        p.value = {
          ...raw,
          avatarUrl: raw.avatarUrl ?? null,
          walletBalance: Number(raw.walletBalance ?? 0),
          walletStatutPrestataire: statut,
          walletBalancePlafond,
          noteMoyenne: Number(raw.noteMoyenne ?? 0),
          nbAvis: Number(raw.nbAvis ?? 0),
          metier: raw.metier ?? "—",
          documents: raw.documents ?? []
        };
      } catch (e) {
        console.error(e);
        p.value = null;
        loadError.value = extractApiMessage(e) || "Prestataire introuvable ou erreur de chargement.";
      } finally {
        loading.value = false;
      }
    }
    function unwrapPrestataireTransactionsPayload(response) {
      if (!response || typeof response !== "object") return {};
      const r = response;
      const inner = r.data;
      if (inner && typeof inner === "object" && !Array.isArray(inner) && ("items" in inner || "total" in inner)) {
        return inner;
      }
      if ("items" in r || "total" in r) {
        return r;
      }
      return {};
    }
    async function loadWalletTransactions() {
      if (!p.value?.id) return;
      walletTxLoading.value = true;
      walletTxError.value = "";
      try {
        const response = await fetchAdminApi(`/admin/prestataires/${p.value.id}/transactions`, {
          query: { limit: 100 }
        });
        const payload = unwrapPrestataireTransactionsPayload(response);
        const items = payload.items ?? [];
        walletTxRows.value = items.map((row) => ({
          ...row,
          clientNom: row.clientNom?.trim() || "—",
          serviceLibelle: row.serviceLibelle?.trim() || "—",
          statut: row.statut || "Payé"
        }));
        walletTxTotal.value = payload.total ?? items.length;
      } catch (e) {
        console.error(e);
        walletTxError.value = "Impossible de charger les transactions.";
        walletTxRows.value = [];
        walletTxTotal.value = 0;
      } finally {
        walletTxLoading.value = false;
      }
    }
    watch(walletManageOpen, (open) => {
      if (open && p.value) {
        loadWalletTransactions();
      }
    });
    watch(id, () => {
      headerAvatarFailed.value = false;
      walletManageOpen.value = false;
      walletTxRows.value = [];
      walletTxTotal.value = 0;
      walletTxError.value = "";
      documentsPanelOpen.value = false;
      deleteHint.value = false;
      loadDetail();
    }, { immediate: true });
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
    function formatDate(value) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleDateString("fr-FR");
    }
    function formatDateTime(value) {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return value;
      return d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
    }
    function formatMoney(value) {
      return `${new Intl.NumberFormat("fr-FR").format(value ?? 0)} FCFA`;
    }
    function renderStars(note) {
      const rounded = Math.max(0, Math.min(5, Math.round(note || 0)));
      return `${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}`;
    }
    function walletStatutLabel(s) {
      return s === "BLOQUE" ? "Bloqué" : "Actif";
    }
    function statusChipClass(statut) {
      if (statut === "VALIDE") return "bg-emerald-100 text-emerald-700";
      if (statut === "REFUSE") return "bg-rose-100 text-rose-700";
      return "bg-amber-100 text-amber-700";
    }
    function extractApiMessage(e) {
      if (typeof e !== "object" || e === null) return "";
      const any = e;
      const payload = any.data;
      if (payload && typeof payload === "object" && "message" in payload) {
        const m = payload.message;
        if (Array.isArray(m)) return m.filter(Boolean).join(" ");
        if (typeof m === "string" && m.trim()) return m;
      }
      if (typeof any.message === "string" && any.message.trim()) {
        const msg = any.message.trim();
        if (!msg.startsWith("[")) return msg;
      }
      return "";
    }
    const isDocumentPreviewOpen = ref(false);
    const documentPreviewLoading = ref(false);
    const documentPreviewError = ref("");
    const documentPreviewUrl = ref("");
    const documentPreviewOpenTabUrl = ref("");
    ref(null);
    const documentPreviewTitle = ref("");
    const documentPreviewKind = ref("pdf");
    const documentPreviewSrc = computed(() => {
      const base = documentPreviewUrl.value;
      if (!base) return "";
      const isBlob = base.startsWith("blob:");
      const hash = documentPreviewKind.value === "pdf" && !isBlob && !base.includes("/api/document-preview") ? "#toolbar=0" : "";
      return `${base}${hash}`;
    });
    const pageTitle = computed(() => p.value?.nom ? p.value.nom : "Prestataire");
    useHead({
      title: pageTitle
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/prestataires",
        class: "inline-flex items-center gap-2 text-sm font-medium text-[#020B51] hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"${_scopeId}></path></svg> Retour `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "h-4 w-4",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                viewBox: "0 0 24 24"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M15 19l-7-7 7-7"
                })
              ])),
              createTextVNode(" Retour ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(loadError)) {
        _push(`<div class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(loadError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(loading)) {
        _push(`<div class="rounded-2xl bg-white p-10 text-center text-sm text-slate-500 shadow-sm"> Chargement… </div>`);
      } else if (unref(p)) {
        _push(`<!--[--><section class="rounded-2xl bg-white p-5 shadow-sm sm:p-6"><div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between"><div class="flex flex-col gap-4 sm:flex-row sm:items-start"><div class="mx-auto flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-sky-100 text-sky-500 sm:mx-0">`);
        if (unref(p).avatarUrl && !unref(headerAvatarFailed)) {
          _push(`<img${ssrRenderAttr("src", unref(p).avatarUrl)} alt="" class="h-full w-full object-cover">`);
        } else {
          _push(`<svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>`);
        }
        _push(`</div><div class="min-w-0 text-center sm:text-left"><h1 class="text-2xl font-bold text-[#020B51] sm:text-3xl">${ssrInterpolate(unref(p).nom)}</h1><p class="mt-1 text-amber-500">${ssrInterpolate(renderStars(unref(p).noteMoyenne))} <span class="text-slate-400">(${ssrInterpolate(unref(p).nbAvis)})</span></p><div class="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2"><p class="flex items-center justify-center gap-2 sm:justify-start"><span class="text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></span> ${ssrInterpolate(unref(p).telephone?.trim() || "—")}</p><p class="flex items-center justify-center gap-2 sm:justify-start"><span class="text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg></span><span class="truncate">${ssrInterpolate(unref(p).email)}</span></p><p class="flex items-center justify-center gap-2 sm:justify-start sm:col-span-2"><span class="text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></span><span><span class="font-semibold text-slate-800">Métier :</span> ${ssrInterpolate(unref(p).metier)}</span></p><p class="flex items-center justify-center gap-2 sm:justify-start sm:col-span-2"><span class="text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></span><span><span class="font-semibold text-slate-800">Date d&#39;adhésion :</span> ${ssrInterpolate(formatDate(unref(p).dateAdhesion))}</span></p></div></div></div><div class="flex flex-col items-center gap-4 sm:flex-row lg:flex-col lg:items-end"><div class="flex items-center gap-3"><span class="text-sm font-semibold text-slate-700">${ssrInterpolate(unref(p).actif ? "Actif" : "Inactif")}</span><button type="button" role="switch"${ssrRenderAttr("aria-checked", unref(p).actif)}${ssrIncludeBooleanAttr(unref(prestataireToggleLoading)) ? " disabled" : ""} class="${ssrRenderClass([unref(p).actif ? "bg-emerald-500" : "bg-slate-300", "relative h-8 w-14 shrink-0 rounded-full transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#020B51] disabled:opacity-50"])}"><span class="${ssrRenderClass([unref(p).actif ? "left-7" : "left-1", "absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all"])}"></span></button></div><div class="flex items-center gap-3">`);
        if (phoneDigits(unref(p).telephone)) {
          _push(`<a${ssrRenderAttr("href", telHref(unref(p).telephone))} class="flex h-11 w-11 items-center justify-center rounded-full bg-amber-400 text-white shadow-md hover:bg-amber-500" title="Appeler"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg></a>`);
        } else {
          _push(`<!---->`);
        }
        if (phoneDigits(unref(p).telephone)) {
          _push(`<a${ssrRenderAttr("href", smsHref(unref(p).telephone))} class="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md hover:bg-emerald-600" title="SMS"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg></a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
        if (unref(actifToggleError)) {
          _push(`<p class="mt-4 text-sm text-amber-800">${ssrInterpolate(unref(actifToggleError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</section><div class="grid gap-4 lg:grid-cols-2"><article class="${ssrRenderClass([unref(walletManageOpen) ? "lg:col-span-2" : "", "flex flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6"])}"><div class="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 class="text-lg font-semibold text-slate-800">Wallet</h2><div class="flex items-center gap-1"><button type="button" class="rounded-full px-3 py-1.5 text-xs font-semibold text-[#020B51] hover:bg-slate-100">${ssrInterpolate(unref(walletManageOpen) ? "Masquer" : "Gérer")}</button><button type="button" class="rounded-full p-2 text-slate-500 hover:bg-slate-100"${ssrRenderAttr("title", unref(walletBalanceVisible) ? "Masquer le solde" : "Afficher le solde")}>`);
        if (unref(walletBalanceVisible)) {
          _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>`);
        } else {
          _push(`<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.289m-2.06 2.06l5.303 5.304M12 12h.01M18 12h.01M21 12c-1.274 4.057-5.064 7-9.542 7-1.259 0-2.47-.23-3.59-.646m-4.888-1.438A9.953 9.953 0 013 12c0-1.37.276-2.68.775-3.87"></path></svg>`);
        }
        _push(`</button></div></div><div class="flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-xl bg-[#020B51] px-4 py-8 text-center text-white"><p class="text-2xl font-bold tracking-tight sm:text-3xl">`);
        if (unref(walletBalanceVisible)) {
          _push(`<!--[-->${ssrInterpolate(formatMoney(unref(p).walletBalance))}<!--]-->`);
        } else {
          _push(`<!--[-->••••••<!--]-->`);
        }
        _push(`</p><p class="mt-1 text-xs text-white/70">Solde prestataire</p><p class="${ssrRenderClass([
          unref(p).walletStatutPrestataire === "BLOQUE" ? "bg-amber-400/90 text-amber-950" : "bg-emerald-400/90 text-emerald-950",
          "mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold"
        ])}"> Wallet : ${ssrInterpolate(walletStatutLabel(unref(p).walletStatutPrestataire))}</p>`);
        if (unref(p).walletBalancePlafond != null) {
          _push(`<p class="mt-1 max-w-[280px] text-xs text-white/80"> Solde maximal : ${ssrInterpolate(formatMoney(unref(p).walletBalancePlafond))} (le solde ne peut pas le dépasser) </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="mt-4 flex flex-wrap items-center gap-2"><button type="button" class="rounded-full bg-[#020B51] px-4 py-2 text-xs font-semibold text-white hover:bg-[#020B51]/90"> Plafonner </button><button type="button" class="rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-600 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(walletStatutSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(p).walletStatutPrestataire === "BLOQUE" ? "Dégeler" : "Geler")}</button></div><div class="mt-5 border-t border-slate-200 pt-5" style="${ssrRenderStyle(unref(walletManageOpen) ? null : { display: "none" })}"><h3 class="mb-3 text-sm font-semibold text-slate-800">Transactions (paiements particuliers)</h3>`);
        if (unref(walletTxLoading)) {
          _push(`<div class="py-8 text-center text-sm text-slate-500"> Chargement… </div>`);
        } else if (unref(walletTxError)) {
          _push(`<div class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">${ssrInterpolate(unref(walletTxError))}</div>`);
        } else if (!unref(walletTxRows).length) {
          _push(`<div class="py-6 text-center text-sm text-slate-500"> Aucune transaction pour ce prestataire. </div>`);
        } else {
          _push(`<div class="max-h-[min(420px,55vh)] overflow-auto rounded-lg border border-slate-200"><table class="min-w-full divide-y divide-slate-200 text-left text-sm"><thead class="sticky top-0 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600"><tr><th class="whitespace-nowrap px-3 py-2">Date</th><th class="whitespace-nowrap px-3 py-2">Client</th><th class="min-w-[8rem] px-3 py-2">Prestation</th><th class="whitespace-nowrap px-3 py-2 text-right">Montant</th><th class="whitespace-nowrap px-3 py-2">Statut</th></tr></thead><tbody class="divide-y divide-slate-100 bg-white"><!--[-->`);
          ssrRenderList(unref(walletTxRows), (row) => {
            _push(`<tr class="text-slate-700"><td class="whitespace-nowrap px-3 py-2 text-slate-600">${ssrInterpolate(formatDateTime(row.date))}</td><td class="max-w-[10rem] truncate px-3 py-2"${ssrRenderAttr("title", row.clientNom)}>${ssrInterpolate(row.clientNom)}</td><td class="max-w-[14rem] truncate px-3 py-2"${ssrRenderAttr("title", row.serviceLibelle)}>${ssrInterpolate(row.serviceLibelle)}</td><td class="whitespace-nowrap px-3 py-2 text-right font-medium tabular-nums">${ssrInterpolate(formatMoney(row.montant))}</td><td class="whitespace-nowrap px-3 py-2"><span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">${ssrInterpolate(row.statut)}</span></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        if (unref(walletTxTotal) > unref(walletTxRows).length) {
          _push(`<p class="mt-2 text-xs text-slate-500"> Affichage de ${ssrInterpolate(unref(walletTxRows).length)} sur ${ssrInterpolate(unref(walletTxTotal))} écriture(s). </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></article><article class="flex flex-col rounded-2xl bg-white p-5 shadow-sm sm:p-6"><h2 class="mb-4 text-lg font-semibold text-slate-800">Documents</h2><div class="flex min-h-[120px] flex-1 flex-col items-center justify-center rounded-xl bg-[#020B51]/95 px-4 py-8 text-white"><svg class="h-16 w-16 text-white/90" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><p class="mt-2 text-sm text-white/80">${ssrInterpolate(unref(p).documents.length)} fichier(s)</p></div><div class="mt-4 flex flex-wrap gap-2"><button type="button" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#020B51] px-4 py-2 text-xs font-semibold text-white hover:bg-[#020B51]/90 sm:flex-initial"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> Voir </button><button type="button" class="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 sm:flex-initial"><svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg> Supprimer </button></div>`);
        if (unref(documentsPanelOpen) && unref(deleteHint)) {
          _push(`<p class="mt-2 text-xs text-slate-500"> Sélectionnez un document ci-dessous puis supprimez-le avec l’icône corbeille. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article></div><section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" style="${ssrRenderStyle(unref(documentsPanelOpen) ? null : { display: "none" })}"><h3 class="mb-4 text-base font-semibold text-slate-800">Gestion des documents</h3>`);
        if (!unref(p).documents.length) {
          _push(`<div class="text-sm text-slate-500">Aucun document enregistré.</div>`);
        } else {
          _push(`<div class="space-y-2"><!--[-->`);
          ssrRenderList(unref(p).documents, (doc) => {
            _push(`<article class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-3"><div class="min-w-0 flex-1"><p class="truncate text-sm font-semibold text-slate-800">${ssrInterpolate(doc.typeLibelle)}</p><p class="truncate text-xs text-slate-500">${ssrInterpolate(doc.nomFichier || doc.fichierUrl)}</p><button type="button" class="mt-1 text-left text-xs font-medium text-[#020B51] underline-offset-2 hover:underline"> Voir le document </button></div><div class="flex flex-wrap items-center gap-2"><span class="${ssrRenderClass([statusChipClass(doc.statut), "rounded-full px-2.5 py-1 text-xs font-semibold"])}">${ssrInterpolate(doc.statut)}</span><button type="button" class="rounded-full border border-emerald-600 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-600 hover:text-white disabled:opacity-50"${ssrIncludeBooleanAttr(doc.statut === "VALIDE" || unref(docActionLoadingId) === doc.id) ? " disabled" : ""}>${ssrInterpolate(unref(validatingDocumentId) === doc.id ? "…" : "Valider")}</button><button type="button" class="rounded-full border border-rose-600 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-600 hover:text-white disabled:opacity-50"${ssrIncludeBooleanAttr(doc.statut === "VALIDE" || unref(docActionLoadingId) === doc.id) ? " disabled" : ""}> Rejeter </button><button type="button" class="rounded-full p-2 text-rose-600 hover:bg-rose-50 disabled:opacity-50" title="Supprimer ce document"${ssrIncludeBooleanAttr(unref(deletingDocumentId) === doc.id) ? " disabled" : ""}><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></article>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</section><!--]-->`);
      } else {
        _push(`<!---->`);
      }
      if (unref(rejectDocumentModalOpen)) {
        _push(`<div class="fixed inset-0 z-[75] flex items-center justify-center bg-[#140C44]/50 px-4 py-6 backdrop-blur-md" role="dialog" aria-modal="true"><div class="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"><h4 class="text-base font-semibold text-slate-900">Rejeter le document</h4><p class="mt-1 text-sm text-slate-500">Motif de refus (min. 3 caractères).</p><textarea rows="4" class="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#020B51]/40">${ssrInterpolate(unref(rejectDocumentMotif))}</textarea>`);
        if (unref(rejectDocumentError)) {
          _push(`<p class="mt-2 text-sm text-rose-600">${ssrInterpolate(unref(rejectDocumentError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-4 flex justify-end gap-2"><button type="button" class="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"${ssrIncludeBooleanAttr(unref(rejectDocumentSubmitting)) ? " disabled" : ""}> Annuler </button><button type="button" class="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(rejectDocumentSubmitting)) ? " disabled" : ""}>${ssrInterpolate(unref(rejectDocumentSubmitting) ? "Envoi…" : "Confirmer")}</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(isDocumentPreviewOpen)) {
          _push2(`<div class="fixed inset-0 z-[10050] flex items-center justify-center bg-[#140C44]/50 px-2 py-6 backdrop-blur-md sm:px-4"><div class="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"><div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3"><h4 class="min-w-0 flex-1 truncate text-sm font-semibold text-slate-900">${ssrInterpolate(unref(documentPreviewTitle))}</h4><button type="button" class="rounded-full border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"> Fermer </button></div><div class="min-h-[50vh] flex-1 overflow-auto bg-slate-100">`);
          if (unref(documentPreviewLoading)) {
            _push2(`<div class="flex min-h-[50vh] items-center justify-center text-sm text-slate-600"> Chargement… </div>`);
          } else if (unref(documentPreviewError)) {
            _push2(`<p class="px-4 py-10 text-center text-sm text-rose-600">${ssrInterpolate(unref(documentPreviewError))}</p>`);
          } else {
            _push2(`<!--[-->`);
            if (unref(documentPreviewKind) === "image") {
              _push2(`<img${ssrRenderAttr("src", unref(documentPreviewUrl))}${ssrRenderAttr("alt", unref(documentPreviewTitle))} class="mx-auto block max-h-[85vh] w-auto object-contain">`);
            } else if (unref(documentPreviewKind) === "pdf") {
              _push2(`<iframe${ssrRenderAttr("src", unref(documentPreviewSrc))} class="min-h-[min(85vh,800px)] h-[min(85vh,800px)] w-full border-0 bg-white" title="Aperçu PDF"></iframe>`);
            } else {
              _push2(`<iframe${ssrRenderAttr("src", unref(documentPreviewSrc))} class="h-[min(85vh,800px)] min-h-[40vh] w-full border-0 bg-white" title="Aperçu"></iframe>`);
            }
            _push2(`<!--]-->`);
          }
          _push2(`</div>`);
          if (unref(documentPreviewOpenTabUrl) && !unref(documentPreviewLoading)) {
            _push2(`<div class="border-t border-slate-200 bg-white px-4 py-3 text-center"><a${ssrRenderAttr("href", unref(documentPreviewOpenTabUrl))} target="_blank" rel="noopener noreferrer" class="text-sm font-medium text-[#020B51] underline"> Ouvrir dans un nouvel onglet </a></div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(plafondModalOpen)) {
          _push2(`<div class="fixed inset-0 z-[10040] flex items-center justify-center bg-[#140C44]/50 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="plafond-modal-title"><div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div class="flex items-start justify-between gap-3"><h2 id="plafond-modal-title" class="text-lg font-semibold text-slate-900">Plafonner</h2><button type="button" class="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Fermer"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><label class="mt-5 block"><span class="text-sm font-medium text-slate-700">Solde maximal du wallet (FCFA)</span><input${ssrRenderAttr("value", unref(plafondInput))} type="text" inputmode="decimal" autocomplete="off" placeholder="500 000" class="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#020B51]/40"><span class="mt-1 block text-xs text-slate-500"> Après un crédit (prestation, etc.), le solde ne pourra jamais dépasser ce montant. </span></label>`);
          if (unref(plafondModalError)) {
            _push2(`<p class="mt-3 text-sm text-rose-600">${ssrInterpolate(unref(plafondModalError))}</p>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button type="button" class="mt-6 w-full rounded-full bg-[#020B51] py-3 text-sm font-semibold text-white hover:bg-[#020B51]/90 disabled:opacity-50"${ssrIncludeBooleanAttr(unref(plafondSaving)) ? " disabled" : ""}>${ssrInterpolate(unref(plafondSaving) ? "Envoi…" : "Appliquer")}</button>`);
          if (unref(p)?.walletBalancePlafond != null) {
            _push2(`<button type="button" class="mt-3 w-full text-center text-sm font-medium text-slate-600 underline-offset-2 hover:text-rose-600 hover:underline disabled:opacity-50"${ssrIncludeBooleanAttr(unref(plafondSaving)) ? " disabled" : ""}> Retirer le plafond </button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/prestataires/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-C0jdA3W_.mjs.map
