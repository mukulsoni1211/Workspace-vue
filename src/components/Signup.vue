<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { signup } from '../services/authService'
import { saveSession } from '../services/sessionService'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function submitSignup() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!name.value.trim()) {
    errorMessage.value = 'Enter your name.'
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errorMessage.value = 'Enter a valid email address.'
    return
  }

  if (password.value.length < 8 || !/[A-Za-z]/.test(password.value) || !/\d/.test(password.value)) {
    errorMessage.value = 'Password must be at least 8 characters and include a letter and a number.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true

  try {
    const account = await signup(name.value.trim(), email.value.trim(), password.value)
    saveSession(account)
    await router.replace('/dashboard/todos')

  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to create your account. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="signup-page">
    <section class="signup-intro" aria-labelledby="signup-welcome-title">
      <div class="brand-mark" aria-hidden="true">N</div>
      <p class="eyebrow">Personal workspace</p>
      <h1 id="signup-welcome-title">A clear place to begin.</h1>
      <p class="intro-copy">Create your account and make room for what matters next.</p>
    </section>

    <section class="signup-panel" aria-labelledby="signup-title">
      <div class="panel-heading">
        <p class="eyebrow">Get started</p>
        <h2 id="signup-title">Create your account</h2>
        <p>Enter your details to set up your personal workspace.</p>
      </div>

      <form class="signup-form" novalidate @submit.prevent="submitSignup">
        <div class="field-group">
          <label for="signup-name">Name</label>
          <input id="signup-name" v-model.trim="name" type="text" autocomplete="name" placeholder="Your name" required />
        </div>

        <div class="field-group">
          <label for="signup-email">Email address</label>
          <input id="signup-email" v-model.trim="email" type="email" autocomplete="email" placeholder="you@company.com" required />
        </div>

        <div class="field-group">
          <label for="signup-password">Password</label>
          <input id="signup-password" v-model="password" type="password" autocomplete="new-password" minlength="8" placeholder="At least 8 characters" required />
          <span class="field-hint">Use at least 8 characters, including a letter and a number.</span>
        </div>

        <div class="field-group">
          <label for="confirm-password">Confirm password</label>
          <input id="confirm-password" v-model="confirmPassword" type="password" autocomplete="new-password" placeholder="Re-enter your password" required />
        </div>

        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <p v-if="successMessage" class="form-success" role="status">{{ successMessage }}</p>
        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Creating account...' : 'Create account' }} <span aria-hidden="true">&rarr;</span>
        </button>
      </form>

      <p class="login-prompt">Already have an account? <RouterLink to="/login">Sign in</RouterLink></p>
    </section>
  </main>
</template>

<style scoped>
.signup-page { min-height: 100vh; display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr); background: #f8f6f0; color: #1f2928; }
.signup-intro { position: relative; display: flex; flex-direction: column; justify-content: center; padding: 8vw; overflow: hidden; background: #183f3a; color: #f8f6f0; }
.brand-mark { position: absolute; top: 42px; left: 8vw; display: grid; width: 38px; height: 38px; place-items: center; border: 1px solid #eebe68; color: #eebe68; font: 700 18px Georgia, serif; }
.eyebrow { margin-bottom: 18px; color: #c6d2c6; font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; }
.signup-intro h1 { max-width: 600px; font: 400 clamp(3.2rem, 5.5vw, 6rem)/0.98 Georgia, 'Times New Roman', serif; }
.intro-copy { max-width: 350px; margin-top: 30px; color: #c6d2c6; font-size: 17px; line-height: 1.7; }
.signup-panel { align-self: center; width: min(100% - 80px, 460px); margin: 0 auto; padding: 48px 0; }
.panel-heading h2 { margin-bottom: 12px; font: 400 40px/1.1 Georgia, 'Times New Roman', serif; }
.panel-heading > p:last-child { color: #697572; font-size: 14px; }
.signup-form { display: grid; gap: 18px; margin-top: 32px; }
.field-group { display: grid; gap: 8px; }
label { color: #31403c; font-size: 12px; font-weight: 700; }
input { width: 100%; border: 1px solid #d7ddd5; border-radius: 2px; padding: 13px 16px; background: #fffefb; color: #1f2928; font: inherit; outline: none; }
input:focus { border-color: #286b60; box-shadow: 0 0 0 3px rgba(40, 107, 96, 0.12); }
.field-hint { color: #697572; font-size: 11px; line-height: 1.4; }
.submit-button { display: flex; justify-content: space-between; align-items: center; border: 0; border-radius: 2px; padding: 16px 18px; background: #eebe68; color: #183f3a; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.submit-button:disabled { cursor: wait; opacity: 0.65; }
.submit-button span { font-size: 20px; line-height: 0; }
.form-error, .form-success { margin: -4px 0; font-size: 13px; }
.form-error { color: #a33d32; }
.form-success { color: #286b60; }
.login-prompt { margin-top: 24px; color: #697572; font-size: 13px; }
.login-prompt a { color: #286b60; font-weight: 700; text-decoration: none; }
@media (max-width: 760px) {
  .signup-page { display: block; }
  .signup-intro { min-height: 320px; padding: 100px 32px 40px; }
  .brand-mark { top: 32px; left: 32px; }
  .signup-intro h1 { font-size: clamp(3rem, 14vw, 4.5rem); }
  .intro-copy { margin-top: 18px; font-size: 15px; }
  .signup-panel { width: min(100% - 64px, 460px); padding: 48px 0; }
  .panel-heading h2 { font-size: 34px; }
}
</style>