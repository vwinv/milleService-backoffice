import { fileURLToPath } from 'url'

// https://nuxt.com/docs/api/configuration/nuxt-config
const mainCss = fileURLToPath(new URL('./assets/css/main.css', import.meta.url))

export default defineNuxtConfig({
  ssr: true, // IMPORTANT pour SEO

  app: {
    head: {
      title: 'Milles Services',
      meta: [
        { name: 'description', content: 'Plateforme de mise en relation particulier et prestataires' }
      ]
    }
  },

  // Utiliser un chemin absolu évite les problèmes de résolution
  // (alias `~`, cache Nuxt/Vite, et environnement Vitest).
  css: [mainCss],

  runtimeConfig: {
    // Set via NUXT_OPENAI_API_KEY or OPENAI_API_KEY in env
    openaiApiKey: '',
    public: {
      siteUrl: 'https://mille-services.com',
      /** API Nest (avis public, auth, etc.) — ex. http://[::1]:3001 */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://[::1]:3001',
    }
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ]
})

