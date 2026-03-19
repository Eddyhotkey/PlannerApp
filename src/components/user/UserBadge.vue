<template>

  <div
    class="UserBadge p-3 bg-indigo-600 rounded-base shadow-xl/20 mb-5 flex items-center gap-2.5">
    <img
      class="w-10 h-10 rounded-full"
      :src="image"
      :alt="name">
    <div class="font-medium text-heading">
      <p class="text-white text-sm font-normal">{{ name }}</p>
      <p class="text-white text-sm font-normal">{{ subtitle }}</p>
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
