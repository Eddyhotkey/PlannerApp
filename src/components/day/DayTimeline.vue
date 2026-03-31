<template>
  <section class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="mb-4">
      <h2 class="text-lg font-semibold text-slate-800">Tagesplan</h2>
    </div>

    <div class="flex">
      <div class="w-20 shrink-0">
        <div
          v-for="hour in hours"
          :key="hour"
          class="relative h-[60px] pr-3 text-right text-xs text-slate-500"
        >
          <span class="absolute -top-2 right-3">
            {{ formatHour(hour) }}
          </span>
        </div>
      </div>

      <div class="relative flex-1 border-l border-slate-200">
        <div
          v-for="hour in hours"
          :key="`line-${hour}`"
          class="relative h-[60px] border-t border-slate-200"
        >
          <div class="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-100"></div>
        </div>

        <div
          v-for="appointment in positionedAppointments"
          :key="appointment.id"
          class="absolute left-3 right-3 overflow-hidden rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 shadow-sm"
          :style="{
            top: `${appointment.top}px`,
            height: `${appointment.height}px`,
          }"
        >
          <p class="truncate text-xs font-semibold text-indigo-700">
            {{ appointment.start }} – {{ appointment.end }} {{ appointment.title }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  appointments: {
    type: Array,
    required: true,
  },
  startHour: {
    type: Number,
    default: 7,
  },
  endHour: {
    type: Number,
    default: 19,
  },
})

const pixelsPerMinute = 1

const hours = computed(() => {
  const result = []

  for (let hour = props.startHour; hour <= props.endHour; hour += 1) {
    result.push(hour)
  }

  return result
})

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return (hours * 60) + minutes
}

function formatHour(hour) {
  return `${String(hour).padStart(2, '0')}:00`
}

const dayStartInMinutes = computed(() => props.startHour * 60)
const dayEndInMinutes = computed(() => props.endHour * 60)

const positionedAppointments = computed(() => {
  return props.appointments
    .filter(appointment => appointment.start && appointment.end)
    .map((appointment) => {
      const startInMinutes = timeToMinutes(appointment.start)
      const endInMinutes = timeToMinutes(appointment.end)

      const clampedStart = Math.max(startInMinutes, dayStartInMinutes.value)
      const clampedEnd = Math.min(endInMinutes, dayEndInMinutes.value)

      const top = (clampedStart - dayStartInMinutes.value) * pixelsPerMinute
      const height = Math.max((clampedEnd - clampedStart) * pixelsPerMinute, 24)

      return {
        ...appointment,
        top,
        height,
      }
    })
})
</script>
