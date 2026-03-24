import { _ as __nuxt_component_0 } from './nuxt-link-A23Gg7KZ.mjs';
import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, withCtx, createVNode, unref, createTextVNode, toValue, reactive, getCurrentInstance, onServerPrefetch, shallowRef, nextTick, toRef, provide, cloneVNode, h, createElementBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrInterpolate } from 'vue/server-renderer';
import { _ as _imports_0 } from './virtual_public-3Fh-jQka.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { _ as _export_sfc, u as useRoute, h as fetchDefaults, d as useRuntimeConfig, e as useNuxtApp, f as asyncDataDefaults, i as useRequestFetch, g as createError } from './server.mjs';
import { D as hash } from '../nitro/nitro.mjs';
import { isPlainObject } from '@vue/shared';
import { debounce } from 'perfect-debounce';
import { u as useHead } from './composables-CM5oTO8Z.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'vue-router';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _imports_1 = publicAssetsURL("/images/app.png");
const _imports_2 = publicAssetsURL("/images/prestataire.png");
const _imports_3 = publicAssetsURL("/images/app1.png");
const clientOnlySymbol = /* @__PURE__ */ Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
function useAsyncData(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (_isAutoKeyNeeded(args[0], args[1])) {
    args.unshift(autoKey);
  }
  let [_key, _handler, options = {}] = args;
  const key = computed(() => toValue(_key));
  if (typeof key.value !== "string") {
    throw new TypeError("[nuxt] [useAsyncData] key must be a string.");
  }
  if (typeof _handler !== "function") {
    throw new TypeError("[nuxt] [useAsyncData] handler must be a function.");
  }
  const nuxtApp = useNuxtApp();
  options.server ??= true;
  options.default ??= getDefault;
  options.getCachedData ??= getDefaultCachedData;
  options.lazy ??= false;
  options.immediate ??= true;
  options.deep ??= asyncDataDefaults.deep;
  options.dedupe ??= "cancel";
  options._functionName || "useAsyncData";
  nuxtApp._asyncData[key.value];
  function createInitialFetch() {
    const initialFetchOptions = { cause: "initial", dedupe: options.dedupe };
    if (!nuxtApp._asyncData[key.value]?._init) {
      initialFetchOptions.cachedData = options.getCachedData(key.value, nuxtApp, { cause: "initial" });
      nuxtApp._asyncData[key.value] = createAsyncData(nuxtApp, key.value, _handler, options, initialFetchOptions.cachedData);
    }
    return () => nuxtApp._asyncData[key.value].execute(initialFetchOptions);
  }
  const initialFetch = createInitialFetch();
  const asyncData = nuxtApp._asyncData[key.value];
  asyncData._deps++;
  const fetchOnServer = options.server !== false && nuxtApp.payload.serverRendered;
  if (fetchOnServer && options.immediate) {
    const promise = initialFetch();
    if (getCurrentInstance()) {
      onServerPrefetch(() => promise);
    } else {
      nuxtApp.hook("app:created", async () => {
        await promise;
      });
    }
  }
  const asyncReturn = {
    data: writableComputedRef(() => nuxtApp._asyncData[key.value]?.data),
    pending: writableComputedRef(() => nuxtApp._asyncData[key.value]?.pending),
    status: writableComputedRef(() => nuxtApp._asyncData[key.value]?.status),
    error: writableComputedRef(() => nuxtApp._asyncData[key.value]?.error),
    refresh: (...args2) => {
      if (!nuxtApp._asyncData[key.value]?._init) {
        const initialFetch2 = createInitialFetch();
        return initialFetch2();
      }
      return nuxtApp._asyncData[key.value].execute(...args2);
    },
    execute: (...args2) => asyncReturn.refresh(...args2),
    clear: () => {
      const entry = nuxtApp._asyncData[key.value];
      if (entry?._abortController) {
        try {
          entry._abortController.abort(new DOMException("AsyncData aborted by user.", "AbortError"));
        } finally {
          entry._abortController = void 0;
        }
      }
      clearNuxtDataByKey(nuxtApp, key.value);
    }
  };
  const asyncDataPromise = Promise.resolve(nuxtApp._asyncDataPromises[key.value]).then(() => asyncReturn);
  Object.assign(asyncDataPromise, asyncReturn);
  return asyncDataPromise;
}
function writableComputedRef(getter) {
  return computed({
    get() {
      return getter()?.value;
    },
    set(value) {
      const ref2 = getter();
      if (ref2) {
        ref2.value = value;
      }
    }
  });
}
function _isAutoKeyNeeded(keyOrFetcher, fetcher) {
  if (typeof keyOrFetcher === "string") {
    return false;
  }
  if (typeof keyOrFetcher === "object" && keyOrFetcher !== null) {
    return false;
  }
  if (typeof keyOrFetcher === "function" && typeof fetcher === "function") {
    return false;
  }
  return true;
}
function clearNuxtDataByKey(nuxtApp, key) {
  if (key in nuxtApp.payload.data) {
    nuxtApp.payload.data[key] = void 0;
  }
  if (key in nuxtApp.payload._errors) {
    nuxtApp.payload._errors[key] = void 0;
  }
  if (nuxtApp._asyncData[key]) {
    nuxtApp._asyncData[key].data.value = unref(nuxtApp._asyncData[key]._default());
    nuxtApp._asyncData[key].error.value = void 0;
    nuxtApp._asyncData[key].status.value = "idle";
  }
  if (key in nuxtApp._asyncDataPromises) {
    nuxtApp._asyncDataPromises[key] = void 0;
  }
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
function createAsyncData(nuxtApp, key, _handler, options, initialCachedData) {
  nuxtApp.payload._errors[key] ??= void 0;
  const hasCustomGetCachedData = options.getCachedData !== getDefaultCachedData;
  const handler = _handler ;
  const _ref = options.deep ? ref : shallowRef;
  const hasCachedData = initialCachedData !== void 0;
  const unsubRefreshAsyncData = nuxtApp.hook("app:data:refresh", async (keys) => {
    if (!keys || keys.includes(key)) {
      await asyncData.execute({ cause: "refresh:hook" });
    }
  });
  const asyncData = {
    data: _ref(hasCachedData ? initialCachedData : options.default()),
    pending: computed(() => asyncData.status.value === "pending"),
    error: toRef(nuxtApp.payload._errors, key),
    status: shallowRef("idle"),
    execute: (...args) => {
      const [_opts, newValue = void 0] = args;
      const opts = _opts && newValue === void 0 && typeof _opts === "object" ? _opts : {};
      if (nuxtApp._asyncDataPromises[key]) {
        if ((opts.dedupe ?? options.dedupe) === "defer") {
          return nuxtApp._asyncDataPromises[key];
        }
      }
      {
        const cachedData = "cachedData" in opts ? opts.cachedData : options.getCachedData(key, nuxtApp, { cause: opts.cause ?? "refresh:manual" });
        if (cachedData !== void 0) {
          nuxtApp.payload.data[key] = asyncData.data.value = cachedData;
          asyncData.error.value = void 0;
          asyncData.status.value = "success";
          return Promise.resolve(cachedData);
        }
      }
      if (asyncData._abortController) {
        asyncData._abortController.abort(new DOMException("AsyncData request cancelled by deduplication", "AbortError"));
      }
      asyncData._abortController = new AbortController();
      asyncData.status.value = "pending";
      const cleanupController = new AbortController();
      const promise = new Promise(
        (resolve, reject) => {
          try {
            const timeout = opts.timeout ?? options.timeout;
            const mergedSignal = mergeAbortSignals([asyncData._abortController?.signal, opts?.signal], cleanupController.signal, timeout);
            if (mergedSignal.aborted) {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
              return;
            }
            mergedSignal.addEventListener("abort", () => {
              const reason = mergedSignal.reason;
              reject(reason instanceof Error ? reason : new DOMException(String(reason ?? "Aborted"), "AbortError"));
            }, { once: true, signal: cleanupController.signal });
            return Promise.resolve(handler(nuxtApp, { signal: mergedSignal })).then(resolve, reject);
          } catch (err) {
            reject(err);
          }
        }
      ).then(async (_result) => {
        let result = _result;
        if (options.transform) {
          result = await options.transform(_result);
        }
        if (options.pick) {
          result = pick(result, options.pick);
        }
        nuxtApp.payload.data[key] = result;
        asyncData.data.value = result;
        asyncData.error.value = void 0;
        asyncData.status.value = "success";
      }).catch((error) => {
        if (nuxtApp._asyncDataPromises[key] && nuxtApp._asyncDataPromises[key] !== promise) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (asyncData._abortController?.signal.aborted) {
          return nuxtApp._asyncDataPromises[key];
        }
        if (typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "AbortError") {
          asyncData.status.value = "idle";
          return nuxtApp._asyncDataPromises[key];
        }
        asyncData.error.value = createError(error);
        asyncData.data.value = unref(options.default());
        asyncData.status.value = "error";
      }).finally(() => {
        cleanupController.abort();
        delete nuxtApp._asyncDataPromises[key];
      });
      nuxtApp._asyncDataPromises[key] = promise;
      return nuxtApp._asyncDataPromises[key];
    },
    _execute: debounce((...args) => asyncData.execute(...args), 0, { leading: true }),
    _default: options.default,
    _deps: 0,
    _init: true,
    _hash: void 0,
    _off: () => {
      unsubRefreshAsyncData();
      if (nuxtApp._asyncData[key]?._init) {
        nuxtApp._asyncData[key]._init = false;
      }
      if (!hasCustomGetCachedData) {
        nextTick(() => {
          if (!nuxtApp._asyncData[key]?._init) {
            clearNuxtDataByKey(nuxtApp, key);
            asyncData.execute = () => Promise.resolve();
          }
        });
      }
    }
  };
  return asyncData;
}
const getDefault = () => void 0;
const getDefaultCachedData = (key, nuxtApp, ctx) => {
  if (nuxtApp.isHydrating) {
    return nuxtApp.payload.data[key];
  }
  if (ctx.cause !== "refresh:manual" && ctx.cause !== "refresh:hook") {
    return nuxtApp.static.data[key];
  }
};
function mergeAbortSignals(signals, cleanupSignal, timeout) {
  const list = signals.filter((s) => !!s);
  if (typeof timeout === "number" && timeout >= 0) {
    const timeoutSignal = AbortSignal.timeout?.(timeout);
    if (timeoutSignal) {
      list.push(timeoutSignal);
    }
  }
  if (AbortSignal.any) {
    return AbortSignal.any(list);
  }
  const controller = new AbortController();
  for (const sig of list) {
    if (sig.aborted) {
      const reason = sig.reason ?? new DOMException("Aborted", "AbortError");
      try {
        controller.abort(reason);
      } catch {
        controller.abort();
      }
      return controller.signal;
    }
  }
  const onAbort = () => {
    const abortedSignal = list.find((s) => s.aborted);
    const reason = abortedSignal?.reason ?? new DOMException("Aborted", "AbortError");
    try {
      controller.abort(reason);
    } catch {
      controller.abort();
    }
  };
  for (const sig of list) {
    sig.addEventListener?.("abort", onAbort, { once: true, signal: cleanupSignal });
  }
  return controller.signal;
}
function useFetch(request, arg1, arg2) {
  const [opts = {}, autoKey] = typeof arg1 === "string" ? [{}, arg1] : [arg1, arg2];
  const _request = computed(() => toValue(request));
  const key = computed(() => toValue(opts.key) || "$f" + hash([autoKey, typeof _request.value === "string" ? _request.value : "", ...generateOptionSegments(opts)]));
  if (!opts.baseURL && typeof _request.value === "string" && (_request.value[0] === "/" && _request.value[1] === "/")) {
    throw new Error('[nuxt] [useFetch] the request URL must not start with "//".');
  }
  const {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    watch: watchSources,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    ...fetchOptions
  } = opts;
  const _fetchOptions = reactive({
    ...fetchDefaults,
    ...fetchOptions,
    cache: typeof opts.cache === "boolean" ? void 0 : opts.cache
  });
  const _asyncDataOptions = {
    server,
    lazy,
    default: defaultFn,
    transform,
    pick: pick2,
    immediate,
    getCachedData,
    deep,
    dedupe,
    timeout,
    watch: watchSources === false ? [] : [...watchSources || [], _fetchOptions]
  };
  const asyncData = useAsyncData(watchSources === false ? key.value : key, (_, { signal }) => {
    let _$fetch = opts.$fetch || globalThis.$fetch;
    if (!opts.$fetch) {
      const isLocalFetch = typeof _request.value === "string" && _request.value[0] === "/" && (!toValue(opts.baseURL) || toValue(opts.baseURL)[0] === "/");
      if (isLocalFetch) {
        _$fetch = useRequestFetch();
      }
    }
    return _$fetch(_request.value, { signal, ..._fetchOptions });
  }, _asyncDataOptions);
  return asyncData;
}
function generateOptionSegments(opts) {
  const segments = [
    toValue(opts.method)?.toUpperCase() || "GET",
    toValue(opts.baseURL)
  ];
  for (const _obj of [opts.query || opts.params]) {
    const obj = toValue(_obj);
    if (!obj) {
      continue;
    }
    const unwrapped = {};
    for (const [key, value] of Object.entries(obj)) {
      unwrapped[toValue(key)] = toValue(value);
    }
    segments.push(unwrapped);
  }
  if (opts.body) {
    const value = toValue(opts.body);
    if (!value) {
      segments.push(hash(value));
    } else if (value instanceof ArrayBuffer) {
      segments.push(hash(Object.fromEntries([...new Uint8Array(value).entries()].map(([k, v]) => [k, v.toString()]))));
    } else if (value instanceof FormData) {
      const obj = {};
      for (const entry of value.entries()) {
        const [key, val] = entry;
        obj[key] = val instanceof File ? val.name : val;
      }
      segments.push(hash(obj));
    } else if (isPlainObject(value)) {
      segments.push(hash(reactive(value)));
    } else {
      try {
        segments.push(hash(value));
      } catch {
        console.warn("[useFetch] Failed to hash body", value);
      }
    }
  }
  return segments;
}
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const config = useRuntimeConfig();
    const faqItems = [
      {
        id: "prestataire",
        question: "Comment devenir prestataire Mille Services ?",
        answer: "Rejoignez Mille Services et développez votre activité en accédant à de nouveaux clients près de chez vous. Inscrivez-vous simplement sur la plateforme, complétez votre profil et mettez en avant vos compétences. Une fois validé, vous pourrez recevoir des demandes, entrer en contact avec des clients et proposer vos services en toute simplicité."
      },
      {
        id: "demande",
        question: "Comment demander un Mille Services ?",
        answer: "Faites votre demande en quelques clics en décrivant simplement votre besoin. Indiquez le type de service recherché et votre localisation, puis recevez rapidement des propositions de prestataires qualifiés. Il ne vous reste plus qu’à choisir le professionnel qui vous convient et bénéficier d’un service fiable et adapté à vos attentes."
      },
      {
        id: "paiement",
        question: "Pourquoi Mille Services ?",
        answer: "Mille Services vous offre une solution simple, rapide et fiable pour trouver des prestataires de qualité près de chez vous. En centralisant différents services sur une seule plateforme, nous vous faisons gagner du temps et vous permettons d’accéder facilement à des professionnels compétents.\nNotre objectif est de vous garantir une expérience fluide et sécurisée, tout en valorisant les prestataires locaux. Avec Mille Services, vous avez l’assurance de trouver le bon service, au bon moment, en toute confiance."
      },
      {
        id: "avis",
        question: "Peut-on avoir un profile client et un profil prestataire ?",
        answer: "Oui, il est tout à fait possible de disposer à la fois d’un profil client et d’un profil prestataire sur Mille Services. Vous pouvez ainsi rechercher des services pour vos besoins personnels tout en proposant vos propres compétences aux autres utilisateurs.\n\nCette flexibilité vous permet de tirer pleinement parti de la plateforme, en vous offrant une expérience complète et adaptée à vos différentes activités."
      },
      {
        id: "gratuit",
        question: "24H/7 Besoins d’aide ?",
        answer: "Besoin d’aide à tout moment ? Mille Services est disponible 24h/24 et 7j/7 pour vous accompagner. Trouvez rapidement un prestataire qualifié et obtenez une solution adaptée, quand vous en avez besoin, en toute simplicité."
      }
    ];
    const openFaqIndex = ref(null);
    ref(null);
    const faqSectionVisible = ref(false);
    const { data: avisRaw, pending: avisPending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/prestataires/public/avis",
      {
        baseURL: config.public.apiBase || "http://localhost:3000",
        default: () => [],
        transform: (res) => {
          if (Array.isArray(res)) return res;
          if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
            return res.data;
          }
          return [];
        }
      },
      "$7KNHqtcCfq"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const avisList = computed(() => avisRaw.value ?? []);
    const carouselOffset = ref(0);
    let avisCarouselTimer = null;
    const carouselSlots = computed(() => {
      const list = avisList.value;
      if (list.length < 3) return [];
      const o = carouselOffset.value % list.length;
      return [
        list[o],
        list[(o + 1) % list.length],
        list[(o + 2) % list.length]
      ];
    });
    const carouselPageCount = computed(
      () => avisList.value.length >= 3 ? avisList.value.length : 0
    );
    watch(
      () => avisList.value.length,
      (len) => {
        if (avisCarouselTimer) {
          clearInterval(avisCarouselTimer);
          avisCarouselTimer = null;
        }
        if (len >= 3) {
          avisCarouselTimer = setInterval();
        }
      },
      { immediate: true }
    );
    function initials(name) {
      const parts = name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.slice(0, 2).toUpperCase() || "?";
    }
    function avatarSrc(url) {
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      const base = config.public.apiBase || "";
      return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
    }
    const heroSlides = ["/images/headerAccueil1.png", "/images/headerAccueil2.png"];
    const currentHeroSlide = ref(0);
    ref(null);
    const heroSectionVisible = ref(false);
    ref(null);
    const appSectionVisible = ref(false);
    ref(null);
    const prestataireSectionVisible = ref(false);
    ref(null);
    const app1SectionVisible = ref(false);
    const isHomeActive = computed(
      () => route.path === "/" && route.hash !== "#explorer"
    );
    const isExplorerActive = computed(() => route.hash === "#explorer");
    function navLinkClass(active) {
      return [
        "transition-colors",
        active ? "font-semibold text-[#020B51]" : "text-[#727272] hover:text-[#020B51]"
      ];
    }
    useHead({
      title: "Mille Services — Accueil",
      meta: [
        {
          name: "description",
          content: "Plateforme de mise en relation entre particuliers et prestataires de services."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white text-slate-900" }, _attrs))} data-v-50968b2e><header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur" data-v-50968b2e><div class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8" data-v-50968b2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex shrink-0 items-center",
        "aria-label": "Mille Services — Accueil"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Mille Services" class="h-11 w-auto max-h-14 object-contain object-left sm:h-12 md:h-14" width="200" height="50" loading="eager" data-v-50968b2e${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Mille Services",
                class: "h-11 w-auto max-h-14 object-contain object-left sm:h-12 md:h-14",
                width: "200",
                height: "50",
                loading: "eager"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex min-w-0 flex-wrap items-center justify-end gap-4 sm:gap-8 lg:gap-10" data-v-50968b2e><nav class="flex items-center gap-5 text-sm font-medium sm:gap-8 sm:text-base" aria-label="Navigation principale" data-v-50968b2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: navLinkClass(unref(isHomeActive))
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
        to: "/#explorer",
        class: navLinkClass(unref(isExplorerActive))
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Explorer `);
          } else {
            return [
              createTextVNode(" Explorer ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><a href="#" class="inline-flex items-center justify-center rounded-full bg-[#020B51] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#031a6b] sm:px-5 sm:text-sm md:text-base" data-v-50968b2e> Télécharger l’application </a></div></div></header><div class="${ssrRenderClass([{ "hero-block--visible": unref(heroSectionVisible) }, "hero-block"])}" data-v-50968b2e><section id="home" class="hero-section relative min-h-[min(85vh,680px)] overflow-hidden sm:min-h-[min(90vh,800px)]" data-v-50968b2e><div class="pointer-events-none absolute inset-0" aria-hidden="true" data-v-50968b2e><!--[-->`);
      ssrRenderList(heroSlides, (src, i) => {
        _push(`<div class="${ssrRenderClass([unref(currentHeroSlide) === i ? "z-[1] opacity-100" : "z-0 opacity-0", "absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ease-in-out"])}" style="${ssrRenderStyle({ backgroundImage: `url('${src}')` })}" data-v-50968b2e></div>`);
      });
      _push(`<!--]--></div><div class="hero-gradient absolute inset-0 z-[2]" style="${ssrRenderStyle({ "background": "linear-gradient(\n            to right,\n            rgba(2, 11, 81, 0.63) 0%,\n            rgba(2, 11, 81, 0.63) 50%,\n            #31294B 100%,\n            #31294B 100%,\n            #31294B 100%\n          )" })}" aria-hidden="true" data-v-50968b2e></div><div class="relative z-20 mx-auto flex min-h-[min(85vh,680px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-8 text-left sm:min-h-[min(90vh,800px)] sm:px-6 sm:pb-24 sm:pt-12 lg:px-8" data-v-50968b2e><h1 class="hero-title text-4xl font-bold tracking-tight text-white sm:text-5xl" data-v-50968b2e> Votre conciergerie<br data-v-50968b2e>Numérique </h1><p class="hero-lead mt-6 max-w-xl text-lg text-white/85" data-v-50968b2e> Une solution digitale pensée pour simplifier votre quotidien en vous connectant rapidement aux bons prestataires. Notre conciergerie numérique vous accompagne dans la gestion de vos besoins en services, avec efficacité, fiabilité et simplicité. </p></div></section><div class="hero-dots flex justify-center border-b border-slate-100 bg-white px-4 py-4 sm:py-5" data-v-50968b2e><div class="flex items-center gap-2.5" role="tablist" aria-label="Diaporama du bandeau" data-v-50968b2e><!--[-->`);
      ssrRenderList(heroSlides, (_, i) => {
        _push(`<button type="button" class="${ssrRenderClass([
          unref(currentHeroSlide) === i ? "h-2.5 w-2.5 bg-[#020B51]" : "h-2.5 w-2.5 bg-slate-200 hover:bg-slate-300",
          "rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51]/35 focus-visible:ring-offset-2"
        ])}"${ssrRenderAttr("aria-current", unref(currentHeroSlide) === i ? "true" : void 0)}${ssrRenderAttr("aria-label", `Slide ${i + 1} sur ${heroSlides.length}${unref(currentHeroSlide) === i ? " (affichée)" : ""}`)} data-v-50968b2e></button>`);
      });
      _push(`<!--]--></div></div></div><div class="${ssrRenderClass([{ "app-section-block--visible": unref(appSectionVisible) }, "app-section-block"])}" data-v-50968b2e><section class="border-b border-slate-100 bg-white px-4 py-12 sm:py-16" aria-labelledby="app-download-heading" data-v-50968b2e><div class="mx-auto flex max-w-6xl flex-col items-center text-center" data-v-50968b2e><h2 id="app-download-heading" class="sr-only" data-v-50968b2e> Télécharger l’application Mille Services </h2><img${ssrRenderAttr("src", _imports_1)} alt="Aperçu de l’application Mille Services" class="app-mockup-reveal mx-auto h-auto w-full max-w-3xl object-contain sm:max-w-4xl lg:max-w-5xl" width="1024" height="1024" loading="lazy" decoding="async" data-v-50968b2e><div class="app-section-cta mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4" data-v-50968b2e><a href="#" class="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#031a6b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[220px]" data-v-50968b2e> Télécharger sur l’App Store </a><a href="#" class="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-[#020B51] bg-white px-6 py-3 text-sm font-semibold text-[#020B51] transition hover:bg-[#020B51]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51]/40 focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[220px]" data-v-50968b2e> Télécharger sur le Play Store </a></div></div></section></div><div class="${ssrRenderClass([{ "prestataire-section-block--visible": unref(prestataireSectionVisible) }, "prestataire-section-block"])}" data-v-50968b2e><section class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20" aria-labelledby="prestataires-heading" data-v-50968b2e><div class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16" data-v-50968b2e><div class="prestataire-anim-left relative mx-auto flex w-full max-w-lg justify-center lg:mx-0 lg:justify-start" data-v-50968b2e><div class="flex w-full max-w-md justify-center lg:justify-start" data-v-50968b2e><img${ssrRenderAttr("src", _imports_2)} alt="Prestataires Mille Services à proximité" class="prestataire-img-spin h-auto w-full object-contain drop-shadow-lg" width="400" height="400" loading="lazy" decoding="async" data-v-50968b2e></div></div><div class="prestataire-anim-right text-left" data-v-50968b2e><h2 id="prestataires-heading" class="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[1.75rem] xl:text-4xl" data-v-50968b2e> Mille Services, c’est avoir accès aux prestataires proches de chez vous ! </h2><div class="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg" data-v-50968b2e><p data-v-50968b2e> Mille Services vous permet d’accéder facilement à des prestataires qualifiés, proches de chez vous. Que vous ayez besoin d’un plombier, d’un carreleur, d’un électricien ou d’un autre professionnel, la plateforme vous aide à trouver rapidement la bonne personne pour répondre à vos besoins. </p><p class="text-sm leading-relaxed text-slate-600 sm:text-base" data-v-50968b2e> Grâce à une expérience simple et intuitive, vous pouvez rechercher, comparer et entrer en contact avec des prestataires fiables en toute sérénité. Mille Services a pour objectif de faciliter votre quotidien en vous offrant un accès rapide à des services de proximité, tout en valorisant le savoir-faire des professionnels locaux. </p></div></div></div></section></div><div class="${ssrRenderClass([{ "app1-section-block--visible": unref(app1SectionVisible) }, "app1-section-block"])}" data-v-50968b2e><section class="border-b border-slate-100 bg-white px-4 py-12 sm:py-16" aria-label="Application Mille Services" data-v-50968b2e><div class="app1-bounce-wrap mx-auto flex max-w-6xl justify-center" data-v-50968b2e><img${ssrRenderAttr("src", _imports_3)} alt="Application Mille Services" class="app1-bounce h-auto w-full max-w-xl object-contain sm:max-w-2xl lg:max-w-3xl" width="768" height="768" loading="lazy" decoding="async" data-v-50968b2e></div></section></div><section id="avis-clients" class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20" aria-labelledby="avis-clients-heading" data-v-50968b2e><div class="mx-auto max-w-6xl" data-v-50968b2e><h2 id="avis-clients-heading" class="text-center text-2xl font-bold text-slate-900 sm:text-3xl" data-v-50968b2e> Avis clients </h2><p class="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-slate-600 sm:text-lg" data-v-50968b2e> Découvrez ce que nos utilisateurs pensent de Mille Services. Leurs retours nous aident chaque jour à améliorer la plateforme et à renforcer la confiance entre particuliers et prestataires de proximité. </p>`);
      if (unref(avisPending)) {
        _push(`<div class="mt-12 flex justify-center py-12 text-slate-500" data-v-50968b2e> Chargement des avis… </div>`);
      } else if (!unref(avisList).length) {
        _push(`<div class="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 py-12 text-center text-slate-600" data-v-50968b2e> Aucun avis pour le moment. Les avis laissés par les clients apparaîtront ici. </div>`);
      } else {
        _push(`<div class="relative mt-12" data-v-50968b2e>`);
        if (unref(avisList).length < 3) {
          _push(`<div class="${ssrRenderClass([unref(avisList).length === 1 ? "sm:grid-cols-1 sm:justify-items-center" : "", "mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"])}" data-v-50968b2e><!--[-->`);
          ssrRenderList(unref(avisList), (slot, idx) => {
            _push(`<article class="${ssrRenderClass([
              unref(avisList).length === 1 || idx === 1 ? "border-2 border-[#020B51] bg-[#020B51] text-white" : "border border-slate-200 bg-white text-slate-900",
              "flex min-h-[220px] w-full max-w-lg flex-col rounded-2xl p-5 shadow-sm sm:min-h-[260px]"
            ])}" data-v-50968b2e><div class="flex items-start gap-3" data-v-50968b2e><div class="${ssrRenderClass([
              unref(avisList).length === 1 || idx === 1 ? "border-white/40" : "border-slate-200",
              "relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"
            ])}" data-v-50968b2e>`);
            if (slot.avatarUrl) {
              _push(`<img${ssrRenderAttr("src", avatarSrc(slot.avatarUrl))} alt="" class="h-full w-full object-cover" loading="lazy" data-v-50968b2e>`);
            } else {
              _push(`<div class="${ssrRenderClass([
                unref(avisList).length === 1 || idx === 1 ? "bg-white/20 text-white" : "bg-slate-100 text-[#020B51]",
                "flex h-full w-full items-center justify-center text-sm font-semibold"
              ])}" data-v-50968b2e>${ssrInterpolate(initials(slot.nomClient))}</div>`);
            }
            _push(`</div><div class="min-w-0 flex-1" data-v-50968b2e><p class="${ssrRenderClass([
              unref(avisList).length === 1 || idx === 1 ? "text-white" : "text-slate-900",
              "font-semibold leading-tight"
            ])}" data-v-50968b2e>${ssrInterpolate(slot.nomClient)}</p><p class="${ssrRenderClass([
              unref(avisList).length === 1 || idx === 1 ? "text-white/70" : "text-slate-500",
              "mt-0.5 text-xs font-medium uppercase tracking-wide"
            ])}" data-v-50968b2e> Client </p></div></div><p class="${ssrRenderClass([
              unref(avisList).length === 1 || idx === 1 ? "text-white/90" : "text-slate-600",
              "mt-4 flex-1 text-sm leading-relaxed"
            ])}" data-v-50968b2e>${ssrInterpolate(slot.commentaire || "—")}</p><div class="${ssrRenderClass([unref(avisList).length === 1 || idx === 1 ? "text-amber-300" : "", "mt-4 flex gap-0.5 text-amber-400"])}" aria-label="Note sur 5" data-v-50968b2e><!--[-->`);
            ssrRenderList(5, (star) => {
              _push(`<span class="text-lg leading-none" data-v-50968b2e>${ssrInterpolate(star <= slot.note ? "★" : "☆")}</span>`);
            });
            _push(`<!--]--></div></article>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!--[--><div class="overflow-hidden pb-2" data-v-50968b2e><div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5" data-v-50968b2e><!--[-->`);
          ssrRenderList(unref(carouselSlots), (slot, idx) => {
            _push(`<article class="${ssrRenderClass([
              idx === 1 ? "border-2 border-[#020B51] bg-[#020B51] text-white" : "border border-slate-200 bg-white text-slate-900",
              "flex min-h-[220px] flex-col rounded-2xl p-5 shadow-sm transition-colors md:min-h-[260px]"
            ])}" data-v-50968b2e>`);
            if (slot) {
              _push(`<!--[--><div class="flex items-start gap-3" data-v-50968b2e><div class="${ssrRenderClass([idx === 1 ? "border-white/40" : "border-slate-200", "relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"])}" data-v-50968b2e>`);
              if (slot.avatarUrl) {
                _push(`<img${ssrRenderAttr("src", avatarSrc(slot.avatarUrl))} alt="" class="h-full w-full object-cover" loading="lazy" data-v-50968b2e>`);
              } else {
                _push(`<div class="${ssrRenderClass([
                  idx === 1 ? "bg-white/20 text-white" : "bg-slate-100 text-[#020B51]",
                  "flex h-full w-full items-center justify-center text-sm font-semibold"
                ])}" data-v-50968b2e>${ssrInterpolate(initials(slot.nomClient))}</div>`);
              }
              _push(`</div><div class="min-w-0 flex-1" data-v-50968b2e><p class="${ssrRenderClass([idx === 1 ? "text-white" : "text-slate-900", "font-semibold leading-tight"])}" data-v-50968b2e>${ssrInterpolate(slot.nomClient)}</p><p class="${ssrRenderClass([idx === 1 ? "text-white/70" : "text-slate-500", "mt-0.5 text-xs font-medium uppercase tracking-wide"])}" data-v-50968b2e> Client </p></div></div><p class="${ssrRenderClass([idx === 1 ? "text-white/90" : "text-slate-600", "mt-4 flex-1 text-sm leading-relaxed"])}" data-v-50968b2e>${ssrInterpolate(slot.commentaire || "—")}</p><div class="${ssrRenderClass([idx === 1 ? "text-amber-300" : "", "mt-4 flex gap-0.5 text-amber-400"])}" aria-label="Note sur 5" data-v-50968b2e><!--[-->`);
              ssrRenderList(5, (star) => {
                _push(`<span class="text-lg leading-none" data-v-50968b2e>${ssrInterpolate(star <= slot.note ? "★" : "☆")}</span>`);
              });
              _push(`<!--]--></div><!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</article>`);
          });
          _push(`<!--]--></div></div><div class="mt-8 flex justify-center gap-2" role="tablist" aria-label="Navigation du carrousel d’avis" data-v-50968b2e><!--[-->`);
          ssrRenderList(unref(carouselPageCount), (page) => {
            _push(`<button type="button" class="${ssrRenderClass([
              unref(carouselOffset) === page - 1 ? "bg-[#020B51]" : "bg-slate-200 hover:bg-slate-300",
              "h-2.5 w-2.5 rounded-full transition-colors"
            ])}"${ssrRenderAttr("aria-selected", unref(carouselOffset) === page - 1)}${ssrRenderAttr("aria-label", `Groupe d’avis ${page}`)} data-v-50968b2e></button>`);
          });
          _push(`<!--]--></div><!--]-->`);
        }
        _push(`</div>`);
      }
      _push(`</div></section><section id="faq" class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20" aria-labelledby="faq-heading" data-v-50968b2e><div class="mx-auto w-full max-w-5xl lg:max-w-6xl" data-v-50968b2e><h2 id="faq-heading" class="text-center text-2xl font-bold text-slate-900 sm:text-3xl" data-v-50968b2e> Les questions les plus fréquentes (FAQ) </h2><p class="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg" data-v-50968b2e> Retrouvez ici les réponses aux interrogations les plus courantes sur Mille Services : inscription, recherche de prestataires, sécurité et utilisation de l’application. </p><div class="${ssrRenderClass([{ "faq-accordion-list--animate": unref(faqSectionVisible) }, "faq-accordion-list mt-10 space-y-3"])}" data-v-50968b2e><!--[-->`);
      ssrRenderList(faqItems, (item, i) => {
        _push(`<div style="${ssrRenderStyle({ "--faq-stagger": `${i * 0.1}s` })}" class="${ssrRenderClass([
          unref(openFaqIndex) === i ? "border-[#020B51] bg-[#020B51] text-white shadow-md" : "border-slate-200 bg-white text-slate-900 shadow-sm",
          "faq-accordion-item overflow-hidden rounded-xl border transition-colors duration-200"
        ])}" data-v-50968b2e><button type="button" class="${ssrRenderClass([
          unref(openFaqIndex) === i ? "text-white" : "text-slate-900 hover:bg-slate-50/80",
          "flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2 sm:px-6 sm:py-5 sm:text-lg"
        ])}"${ssrRenderAttr("aria-expanded", unref(openFaqIndex) === i)}${ssrRenderAttr("aria-controls", `faq-panel-${item.id}`)}${ssrRenderAttr("id", `faq-trigger-${item.id}`)} data-v-50968b2e><span data-v-50968b2e>${ssrInterpolate(item.question)}</span><span class="${ssrRenderClass([
          unref(openFaqIndex) === i ? "rotate-180 bg-white/15 text-white" : "bg-slate-100 text-[#020B51]",
          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200"
        ])}" aria-hidden="true" data-v-50968b2e><svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" data-v-50968b2e><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" data-v-50968b2e></path></svg></span></button><div${ssrRenderAttr("id", `faq-panel-${item.id}`)} role="region"${ssrRenderAttr("aria-labelledby", `faq-trigger-${item.id}`)} class="border-t border-white/20 px-5 pb-5 pt-0 text-sm leading-relaxed text-white/95 sm:px-6" style="${ssrRenderStyle(unref(openFaqIndex) === i ? null : { display: "none" })}" data-v-50968b2e><p class="pt-1" data-v-50968b2e>${ssrInterpolate(item.answer)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></section><footer class="bg-[#050a44] text-white" aria-label="Pied de page" data-v-50968b2e><div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16" data-v-50968b2e><div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12" data-v-50968b2e><div class="flex flex-col items-start" data-v-50968b2e><div class="inline-flex flex-col items-center rounded-lg bg-white p-4 shadow-md sm:p-5" data-v-50968b2e><div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 sm:h-28 sm:w-28" data-v-50968b2e><img${ssrRenderAttr("src", _imports_0)} alt="Mille Services" class="h-full w-full object-contain p-2" width="112" height="112" loading="lazy" data-v-50968b2e></div><p class="mt-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-[#020B51] sm:text-xs" data-v-50968b2e> Mille Services </p></div></div><div class="text-left text-sm leading-relaxed text-white/90" data-v-50968b2e><p data-v-50968b2e> Mille Services met en relation particuliers et prestataires de services de proximité. Notre plateforme vous aide à trouver rapidement le bon professionnel pour vos besoins du quotidien, en toute confiance et simplicité. </p></div><div class="text-left text-sm" data-v-50968b2e><h3 class="text-base font-bold text-white" data-v-50968b2e>Adresse</h3><p class="mt-3 leading-relaxed text-white/85" data-v-50968b2e> Jln. Galau terus no 23.<br data-v-50968b2e> Jakarta Selatan </p><h3 class="mt-8 text-base font-bold text-white" data-v-50968b2e>Suivez-nous</h3><div class="mt-4 flex flex-wrap items-center gap-4" aria-label="Réseaux sociaux" data-v-50968b2e><a href="#" class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded" aria-label="Instagram" data-v-50968b2e><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-50968b2e><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" data-v-50968b2e></path></svg></a><a href="#" class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded" aria-label="LinkedIn" data-v-50968b2e><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-50968b2e><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" data-v-50968b2e></path></svg></a><a href="#" class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded" aria-label="Facebook" data-v-50968b2e><svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-50968b2e><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" data-v-50968b2e></path></svg></a><a href="#" class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded" aria-label="X (Twitter)" data-v-50968b2e><svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" data-v-50968b2e><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" data-v-50968b2e></path></svg></a></div></div><div class="text-left text-sm" data-v-50968b2e><h3 class="text-base font-bold text-white" data-v-50968b2e>Infos</h3><ul class="mt-4 space-y-3" data-v-50968b2e><li data-v-50968b2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/#faq",
        class: "text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` FAQ `);
          } else {
            return [
              createTextVNode(" FAQ ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-50968b2e><a href="#" class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline" data-v-50968b2e> Aide </a></li><li data-v-50968b2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy-policy",
        class: "text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Politique de confidentialité `);
          } else {
            return [
              createTextVNode(" Politique de confidentialité ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-50968b2e><a href="#" class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline" data-v-50968b2e> Conditions générales </a></li><li data-v-50968b2e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin",
        class: "text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Administration `);
          } else {
            return [
              createTextVNode(" Administration ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div><div class="mt-12 border-t border-white/15 pt-8 text-center text-xs text-white/55" data-v-50968b2e> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Mille Services </div></div></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-50968b2e"]]);

export { index as default };
//# sourceMappingURL=index-D8B37GIB.mjs.map
