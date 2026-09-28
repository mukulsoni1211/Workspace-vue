import { createRouter, createWebHistory } from 'vue-router'
import { hasSession } from './services/sessionService'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import LoggedIn from './components/LoggedIn.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard/todos' },
    { path: '/login', component: Login, meta: { guestOnly: true } },
    { path: '/signup', component: Signup, meta: { guestOnly: true } },
    {
      path: '/dashboard/:section(todos|notes)',
      component: LoggedIn,
      props: (route) => ({ section: route.params.section }),
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const isAuthenticated = hasSession()

  if (to.meta.requiresAuth && !isAuthenticated) return '/login'
  if (to.meta.guestOnly && isAuthenticated) return '/dashboard/todos'
  if (to.path === '/') return isAuthenticated ? '/dashboard/todos' : '/login'
})

export default router