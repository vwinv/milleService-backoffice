import { u as useRoute, a as useRouter, b as useCookie, c as __nuxt_component_0 } from './server.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-A23Gg7KZ.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-3Fh-jQka.mjs';
import { u as useHead } from './composables-CM5oTO8Z.mjs';
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
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    const isAdminLogin = computed(() => route.path === "/admin/login");
    const adminDisplayNameCookie = useCookie("admin_display_name");
    ref(null);
    const isExportingPdf = ref(false);
    const adminDisplayName = computed(() => {
      const raw = adminDisplayNameCookie.value?.trim();
      if (!raw) return "Admin";
      const base = raw.includes("@") ? raw.split("@")[0] || raw : raw;
      return base.replace(/[._-]+/g, " ").split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
    });
    useHead({
      titleTemplate: (titleChunk) => titleChunk ? `${titleChunk} — Admin Mille Services` : "Admin — Mille Services"
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["min-h-screen", unref(isAdminLogin) ? "" : "bg-[#f3f3f3] text-slate-900"]
      }, _attrs))}>`);
      if (unref(isAdminLogin)) {
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      } else {
        _push(`<div class="flex min-h-screen"><aside class="hidden w-[230px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex"><div class="mb-8 flex justify-center"><img${ssrRenderAttr("src", _imports_0)} alt="Mille Services" class="h-16 w-auto object-contain" width="72" height="72"></div><nav class="space-y-2 text-sm font-medium">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin",
          class: [
            "flex items-center gap-3 rounded-full px-4 py-2.5 transition",
            unref(route).path === "/admin" ? "bg-[#020B51] text-white" : "text-slate-700 hover:bg-slate-100"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Home `);
            } else {
              return [
                createTextVNode(" Home ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/prestataires",
          class: [
            "flex items-center gap-3 rounded-full px-4 py-2.5 transition",
            unref(route).path.startsWith("/admin/prestataires") ? "bg-[#020B51] text-white" : "text-slate-700 hover:bg-slate-100"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Prestataires `);
            } else {
              return [
                createTextVNode(" Prestataires ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/clients",
          class: [
            "flex items-center gap-3 rounded-full px-4 py-2.5 transition",
            unref(route).path.startsWith("/admin/clients") ? "bg-[#020B51] text-white" : "text-slate-700 hover:bg-slate-100"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Clients `);
            } else {
              return [
                createTextVNode(" Clients ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin/services",
          class: [
            "flex items-center gap-3 rounded-full px-4 py-2.5 transition",
            unref(route).path.startsWith("/admin/services") ? "bg-[#020B51] text-white" : "text-slate-700 hover:bg-slate-100"
          ]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Métiers `);
            } else {
              return [
                createTextVNode(" Métiers ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<a href="#" class="flex items-center gap-3 rounded-full px-4 py-2.5 text-slate-700 transition hover:bg-slate-100"> Wallet </a></nav><button type="button" class="mt-auto rounded-full px-4 py-2.5 text-left text-sm font-medium text-rose-400 transition hover:bg-rose-50"> Logout </button></aside><div class="flex min-w-0 flex-1 flex-col"><header class="px-4 pb-2 pt-4 sm:px-6 lg:px-8"><div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-transparent"><label class="relative block min-w-[220px] flex-1 max-w-xl"><input type="search" placeholder="Search" class="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#020B51]/30"><span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path stroke-linecap="round" d="m20 20-3.5-3.5"></path></svg></span></label><div class="flex items-center gap-2 sm:gap-3"><button type="button" class="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm" aria-label="Notifications"><span class="h-2 w-2 rounded-full bg-rose-500"></span></button><button type="button" class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-medium text-white shadow-sm"><img${ssrRenderAttr("src", _imports_0)} alt="" class="h-6 w-6 rounded-full bg-white object-contain p-0.5" width="24" height="24"> ${ssrInterpolate(unref(adminDisplayName))}</button><button type="button" class="inline-flex items-center gap-2 rounded-full bg-[#020B51] px-4 py-2.5 text-sm font-semibold text-white shadow-sm"${ssrIncludeBooleanAttr(unref(isExportingPdf)) ? " disabled" : ""}>${ssrInterpolate(unref(isExportingPdf) ? "Export..." : "Exporter")}</button></div></div></header><main class="px-4 pb-6 pt-2 sm:px-6 lg:px-8">`);
        _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
        _push(`</main></div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-BX_rPeK6.mjs.map
