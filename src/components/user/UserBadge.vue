<template>

  <div
    class="UserBadge
      flex items-center
      gap-2.5
      mb-5
      px-3 py-1.5
      rounded-md
      bg-neutral-100 dark:bg-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600
      text-sm text-neutral-800 dark:text-neutral-100 hover:text-neutral-950 dark:hover:text-neutral-100
      border border-neutral-200 dark:border-neutral-500 hover:border-neutral-600
      cursor-pointer
      ">
    <img
      class="w-10 h-10 rounded-full"
      :src="image"
      :alt="name">
    <div class="text-neutral-800 dark:text-neutral-100">
      <p class=" text-sm font-normal">{{ name }}</p>
      <p class=" text-sm font-normal">{{ subtitle }}</p>
    </div>
  </div>

</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>

</style>
