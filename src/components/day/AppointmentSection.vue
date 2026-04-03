<script setup>
import { ref, watch } from 'vue'
import AppointmentItem from '@/components/day/AppointmentItem.vue'

const props = defineProps({
  appointments: {
    type: Array,
    required: true,
  },
  lastCreatedAppointmentId: {
    type: Number,
    default: null,
  },
  saveAppointment: {
    type: Function,
    required: true,
  },
  deleteAppointment: {
    type: Function,
    required: true,
  },
})

const emit = defineEmits(['add-appointment'])

const editingAppointmentId = ref(null)

watch(
  [() => props.lastCreatedAppointmentId, () => props.appointments],
  ([newId]) => {
    if (!newId) return

    const exists = props.appointments.some(item => item.id === newId)

    if (exists) {
      editingAppointmentId.value = newId
    }
  },
  { immediate: true, deep: true }
)

function startEditing(appointment) {
  editingAppointmentId.value = appointment.id
}

function stopEditing() {
  editingAppointmentId.value = null
}

async function handleSaveAppointment(payload) {
  const result = await props.saveAppointment(payload)

  if (result?.success === false) {
    return result
  }

  editingAppointmentId.value = null
  return result
}

async function handleDeleteAppointment(appointment) {
  await props.deleteAppointment(appointment)

  if (editingAppointmentId.value === appointment.id) {
    editingAppointmentId.value = null
  }
}
</script>

<template>
  <section class="rounded-lg border
        border-neutral-100 dark:border-neutral-600
        bg-white dark:bg-neutral-800
        p-4 shadow-sm transition ">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100">Termine</h2>

      <button
        type="button"
        class="rounded-md border border-neutral-200 bg-neutral-100 cursor-pointer px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-300"
        @click="$emit('add-appointment')"
      >
        + Termin
      </button>
    </div>

    <div class="space-y-2">
      <AppointmentItem
        v-for="appointment in appointments"
        :key="appointment.id"
        :appointment="appointment"
        :is-editing="editingAppointmentId === appointment.id"
        @start-editing="startEditing(appointment)"
        @cancel-editing="stopEditing"
        @save-appointment="handleSaveAppointment"
        @delete-appointment="handleDeleteAppointment(appointment)"
      />
    </div>
  </section>
</template>
