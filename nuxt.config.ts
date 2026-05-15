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
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo.png' },
        { rel: 'apple-touch-icon', href: '/images/logo.png' }
      ]
    }
  },

  // Utiliser un chemin absolu évite les problèmes de résolution
  // (alias `~`, cache Nuxt/Vite, et environnement Vitest).
  css: [mainCss],

  runtimeConfig: {
    // Set via NUXT_OPENAI_API_KEY or OPENAI_API_KEY in env
    openaiApiKey: '',
    /**
     * URL réelle du backend Nest (côté serveur Nuxt uniquement).
     * Défaut : localhost pour le dev ; en prod sur le même hébergeur que le backoffice :
     *   NUXT_API_BACKEND=https://votre-api.onrender.com
     */
    apiBackend:
      process.env.NUXT_API_BACKEND ||
      process.env.NUXT_PUBLIC_API_BASE ||
      process.env.NUXT_PUBLIC_API_URL ||
      //'http://127.0.0.1:3001',
      'https://milleservice-backend-aacp.onrender.com',
    public: {
      /** Canonique ; l’API autorise aussi https://www.mille-services.com (CORS). */
      siteUrl: 'https://mille-services.com',
      /**
       * Vide par défaut : le client appelle /__nest (même origine, pas de CORS). Définir NUXT_API_BACKEND
       * sur l’hébergeur du backoffice pour que Nitro proxifie vers Nest.
       * NUXT_PUBLIC_API_BASE : appels directs navigateur → Nest (ajouter l’origine du backoffice dans CORS_ORIGINS).
       */
      apiBase: '',
    }
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ]
})

