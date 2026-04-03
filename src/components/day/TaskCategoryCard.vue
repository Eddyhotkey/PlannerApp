<template>
  <section
    :class="[
      'rounded-lg border\n'+
'        border-neutral-200 dark:border-neutral-600\n'+
'        bg-white dark:bg-neutral-800\n'+
'        border-neutral-200 bg-white p-4 shadow-sm transition',
      isDragOver
        ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
        : 'border-neutral-200'
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDropCategory"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-neutral-800 dark:text-neutral-100">{{ title }}</h2>

      <button
        type="button"
        class="rounded-md border border-neutral-200 bg-neutral-100 cursor-pointer px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-300"
        @click="$emit('add-task')"
      >
        + Aufgabe
      </button>
    </div>

    <p
      v-if="isDragOver"
      class="mb-3 rounded-md bg-blue-100 px-3 py-2 text-sm text-blue-700"
    >
      Aufgabe hier ablegen
    </p>

    <ul class="mb-2 space-y-2">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-editing="editingTaskId === task.id"
        :is-dragging="draggedTaskId === task.id"
        :is-drop-target="dropTargetTaskId === task.id"
        :drop-position="dropTargetTaskId === task.id ? dropPosition : null"
        @start-editing="startEditing"
        @cancel-editing="stopEditing"
        @remove-task="$emit('remove-task', $event)"
        @toggle-completed="$emit('toggle-completed', $event)"
        @move-to-tomorrow="$emit('move-to-tomorrow', $event)"
        @update-title="handleUpdateTitle"
        @update-priority="$emit('update-priority', $event)"
        @drag-start="handleTaskDragStart"
        @drag-end="$emit('drag-end')"
        @drag-over-task="handleTaskDragOver"
        @drag-leave-task="handleTaskDragLeave"
        @drop-task="handleTaskDrop"
      />
    </ul>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import TaskItem from '@/components/day/TaskItem.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
  },
  draggedTaskId: {
    type: [Number, String, null],
    default: null,
  },
  lastCreatedTaskId: {
    type: [Number, null],
    default: null,
  },
})

const emit = defineEmits([
  'add-task',
  'remove-task',
  'toggle-completed',
  'move-to-tomorrow',
  'update-title',
  'update-priority',
  'drag-start',
  'drag-end',
  'drop-task',
  'drop-category',
])

const isDragOver = ref(false)
const dropTargetTaskId = ref(null)
const dropPosition = ref(null)
const editingTaskId = ref(null)

watch(
  [() => props.lastCreatedTaskId, () => props.tasks],
  ([newId]) => {
    if (!newId) return

    const existsInThisCategory = props.tasks.some(task => task.id === newId)

    if (existsInThisCategory) {
      editingTaskId.value = newId
    }
  },
  { immediate: true, deep: true }
)

function startEditing(task) {
  editingTaskId.value = task.id
}

function stopEditing() {
  editingTaskId.value = null
}

function handleUpdateTitle(payload) {
  emit('update-title', payload)
  editingTaskId.value = null
}

function handleDragEnter() {
  isDragOver.value = true
}

function handleDragOver() {
  isDragOver.value = true
}

function handleDragLeave(event) {
  const currentTarget = event.currentTarget
  const relatedTarget = event.relatedTarget

  if (!currentTarget.contains(relatedTarget)) {
    isDragOver.value = false
  }
}

function handleTaskDragStart(task) {
  emit('drag-start', task)
}

function handleTaskDragOver(payload) {
  isDragOver.value = true
  dropTargetTaskId.value = payload.task.id
  dropPosition.value = payload.position
}

function handleTaskDragLeave() {
  dropTargetTaskId.value = null
  dropPosition.value = null
}

function handleTaskDrop(payload) {
  isDragOver.value = false
  dropTargetTaskId.value = null
  dropPosition.value = null

  emit('drop-task', payload.targetTask, payload.position)
}

function handleDropCategory() {
  isDragOver.value = false
  dropTargetTaskId.value = null
  dropPosition.value = null
  emit('drop-category')
}
</script>
