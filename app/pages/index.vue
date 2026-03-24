<template>
  <div class="min-h-screen bg-white text-slate-900">
    <!-- Topbar -->
    <header
      class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur"
    >
      <div
        class="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8"
      >
        <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="Mille Services — Accueil">
          <img
            src="/images/logo.png"
            alt="Mille Services"
            class="h-11 w-auto max-h-14 object-contain object-left sm:h-12 md:h-14"
            width="200"
            height="50"
            loading="eager"
          />
        </NuxtLink>

        <div
          class="flex min-w-0 flex-wrap items-center justify-end gap-4 sm:gap-8 lg:gap-10"
        >
          <nav
            class="flex items-center gap-5 text-sm font-medium sm:gap-8 sm:text-base"
            aria-label="Navigation principale"
          >
            <NuxtLink
              to="/"
              :class="navLinkClass(isHomeActive)"
            >
              Home
            </NuxtLink>
            <NuxtLink
              to="/#explorer"
              :class="navLinkClass(isExplorerActive)"
            >
              Explorer
            </NuxtLink>
          </nav>

          <a
            href="#"
            class="inline-flex items-center justify-center rounded-full bg-[#020B51] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#031a6b] sm:px-5 sm:text-sm md:text-base"
          >
            Télécharger l’application
          </a>
        </div>
      </div>
    </header>

    <!-- Hero : image + filtre gradient #020B51 (animations au scroll) -->
    <div
      ref="heroBlockRef"
      class="hero-block"
      :class="{ 'hero-block--visible': heroSectionVisible }"
    >
    <section
      id="home"
      class="hero-section relative min-h-[min(85vh,680px)] overflow-hidden sm:min-h-[min(90vh,800px)]"
    >
      <!-- Slider images de fond -->
      <div class="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          v-for="(src, i) in heroSlides"
          :key="src"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-[1200ms] ease-in-out"
          :class="currentHeroSlide === i ? 'z-[1] opacity-100' : 'z-0 opacity-0'"
          :style="{ backgroundImage: `url('${src}')` }"
        />
      </div>
      <!-- Dégradé gauche → droite : rgba(2,11,81,0.63) → même → #292246 -->
      <div
        class="hero-gradient absolute inset-0 z-[2]"
        style="
          background: linear-gradient(
            to right,
            rgba(2, 11, 81, 0.63) 0%,
            rgba(2, 11, 81, 0.63) 50%,
            #31294B 100%,
            #31294B 100%,
            #31294B 100%
          );
        "
        aria-hidden="true"
      />

      <div
        class="relative z-20 mx-auto flex min-h-[min(85vh,680px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-8 text-left sm:min-h-[min(90vh,800px)] sm:px-6 sm:pb-24 sm:pt-12 lg:px-8"
      >
        <h1
          class="hero-title text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Votre conciergerie<br />Numérique
        </h1>
        <p class="hero-lead mt-6 max-w-xl text-lg text-white/85">
          Une solution digitale pensée pour simplifier votre quotidien en vous connectant rapidement aux bons prestataires. Notre conciergerie numérique vous accompagne dans la gestion de vos besoins en services, avec efficacité, fiabilité et simplicité.
        </p>
      </div>
    </section>

    <!-- Indicateurs slider (sous le hero) -->
    <div
      class="hero-dots flex justify-center border-b border-slate-100 bg-white px-4 py-4 sm:py-5"
    >
      <div
        class="flex items-center gap-2.5"
        role="tablist"
        aria-label="Diaporama du bandeau"
      >
        <button
          v-for="(_, i) in heroSlides"
          :key="i"
          type="button"
          class="rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51]/35 focus-visible:ring-offset-2"
          :class="
            currentHeroSlide === i
              ? 'h-2.5 w-2.5 bg-[#020B51]'
              : 'h-2.5 w-2.5 bg-slate-200 hover:bg-slate-300'
          "
          :aria-current="currentHeroSlide === i ? 'true' : undefined"
          :aria-label="`Slide ${i + 1} sur ${heroSlides.length}${currentHeroSlide === i ? ' (affichée)' : ''}`"
          @click="currentHeroSlide = i"
        />
      </div>
    </div>
    </div>

    <!-- App : visuel + stores (animations au scroll) -->
    <div
      ref="appSectionBlockRef"
      class="app-section-block"
      :class="{ 'app-section-block--visible': appSectionVisible }"
    >
    <section
      class="border-b border-slate-100 bg-white px-4 py-12 sm:py-16"
      aria-labelledby="app-download-heading"
    >
      <div class="mx-auto flex max-w-6xl flex-col items-center text-center">
        <h2 id="app-download-heading" class="sr-only">
          Télécharger l’application Mille Services
        </h2>
        <img
          src="/images/app.png"
          alt="Aperçu de l’application Mille Services"
          class="app-mockup-reveal mx-auto h-auto w-full max-w-3xl object-contain sm:max-w-4xl lg:max-w-5xl"
          width="1024"
          height="1024"
          loading="lazy"
          decoding="async"
        />
        <div
          class="app-section-cta mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4"
        >
          <a
            href="#"
            class="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full bg-[#020B51] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#031a6b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[220px]"
          >
            Télécharger sur l’App Store
          </a>
          <a
            href="#"
            class="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-full border-2 border-[#020B51] bg-white px-6 py-3 text-sm font-semibold text-[#020B51] transition hover:bg-[#020B51]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020B51]/40 focus-visible:ring-offset-2 sm:flex-initial sm:min-w-[220px]"
          >
            Télécharger sur le Play Store
          </a>
        </div>
      </div>
    </section>
    </div>

    <!-- Prestataires : visuel + texte (animations au scroll) -->
    <div
      ref="prestataireSectionBlockRef"
      class="prestataire-section-block"
      :class="{ 'prestataire-section-block--visible': prestataireSectionVisible }"
    >
    <section
      class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20"
      aria-labelledby="prestataires-heading"
    >
      <div
        class="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16"
      >
        <div
          class="prestataire-anim-left relative mx-auto flex w-full max-w-lg justify-center lg:mx-0 lg:justify-start"
        >
          <div class="flex w-full max-w-md justify-center lg:justify-start">
            <img
              src="/images/prestataire.png"
              alt="Prestataires Mille Services à proximité"
              class="prestataire-img-spin h-auto w-full object-contain drop-shadow-lg"
              width="400"
              height="400"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="prestataire-anim-right text-left">
          <h2
            id="prestataires-heading"
            class="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-[1.75rem] xl:text-4xl"
          >
            Mille Services, c’est avoir accès aux prestataires proches de chez vous !
          </h2>
          <div class="mt-6 space-y-4 text-base leading-relaxed text-slate-600 sm:text-lg">
            <p>
              Mille Services vous permet d’accéder facilement à des prestataires qualifiés, proches de chez vous. Que vous ayez besoin d’un plombier, d’un carreleur, d’un électricien ou d’un autre professionnel, la plateforme vous aide à trouver rapidement la bonne personne pour répondre à vos besoins.
            </p>
            <p class="text-sm leading-relaxed text-slate-600 sm:text-base">
              Grâce à une expérience simple et intuitive, vous pouvez rechercher, comparer et entrer en contact avec des prestataires fiables en toute sérénité. Mille Services a pour objectif de faciliter votre quotidien en vous offrant un accès rapide à des services de proximité, tout en valorisant le savoir-faire des professionnels locaux.
            </p>
          </div>
        </div>
      </div>
    </section>
    </div>

    <!-- Visuel app (bounce accentué + entrée au scroll) -->
    <div
      ref="app1SectionBlockRef"
      class="app1-section-block"
      :class="{ 'app1-section-block--visible': app1SectionVisible }"
    >
    <section
      class="border-b border-slate-100 bg-white px-4 py-12 sm:py-16"
      aria-label="Application Mille Services"
    >
      <div class="app1-bounce-wrap mx-auto flex max-w-6xl justify-center">
        <img
          src="/images/app1.png"
          alt="Application Mille Services"
          class="app1-bounce h-auto w-full max-w-xl object-contain sm:max-w-2xl lg:max-w-3xl"
          width="768"
          height="768"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
    </div>

    <!-- Avis clients -->
    <section
      id="avis-clients"
      class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20"
      aria-labelledby="avis-clients-heading"
    >
      <div class="mx-auto max-w-6xl">
        <h2
          id="avis-clients-heading"
          class="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Avis clients
        </h2>
        <p
          class="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-slate-600 sm:text-lg"
        >
          Découvrez ce que nos utilisateurs pensent de Mille Services. Leurs retours nous aident chaque jour à améliorer la plateforme et à renforcer la confiance entre particuliers et prestataires de proximité.
        </p>

        <div v-if="avisPending" class="mt-12 flex justify-center py-12 text-slate-500">
          Chargement des avis…
        </div>

        <div
          v-else-if="!avisList.length"
          class="mt-12 rounded-2xl border border-slate-200 bg-slate-50/80 py-12 text-center text-slate-600"
        >
          Aucun avis pour le moment. Les avis laissés par les clients apparaîtront ici.
        </div>

        <div v-else class="relative mt-12">
          <!-- 1 ou 2 avis : grille simple -->
          <div
            v-if="avisList.length < 3"
            class="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2"
            :class="avisList.length === 1 ? 'sm:grid-cols-1 sm:justify-items-center' : ''"
          >
            <article
              v-for="(slot, idx) in avisList"
              :key="slot.id"
              class="flex min-h-[220px] w-full max-w-lg flex-col rounded-2xl p-5 shadow-sm sm:min-h-[260px]"
              :class="
                avisList.length === 1 || idx === 1
                  ? 'border-2 border-[#020B51] bg-[#020B51] text-white'
                  : 'border border-slate-200 bg-white text-slate-900'
              "
            >
              <div class="flex items-start gap-3">
                <div
                  class="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"
                  :class="
                    avisList.length === 1 || idx === 1
                      ? 'border-white/40'
                      : 'border-slate-200'
                  "
                >
                  <img
                    v-if="slot.avatarUrl"
                    :src="avatarSrc(slot.avatarUrl)"
                    alt=""
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div
                    v-else
                    class="flex h-full w-full items-center justify-center text-sm font-semibold"
                    :class="
                      avisList.length === 1 || idx === 1
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-[#020B51]'
                    "
                  >
                    {{ initials(slot.nomClient) }}
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p
                    class="font-semibold leading-tight"
                    :class="
                      avisList.length === 1 || idx === 1
                        ? 'text-white'
                        : 'text-slate-900'
                    "
                  >
                    {{ slot.nomClient }}
                  </p>
                  <p
                    class="mt-0.5 text-xs font-medium uppercase tracking-wide"
                    :class="
                      avisList.length === 1 || idx === 1
                        ? 'text-white/70'
                        : 'text-slate-500'
                    "
                  >
                    Client
                  </p>
                </div>
              </div>
              <p
                class="mt-4 flex-1 text-sm leading-relaxed"
                :class="
                  avisList.length === 1 || idx === 1
                    ? 'text-white/90'
                    : 'text-slate-600'
                "
              >
                {{ slot.commentaire || '—' }}
              </p>
              <div
                class="mt-4 flex gap-0.5 text-amber-400"
                :class="avisList.length === 1 || idx === 1 ? 'text-amber-300' : ''"
                aria-label="Note sur 5"
              >
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-lg leading-none"
                >
                  {{ star <= slot.note ? '★' : '☆' }}
                </span>
              </div>
            </article>
          </div>

          <!-- 3+ avis : carrousel (3 visibles, milieu mis en avant) -->
          <template v-else>
            <div class="overflow-hidden pb-2">
              <Transition name="avis-carousel" mode="out-in">
                <div
                  :key="carouselOffset"
                  class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
                >
                  <article
                    v-for="(slot, idx) in carouselSlots"
                    :key="`${carouselOffset}-${slot?.id ?? idx}`"
                    class="flex min-h-[220px] flex-col rounded-2xl p-5 shadow-sm transition-colors md:min-h-[260px]"
                    :class="
                      idx === 1
                        ? 'border-2 border-[#020B51] bg-[#020B51] text-white'
                        : 'border border-slate-200 bg-white text-slate-900'
                    "
                  >
                    <template v-if="slot">
                      <div class="flex items-start gap-3">
                        <div
                          class="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"
                          :class="idx === 1 ? 'border-white/40' : 'border-slate-200'"
                        >
                          <img
                            v-if="slot.avatarUrl"
                            :src="avatarSrc(slot.avatarUrl)"
                            alt=""
                            class="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div
                            v-else
                            class="flex h-full w-full items-center justify-center text-sm font-semibold"
                            :class="
                              idx === 1
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-[#020B51]'
                            "
                          >
                            {{ initials(slot.nomClient) }}
                          </div>
                        </div>
                        <div class="min-w-0 flex-1">
                          <p
                            class="font-semibold leading-tight"
                            :class="idx === 1 ? 'text-white' : 'text-slate-900'"
                          >
                            {{ slot.nomClient }}
                          </p>
                          <p
                            class="mt-0.5 text-xs font-medium uppercase tracking-wide"
                            :class="idx === 1 ? 'text-white/70' : 'text-slate-500'"
                          >
                            Client
                          </p>
                        </div>
                      </div>
                      <p
                        class="mt-4 flex-1 text-sm leading-relaxed"
                        :class="idx === 1 ? 'text-white/90' : 'text-slate-600'"
                      >
                        {{ slot.commentaire || '—' }}
                      </p>
                      <div
                        class="mt-4 flex gap-0.5 text-amber-400"
                        :class="idx === 1 ? 'text-amber-300' : ''"
                        aria-label="Note sur 5"
                      >
                        <span
                          v-for="star in 5"
                          :key="star"
                          class="text-lg leading-none"
                        >
                          {{ star <= slot.note ? '★' : '☆' }}
                        </span>
                      </div>
                    </template>
                  </article>
                </div>
              </Transition>
            </div>

            <div
              class="mt-8 flex justify-center gap-2"
              role="tablist"
              aria-label="Navigation du carrousel d’avis"
            >
              <button
                v-for="page in carouselPageCount"
                :key="page"
                type="button"
                class="h-2.5 w-2.5 rounded-full transition-colors"
                :class="
                  carouselOffset === page - 1
                    ? 'bg-[#020B51]'
                    : 'bg-slate-200 hover:bg-slate-300'
                "
                :aria-selected="carouselOffset === page - 1"
                :aria-label="`Groupe d’avis ${page}`"
                @click="goToCarouselPage(page - 1)"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section
      id="faq"
      class="border-b border-slate-100 bg-white px-4 py-14 sm:py-20"
      aria-labelledby="faq-heading"
    >
      <div class="mx-auto w-full max-w-5xl lg:max-w-6xl">
        <h2
          id="faq-heading"
          class="text-center text-2xl font-bold text-slate-900 sm:text-3xl"
        >
          Les questions les plus fréquentes (FAQ)
        </h2>
        <p
          class="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-slate-600 sm:text-lg"
        >
          Retrouvez ici les réponses aux interrogations les plus courantes sur Mille Services : inscription, recherche de prestataires, sécurité et utilisation de l’application.
        </p>

        <div
          ref="faqListRef"
          class="faq-accordion-list mt-10 space-y-3"
          :class="{ 'faq-accordion-list--animate': faqSectionVisible }"
        >
          <div
            v-for="(item, i) in faqItems"
            :key="item.id"
            class="faq-accordion-item overflow-hidden rounded-xl border transition-colors duration-200"
            :style="{ '--faq-stagger': `${i * 0.1}s` }"
            :class="
              openFaqIndex === i
                ? 'border-[#020B51] bg-[#020B51] text-white shadow-md'
                : 'border-slate-200 bg-white text-slate-900 shadow-sm'
            "
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#020B51] focus-visible:ring-offset-2 sm:px-6 sm:py-5 sm:text-lg"
              :class="
                openFaqIndex === i
                  ? 'text-white'
                  : 'text-slate-900 hover:bg-slate-50/80'
              "
              :aria-expanded="openFaqIndex === i"
              :aria-controls="`faq-panel-${item.id}`"
              :id="`faq-trigger-${item.id}`"
              @click="toggleFaq(i)"
            >
              <span>{{ item.question }}</span>
              <span
                class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200"
                :class="
                  openFaqIndex === i
                    ? 'rotate-180 bg-white/15 text-white'
                    : 'bg-slate-100 text-[#020B51]'
                "
                aria-hidden="true"
              >
                <svg
                  class="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              v-show="openFaqIndex === i"
              :id="`faq-panel-${item.id}`"
              role="region"
              :aria-labelledby="`faq-trigger-${item.id}`"
              class="border-t border-white/20 px-5 pb-5 pt-0 text-sm leading-relaxed text-white/95 sm:px-6"
            >
              <p class="pt-1">{{ item.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer
      class="bg-[#050a44] text-white"
      aria-label="Pied de page"
    >
      <div
        class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
      >
        <div
          class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 xl:gap-12"
        >
          <!-- Colonne 1 — Logo -->
          <div class="flex flex-col items-start">
            <div
              class="inline-flex flex-col items-center rounded-lg bg-white p-4 shadow-md sm:p-5"
            >
              <div class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 sm:h-28 sm:w-28">
                <img
                  src="/images/logo.png"
                  alt="Mille Services"
                  class="h-full w-full object-contain p-2"
                  width="112"
                  height="112"
                  loading="lazy"
                />
              </div>
              <p
                class="mt-3 text-center text-[0.65rem] font-bold uppercase leading-tight tracking-wide text-[#020B51] sm:text-xs"
              >
                Mille Services
              </p>
            </div>
          </div>

          <!-- Colonne 2 — Description -->
          <div class="text-left text-sm leading-relaxed text-white/90">
            <p>
              Mille Services met en relation particuliers et prestataires de services de proximité. Notre plateforme vous aide à trouver rapidement le bon professionnel pour vos besoins du quotidien, en toute confiance et simplicité.
            </p>
          </div>

          <!-- Colonne 3 — Adresse & réseaux -->
          <div class="text-left text-sm">
            <h3 class="text-base font-bold text-white">Adresse</h3>
            <p class="mt-3 leading-relaxed text-white/85">
              Jln. Galau terus no 23.<br />
              Jakarta Selatan
            </p>
            <h3 class="mt-8 text-base font-bold text-white">Suivez-nous</h3>
            <div class="mt-4 flex flex-wrap items-center gap-4" aria-label="Réseaux sociaux">
              <a
                href="#"
                class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                aria-label="Instagram"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                aria-label="LinkedIn"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                aria-label="Facebook"
              >
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
              <a
                href="#"
                class="text-white transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
                aria-label="X (Twitter)"
              >
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  />
                </svg>
              </a>
            </div>
          </div>

          <!-- Colonne 4 — Liens -->
          <div class="text-left text-sm">
            <h3 class="text-base font-bold text-white">Infos</h3>
            <ul class="mt-4 space-y-3">
              <li>
                <NuxtLink
                  to="/#faq"
                  class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  FAQ
                </NuxtLink>
              </li>
              <li>
                <a
                  href="#"
                  class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Aide
                </a>
              </li>
              <li>
                <NuxtLink
                  to="/privacy-policy"
                  class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Politique de confidentialité
                </NuxtLink>
              </li>
              <li>
                <a
                  href="#"
                  class="text-white/90 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Conditions générales
                </a>
              </li>
              <li>
                <NuxtLink
                  to="/admin"
                  class="text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Administration
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>

        <div
          class="mt-12 border-t border-white/15 pt-8 text-center text-xs text-white/55"
        >
          © {{ new Date().getFullYear() }} Mille Services
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const config = useRuntimeConfig()

/** FAQ (contenu éditorial) */
const faqItems = [
  {
    id: 'prestataire',
    question: 'Comment devenir prestataire Mille Services ?',
    answer:
      'Rejoignez Mille Services et développez votre activité en accédant à de nouveaux clients près de chez vous. Inscrivez-vous simplement sur la plateforme, complétez votre profil et mettez en avant vos compétences. Une fois validé, vous pourrez recevoir des demandes, entrer en contact avec des clients et proposer vos services en toute simplicité.',
  },
  {
    id: 'demande',
    question: 'Comment demander un Mille Services ?',
    answer:
      'Faites votre demande en quelques clics en décrivant simplement votre besoin. Indiquez le type de service recherché et votre localisation, puis recevez rapidement des propositions de prestataires qualifiés. Il ne vous reste plus qu’à choisir le professionnel qui vous convient et bénéficier d’un service fiable et adapté à vos attentes.'
  },
  {
    id: 'paiement',
    question: 'Pourquoi Mille Services ?',
    answer:
      'Mille Services vous offre une solution simple, rapide et fiable pour trouver des prestataires de qualité près de chez vous. En centralisant différents services sur une seule plateforme, nous vous faisons gagner du temps et vous permettons d’accéder facilement à des professionnels compétents.\nNotre objectif est de vous garantir une expérience fluide et sécurisée, tout en valorisant les prestataires locaux. Avec Mille Services, vous avez l’assurance de trouver le bon service, au bon moment, en toute confiance.',
  },
  {
    id: 'avis',
    question: 'Peut-on avoir un profile client et un profil prestataire ?',
    answer:
      'Oui, il est tout à fait possible de disposer à la fois d’un profil client et d’un profil prestataire sur Mille Services. Vous pouvez ainsi rechercher des services pour vos besoins personnels tout en proposant vos propres compétences aux autres utilisateurs.\n\nCette flexibilité vous permet de tirer pleinement parti de la plateforme, en vous offrant une expérience complète et adaptée à vos différentes activités.'
  },
  {
    id: 'gratuit',
    question: '24H/7 Besoins d’aide ?',
    answer:
      'Besoin d’aide à tout moment ? Mille Services est disponible 24h/24 et 7j/7 pour vous accompagner. Trouvez rapidement un prestataire qualifié et obtenez une solution adaptée, quand vous en avez besoin, en toute simplicité.',
  },
] as const

const openFaqIndex = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaqIndex.value = openFaqIndex.value === index ? null : index
}

/** FAQ : animation au scroll (relancée à chaque entrée dans le viewport) */
const faqListRef = ref<HTMLElement | null>(null)
const faqSectionVisible = ref(false)

function playFaqEntrance() {
  faqSectionVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      faqSectionVisible.value = true
    })
  })
}

function resetFaqEntrance() {
  faqSectionVisible.value = false
}

let faqIo: IntersectionObserver | null = null

/** Avis publics (API Nest) */
interface AvisPublicItem {
  id: string
  nomClient: string
  note: number
  commentaire: string | null
  avatarUrl: string | null
}

const { data: avisRaw, pending: avisPending } = await useFetch<AvisPublicItem[]>(
  '/prestataires/public/avis',
  {
    baseURL: (config.public.apiBase as string) || 'http://localhost:3000',
    default: () => [],
    transform: (res: unknown): AvisPublicItem[] => {
      if (Array.isArray(res)) return res as AvisPublicItem[]
      if (
        res &&
        typeof res === 'object' &&
        'data' in res &&
        Array.isArray((res as { data: unknown }).data)
      ) {
        return (res as { data: AvisPublicItem[] }).data
      }
      return []
    },
  },
)

const avisList = computed(() => avisRaw.value ?? [])

const carouselOffset = ref(0)
let avisCarouselTimer: ReturnType<typeof setInterval> | null = null

const carouselSlots = computed((): (AvisPublicItem | null)[] => {
  const list = avisList.value
  if (list.length < 3) return []
  const o = carouselOffset.value % list.length
  return [
    list[o]!,
    list[(o + 1) % list.length]!,
    list[(o + 2) % list.length]!,
  ]
})

/** Nombre de positions du carrousel (= nombre d’avis si ≥ 3) */
const carouselPageCount = computed(() =>
  avisList.value.length >= 3 ? avisList.value.length : 0,
)

watch(
  () => avisList.value.length,
  (len) => {
    if (avisCarouselTimer) {
      clearInterval(avisCarouselTimer)
      avisCarouselTimer = null
    }
    if (len >= 3) {
      avisCarouselTimer = setInterval(() => {
        const l = avisList.value.length
        if (l >= 3) {
          carouselOffset.value = (carouselOffset.value + 1) % l
        }
      }, 6000)
    }
  },
  { immediate: true },
)

function goToCarouselPage(i: number) {
  const len = avisList.value.length
  if (len < 3) return
  carouselOffset.value = ((i % len) + len) % len
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0]![0]!}${parts[1]![0]!}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || '?'
}

function avatarSrc(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = (config.public.apiBase as string) || ''
  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
}

/** Images du slider hero (public/images/) */
const heroSlides = ['/images/headerAccueil1.png', '/images/headerAccueil2.png'] as const

const currentHeroSlide = ref(0)
let heroSliderTimer: ReturnType<typeof setInterval> | null = null

/** Hero : animations au scroll (relancées à chaque entrée dans le viewport) */
const heroBlockRef = ref<HTMLElement | null>(null)
const heroSectionVisible = ref(false)

function playHeroEntrance() {
  heroSectionVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      heroSectionVisible.value = true
    })
  })
}

function resetHeroEntrance() {
  heroSectionVisible.value = false
}

let heroIo: IntersectionObserver | null = null

/** Section App (mockup + boutons) : animations au scroll */
const appSectionBlockRef = ref<HTMLElement | null>(null)
const appSectionVisible = ref(false)

function playAppSectionEntrance() {
  appSectionVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      appSectionVisible.value = true
    })
  })
}

function resetAppSectionEntrance() {
  appSectionVisible.value = false
}

let appSectionIo: IntersectionObserver | null = null

/** Section Prestataires (3) : entrée au scroll */
const prestataireSectionBlockRef = ref<HTMLElement | null>(null)
const prestataireSectionVisible = ref(false)

function playPrestataireSectionEntrance() {
  prestataireSectionVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      prestataireSectionVisible.value = true
    })
  })
}

function resetPrestataireSectionEntrance() {
  prestataireSectionVisible.value = false
}

let prestataireSectionIo: IntersectionObserver | null = null

/** Section app1 (bounce) : entrée au scroll */
const app1SectionBlockRef = ref<HTMLElement | null>(null)
const app1SectionVisible = ref(false)

function playApp1SectionEntrance() {
  app1SectionVisible.value = false
  nextTick(() => {
    requestAnimationFrame(() => {
      app1SectionVisible.value = true
    })
  })
}

function resetApp1SectionEntrance() {
  app1SectionVisible.value = false
}

let app1SectionIo: IntersectionObserver | null = null

onMounted(() => {
  heroSliderTimer = setInterval(() => {
    currentHeroSlide.value = (currentHeroSlide.value + 1) % heroSlides.length
  }, 6000)

  const heroEl = heroBlockRef.value
  if (heroEl && typeof IntersectionObserver !== 'undefined') {
    heroIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          playHeroEntrance()
        } else {
          resetHeroEntrance()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    )
    heroIo.observe(heroEl)
  }

  const appSecEl = appSectionBlockRef.value
  if (appSecEl && typeof IntersectionObserver !== 'undefined') {
    appSectionIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          playAppSectionEntrance()
        } else {
          resetAppSectionEntrance()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    )
    appSectionIo.observe(appSecEl)
  }

  const prestataireEl = prestataireSectionBlockRef.value
  if (prestataireEl && typeof IntersectionObserver !== 'undefined') {
    prestataireSectionIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          playPrestataireSectionEntrance()
        } else {
          resetPrestataireSectionEntrance()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    )
    prestataireSectionIo.observe(prestataireEl)
  }

  const app1El = app1SectionBlockRef.value
  if (app1El && typeof IntersectionObserver !== 'undefined') {
    app1SectionIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          playApp1SectionEntrance()
        } else {
          resetApp1SectionEntrance()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
    )
    app1SectionIo.observe(app1El)
  }

  const faqEl = faqListRef.value
  if (faqEl && typeof IntersectionObserver !== 'undefined') {
    faqIo = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          playFaqEntrance()
        } else {
          resetFaqEntrance()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    faqIo.observe(faqEl)
  }
})

onUnmounted(() => {
  if (heroSliderTimer) clearInterval(heroSliderTimer)
  if (avisCarouselTimer) clearInterval(avisCarouselTimer)
  heroIo?.disconnect()
  heroIo = null
  appSectionIo?.disconnect()
  appSectionIo = null
  prestataireSectionIo?.disconnect()
  prestataireSectionIo = null
  app1SectionIo?.disconnect()
  app1SectionIo = null
  faqIo?.disconnect()
  faqIo = null
})

/** Home actif sur / sans ancre #explorer ; Explorer actif quand hash = #explorer */
const isHomeActive = computed(
  () => route.path === '/' && route.hash !== '#explorer',
)
const isExplorerActive = computed(() => route.hash === '#explorer')

function navLinkClass(active: boolean) {
  return [
    'transition-colors',
    active ? 'font-semibold text-[#020B51]' : 'text-[#727272] hover:text-[#020B51]',
  ]
}

useHead({
  title: 'Mille Services — Accueil',
  meta: [
    {
      name: 'description',
      content:
        'Plateforme de mise en relation entre particuliers et prestataires de services.',
    },
  ],
})
</script>

<style scoped>
/* Entrée hero : léger zoom (sans masquer le fond pour éviter un flash) */
@keyframes hero-section-in {
  from {
    transform: scale(1.03);
  }
  to {
    transform: scale(1);
  }
}

@keyframes hero-fade-up {
  from {
    opacity: 0;
    transform: translateY(1.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.hero-section {
  transform-origin: center center;
  transform: scale(1.03);
}

.hero-block--visible .hero-section {
  animation: hero-section-in 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.hero-gradient {
  opacity: 0;
}

.hero-block--visible .hero-gradient {
  animation: hero-fade-in 0.9s ease-out 0.15s forwards;
}

.hero-title {
  opacity: 0;
  transform: translateY(1.5rem);
}

.hero-block--visible .hero-title {
  animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.25s forwards;
}

.hero-lead {
  opacity: 0;
  transform: translateY(1.5rem);
}

.hero-block--visible .hero-lead {
  animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.45s forwards;
}

.hero-dots {
  opacity: 0;
}

.hero-block--visible .hero-dots {
  animation: hero-fade-in 0.7s ease-out 0.75s forwards;
}

/* Apparence lente du mockup app (une fois au chargement) */
@keyframes app-mockup-reveal {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-mockup-reveal {
  opacity: 0;
  transform: translateY(28px);
}

.app-section-block--visible .app-mockup-reveal {
  animation: app-mockup-reveal 3.2s ease-out forwards;
}

.app-section-cta {
  opacity: 0;
  transform: translateY(1.25rem);
}

.app-section-block--visible .app-section-cta {
  animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards;
}

/* Section 3 — Prestataires : entrée au scroll */
.prestataire-anim-left,
.prestataire-anim-right {
  opacity: 0;
  transform: translateY(1.5rem);
}

.prestataire-section-block--visible .prestataire-anim-left {
  animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.prestataire-section-block--visible .prestataire-anim-right {
  animation: hero-fade-up 0.85s cubic-bezier(0.22, 1, 0.36, 1) 0.18s forwards;
}

/* app1 : entrée au scroll + rebond accentué */
.app1-bounce-wrap {
  opacity: 0;
  transform: translateY(1.75rem);
}

.app1-section-block--visible .app1-bounce-wrap {
  animation: hero-fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

/* Rebond infini sur app1.png (amplitude + rythme plus lisibles) */
@keyframes app1-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  35% {
    transform: translateY(-8px);
  }
  50% {
    transform: translateY(-32px);
  }
  65% {
    transform: translateY(-10px);
  }
}

.app1-bounce {
  animation: app1-bounce 2.1s cubic-bezier(0.42, 0, 0.58, 1) infinite;
}

/*
  1) Tour rapide (~0,75 s)
  2) Pause 10 s
  3) Retour rapide (~0,75 s) en sens inverse
  Durée totale d’un cycle = 11,5 s. Les unités `turn` assurent une vraie interpolation inverse.
*/
@keyframes prestataire-spin-cycle {
  0% {
    transform: rotate(0turn);
  }
  /* 0,75 / 11,5 */
  6.521739% {
    transform: rotate(1turn);
  }
  /* fin de la pause (0,75 + 10) / 11,5 */
  93.478261% {
    transform: rotate(1turn);
  }
  100% {
    transform: rotate(0turn);
  }
}

.prestataire-img-spin {
  transform-origin: center center;
  animation: prestataire-spin-cycle 11.5s linear infinite;
}

/* FAQ : accordéons — entrée en cascade depuis le bas */
@keyframes faq-item-rise {
  from {
    opacity: 0;
    transform: translateY(1.75rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.faq-accordion-item {
  opacity: 0;
  transform: translateY(1.75rem);
}

.faq-accordion-list--animate .faq-accordion-item {
  animation: faq-item-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  animation-delay: var(--faq-stagger, 0s);
}

/* Carrousel avis clients */
.avis-carousel-enter-active,
.avis-carousel-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}

.avis-carousel-enter-from {
  opacity: 0;
  transform: translateX(1.25rem);
}

.avis-carousel-leave-to {
  opacity: 0;
  transform: translateX(-1.25rem);
}

@media (prefers-reduced-motion: reduce) {
  .hero-section {
    animation: none;
    transform: none;
  }

  .hero-gradient,
  .hero-title,
  .hero-lead,
  .hero-dots {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .app-mockup-reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .app-section-cta {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .prestataire-anim-left,
  .prestataire-anim-right {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .app1-bounce-wrap {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .app1-bounce {
    animation: none;
    transform: none;
  }

  .prestataire-img-spin {
    animation: none;
  }

  .avis-carousel-enter-active,
  .avis-carousel-leave-active {
    transition: none;
  }

  .avis-carousel-enter-from,
  .avis-carousel-leave-to {
    opacity: 1;
    transform: none;
  }

  .faq-accordion-item {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
