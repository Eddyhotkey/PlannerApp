<template>
  <div class="AppHeader_day" >
    <div class="inline-flex rounded-base shadow-xs -space-x-px" role="group">
      <button type="button"
              class="cursor-pointer inline-flex items-center justify-center text-body bg-neutral-primary-soft rounded-s-base box-border border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary leading-5 px-3 py-2 focus:outline-none">
        <IconArrowLeft />
      </button>
      <p
        class="text-body bg-neutral-primary-soft border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary-soft font-medium leading-5 text-sm px-3 py-2 focus:outline-none">
        16 Montag
      </p>
      <button type="button"
              class="cursor-pointer inline-flex items-center justify-center text-body bg-neutral-primary-soft rounded-e-base box-border border border-default hover:bg-neutral-secondary-medium hover:text-heading focus:ring-3 focus:ring-neutral-tertiary leading-5 px-3 py-2 focus:outline-none">
        <IconArrowRight />
      </button>
    </div>
  </div>
</template>
<script setup >

import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
</script>
<style scoped >

</style>
