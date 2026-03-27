<template>
  <section
    :class="[
      'rounded-xl border bg-slate-50 p-4 transition',
      isDragOver
        ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200'
        : 'border-slate-200'
    ]"
    @dragenter.prevent="handleDragEnter"
    @dragover.prevent="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDropCategory"
  >
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-lg font-semibold text-slate-800">{{ title }}</h2>

      <button
        type="button"
        class="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
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
        :is-drop-target="dropTargetTaskId === task.id"
        @remove-task="$emit( 'remove-task', $event )"
        @toggle-completed="$emit('toggle-completed', $event)"
        @move-to-tomorrow="$emit('move-to-tomorrow', $event)"
        @update-title="$emit('update-title', $event)"
        @update-priority="$emit('update-priority', $event)"
        @drag-start="handleTaskDragStart"
        @drag-over-task="handleTaskDragOver"
        @drag-leave-task="handleTaskDragLeave"
        @drop-task="handleTaskDrop"
      />
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TaskItem from '@/components/day/TaskItem.vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: true,
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
  'drop-task',
  'drop-category',
])

const isDragOver = ref(false);
const dropTargetTaskId = ref( null );

function handleDragEnter( ) {
  isDragOver.value = true;
}

function handleDragOver( ) {
  isDragOver.value = true;
}

function handleDragLeave ( event ) {
  const currentTarget = event.currentTarget;
  const relatedTarget = event.relatedTarget;

  if ( !currentTarget.contains( relatedTarget ) ) {
    isDragOver.value = false;
  }
}

function handleDropCategory( ) {
  isDragOver.value = false;
  emit( 'drop-category' );
}

function handleTaskDragStart ( task ) {
  emit( 'drag-start', task );
}

function handleTaskDragOver ( task ) {
  isDragOver.value = true;
  dropTargetTaskId.value = task.id;
}

function handleTaskDragLeave ( ) {
  dropTargetTaskId.value =null;
}

function handleTaskDrop( task ) {
  isDragOver.value = false;
  dropTargetTaskId.value = null;
  emit( 'drop-task', task)
}

</script>
