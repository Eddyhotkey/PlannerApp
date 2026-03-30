<template>
  <aside class="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm lg:col-span-2">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">Termine</h2>

      <button
        type="button"
        class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        @click="$emit('add-appointment')"
      >
        + Termin
      </button>
    </div>

    <ul v-if="appointments.length" class="space-y-3">
      <AppointmentItem
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
        @update-appointment="$emit('update-appointment', $event)"
        @remove-appointment="$emit('remove-appointment', $event)"
      />
    </ul>

    <p
      v-else
      class="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500"
    >
      Noch keine Termine für heute.
    </p>
  </aside>
</template>

<script setup>
import AppointmentItem from '@/components/day/AppointmentItem.vue'

defineProps({
  appointments: {
    type: Array,
    required: true,
  },
})

defineEmits([
  'add-appointment',
  'update-appointment',
  'remove-appointment',
])
</script>
