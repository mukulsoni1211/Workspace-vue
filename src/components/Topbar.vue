<script setup>
defineProps({
  name: {
    type: String,
    default: '',
  },
})

defineEmits(['logout'])
</script>

<template>
  <header class="topbar">
    <div class="account-actions">
      <span class="account-label">
        <span class="account-avatar" aria-hidden="true">{{ (name || '').trim().charAt(0).toUpperCase() || 'A' }}</span>
        {{ name || 'Account' }}
      </span>
      <button class="logout-button" type="button" @click="$emit('logout')">Sign out</button>
    </div>
  </header>
</template>

<style scoped>
.topbar { min-height: 76px; display: flex; align-items: center; justify-content: flex-end; padding: 0 40px; border-bottom: 1px solid #d9ddd4; background: #fffefa; }
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