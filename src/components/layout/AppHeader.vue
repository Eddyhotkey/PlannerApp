<template>
  <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
    <DayNavigator />
    <PeriodNavigator />
  </div>
</template>

<script setup>
import DayNavigator from "@/components/navigation/DayNavigator.vue"
import PeriodNavigator from "@/components/navigation/PeriodNavigator.vue"
</script>
