<script setup>
defineEmits(['logout'])
</script>

<template>
  <main class="logged-in-page">
    <section class="logged-in-card" aria-labelledby="logged-in-title">
      <div class="brand-mark" aria-hidden="true">N</div>
      <p class="eyebrow">Personal workspace</p>
      <h1 id="logged-in-title">You're in.</h1>
      <p>Your workspace is ready whenever you are.</p>
      <button class="logout-button" type="button" @click="$emit('logout')">Sign out</button>
    </section>
  </main>
</template>

<style scoped>
.logged-in-page { min-height: 100vh; display: grid; place-items: center; padding: 32px; background: #183f3a; color: #f8f6f0; }
.logged-in-card { width: min(100%, 520px); padding: 56px; border: 1px solid rgba(238, 190, 104, 0.5); background: #21504a; }
.brand-mark { display: grid; width: 38px; height: 38px; margin-bottom: 64px; place-items: center; border: 1px solid #eebe68; color: #eebe68; font: 700 18px Georgia, serif; }
.eyebrow { margin-bottom: 18px; color: #c6d2c6; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
h1 { margin-bottom: 16px; font: 400 64px/1 Georgia, 'Times New Roman', serif; }
.logged-in-card p:not(.eyebrow) { color: #c6d2c6; }
.logout-button { margin-top: 40px; border: 0; border-radius: 2px; padding: 14px 18px; background: #eebe68; color: #183f3a; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
@media (max-width: 560px) { .logged-in-card { padding: 32px; } .brand-mark { margin-bottom: 44px; } }
</style>