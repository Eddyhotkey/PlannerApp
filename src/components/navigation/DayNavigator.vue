<template>
  <div class="AppHeader_day" >
    <div class="inline-flex rounded-base shadow-xs -space-x-px" role="group">
      <button type="button"
              @click="dateStore.previousDay()"
              class="cursor-pointer inline-flex items-center justify-center text-white bg-indigo-400 rounded-s-base shadow-xl/10 hover:bg-indigo-500 hover:text-white focus:ring-3 focus:ring-neutral-tertiary leading-5 px-3 py-2 focus:outline-none">
        <IconArrowLeft />
      </button>
      <p
        class="leading-6 w-40 uppercase text-center text-white bg-indigo-400  hover:bg-indigo-400 hover:text-white focus:ring-3 focus:bg-indigo-500 font-medium shadow-xl/10 text-sm px-3 py-2 focus:outline-none">
        {{ currentDay }} {{ currentWeekday }}
      </p>
      <button type="button"
              @click="dateStore.nextDay()"
              class="cursor-pointer inline-flex items-center justify-center text-white shadow-xl/10 bg-indigo-400 rounded-e-base  hover:bg-indigo-500 hover:text-white leading-5 px-3 py-2 focus:outline-none">
        <IconArrowRight />
      </button>

      <button
        type="button"
        class="uppercase cursor-pointer text-white shadow-xl/20 bg-red-400 hover:bg-red-500 px-5 py-2 rounded-base ml-4"
        @click="goToToday"
      >
        Heute
      </button>
    </div>
  </div>
</template>
<script setup >
  import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
  import IconArrowRight from "@/components/icons/IconArrowRight.vue";
  import {computed} from "vue";
  import {useDateStore} from "@/stores/dateStore.js";
  import { useRouter } from "vue-router";
  import router from "@/router/index.js";


  const dateStore = useDateStore();
  const currentDay = computed( ( ) => {
    return dateStore.selectedDate.getDate();
  });

  const currentWeekday = computed( () => {
    return new Intl.DateTimeFormat( 'de-DE', {
      weekday: 'long'
    }).format( dateStore.selectedDate );
  });

  function goToToday() {
    dateStore.setToday();
    router.push('/day');
  }

</script>
<style scoped >

</style>
