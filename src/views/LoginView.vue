<template>

  <div class="grid grid-cols-1 md:grid-cols-12 min-h-screen">

    <div class="md:col-span-7 bg-gray-50 dark:bg-gray-900 p-4">
      <img src="../assets/images/logo/logo.svg" alt="Planner Logo" class="h-screen w-full" />
    </div>

    <div class="md:col-span-5 p-4">
      <!-- LoginForm.vue Start -->
        <LoginForm />
      <!-- LoginForm.vue Stop -->
    </div>

  </div>
</template>

<script>
import LoginForm from "@/components/auth/LoginForm.vue";
export default {
  name: 'LoginView',

  components: {
    LoginForm,
  }
}
</script>

<style scoped>

</style>
