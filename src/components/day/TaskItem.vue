<template>
  <li
    class="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
    draggable="true"
    @dragstart="$emit('drag-start', task)"
    @dragover.prevent
    @drop="$emit('drop-task', task)"
  >
    <input
      :checked="task.completed"
      type="checkbox"
      class="h-5 w-5 cursor-pointer"
      @change="$emit('toggle-completed', task)"
    />

    <div class="flex-1">
      <template v-if="isEditing">
        <input
          v-model="localTitle"
          type="text"
          class="w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          @blur="saveEdit"
        />
      </template>

      <template v-else>
        <div
          :class="[
            'text-sm transition',
            task.completed ? 'line-through text-slate-400' : 'text-slate-700'
          ]"
        >
          {{ task.title }}
        </div>
      </template>
    </div>

    <span
      class="rounded-md px-2 py-1 text-xs"
      :class="priorityClass"
    >
      {{ priorityLabel }}
    </span>

    <button
      type="button"
      class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
      @click="cyclePriority"
    >
      Priorität
    </button>

    <button
      v-if="!isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
      @click="startEdit"
    >
      Bearbeiten
    </button>

    <button
      v-if="!task.completed && !isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
      @click="$emit('move-to-tomorrow', task)"
    >
      Morgen
    </button>
  </li>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([
  'toggle-completed',
  'move-to-tomorrow',
  'update-title',
  'update-priority',
  'drag-start',
  'drop-task',
  'remove-task',
])

const isEditing = ref(false)
const localTitle = ref(props.task.title)

watch(
  () => props.task.title,
  (newValue) => {
    localTitle.value = newValue
  }
)

watch(
  () => props.task.isNew,
  (isNew) => {
    if (isNew) {
      startEdit()
    }
  },
  { immediate: true }
)

const priorityLabel = computed(() => {
  if (props.task.priority === 'high') return 'Hoch'
  if (props.task.priority === 'low') return 'Niedrig'
  return 'Mittel'
})

const priorityClass = computed(() => {
  if (props.task.priority === 'high') return 'bg-red-100 text-red-700'
  if (props.task.priority === 'low') return 'bg-slate-100 text-slate-600'
  return 'bg-amber-100 text-amber-700'
})

function startEdit() {
  isEditing.value = true
  localTitle.value = props.task.title

  nextTick(() => {
    titleInput.value?.focus()
  })
}

function saveEdit() {
  const trimmed = localTitle.value.trim()

  if (!trimmed) {
    if ( props.task.isNew ) {
      emit('remove-task', props.task )
      return;
    }

    localTitle.value = props.task.title
    isEditing.value = false
    return
  }

  emit('update-title', {
    id: props.task.id,
    title: trimmed,
  })

  isEditing.value = false
}

function cancelEdit() {
  localTitle.value = props.task.title
  isEditing.value = false
}

function cyclePriority() {
  const current = props.task.priority

  let next = 'medium'

  if (current === 'low') next = 'medium'
  else if (current === 'medium') next = 'high'
  else if (current === 'high') next = 'low'

  emit('update-priority', {
    id: props.task.id,
    priority: next,
  })
}
</script>
