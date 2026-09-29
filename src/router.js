import { createRouter, createWebHistory } from 'vue-router'
import { hasSession } from './services/sessionService'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import DashboardLayout from './components/DashboardLayout.vue'
import TodosPage from './components/TodosPage.vue'
import NotesPage from './components/NotesPage.vue'
import NoteShowPage from './components/NoteShowPage.vue'
import NoteEditorPage from './components/NoteEditorPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard/todos' },
    { path: '/login', component: Login, meta: { guestOnly: true } },
    { path: '/signup', component: Signup, meta: { guestOnly: true } },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/dashboard/todos' },
        { path: 'todos', name: 'dashboard-todos', component: TodosPage, meta: { section: 'todos' } },
        { path: 'notes', name: 'dashboard-notes', component: NotesPage, meta: { section: 'notes' } },
        { path: 'notes/new', name: 'dashboard-note-new', component: NoteEditorPage, meta: { section: 'notes' } },
        { path: 'notes/:id', name: 'dashboard-note-show', component: NoteShowPage, meta: { section: 'notes' } },
        { path: 'notes/:id/edit', name: 'dashboard-note-edit', component: NoteEditorPage, meta: { section: 'notes' } },
      ],
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