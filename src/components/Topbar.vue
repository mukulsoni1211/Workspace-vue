<script setup>
import { useRouter } from 'vue-router'
import { clearSession } from '../services/sessionService'

defineProps({
  name: {
    type: String,
    default: '',
  },
})

const router = useRouter()

function signOut() {
  clearSession()
  router.replace('/login')
}
</script>

<template>
  <header class="topbar">
    <div class="brand" aria-label="Personal workspace">
      <span class="brand-mark" aria-hidden="true">N</span>
      <span class="brand-name">Personal</span>
    </div>
    <div class="account-actions">
      <span class="account-label">
        <span class="account-avatar" aria-hidden="true">{{ (name || '').trim().charAt(0).toUpperCase() || 'A' }}</span>
        {{ name || 'Account' }}
      </span>
      <button class="logout-button" type="button" @click="signOut">Sign out</button>
    </div>
  </header>
</template>

<style scoped>
.topbar { min-height: 76px; display: flex; align-items: center; justify-content: flex-end; padding: 0 40px; border-bottom: 1px solid #d9ddd4; background: #fffefa; }
.brand { display: flex; align-items: center; gap: 11px; margin-right: auto; color: #183f3a; }
.brand-mark { display: grid; width: 34px; height: 34px; place-items: center; border: 1px solid #9eaf9e; color: #557064; font: 700 16px Georgia, serif; }
.brand-name { font: 700 18px Georgia, 'Times New Roman', serif; }
.account-actions { display: flex; align-items: center; gap: 28px; }
.account-label { display: flex; align-items: center; gap: 10px; color: #34524a; font-size: 13px; font-weight: 600; }
.account-avatar { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 50%; background: #dce7dd; color: #183f3a; font: 700 13px Georgia, serif; }
.logout-button { border: 0; padding: 10px 0; background: transparent; color: #34524a; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.logout-button:hover { color: #a24d32; }
@media (max-width: 640px) {
  .topbar { min-height: 64px; padding: 0 20px; }
  .account-actions { gap: 16px; }
}
</style>