import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchEntriesByDate,
  createEntry,
  updateEntry,
  deleteEntry,
} from '@/services/api'

function mapEntryFromApi(entry) {
  return {
    ...entry,
    completed: Boolean(entry.is_completed),
    start: entry.start_time ? entry.start_time.slice(0, 5) : '',
    end: entry.end_time ? entry.end_time.slice(0, 5) : '',
  }
}

export const useTaskStore = defineStore('task', () => {
  const entries = ref([])
  const isLoading = ref(false)
  const error = ref('')
  const activeDate = ref('')
  const lastCreatedTaskId = ref(null)
  const lastCreatedAppointmentId = ref(null)
  const draggedTaskId = ref(null)
  const draggedTask = ref(null)

  const mappedEntries = computed(() => {
    return entries.value.map(mapEntryFromApi)
  })

  const tasks = computed(() =>
    mappedEntries.value.filter(entry => entry.entry_type === 'task')
  )

  const appointments = computed(() =>
    mappedEntries.value
      .filter(entry => entry.entry_type === 'appointment')
      .sort((a, b) => {
        if (a.start === b.start) return a.id - b.id
        return a.start.localeCompare(b.start)
      })
  )

  const arbeitTasks = computed(() =>
    tasks.value.filter(task => task.category === 'arbeit')
  )

  const familieTasks = computed(() =>
    tasks.value.filter(task => task.category === 'familie')
  )

  const persoenlichTasks = computed(() =>
    tasks.value.filter(task => task.category === 'persoenlich')
  )

  async function loadEntries(date) {
    if (!date) return

    isLoading.value = true
    error.value = ''

    try {
      activeDate.value = date
      const data = await fetchEntriesByDate(date)
      entries.value = data.entries ?? []
    } catch (err) {
      error.value = err.message || 'Fehler beim Laden'
    } finally {
      isLoading.value = false
    }
  }

  function normalizeTaskOrders(taskList, category) {
    return taskList.map((task, index) => ({
      ...task,
      category,
      sort_order: index + 1,
    }))
  }

  async function persistTaskOrder(taskList) {
    for (const task of taskList) {
      await updateEntry({
        id: task.id,
        category: task.category,
        sort_order: task.sort_order,
      })
    }

    await loadEntries(activeDate.value)
  }


  // Tasks;
  async function addTask(category) {
    const data = await createEntry({
      entry_type: 'task',
      title: 'Neue Aufgabe',
      category,
      entry_date: activeDate.value,
      is_completed: 0,
      priority: 'medium',
      sort_order: getNextSortOrder(category),
    })

    lastCreatedTaskId.value = Number(data.id)

    await loadEntries(activeDate.value)
  }

  async function updateTaskTitle({ id, title }) {
    await updateEntry({
      id,
      title,
    })

    if (lastCreatedTaskId.value === id) {
      lastCreatedTaskId.value = null
    }

    await loadEntries(activeDate.value)
  }

  async function updateTaskPriority({ id, priority }) {
    await updateEntry({
      id,
      priority,
    })

    await loadEntries(activeDate.value)
  }

  async function toggleTaskCompleted(task) {
    await updateEntry({
      id: task.id,
      is_completed: task.completed ? 0 : 1,
    })

    await loadEntries(activeDate.value)
  }

  async function removeTask(task) {
    if (lastCreatedTaskId.value === task.id) {
      lastCreatedTaskId.value = null
    }

    await deleteEntry(task.id)
    await loadEntries(activeDate.value)
  }


  async function moveTaskToTomorrow(task) {
    const tomorrow = new Date(activeDate.value)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const year = tomorrow.getFullYear()
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
    const day = String(tomorrow.getDate()).padStart(2, '0')

    if (lastCreatedTaskId.value === task.id) {
      lastCreatedTaskId.value = null
    }

    await updateEntry({
      id: task.id,
      entry_date: `${year}-${month}-${day}`,
    })

    await loadEntries(activeDate.value)
  }

  // Drag & Drop;

  function startTaskDrag(task) {
    draggedTaskId.value = task.id
    draggedTask.value = task
  }

  function endTaskDrag() {
    draggedTaskId.value = null
    draggedTask.value = null
  }

  async function moveTaskToCategoryEnd(targetCategory) {
    if (!draggedTask.value) return

    const sourceTask = draggedTask.value
    const sourceCategory = sourceTask.category

    const remainingTasks = tasks.value.filter(task => task.id !== sourceTask.id)

    const targetTasks = remainingTasks.filter(task => task.category === targetCategory)

    const newTargetTasks = [
      ...targetTasks,
      {
        ...sourceTask,
        category: targetCategory,
      },
    ]

    const normalizedTarget = normalizeTaskOrders(newTargetTasks, targetCategory)

    const sourceTasks = remainingTasks.filter(task => task.category === sourceCategory)
    const normalizedSource = normalizeTaskOrders(sourceTasks, sourceCategory)

    const otherTasks = remainingTasks
      .filter(task => task.category !== sourceCategory && task.category !== targetCategory)
      .reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = []
        acc[task.category].push(task)
        return acc
      }, {})

    const normalizedOthers = Object.entries(otherTasks).flatMap(([category, list]) =>
      normalizeTaskOrders(list, category)
    )

    await persistTaskOrder([
      ...normalizedSource,
      ...normalizedTarget,
      ...normalizedOthers,
    ])

    endTaskDrag()
  }

  async function moveTaskBeforeOrAfterTask(targetTask, position) {
    if (!draggedTask.value) return

    const sourceTask = draggedTask.value

    if (sourceTask.id === targetTask.id) return

    const sourceCategory = sourceTask.category
    const targetCategory = targetTask.category

    const remainingTasks = tasks.value.filter(task => task.id !== sourceTask.id)

    // 👉 Ziel-Kategorie neu bauen
    const targetTasks = remainingTasks.filter(task => task.category === targetCategory)

    const targetIndex = targetTasks.findIndex(task => task.id === targetTask.id)
    const insertIndex = position === 'before' ? targetIndex : targetIndex + 1

    const newTargetTasks = [...targetTasks]
    newTargetTasks.splice(insertIndex, 0, {
      ...sourceTask,
      category: targetCategory,
    })

    const normalizedTarget = normalizeTaskOrders(newTargetTasks, targetCategory)

    // 👉 QUELL-Kategorie auch neu bauen !!!
    const sourceTasks = remainingTasks.filter(task => task.category === sourceCategory)

    const normalizedSource = normalizeTaskOrders(sourceTasks, sourceCategory)

    // 👉 alle anderen Kategorien
    const otherTasks = remainingTasks
      .filter(task => task.category !== sourceCategory && task.category !== targetCategory)
      .reduce((acc, task) => {
        if (!acc[task.category]) acc[task.category] = []
        acc[task.category].push(task)
        return acc
      }, {})

    const normalizedOthers = Object.entries(otherTasks).flatMap(([category, list]) =>
      normalizeTaskOrders(list, category)
    )

    await persistTaskOrder([
      ...normalizedSource,
      ...normalizedTarget,
      ...normalizedOthers,
    ])

    endTaskDrag()
  }



  // Appointments;
  async function addAppointment() {
    const data = await createEntry({
      entry_type: 'appointment',
      title: 'Neuer Termin',
      entry_date: activeDate.value,
      start_time: '09:00:00',
      end_time: '09:30:00',
      sort_order: getNextAppointmentSortOrder(),
    })

    lastCreatedAppointmentId.value = Number(data.id)

    await loadEntries(activeDate.value)
  }

  async function updateAppointment(payload) {
    const overlap = getOverlappingAppointment(payload)

    if (overlap) {
      return {
        success: false,
        error: 'overlap',
        overlappingAppointment: overlap,
      }
    }

    await updateEntry({
      id: payload.id,
      title: payload.title,
      start_time: payload.start ? `${payload.start}:00` : null,
      end_time: payload.end ? `${payload.end}:00` : null,
    })

    if (lastCreatedAppointmentId.value === payload.id) {
      lastCreatedAppointmentId.value = null
    }

    await loadEntries(activeDate.value)

    return { success: true }
  }

  async function removeAppointment(appointment) {
    if (lastCreatedAppointmentId.value === appointment.id) {
      lastCreatedAppointmentId.value = null
    }

    await deleteEntry(appointment.id)
    await loadEntries(activeDate.value)
  }

  function clearLastCreatedTaskId() {
    lastCreatedTaskId.value = null
  }

  function getNextSortOrder(category) {
    const categoryTasks = tasks.value.filter(task => task.category === category)

    if (!categoryTasks.length) return 1

    return Math.max(...categoryTasks.map(task => Number(task.sort_order) || 0)) + 1
  }

  function getNextAppointmentSortOrder() {
    if (!appointments.value.length) return 1

    return Math.max(...appointments.value.map(item => Number(item.sort_order) || 0)) + 1
  }

  function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number)
    return (hours * 60) + minutes
  }

  function getOverlappingAppointment(updatedAppointment) {
    return appointments.value.find(item => {
      if (item.id === updatedAppointment.id) return false
      if (!item.start || !item.end || !updatedAppointment.start || !updatedAppointment.end) return false

      const itemStart = timeToMinutes(item.start)
      const itemEnd = timeToMinutes(item.end)
      const updatedStart = timeToMinutes(updatedAppointment.start)
      const updatedEnd = timeToMinutes(updatedAppointment.end)

      return updatedStart < itemEnd && updatedEnd > itemStart
    })
  }

  return {
    entries,
    tasks,
    appointments,
    arbeitTasks,
    familieTasks,
    persoenlichTasks,
    isLoading,
    error,
    activeDate,
    lastCreatedTaskId,
    loadEntries,
    addTask,
    updateTaskTitle,
    updateTaskPriority,
    toggleTaskCompleted,
    removeTask,
    moveTaskToTomorrow,
    addAppointment,
    updateAppointment,
    removeAppointment,
    clearLastCreatedTaskId,
    draggedTaskId,
    startTaskDrag,
    endTaskDrag,
    moveTaskToCategoryEnd,
    moveTaskBeforeOrAfterTask,
    lastCreatedAppointmentId,
  }
})
