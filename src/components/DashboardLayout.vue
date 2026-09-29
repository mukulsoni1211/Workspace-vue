<script setup>
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { getSessionName } from '../services/sessionService'

const route = useRoute()
const accountName = getSessionName()
const activeSection = computed(() => route.meta.section)
</script>

<template>
  <main class="logged-in-page">
    <Topbar :name="accountName" />
    <div class="workspace-layout">
      <Sidebar :active-section="activeSection" />
      <section class="content">
        <!-- RouteView will render component matches in the child route -->
        <RouterView />
      </section>
    </div>
  </main>
</template>

<style scoped>
.logged-in-page { min-height: 100vh; background: #f5f4ee; color: #183f3a; }
.workspace-layout { min-height: calc(100vh - 76px); display: grid; grid-template-columns: 240px minmax(0, 1fr); }
.content { min-width: 0; padding: 56px clamp(28px, 7vw, 100px); }
@media (max-width: 640px) {
  .workspace-layout { min-height: calc(100vh - 64px); grid-template-columns: 1fr; grid-template-rows: auto 1fr; }
  .content { padding: 36px 24px; }
}
</style>