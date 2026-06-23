import fs from 'node:fs'
import path from 'node:path'

const outDir = path.resolve('.output/public')
const fallback = path.join(outDir, '200.html')

if (!fs.existsSync(fallback)) {
  console.error('❌ 200.html introuvable — lancez npm run generate')
  process.exit(1)
}

// Certains hébergeurs cherchent /admin/index.html au lieu d'une réécriture SPA.
const adminDir = path.join(outDir, 'admin')
fs.mkdirSync(adminDir, { recursive: true })
fs.copyFileSync(fallback, path.join(adminDir, 'index.html'))

const hidden = ['.htaccess', '_redirects']
for (const name of hidden) {
  const p = path.join(outDir, name)
  console.log(fs.existsSync(p) ? `✅ ${name} présent` : `⚠️  ${name} manquant — uploadez-le sur le serveur`)
}

console.log('\n📦 Déployer TOUT le contenu de .output/public/ (y compris fichiers cachés et _nuxt/)')
