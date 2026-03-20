<template>
  <section class="rounded-xl bg-indigo-100 p-4 shadow-sm">
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

    <ul class="mb-2 space-y-2">
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @toggle-completed="$emit('toggle-completed', $event)"
        @move-to-tomorrow="$emit('move-to-tomorrow', $event)"
        @update-title="$emit('update-title', $event)"
        @update-priority="$emit('update-priority', $event)"
        @drag-start="$emit('drag-start', $event)"
        @drop-task="$emit('drop-task', $event)"
      />
    </ul>
  </section>
</template>

<script setup>
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

defineEmits([
  'add-task',
  'toggle-completed',
  'move-to-tomorrow',
  'update-title',
  'update-priority',
  'drag-start',
  'drop-task',
])
</script>
