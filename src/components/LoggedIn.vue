<script setup>
import { ref } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

defineProps({
  name: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['logout'])

const activeSection = ref('TODOs')
</script>

<template>
  <main class="logged-in-page">
    <Topbar :name="name" @logout="emit('logout')" />

    <div class="workspace-layout">
      <Sidebar :active-section="activeSection" @select="activeSection = $event" />

      <section class="content" :aria-labelledby="'section-title'">
        <p class="eyebrow">Personal workspace</p>
        <h1 id="section-title">{{ activeSection }}</h1>
        <div class="empty-state">
          <span class="empty-mark" aria-hidden="true">{{ activeSection === 'TODOs' ? '✓' : '✳' }}</span>
          <h2>{{ activeSection === 'TODOs' ? 'Nothing on your list yet' : 'A place for your thoughts' }}</h2>
          <p>{{ activeSection === 'TODOs' ? 'Your TODOs will appear here.' : 'Your notes will appear here.' }}</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.logged-in-page { min-height: 100vh; background: #f5f4ee; color: #183f3a; }
.workspace-layout { min-height: calc(100vh - 76px); display: grid; grid-template-columns: 240px minmax(0, 1fr); }
.content { padding: 56px clamp(28px, 7vw, 100px); }
.eyebrow { margin: 0 0 12px; color: #78877b; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { margin: 0; color: #183f3a; font: 400 48px/1.1 Georgia, 'Times New Roman', serif; }
.empty-state { max-width: 560px; margin-top: 64px; padding: 32px 0; border-top: 1px solid #d9ddd4; }
.empty-mark { display: grid; width: 42px; height: 42px; margin-bottom: 24px; place-items: center; border: 1px solid #b9c8bb; color: #557064; font-size: 19px; }
.empty-state h2 { margin: 0 0 8px; color: #294b41; font: 400 24px/1.25 Georgia, 'Times New Roman', serif; }
.empty-state p { margin: 0; color: #718077; font-size: 14px; }
@media (max-width: 640px) {
  .workspace-layout { min-height: calc(100vh - 64px); grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .content { padding: 36px 24px; }
  h1 { font-size: 40px; }
  .empty-state { margin-top: 48px; }
}
</style>