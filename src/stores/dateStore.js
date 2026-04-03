import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDateStore = defineStore( 'date', ( ) => {
  const selectedDate = ref( new Date() )
  // Current Year;
  const currentYear = computed( () => selectedDate.value.getFullYear());

  // Current Month;
  const currentMonth = computed( () => {
    return new Intl.DateTimeFormat( 'de-DE', { month: 'long' } ).format( selectedDate.value );
  });

  // Current Week;
  const currentWeek = computed( () => {
    return getCalendarWeek( selectedDate.value );
  });

  function nextDay( ) {
    const newDate = new Date( selectedDate.value );
    newDate.setDate( newDate.getDate() + 1 );
    selectedDate.value = newDate;
  }

  function previousDay() {
    const newDate = new Date( selectedDate.value );
    newDate.setDate( newDate.getDate() - 1 );
    selectedDate.value = newDate;
  }

  function setDate( date ) {
    selectedDate.value = new Date( date );
  }
  function setToday() {
    selectedDate.value = new Date();
  }

  function getCalendarWeek( date ) {
    const currentDate = new Date( Date.UTC( date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = currentDate.getUTCDay() || 7;
    currentDate.setUTCDate( currentDate.getUTCDate() + 4 - dayNum );
    const yearStart = new Date( Date.UTC( currentDate.getUTCFullYear(), 0, 1 ));
    return Math.ceil(( ( ( currentDate - yearStart ) / 86400000 ) + 1 ) / 7 )
  }

  return {
    selectedDate,
    currentYear,
    currentMonth,
    currentWeek,
    nextDay,
    previousDay,
    setDate,
    setToday
  }
});


