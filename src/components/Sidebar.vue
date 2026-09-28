<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  activeSection: {
    type: String,
    required: true,
  },
})

const sideMenu = [
  { key: 'todos', label: 'TODOs', path: '/dashboard/todos' },
  { key: 'notes', label: 'Notes', path: '/dashboard/notes' },
]
</script>

<template>
  <aside class="sidebar" aria-label="Workspace navigation">
    <p class="sidebar-heading">Workspace</p>
    <nav class="section-list" aria-label="Workspace sections">
      <RouterLink
        v-for="section in sideMenu"
        :key="section.key"
        class="section-link"
        :class="{ active: activeSection === section.key }"
        :to="section.path"
        :aria-current="activeSection === section.key ? 'page' : undefined"
      >
        <span class="section-icon" aria-hidden="true">{{ section.key === 'todos' ? '✓' : '≡' }}</span>
        {{ section.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar { padding: 36px 18px; border-right: 1px solid #d9ddd4; background: #eeefe8; }
.sidebar-heading { margin: 0 12px 14px; color: #78877b; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.section-list { display: grid; gap: 4px; }
.section-link { min-height: 44px; display: flex; align-items: center; gap: 12px; border: 0; border-radius: 3px; padding: 0 12px; background: transparent; color: #52665c; font: inherit; font-size: 14px; text-align: left; cursor: pointer; }
.section-link:hover { background: #e3e7dd; }
.section-link.active { background: #dce7dd; color: #183f3a; font-weight: 700; }
.section-icon { width: 20px; color: #668074; font-size: 17px; text-align: center; }
@media (max-width: 640px) {
  .sidebar { padding: 16px 20px; border-right: 0; border-bottom: 1px solid #d9ddd4; }
  .sidebar-heading { margin: 0 0 10px; }
  .section-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
</style>