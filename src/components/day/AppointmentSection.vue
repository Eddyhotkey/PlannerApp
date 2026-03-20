<template>
  <aside class="rounded-xl bg-indigo-100 p-4 shadow-sm lg:col-span-2">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">Termine</h2>

      <button
        type="button"
        class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        + Termin
      </button>
    </div>

    <ul class="space-y-3">
      <AppointmentItem
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
      />
    </ul>
  </aside>
</template>

<script setup>
  import AppointmentItem from "@/components/day/AppointmentItem.vue";

  defineProps({
    appointments: {
      type: Array,
      required: true,
    }
  })
</script>
