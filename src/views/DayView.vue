<template>
  <div class="grid min-h-full grid-cols-1 gap-4 lg:grid-cols-5">
    <div class="space-y-4 lg:col-span-3">
      <TaskCategoryCard
        title="Arbeit"
        :tasks="arbeitTasks"
        :dragged-task-id="draggedTask?.id ?? null"
        @add-task="addTask('arbeitTasks')"
        @remove-task="task => removeTask(task, 'arbeitTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'arbeitTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'arbeitTasks')"
        @update-title="payload => updateTaskTitle(payload, 'arbeitTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'arbeitTasks')"
        @drag-start="task => handleDragStart(task, 'arbeitTasks')"
        @drag-end="handleDragEnd"
        @drop-task="payload => handleDrop(payload, 'arbeitTasks')"
        @drop-category="handleCategoryDrop('arbeitTasks')"
      />

      <TaskCategoryCard
        title="Familie"
        :tasks="familieTasks"
        :dragged-task-id="draggedTask?.id ?? null"
        @add-task="addTask('familieTasks')"
        @remove-task="task => removeTask(task, 'familieTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'familieTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'familieTasks')"
        @update-title="payload => updateTaskTitle(payload, 'familieTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'familieTasks')"
        @drag-start="task => handleDragStart(task, 'familieTasks')"
        @drag-end="handleDragEnd"
        @drop-task="payload => handleDrop(payload, 'familieTasks')"
        @drop-category="handleCategoryDrop('familieTasks')"
      />

      <TaskCategoryCard
        title="Persönlich"
        :tasks="persoenlichTasks"
        :dragged-task-id="draggedTask?.id ?? null"
        @add-task="addTask('persoenlichTasks')"
        @remove-task="task => removeTask(task, 'persoenlichTasks')"
        @toggle-completed="task => toggleTaskCompleted(task, 'persoenlichTasks')"
        @move-to-tomorrow="task => moveTaskToTomorrow(task, 'persoenlichTasks')"
        @update-title="payload => updateTaskTitle(payload, 'persoenlichTasks')"
        @update-priority="payload => updateTaskPriority(payload, 'persoenlichTasks')"
        @drag-start="task => handleDragStart(task, 'persoenlichTasks')"
        @drag-end="handleDragEnd"
        @drop-task="payload => handleDrop(payload, 'persoenlichTasks')"
        @drop-category="handleCategoryDrop('persoenlichTasks')"
      />
    </div>

    <AppointmentSection
      :appointments="appointments"
      @add-appointment="addAppointment"
      @update-appointment="updateAppointment"
      @remove-appointment="removeAppointment"
    />
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
        { id: 1, start: '14:30', end: '15:00', title: 'Ilias abholen' },
        { id: 2, start: '15:00', end: '15:30', title: 'Leon abholen' },
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

    handleDrop(payload, targetListName) {
      if (!this.draggedTask || !this.draggedFromList) return

      const { task: targetTask, position } = payload

      const sourceList = [...this[this.draggedFromList]]
      const targetList = [...this[targetListName]]

      const sourceIndex = sourceList.findIndex(item => item.id === this.draggedTask.id)
      const targetIndex = targetList.findIndex(item => item.id === targetTask.id)

      if (sourceIndex === -1 || targetIndex === -1) return

      if (this.draggedFromList === targetListName) {
        const movingInSameList = [...targetList]
        const currentIndex = movingInSameList.findIndex(item => item.id === this.draggedTask.id)
        const [movedItem] = movingInSameList.splice(currentIndex, 1)

        let insertIndex = movingInSameList.findIndex(item => item.id === targetTask.id)

        if (insertIndex === -1) return

        if (position === 'after') {
          insertIndex += 1
        }

        movingInSameList.splice(insertIndex, 0, movedItem)
        this[targetListName] = movingInSameList
      } else {
        const [movedItem] = sourceList.splice(sourceIndex, 1)

        let insertIndex = targetList.findIndex(item => item.id === targetTask.id)

        if (insertIndex === -1) return

        if (position === 'after') {
          insertIndex += 1
        }

        targetList.splice(insertIndex, 0, movedItem)

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

    handleDragEnd() {
      this.draggedTask = null
      this.draggedFromList = null
    },


    // Appointments:

    addAppointment() {
      const newAppointment = {
        id: Date.now(),
        start: '',
        end: '',
        title: '',
        isNew: true,
      }

      this.appointments.push(newAppointment)
    },

    updateAppointment(payload) {
      const currentAppointment = this.appointments.find(
        item => item.id === payload.id
      )

      if (!currentAppointment) {
        return { success: false }
      }

      const updatedAppointment = {
        ...currentAppointment,
        start: payload.start,
        end: payload.end,
        title: payload.title,
      }

      if (this.hasAppointmentOverlap(updatedAppointment)) {
        return {
          success: false,
          error: 'overlap',
        }
      }

      currentAppointment.start = payload.start
      currentAppointment.end = payload.end
      currentAppointment.title = payload.title
      currentAppointment.isNew = false

      this.sortAppointments()

      return { success: true }
    },

    removeAppointment(appointment) {
      this.appointments = this.appointments.filter(
        item => item.id !== appointment.id
      )
    },

    sortAppointments() {
      this.appointments = [...this.appointments].sort((a, b) =>
        a.start.localeCompare(b.start)
      )
    },

    hasAppointmentOverlap( updateAppointment ) {
      return this.appointments.some((appointment) => () => {
        if (appointment.id === updateAppointment.id ) {
          return false;
        }
        return updateAppointment.start < appointment.end && updateAppointment.end > appointment.start
      })
    }
  },
}
</script>
