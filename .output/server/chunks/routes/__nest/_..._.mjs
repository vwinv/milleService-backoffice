import { d as defineEventHandler, u as useRuntimeConfig, a as getRequestURL, p as proxyRequest } from '../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

const _____ = defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const backend = String(config.apiBackend || "http://127.0.0.1:3001").replace(
    /\/$/,
    ""
  );
  const u = getRequestURL(event);
  let path = u.pathname.replace(/^\/__nest/, "");
  if (!path || path === "") path = "/";
  const target = `${backend}${path}${u.search}`;
  return proxyRequest(event, target);
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
