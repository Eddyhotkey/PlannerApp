<template>
  <li class="rounded-lg bg-white p-3 shadow-sm">
    <template v-if="isEditing">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">
              Von
            </label>
            <input
              ref="startInput"
              v-model="localStart"
              type="time"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              @keyup.enter="focusEndInput"
              @keyup.esc="cancelEdit"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">
              Bis
            </label>
            <input
              ref="endInput"
              v-model="localEnd"
              type="time"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
              @keyup.enter="focusTitleInput"
              @keyup.esc="cancelEdit"
            />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-xs font-medium text-slate-500">
            Termin
          </label>
          <input
            ref="titleInput"
            v-model="localTitle"
            type="text"
            class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            placeholder="Termin eingeben"
            @keyup.enter="saveEdit"
            @keyup.esc="cancelEdit"
            @blur="handleTitleBlur"
          />
        </div>

        <p
          v-if="showTimeError"
          class="text-xs text-red-600"
        >
          Die Endzeit muss nach der Startzeit liegen.
        </p>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
            @click="saveEdit"
          >
            Speichern
          </button>

          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
            @click="cancelEdit"
          >
            Abbrechen
          </button>

          <button
            type="button"
            class="rounded-md px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
            @click="removeAppointment"
          >
            Löschen
          </button>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-slate-800">
            {{ appointment.start }} - {{ appointment.end }}
          </p>
          <p class="text-sm text-slate-600">
            {{ appointment.title }}
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
            @click="startEdit"
          >
            Bearbeiten
          </button>

          <button
            type="button"
            class="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
            @click="removeAppointment"
          >
            Löschen
          </button>
        </div>
      </div>
    </template>
  </li>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'update-appointment',
  'remove-appointment',
])

const isEditing = ref(false)
const localStart = ref(props.appointment.start || '')
const localEnd = ref(props.appointment.end || '')
const localTitle = ref(props.appointment.title || '')

const startInput = ref(null)
const endInput = ref(null)
const titleInput = ref(null)

watch(
  () => props.appointment.start,
  (newValue) => {
    localStart.value = newValue || ''
  }
)

watch(
  () => props.appointment.end,
  (newValue) => {
    localEnd.value = newValue || ''
  }
)

watch(
  () => props.appointment.title,
  (newValue) => {
    localTitle.value = newValue || ''
  }
)

watch(
  () => props.appointment.isNew,
  (isNew) => {
    if (isNew) {
      startEdit()
    }
  },
  { immediate: true }
)

const showTimeError = computed(() => {
  if (!localStart.value || !localEnd.value) return false
  return localEnd.value <= localStart.value
})

function startEdit() {
  isEditing.value = true
  localStart.value = props.appointment.start || ''
  localEnd.value = props.appointment.end || ''
  localTitle.value = props.appointment.title || ''

  nextTick(() => {
    startInput.value?.focus()
  })
}

function focusEndInput() {
  nextTick(() => {
    endInput.value?.focus()
  })
}

function focusTitleInput() {
  nextTick(() => {
    titleInput.value?.focus()
  })
}

function saveEdit() {
  const trimmedStart = localStart.value.trim()
  const trimmedEnd = localEnd.value.trim()
  const trimmedTitle = localTitle.value.trim()

  if (!trimmedStart || !trimmedEnd || !trimmedTitle) {
    if (props.appointment.isNew) {
      emit('remove-appointment', props.appointment)
      return
    }

    localStart.value = props.appointment.start || ''
    localEnd.value = props.appointment.end || ''
    localTitle.value = props.appointment.title || ''
    isEditing.value = false
    return
  }

  if (trimmedEnd <= trimmedStart) {
    return
  }

  emit('update-appointment', {
    id: props.appointment.id,
    start: trimmedStart,
    end: trimmedEnd,
    title: trimmedTitle,
  })

  isEditing.value = false
}

function cancelEdit() {
  if (props.appointment.isNew) {
    emit('remove-appointment', props.appointment)
    return
  }

  localStart.value = props.appointment.start || ''
  localEnd.value = props.appointment.end || ''
  localTitle.value = props.appointment.title || ''
  isEditing.value = false
}

function handleTitleBlur() {
  saveEdit()
}

function removeAppointment() {
  emit('remove-appointment', props.appointment)
}
</script>
