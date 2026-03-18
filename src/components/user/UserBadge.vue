<template>

  <div class="UserBadge mb-5 flex items-center gap-2.5">
    <img
      class="w-10 h-10 rounded-full"
      :src="image"
      :alt="name">
    <div class="font-medium text-heading">
      <p>{{ name }}</p>
      <p class="text-sm font-normal text-body">{{ subtitle }}</p>
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
