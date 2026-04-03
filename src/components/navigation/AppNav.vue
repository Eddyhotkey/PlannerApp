<template>
  <nav class="AppNav">
    <ul class="AppNav_list">
      <li
        class="AppNav_item"
        v-for="item in menuItems"
        :key="item.name"
      >
        <router-link
          :to="'/' + item.path"
          class="
          flex items-center justify-between
          mb-2
          text-md font-300
          rounded-md border border-neutral-200 bg-neutral-100 cursor-pointer px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-300"
          active-class="bg-neutral-200 border-neutral-300 text-neutral-950"
        >
          {{ item.meta.label }} <IconArrowRight/>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup >
// Damit können wir einen berechneten (reaktiven) Wert erstellen;
import { computed } from 'vue'
// Damit bekommen wir Zugriff auf den Router bekommen;
import { useRouter } from 'vue-router'
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
// Zugriff auf alle Router-Konfigurationen;
const router = useRouter();
// erstellt eine berechnete reaktive Variable.
// Vue berechnet den Inhalt automatisch neu,
// wenn sich abhängige Daten ändern.
const menuItems = computed( () => {
  // sucht in der Router-Konfiguration die Route,
  // die Kinder-Routen besitzt (children).
  // In deinem Fall ist das die Route mit MainLayout.
  const layoutRoute = router.options.routes.find( route => route.children?.length );

  // nimmt die Child-Routen dieser Layout-Route
  // und filtert nur diejenigen heraus,
  // die im meta-Feld "menu: true" gesetzt haben.
  // Dadurch erscheinen nur diese im Sidebar-Menü.
  // "?? []" sorgt dafür, dass ein leeres Array zurückkommt,
  // falls nichts gefunden wird (damit kein Fehler entsteht).
  return layoutRoute?.children?.filter( route => route.meta?.menu ) ?? []
});
</script>

<style scoped>

</style>
