<template>
  <section
    class="min-h-screen bg-neutral-50 dark:bg-neutral-900 lg:grid lg:grid-cols-5 lg:grid-rows-[auto_1fr_auto] lg:gap-2 lg:p-2"
  >
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 z-40 bg-black/40 lg:hidden"
      @click="closeMobileMenu"
    ></div>

    <aside
      class="fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs transform border-r border-neutral-200 bg-white p-4 shadow-lg transition-transform duration-300 dark:border-neutral-700 dark:bg-neutral-800 lg:hidden"
      :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100">
          Menü
        </h2>

        <button
          type="button"
          class="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
          @click="closeMobileMenu"
        >
          ✕
        </button>
      </div>

      <AppSidebar @navigate="closeMobileMenu" />
    </aside>

    <aside
      class="hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-800 lg:row-span-3 lg:block"
    >
      <AppSidebar />
    </aside>

    <header class="sticky top-0 z-30 border-b border-neutral-200 bg-neutral-50/95 px-3 py-2 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95 lg:static lg:col-span-4 lg:border lg:rounded-xl lg:bg-white lg:p-3 lg:shadow-sm dark:lg:bg-neutral-800">
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 lg:hidden"
          @click="toggleMobileMenu"
          aria-label="Menü öffnen"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-navigation"
        >
          ☰
        </button>

        <div class="min-w-0 flex-1">
          <AppHeader />
        </div>
      </div>
    </header>

    <main class="px-3 py-3 lg:col-span-4 lg:col-start-2 lg:row-start-2 lg:px-0 lg:py-0">
      <router-view />
    </main>

    <footer class="px-3 pb-3 pt-1 lg:col-span-4 lg:col-start-2 lg:row-start-3 lg:px-0 lg:pb-0">
      <div class="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-800">
        <AppFooter />
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}
</script>
