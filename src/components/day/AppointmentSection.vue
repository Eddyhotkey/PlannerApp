<template>
  <aside class="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">Termine</h2>

      <button
        class="rounded-lg bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-slate-50"
        @click="$emit('add-appointment')"
      >
        + Termin
      </button>
    </div>

    <ul v-if="appointments.length" class="space-y-3">
      <AppointmentItem
        v-for="a in appointments"
        :key="a.id"
        :appointment="a"
        :appointments="appointments"
        :save-appointment="saveAppointment"
        :delete-appointment="deleteAppointment"
      />
    </ul>

    <p v-else class="text-sm text-slate-500 text-center py-6">
      Noch keine Termine
    </p>
  </aside>
</template>

<script setup>
import AppointmentItem from '@/components/day/AppointmentItem.vue'

defineProps({
  appointments: Array,
  saveAppointment: Function,
  deleteAppointment: Function,
})

defineEmits(['add-appointment'])
</script>
