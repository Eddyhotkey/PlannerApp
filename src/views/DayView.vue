<template>
  <div class="grid min-h-full grid-cols-1 gap-4 lg:grid-cols-5">
    <div class="space-y-4 lg:col-span-3">
      <TaskCategoryCard
        title="Arbeit"
        :tasks="arbeitTasks"
        @add-task="addTask('arbeitTasks')"
        @remove-task="task => removeTask(task, 'arbeitTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'arbeitTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'arbeitTasks')"
        @update-title="payload => updateTaskTitle(payload, 'arbeitTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'arbeitTasks')"
        @drag-start="task => handleDragStart(task, 'arbeitTasks')"
        @drop-task="task => handleDrop(task, 'arbeitTasks')"
        @drop-category="handleCategoryDrop('arbeitTasks')"
      />

      <TaskCategoryCard
        title="Familie"
        :tasks="familieTasks"
        @add-task="addTask('familieTasks')"
        @remove-task="task => removeTask(task, 'familieTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'familieTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'familieTasks')"
        @update-title="payload => updateTaskTitle(payload, 'familieTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'familieTasks')"
        @drag-start="task => handleDragStart(task, 'familieTasks')"
        @drop-task="task => handleDrop(task, 'familieTasks')"
        @drop-category="handleCategoryDrop('familieTasks')"
      />

      <TaskCategoryCard
        title="Persönlich"
        :tasks="persoenlichTasks"
        @add-task="addTask('persoenlichTasks')"
        @remove-task="task => removeTask(task, 'persoenlichTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'persoenlichTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'persoenlichTasks')"
        @update-title="payload => updateTaskTitle(payload, 'persoenlichTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'persoenlichTasks')"
        @drag-start="task => handleDragStart(task, 'persoenlichTasks')"
        @drop-task="task => handleDrop(task, 'persoenlichTasks')"
        @drop-category="handleCategoryDrop('persoenlichTasks')"
      />
    </div>

    <AppointmentSection :appointments="appointments" />
  </div>
</template>

<script>
import AppointmentSection from '@/components/day/AppointmentSection.vue'
import TaskCategoryCard from '@/components/day/TaskCategoryCard.vue'

export default {
  name: 'DayView',

  components: {
    AppointmentSection,
    TaskCategoryCard,
  },

  data() {
    return {
      draggedTask: null,
      draggedFromList: null,

      arbeitTasks: [
        { id: 1, title: 'Kunden anrufen', completed: false, priority: 'high' },
        { id: 2, title: 'Angebot erstellen', completed: true, priority: 'medium' },
      ],
      familieTasks: [
        { id: 3, title: 'Einkaufen', completed: false, priority: 'medium' },
        { id: 4, title: 'Mit Leon lesen', completed: false, priority: 'low' },
      ],
      persoenlichTasks: [
        { id: 5, title: 'Sport', completed: true, priority: 'medium' },
        { id: 6, title: 'Vue lernen', completed: false, priority: 'high' },
      ],
      appointments: [
        { id: 1, time: '14:30', title: 'Ilias abholen' },
        { id: 2, time: '15:00', title: 'Leon abholen' },
      ],
    }
  },

  methods: {
    addTask(listName) {
      const newTask = {
        id: Date.now(),
        title: '',
        completed: false,
        priority: 'medium',
        isNew: true,
      }

      this[listName].push(newTask)
    },

    removeTask(task, listName) {
      this[listName] = this[listName].filter(item => item.id !== task.id)
    },

    toggleTaskCompleted(task, listName) {
      const currentTask = this[listName].find(item => item.id === task.id)

      if (currentTask) {
        currentTask.completed = !currentTask.completed
      }
    },

    moveTaskToTomorrow(task, listName) {
      this[listName] = this[listName].filter(item => item.id !== task.id)
    },

    updateTaskTitle(payload, listName) {
      const currentTask = this[listName].find(item => item.id === payload.id)

      if (currentTask) {
        currentTask.title = payload.title
        currentTask.isNew = false
      }
    },

    updateTaskPriority(payload, listName) {
      const currentTask = this[listName].find(item => item.id === payload.id)

      if (currentTask) {
        currentTask.priority = payload.priority
      }
    },

    handleDragStart(task, listName) {
      this.draggedTask = task
      this.draggedFromList = listName
    },

    handleDrop(targetTask, targetListName) {
      if (!this.draggedTask || !this.draggedFromList) return

      const sourceList = [...this[this.draggedFromList]]
      const targetList = [...this[targetListName]]

      const sourceIndex = sourceList.findIndex(item => item.id === this.draggedTask.id)
      const targetIndex = targetList.findIndex(item => item.id === targetTask.id)

      if (sourceIndex === -1 || targetIndex === -1) return

      if (this.draggedFromList === targetListName) {
        const [movedItem] = targetList.splice(sourceIndex, 1)
        targetList.splice(targetIndex, 0, movedItem)
        this[targetListName] = targetList
      } else {
        const [movedItem] = sourceList.splice(sourceIndex, 1)
        targetList.splice(targetIndex, 0, movedItem)

        this[this.draggedFromList] = sourceList
        this[targetListName] = targetList
      }

      this.draggedTask = null
      this.draggedFromList = null
    },

    handleCategoryDrop(targetListName) {
      if (!this.draggedTask || !this.draggedFromList) return
      if (this.draggedFromList === targetListName) return

      const sourceList = [...this[this.draggedFromList]]
      const targetList = [...this[targetListName]]

      const sourceIndex = sourceList.findIndex(item => item.id === this.draggedTask.id)

      if (sourceIndex === -1) return

      const [movedItem] = sourceList.splice(sourceIndex, 1)
      targetList.push(movedItem)

      this[this.draggedFromList] = sourceList
      this[targetListName] = targetList

      this.draggedTask = null
      this.draggedFromList = null
    },
  },
}
</script>
