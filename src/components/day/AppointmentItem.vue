<script setup>
import { nextTick, ref, watch, computed } from 'vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
  appointment: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'start-editing',
  'cancel-editing',
  'save-appointment',
  'delete-appointment',
])

const titleInputRef = ref(null)
const localTitle = ref(props.appointment.title)
const localStart = ref(props.appointment.start)
const localEnd = ref(props.appointment.end)
const localError = ref('')

watch(
  () => props.appointment,
  (value) => {
    localTitle.value = value.title
    localStart.value = value.start
    localEnd.value = value.end
  },
  { deep: true }
)

watch(
  () => props.isEditing,
  async (value) => {
    if (value) {
      localTitle.value =
        props.appointment.title === 'Neuer Termin' ? '' : props.appointment.title
      localStart.value = props.appointment.start
      localEnd.value = props.appointment.end
      localError.value = ''

      await nextTick()
      titleInputRef.value?.focus()
      titleInputRef.value?.select()
    }
  },
  { immediate: true }
)

const formattedTime = computed(() => {
  if (!props.appointment.start || !props.appointment.end) return ''
  return `${props.appointment.start}–${props.appointment.end}`
})

function cancelEdit() {
  const isNewAppointment = props.appointment.title === 'Neuer Termin'

  if (isNewAppointment) {
    emit('delete-appointment', props.appointment)
    return
  }

  localTitle.value = props.appointment.title
  localStart.value = props.appointment.start
  localEnd.value = props.appointment.end
  localError.value = ''
  emit('cancel-editing')
}

async function saveAppointment() {
  const trimmedTitle = localTitle.value.trim()
  const isNewAppointment = props.appointment.title === 'Neuer Termin'

  if (!trimmedTitle) {
    if (isNewAppointment) {
      emit('delete-appointment', props.appointment)
    } else {
      localTitle.value = props.appointment.title
      emit('cancel-editing')
    }
    return
  }

  if (!localStart.value || !localEnd.value) {
    localError.value = 'Start- und Endzeit sind erforderlich.'
    return
  }

  if (localStart.value >= localEnd.value) {
    localError.value = 'Die Endzeit muss nach der Startzeit liegen.'
    return
  }

  localError.value = ''

  emit('save-appointment', {
    id: props.appointment.id,
    title: trimmedTitle,
    start: localStart.value,
    end: localEnd.value,
  })
}
</script>

<template>
  <div
    class="rounded-md border border-neutral-200 bg-neutral-50 dark:bg-neutral-600 dark:border-neutral-500 p-2">
    <template v-if="isEditing">
      <div class="space-y-2">
        <input
          ref="titleInputRef"
          v-model="localTitle"
          type="text"
          class="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm"
          placeholder="Termin"
          @keyup.enter="saveAppointment"
          @keyup.esc="cancelEdit"
        />

        <div class="grid grid-cols-2 gap-2">
          <input
            v-model="localStart"
            type="time"
            class="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />

          <input
            v-model="localEnd"
            type="time"
            class="rounded-md border border-neutral-300 px-2 py-1 text-sm"
          />
        </div>

        <p
          v-if="localError"
          class="text-sm text-red-600"
        >
          {{ localError }}
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md border border-neutral-200 bg-neutral-100 cursor-pointer px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-300"
            @click="saveAppointment"
          >
            Speichern
          </button>

          <button
            type="button"
            class="rounded-md border border-neutral-200 bg-neutral-100 cursor-pointer px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-300"
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
          <p class="text-sm font-medium text-neutral-800 dark:text-white">
            {{ appointment.title }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-white">
            {{ formattedTime }}
          </p>
        </div>
        <div class="flex gap-1">
          <button
            type="button"
            class="rounded-md  py-1 text-xs text-neutral-500 cursor-pointer"
            @click="$emit('start-editing')"
          >
            <IconEdit />
          </button>

          <button
            type="button"
            class="rounded-md py-1 text-xs text-red-600 cursor-pointer"
            @click="$emit('delete-appointment')"
          >
            <IconTrash />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
