<template>
  <div class="AppHeader_day" >
    <div class="inline-flex rounded-base shadow-xs -space-x-px" role="group">
      <button type="button"
              @click="dateStore.previousDay()"
              class="cursor-pointer inline-flex items-center justify-center text-white bg-indigo-400 rounded-s-base shadow-xl/10 hover:bg-indigo-500 hover:text-white focus:ring-3 focus:ring-neutral-tertiary leading-5 px-3 py-2 focus:outline-none">
        <IconArrowLeft />
      </button>
      <p
        class="text-white bg-indigo-400  hover:bg-indigo-400 hover:text-white focus:ring-3 focus:bg-indigo-500 font-medium shadow-xl/10 leading-5 text-sm px-3 py-2 focus:outline-none">
        {{ currentDay }} {{ currentWeekday }}
      </p>
      <button type="button"
              @click="dateStore.nextDay()"
              class="cursor-pointer inline-flex items-center justify-center text-white shadow-xl/10 bg-indigo-400 rounded-e-base  hover:bg-indigo-500 hover:text-white leading-5 px-3 py-2 focus:outline-none">
        <IconArrowRight />
      </button>
    </div>
  </div>
</template>
<script setup >

  import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
  import IconArrowRight from "@/components/icons/IconArrowRight.vue";

  import {computed} from "vue";
  import {useDateStore} from "@/stores/dateStore.js";


  const dateStore = useDateStore();
  const currentDay = computed( ( ) => {
    return dateStore.selectedDate.getDate();
  });

  const currentWeekday = computed( () => {
    return new Intl.DateTimeFormat( 'de-DE', {
      weekday: 'long'
    }).format( dateStore.selectedDate );
  });

</script>
<style scoped >

</style>
