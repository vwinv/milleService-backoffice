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
      // 'http://127.0.0.1:3001',
      'https://milleservice-backend-aacp.onrender.com',
    public: {
      /** Canonique ; l’API autorise aussi https://www.mille-services.com (CORS). */
      siteUrl: 'https://mille-services.com',
      /** Appels directs du navigateur vers l’API Nest (CORS : origines du backoffice sur le backend). */
      apiBase:
        //  'http://127.0.0.1:3001',
        'https://milleservice-backend-aacp.onrender.com',
      /** APK Android pour les testeurs (déposer le fichier dans public/downloads/). */
      apkDownloadUrl:
        process.env.NUXT_PUBLIC_APK_DOWNLOAD_URL || '/downloads/milleservices.apk',
    }
  },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  /**
   * Zone admin : pas de SSR (pas de SEO). La session vit dans cookies + localStorage ;
   * sans cela, un refresh déclenche le middleware serveur sans accès au localStorage → déconnexion.
   * prerender: false → les routes dynamiques (/admin/prestataires/:id) ne sont pas figées en HTML statique.
   */
  routeRules: {
    '/admin/**': { ssr: false, prerender: false },
  },

  nitro: {
    /**
     * Serveur Node en production : refresh sur routes dynamiques admin + route API /api/document-preview.
     * Pour un déploiement statique volontaire : NITRO_PRESET=static + fichier public/_redirects.
     */
    preset: process.env.NITRO_PRESET || 'node-server',
  },
})

