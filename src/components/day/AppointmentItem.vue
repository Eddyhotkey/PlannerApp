<template>
  <li class="rounded-lg bg-white p-3 shadow-sm">
    <template v-if="isEditing">
      <div class="space-y-2">
        <input
          v-model="localTime"
          type="time"
          class="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
        />
        <input
          v-model="localTitle"
          type="text"
          class="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
        />
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            @click="saveEdit"
          >
            Speichern
          </button>
          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
            @click="cancelEdit"
          >
            Abbrechen
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-start justify-between gap-3">
        <div>
          <div class="text-sm font-semibold text-slate-800">
            {{ appointment.time }}
          </div>
          <div class="text-sm text-slate-600">
            {{ appointment.title }}
          </div>
        </div>

        <button
          type="button"
          class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          @click="startEdit"
        >
          Bearbeiten
        </button>
      </div>
    </template>
  </li>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update-appointment'])

const isEditing = ref(false)
const localTime = ref(props.appointment.time)
const localTitle = ref(props.appointment.title)

function startEdit() {
  localTime.value = props.appointment.time
  localTitle.value = props.appointment.title
  isEditing.value = true
}

function saveEdit() {
  emit('update-appointment', {
    id: props.appointment.id,
    time: localTime.value,
    title: localTitle.value.trim(),
  })
  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}
</script>
