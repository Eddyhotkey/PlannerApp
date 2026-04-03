<template>
  <div class="grid min-h-full grid-cols-1 gap-2 lg:grid-cols-5">
    <div class="space-y-2 lg:col-span-3">
      <TaskCategoryCard
        title="Arbeit"
        :tasks="taskStore.arbeitTasks"
        :last-created-task-id="taskStore.lastCreatedTaskId"
        :dragged-task-id="taskStore.draggedTaskId"
        @add-task="taskStore.addTask('arbeit')"
        @remove-task="taskStore.removeTask"
        @toggle-completed="taskStore.toggleTaskCompleted"
        @move-to-tomorrow="taskStore.moveTaskToTomorrow"
        @update-title="taskStore.updateTaskTitle"
        @update-priority="taskStore.updateTaskPriority"
        @drag-start="taskStore.startTaskDrag"
        @drag-end="taskStore.endTaskDrag"
        @drop-task="taskStore.moveTaskBeforeOrAfterTask"
        @drop-category="taskStore.moveTaskToCategoryEnd('arbeit')"
      />

      <TaskCategoryCard
        title="Familie"
        :tasks="taskStore.familieTasks"
        :last-created-task-id="taskStore.lastCreatedTaskId"
        :dragged-task-id="taskStore.draggedTaskId"
        @add-task="taskStore.addTask('familie')"
        @remove-task="taskStore.removeTask"
        @toggle-completed="taskStore.toggleTaskCompleted"
        @move-to-tomorrow="taskStore.moveTaskToTomorrow"
        @update-title="taskStore.updateTaskTitle"
        @update-priority="taskStore.updateTaskPriority"
        @drag-start="taskStore.startTaskDrag"
        @drag-end="taskStore.endTaskDrag"
        @drop-task="taskStore.moveTaskBeforeOrAfterTask"
        @drop-category="taskStore.moveTaskToCategoryEnd('familie')"
      />

      <TaskCategoryCard
        title="Persönlich"
        :tasks="taskStore.persoenlichTasks"
        :last-created-task-id="taskStore.lastCreatedTaskId"
        :dragged-task-id="taskStore.draggedTaskId"
        @add-task="taskStore.addTask('persoenlich')"
        @remove-task="taskStore.removeTask"
        @toggle-completed="taskStore.toggleTaskCompleted"
        @move-to-tomorrow="taskStore.moveTaskToTomorrow"
        @update-title="taskStore.updateTaskTitle"
        @update-priority="taskStore.updateTaskPriority"
        @drag-start="taskStore.startTaskDrag"
        @drag-end="taskStore.endTaskDrag"
        @drop-task="taskStore.moveTaskBeforeOrAfterTask"
        @drop-category="taskStore.moveTaskToCategoryEnd('persoenlich')"
      />
    </div>

    <div class="space-y-2 lg:col-span-2">
      <AppointmentSection
        :appointments="taskStore.appointments"
        :last-created-appointment-id="taskStore.lastCreatedAppointmentId"
        :save-appointment="taskStore.updateAppointment"
        :delete-appointment="taskStore.removeAppointment"
        @add-appointment="taskStore.addAppointment"
      />

      <DayTimeline :appointments="taskStore.appointments" />
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useDateStore } from '@/stores/dateStore'
import { useTaskStore } from '@/stores/taskStore'
import { formatDateToApi } from '@/utils/date'

import AppointmentSection from '@/components/day/AppointmentSection.vue'
import TaskCategoryCard from '@/components/day/TaskCategoryCard.vue'
import DayTimeline from '@/components/day/DayTimeline.vue'

const dateStore = useDateStore()
const taskStore = useTaskStore()

const { selectedDate } = storeToRefs(dateStore)

watch(
  selectedDate,
  (date) => {
    taskStore.loadEntries(formatDateToApi(date))
  },
  { immediate: true }
)
</script>
