import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderAttr, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-3Fh-jQka.mjs';
import { a as useRouter } from './server.mjs';
import { u as useHead } from './composables-BQSN98B_.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const email = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const showPassword = ref(false);
    const isSubmitting = ref(false);
    const errorMessage = ref("");
    useHead({
      title: "Connexion"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: "relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f2f2f2] px-4 py-10",
        "aria-labelledby": "admin-login-heading"
      }, _attrs))}><div class="pointer-events-none absolute right-0 top-0 h-[45vh] w-[44vw] min-h-[250px] min-w-[280px] bg-[#020B51]" style="${ssrRenderStyle({ "clip-path": "polygon(\n          36% 0%,\n          100% 0%,\n          100% 72%,\n          84% 60%,\n          71% 50%,\n          56% 40%,\n          45% 31%,\n          38% 22%,\n          35% 10%\n        )" })}" aria-hidden="true"></div><div class="pointer-events-none absolute bottom-0 left-0 h-[40vh] w-[52vw] min-h-[250px] min-w-[320px] bg-[#020B51]" style="${ssrRenderStyle({ "clip-path": "polygon(\n          0% 0%,\n          0% 100%,\n          76% 100%,\n          66% 90%,\n          57% 82%,\n          47% 74%,\n          36% 66%,\n          24% 58%,\n          11% 50%,\n          4% 44%,\n          0% 36%\n        )" })}" aria-hidden="true"></div><div class="relative z-10 w-full max-w-md"><form class="rounded-2xl bg-transparent p-2 sm:p-4"><div class="mb-10 flex flex-col items-center"><img${ssrRenderAttr("src", _imports_0)} alt="Mille Services" class="h-20 w-auto object-contain" width="90" height="90" loading="eager"><h1 id="admin-login-heading" class="mt-10 text-center text-3xl font-semibold tracking-tight text-[#111a4d]"> Connectez-vous </h1></div><div class="space-y-5"><div><label for="email" class="mb-2 block text-sm font-medium text-slate-500"> Email </label><input id="email"${ssrRenderAttr("value", unref(email))} type="email" placeholder="alma.lawson@example.com" class="h-12 w-full rounded-full border border-slate-300 bg-white px-5 text-sm text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-slate-400 focus:border-[#020B51] focus:ring-2 focus:ring-[#020B51]/20" autocomplete="email" required></div><div><label for="password" class="mb-2 block text-sm font-medium text-slate-500"> Mot de passe </label><div class="relative"><input id="password"${ssrRenderDynamicModel(unref(showPassword) ? "text" : "password", unref(password), null)}${ssrRenderAttr("type", unref(showPassword) ? "text" : "password")} placeholder="********" class="h-12 w-full rounded-full border border-slate-300 bg-white px-5 pr-12 text-sm text-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none placeholder:text-slate-400 focus:border-[#020B51] focus:ring-2 focus:ring-[#020B51]/20" autocomplete="current-password" required><button type="button" class="absolute inset-y-0 right-0 inline-flex w-12 items-center justify-center text-slate-500 hover:text-[#020B51]" aria-label="Afficher ou masquer le mot de passe"><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path><circle cx="12" cy="12" r="3"></circle></svg></button></div></div></div><div class="mt-6 flex items-center justify-between gap-4 text-sm"><label class="inline-flex items-center gap-2 text-slate-500"><input${ssrIncludeBooleanAttr(Array.isArray(unref(rememberMe)) ? ssrLooseContain(unref(rememberMe), null) : unref(rememberMe)) ? " checked" : ""} type="checkbox" class="h-4 w-4 rounded border-slate-300 text-[#020B51] focus:ring-[#020B51]"><span>Se souvenir moi</span></label><a href="#" class="font-medium text-[#c58f73] transition hover:text-[#b47d61]"> Mot de passe oublié? </a></div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="mx-auto mt-10 inline-flex h-12 w-full max-w-[220px] items-center justify-center rounded-full bg-[#020B51] px-6 text-sm font-semibold text-white shadow-[0_6px_14px_rgba(2,11,81,0.22)] transition hover:bg-[#07146a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2">${ssrInterpolate(unref(isSubmitting) ? "Connexion..." : "Connexion")}</button>`);
      if (unref(errorMessage)) {
        _push(`<p class="mt-4 text-center text-sm font-medium text-red-500">${ssrInterpolate(unref(errorMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DS4HGulT.mjs.map
