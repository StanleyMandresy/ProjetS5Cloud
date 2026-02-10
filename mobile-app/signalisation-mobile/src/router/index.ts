import { createRouter, createWebHistory } from '@ionic/vue-router'
import { RouteRecordRaw } from 'vue-router'
import Map from '@/pages/Map.vue'
import ReportForm from '@/pages/ReportForm.vue'
import Reports from '@/pages/Reports.vue'
import ReportDetail from '@/pages/ReportDetail.vue'



// Pages simples
import Login from '@/pages/Login.vue'
import Home from '@/pages/Home.vue'

// Tabs
import TabsPage from '@/views/TabsPage.vue'

const routes: Array<RouteRecordRaw> = [
  // 🔐 Page par défaut → Login
  {
    path: '/',
    redirect: '/login'
  },

  // 🔐 Login
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // 🏠 Home (après login)
  {
    path: '/home',
    name: 'Home',
    component: Home
  },

  {
  path: '/reports',
  name: 'Reports',
  component: Reports
 },
  
  {
  path: '/map',
  name: 'Map',
  component: Map
  },
  {
  path: '/report',
  name: 'ReportForm',
  component: ReportForm
 },

  // 📸 Détail d'un signalement
  {
    path: '/report/:id',
    name: 'ReportDetail',
    component: ReportDetail
  },


  // 📱 Application principale avec Tabs
  {
    path: '/tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        name: 'Tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        name: 'Tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        name: 'Tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
