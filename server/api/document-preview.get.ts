import { Buffer } from 'node:buffer'

/**
 * Proxy d’aperçu pour les documents Cloudinary.
 * Les fichiers « raw » sont souvent en application/octet-stream : on normalise le type.
 * Réponse en Buffer + Content-Length pour un flux binaire fiable.
 */
function bufferLooksLikePdf(buf: ArrayBuffer): boolean {
  if (buf.byteLength < 4) return false
  const u8 = new Uint8Array(buf.slice(0, 5))
  const head4 = String.fromCharCode(
    u8[0]!,
    u8[1]!,
    u8[2]!,
    u8[3]!,
  )
  return head4 === '%PDF'
}

function normalizeContentTypeForPreview(
  pathname: string,
  upstreamContentType: string,
  buffer: ArrayBuffer,
): string {
  const path = pathname.split('?')[0].toLowerCase()
  const ct = (upstreamContentType || '').split(';')[0].trim().toLowerCase()

  if (path.endsWith('.pdf') || /\.pdf($|[?#/])/i.test(path)) {
    return 'application/pdf'
  }
  if (ct.includes('pdf')) {
    return upstreamContentType.split(';')[0].trim()
  }
  if (
    (ct === 'application/octet-stream' || ct === '') &&
    bufferLooksLikePdf(buffer)
  ) {
    return 'application/pdf'
  }
  if (
    ct.startsWith('image/') ||
    ct === 'application/pdf' ||
    ct === 'application/x-pdf'
  ) {
    return upstreamContentType.split(';')[0].trim()
  }
  if (path.match(/\.(jpe?g|png|gif|webp|bmp)$/)) {
    return ct || 'application/octet-stream'
  }
  return upstreamContentType.split(';')[0].trim() || 'application/octet-stream'
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const raw = typeof query.url === 'string' ? query.url.trim() : ''
  if (!raw) {
    throw createError({ statusCode: 400, statusMessage: 'Paramètre url requis' })
  }

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'URL invalide' })
  }

  const host = parsed.hostname.toLowerCase()
  if (
    host !== 'res.cloudinary.com' &&
    !host.endsWith('.res.cloudinary.com')
  ) {
    throw createError({ statusCode: 403, statusMessage: 'Hôte non autorisé' })
  }

  if (parsed.protocol !== 'https:') {
    throw createError({ statusCode: 403, statusMessage: 'HTTPS requis' })
  }

  const upstream = await fetch(raw, {
    headers: { Accept: '*/*' },
  })

  if (!upstream.ok) {
    throw createError({
      statusCode: 502,
      statusMessage: `Échec récupération document (${upstream.status})`,
    })
  }

  const buffer = await upstream.arrayBuffer()
  const upstreamCt =
    upstream.headers.get('content-type')?.split(';')[0]?.trim() ||
    'application/octet-stream'

  const contentType = normalizeContentTypeForPreview(
    parsed.pathname,
    upstreamCt,
    buffer,
  )

  const body = Buffer.from(buffer)

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Content-Length', String(body.length))
  setHeader(event, 'Content-Disposition', 'inline')
  setHeader(event, 'Cache-Control', 'private, max-age=120')
  setHeader(event, 'X-Content-Type-Options', 'nosniff')
  // Évite que la réponse binaire soit traitée comme du texte / gzip incorrect.
  setHeader(event, 'Content-Encoding', 'identity')

  return body
})
