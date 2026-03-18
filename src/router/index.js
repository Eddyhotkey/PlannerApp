import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import DayView from "@/views/DayView.vue";
import MainLayout from "@/layouts/MainLayout.vue";
import WeekView from "@/views/WeekView.vue";
import MonthView from "@/views/MonthView.vue";
import YearView from "@/views/YearView.vue";

const routes = [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'day',
          name: 'day',
          component: DayView,
          meta: { label: 'Tag', menu: true }
        },
        {
          path: 'week',
          name: 'week',
          component: WeekView,
          meta: {
            label: 'Woche',
            menu: true,
          }
        },
        {
          path: 'month',
          name: 'month',
          component: MonthView,
          meta: {
            label:'Monat',
            menu: true,
          }
        },
        {
          path: 'year',
          name: 'year',
          component: YearView,
          meta: {
            label: 'Jahr',
            menu: true,
          }
        }
      ],
    }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
