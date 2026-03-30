<template>
  <li
    :class="[
    'relative flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm transition',
    isDragging ? 'opacity-40 ring-1 ring-slate-300 border border-dashed border-slate-400' : ''
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
      class="absolute left-3 right-3 top-0 h-1 rounded-full bg-blue-500"
    ></div>

    <div
      v-if="isDropTarget && dropPosition === 'after'"
      class="absolute left-3 right-3 top-0 h-1 rounded-full bg-blue-500"
    ></div>
    <input
      :checked="task.completed"
      type="checkbox"
      class="h-5 w-5 cursor-pointer"
      @change="$emit('toggle-completed', task)"
    />

    <div class="flex-1">
      <template v-if="isEditing">
        <input
          ref="titleInput"
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
      v-if="!task.completed && !isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
      @click="$emit('move-to-tomorrow', task)"
    >
      Morgen
    </button>


    <button
      v-if="!isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 cursor-pointer"
      @click="startEdit"
    >
      <IconEdit />
    </button>

    <button
      v-if="!isEditing"
      type="button"
      class="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
      @click="removeTask"
    >
      <IconTrash />
    </button>
  </li>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import IconEdit from "@/components/icons/IconEdit.vue";
import IconTrash from "@/components/icons/IconTrash.vue";

const props = defineProps({
  task: {
    type: Object,
    required: true,
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
])

const isEditing = ref(false)
const localTitle = ref(props.task.title)
const titleInput = ref(null)

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
  if ( props.task.isNew ) {
    emit( 'remove-task', props.task )
    return;
  }
  localTitle.value = props.task.title
  isEditing.value = false
}

function removeTask() {
  emit( 'remove-task', props.task );
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
    task: props.task,
    position,
  })
}
</script>
