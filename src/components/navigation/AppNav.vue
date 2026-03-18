<template>
  <nav class="main_nav">
    <ul>
      <li
        v-for="item in menuItems"
        :key="item.name"
      >
        <router-link
          :to="'/' + item.path"
          class="block p-2"
        >
          {{ item.meta.label }}
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
