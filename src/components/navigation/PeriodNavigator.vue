<template>
  <div class="AppHeader_wmy">
    <nav class="inline-flex gap-3" aria-label="Zeitraum-Navigation">
      <router-link
        to="/week"
        class="text-white shadow-xl/20 bg-indigo-400 hover:bg-indigo-500 px-5 py-2 rounded-base"
        active-class="bg-indigo-500"
      >
        KW {{ dateStore.currentWeek }}
      </router-link>

      <router-link
        to="/month"
        class="block text-white shadow-xl/20 bg-indigo-400 hover:bg-indigo-500 px-5 py-2 rounded-base"
        active-class="bg-indigo-500"
      >
        {{ dateStore.currentMonth }}
      </router-link>

      <router-link
        to="/year"
        class="text-white shadow-xl/20 bg-indigo-400 hover:bg-indigo-500 px-5 py-2 rounded-base"
        active-class="bg-indigo-500"
      >
        {{ dateStore.currentYear}}
      </router-link>
    </nav>
  </div>
</template>
<script setup>

  import { useDateStore } from "@/stores/dateStore.js";
  const dateStore = useDateStore();

</script>
<style scoped>

</style>
