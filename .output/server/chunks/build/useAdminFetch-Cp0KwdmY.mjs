import { b as useCookie, d as useRequestEvent, e as useRuntimeConfig } from './server.mjs';
import { a as getRequestURL } from '../nitro/nitro.mjs';
import { computed } from 'vue';

function useRequestURL(opts) {
  {
    return getRequestURL(useRequestEvent(), opts);
  }
}
function isUnauthorized(err) {
  const e = err;
  return e?.statusCode === 401 || e?.status === 401 || e?.response?.status === 401;
}
function shouldRedirectOn401() {
  return false;
}
function resolveAdminApiBases(config) {
  const configured = String(config.public.apiBase ?? "").trim();
  if (configured) {
    if (configured.startsWith("https://")) {
      return [configured];
    }
    return [
      configured,
      "http://127.0.0.1:3001",
      "http://localhost:3001",
      "http://[::1]:3001"
    ];
  }
  try {
    const u = useRequestURL();
    return [`${u.origin}/__nest`];
  } catch {
    return ["http://127.0.0.1:3000/__nest"];
  }
}
function useAdminFetch() {
  const config = useRuntimeConfig();
  const token = useCookie("admin_access_token", {
    path: "/",
    sameSite: "lax"
  });
  const apiBases = computed(() => resolveAdminApiBases(config));
  async function fetchAdminApi(url, options, method = "GET") {
    let lastError = null;
    const authToken = token.value || null;
    const bases = resolveAdminApiBases(config);
    for (const base of bases) {
      try {
        if (false) ;
        return await $fetch(url, {
          method,
          baseURL: base,
          query: options?.query,
          body: options?.body,
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : void 0
        });
      } catch (error) {
        lastError = error;
        if (isUnauthorized(error) && shouldRedirectOn401()) ;
      }
    }
    const hint = "En prod : définir NUXT_API_BACKEND (URL Nest) sur l’hébergeur du backoffice, ou NUXT_PUBLIC_API_BASE pour appels directs. Sans proxy ni URL publique, le navigateur n’atteint pas l’API.";
    throw lastError ?? new Error(`API admin indisponible. ${hint}`);
  }
  return { fetchAdminApi, apiBases };
}

export { useAdminFetch as u };
//# sourceMappingURL=useAdminFetch-Cp0KwdmY.mjs.map
