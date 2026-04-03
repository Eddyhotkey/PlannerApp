<template>
  <div class="hidden lg:block">
    <nav class="flex flex-wrap gap-2" aria-label="Zeitraum-Navigation">
      <router-link
        to="/week"
        class="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-1 text-sm text-neutral-700 hover:bg-neutral-200"
        active-class="border-indigo-500 bg-indigo-500 text-neutral-700"
      >
        KW {{ dateStore.currentWeek }}
      </router-link>

      <router-link
        to="/month"
        class="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-1 text-sm text-neutral-700 hover:bg-neutral-200"
        active-class="border-indigo-500 bg-indigo-500 text-neutral-700"
      >
        {{ dateStore.currentMonth }}
      </router-link>

      <router-link
        to="/year"
        class="rounded-md border border-neutral-200 bg-neutral-100 px-4 py-1 text-sm text-neutral-700 hover:bg-neutral-200"
        active-class="border-indigo-500 bg-indigo-500 text-neutral-700"
      >
        {{ dateStore.currentYear }}
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { useDateStore } from "@/stores/dateStore.js"

const dateStore = useDateStore()
</script>
