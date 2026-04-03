<template>
  <div class="flex justify-end gap-2">
    <div class="flex items-center w-fit gap-2">
      <button
        type="button"
        @click="dateStore.previousDay()"
        class="cursor-pointer inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        aria-label="Vorheriger Tag"
      >
        <IconArrowLeft />
      </button>

      <div
        class="leading-6 h-8 flex-1 rounded-md border border-neutral-200 bg-neutral-100 px-3 py-1 text-center text-sm text-neutral-700"
      >
        <span class="block truncate font-medium">
          {{ currentDay }} {{ currentWeekday }}
        </span>
      </div>

      <button
        type="button"
        @click="dateStore.nextDay()"
        class="cursor-pointer inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        aria-label="Nächster Tag"
      >
        <IconArrowRight />
      </button>
    </div>

    <div class="flex">
      <button
        type="button"
        class="inline-flex cursor-pointer items-center justify-center rounded-md bg-neutral-100 px-4 py-1 text-sm uppercase border border-neutral-200 text-neutral-700 hover:bg-neutral-200 sm:w-auto"
        @click="goToToday"
      >
        Heute
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue"
import { useDateStore } from "@/stores/dateStore.js"
import router from "@/router/index.js"
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue"
import IconArrowRight from "@/components/icons/IconArrowRight.vue"

const dateStore = useDateStore()

const currentDay = computed(() => {
  return dateStore.selectedDate.getDate()
})

const currentWeekday = computed(() => {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
  }).format(dateStore.selectedDate)
})

function goToToday() {
  dateStore.setToday()
  router.push("/day")
}
</script>
