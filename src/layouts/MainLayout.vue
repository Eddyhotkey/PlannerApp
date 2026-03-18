<template>
  <section class="MainLayout min-h-screen grid grid-cols-5 grid-rows-[auto_1fr_auto] gap-0">
    <aside class="MainLayout_aside row-span-5 p-8">
      <AppSidebar />
    </aside>
    <header class="MainLayout_header col-span-4 p-4">
      <AppHeader />
    </header>
    <main class="MainLayout_main col-span-4 row-span-3 col-start-2 row-start-2 p-4">
      <router-view />
    </main>
    <footer class="MainLayout_footer col-span-4 col-start-2 row-start-5 p-4">
      <AppFooter />
    </footer>
  </section>
</template>
<script setup>
  import AppHeader from "@/components/layout/AppHeader.vue";
  import AppSidebar from "@/components/layout/AppSidebar.vue";
  import AppFooter from "@/components/layout/AppFooter.vue";
</script>
<style scoped>

</style>
