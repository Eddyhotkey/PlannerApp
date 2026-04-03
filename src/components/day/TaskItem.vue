<template>
  <li
    :class="[
      'relative flex cursor-grab items-center gap-1 rounded-md border border-neutral-200 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-700 p-2 transition-all duration-150',
      isDragging
        ? 'z-10 scale-[0.90] cursor-grabbing border-dashed border-neutral-400 opacity-50 shadow-md ring-1 ring-neutral-300'
        : 'hover:shadow-md',
      isDropTarget ? 'bg-neutral-50' : '',
      isDropTarget && dropPosition === 'before' ? 'mt-3' : '',
      isDropTarget && dropPosition === 'after' ? 'mb-3' : '',
    ]"
    draggable="true"
    @dragstart="$emit('drag-start', task)"
    @dragend="$emit('drag-end')"
    @dragover.prevent="handleDragOver"
    @dragleave="$emit('drag-leave-task', task)"
    @drop="handleDrop"
  >
    <div
      v-if="isDropTarget && dropPosition === 'before'"
      class="absolute left-3 right-3 top-0 h-1 rounded-full bg-neutral-500"
    ></div>

    <div
      v-if="isDropTarget && dropPosition === 'after'"
      class="absolute left-3 right-3 bottom-0 h-1 rounded-full bg-neutral-500"
    ></div>

    <input
      :checked="task.completed"
      type="checkbox"
      class="h-5 w-5 bg-neutral-300 cursor-pointer rounded-lg text-neutral-400 dark:text-neutral-400
      border border-neutral-200 dark:border-neutral-500"
      @change="$emit('toggle-completed', task)"
    />
    <div></div>
    <div class="flex-1">
      <template v-if="isEditing">
        <input
          ref="titleInput"
          v-model="localTitle"
          type="text"
          class="w-full rounded-md border border-neutral-300 px-2 py-1 text-sm"
          @keyup.enter="saveEdit"
          @keyup.esc="cancelEdit"
          @blur="saveEdit"
        />
      </template>

      <template v-else>
        <div
          :class="[
            'text-sm transition',
            task.completed ? 'line-through text-neutral-400 dark:text-neutral-400' :
            'text-neutral-700 dark:text-white'
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
      class="rounded-md px-2 py-1 text-xs text-neutral-500 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-400 cursor-pointer"
      @mousedown.prevent
      @click="cyclePriority"
    >
      Priorität
    </button>

    <button
      v-if="!task.completed && !isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-neutral-500 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-red-400 cursor-pointer"
      @click="$emit('move-to-tomorrow', task)"
    >
      Morgen
    </button>

    <button
      v-if="!isEditing"
      type="button"
      class="cursor-pointer rounded-md text-xs"
      @click="$emit('start-editing', task)"
    >
      <IconEdit />
    </button>

    <button
      v-if="!isEditing"
      type="button"
      class="cursor-pointer rounded-md text-xs"
      @click="removeTask"
    >
      <IconTrash />
    </button>
  </li>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import IconTrash from '@/components/icons/IconTrash.vue'

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  isDropTarget: {
    type: Boolean,
    default: false,
  },
  dropPosition: {
    type: String,
    default: null,
  },
  isDragging: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'toggle-completed',
  'move-to-tomorrow',
  'update-title',
  'update-priority',
  'drag-start',
  'drag-end',
  'drop-task',
  'remove-task',
  'drag-over-task',
  'drag-leave-task',
  'start-editing',
  'cancel-editing',
])

const localTitle = ref(props.task.title)
const titleInput = ref(null)

watch(
  () => props.task.title,
  (newValue) => {
    localTitle.value = newValue
  }
)

watch(
  () => props.isEditing,
  async (value) => {
    if (value) {
      localTitle.value = props.task.title === 'Neue Aufgabe' ? '' : props.task.title
      await nextTick()
      titleInput.value?.focus()
      titleInput.value?.select()
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
  if (props.task.priority === 'low') return 'bg-neutral-100 text-neutral-600'
  return 'bg-amber-100 text-amber-700'
})

function saveEdit() {
  const trimmed = localTitle.value.trim()

  // 🔥 NEU: wenn leer → löschen
  if (!trimmed) {
    emit('remove-task', props.task)
    return
  }

  emit('update-title', {
    id: props.task.id,
    title: trimmed,
  })
}

function cancelEdit() {
  const trimmed = localTitle.value.trim()
  emit('cancel-editing', {
    id: props.task.id,
    title: trimmed,
  })
}

function removeTask() {
  emit('remove-task', props.task)
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

function getDropPosition(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  const offsetY = event.clientY - rect.top
  const middleY = rect.height / 2

  return offsetY < middleY ? 'before' : 'after'
}

function handleDragOver(event) {
  const position = getDropPosition(event)

  emit('drag-over-task', {
    task: props.task,
    position,
  })
}

function handleDrop(event) {
  const position = getDropPosition(event)

  emit('drop-task', {
    targetTask: props.task,
    position,
  })
}
</script>
