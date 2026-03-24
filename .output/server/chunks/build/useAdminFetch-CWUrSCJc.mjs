import { b as useCookie, d as useRuntimeConfig } from './server.mjs';
import { computed } from 'vue';

function isUnauthorized(err) {
  const e = err;
  return e?.statusCode === 401 || e?.status === 401 || e?.response?.status === 401;
}
function shouldRedirectOn401() {
  return false;
}
function useAdminFetch() {
  const config = useRuntimeConfig();
  const token = useCookie("admin_access_token", {
    path: "/",
    sameSite: "lax"
  });
  const apiBases = computed(() => {
    const configured = config.public.apiBase || "http://[::1]:3001";
    return [
      configured,
      "http://[::1]:3001",
      "http://localhost:3001",
      "http://127.0.0.1:3001"
    ];
  });
  async function fetchAdminApi(url, options, method = "GET") {
    let lastError = null;
    const authToken = token.value || null;
    for (const base of apiBases.value) {
      try {
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
    throw lastError ?? new Error("API admin indisponible");
  }
  return { fetchAdminApi, apiBases };
}

export { useAdminFetch as u };
//# sourceMappingURL=useAdminFetch-CWUrSCJc.mjs.map
