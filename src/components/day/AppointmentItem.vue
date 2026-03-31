<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  appointment: Object,
  appointments: Array,
  saveAppointment: Function,
  deleteAppointment: Function,
})

const isEditing = ref(false)

const localStart = ref('')
const localEnd = ref('')
const localTitle = ref('')

const startInput = ref(null)

const overlapMessage = ref('')
const showTimeError = ref(false)

watch(
  () => props.appointment.isNew,
  (isNew) => {
    if (isNew) startEdit()
  },
  { immediate: true }
)

function startEdit() {
  isEditing.value = true
  overlapMessage.value = ''
  showTimeError.value = false

  localStart.value = props.appointment.start || ''
  localEnd.value = props.appointment.end || ''
  localTitle.value = props.appointment.title || ''

  nextTick(() => startInput.value?.focus())
}

function saveEdit() {
  overlapMessage.value = ''
  showTimeError.value = false

  const s = localStart.value.trim()
  const e = localEnd.value.trim()
  const t = localTitle.value.trim()

  if (!s || !e || !t) {
    if (props.appointment.isNew) {
      props.deleteAppointment(props.appointment)
      return
    }
    cancelEdit()
    return
  }

  if (e <= s) {
    showTimeError.value = true
    return
  }

  const result = props.saveAppointment({
    id: props.appointment.id,
    start: s,
    end: e,
    title: t,
  })

  if (result?.error === 'overlap') {
    const o = result.overlappingAppointment
    overlapMessage.value = `Überschneidet sich mit: ${o.start}–${o.end} ${o.title}`
    return
  }

  isEditing.value = false
}

function cancelEdit() {
  overlapMessage.value = ''
  showTimeError.value = false

  if (props.appointment.isNew) {
    props.deleteAppointment(props.appointment)
    return
  }

  isEditing.value = false
}

function removeAppointment() {
  props.deleteAppointment(props.appointment)
}
</script>

<template>
  <li class="rounded-xl border bg-white p-4 shadow-sm">

    <!-- EDIT -->
    <div v-if="isEditing" class="space-y-2">
      <input ref="startInput" v-model="localStart" type="time" class="w-full border px-2 py-1 rounded" />
      <input v-model="localEnd" type="time" class="w-full border px-2 py-1 rounded" />
      <input v-model="localTitle" placeholder="Titel" class="w-full border px-2 py-1 rounded" />

      <p v-if="showTimeError" class="text-xs text-red-500">
        Endzeit muss später sein
      </p>

      <p v-if="overlapMessage" class="text-xs text-red-500">
        {{ overlapMessage }}
      </p>

      <div class="flex gap-2">
        <button @click="saveEdit" class="text-xs bg-black text-white px-2 py-1 rounded">
          Speichern
        </button>
        <button @click="cancelEdit" class="text-xs">
          Abbrechen
        </button>
        <button @click="removeAppointment" class="text-xs text-red-500">
          Löschen
        </button>
      </div>
    </div>

    <!-- VIEW -->
    <div v-else class="flex justify-between">
      <div>
        <p class="text-sm font-semibold">
          {{ appointment.start }} – {{ appointment.end }}
        </p>
        <p class="text-sm text-slate-600">
          {{ appointment.title }}
        </p>
      </div>

      <div class="flex gap-2">
        <button @click="startEdit" class="text-xs">
          Bearbeiten
        </button>
        <button @click="removeAppointment" class="text-xs text-red-500">
          Löschen
        </button>
      </div>
    </div>

  </li>
</template>
