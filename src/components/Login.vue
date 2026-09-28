<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { login } from '../services/authService'
import { saveSession } from '../services/sessionService'

const router = useRouter()
const email = ref('')
const password = ref('')
const passwordVisible = ref(false)
const isSubmitting = ref(false)
const errorMessage = ref('')

async function submitLogin() {
  errorMessage.value = ''
  isSubmitting.value = true

  try {
    const data = await login(email.value, password.value)
    saveSession(data)
    await router.replace('/dashboard/todos')
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to sign in. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-intro" aria-labelledby="welcome-title">
      <div class="brand-mark" aria-hidden="true">N</div>
      <p class="eyebrow">Personal workspace</p>
      <h1 id="welcome-title">Make space for better work.</h1>
      <p class="intro-copy">Your projects, people, and next good idea are waiting for you.</p>
    </section>

    <section class="login-panel" aria-labelledby="login-title">
      <div class="panel-heading">
        <p class="eyebrow">Welcome back</p>
        <h2 id="login-title">Sign in to Personal</h2>
        <p>Enter your details to continue to your workspace.</p>
      </div>

      <form class="login-form" @submit.prevent="submitLogin">
        <div class="field-group">
          <label for="email">Email address</label>
          <input id="email" v-model.trim="email" type="email" autocomplete="email" placeholder="you@company.com" required />
        </div>

        <div class="field-group">
          <div class="field-label-row">
            <label for="password">Password</label>
            <a href="#forgot-password">Forgot password?</a>
          </div>
          <div class="password-input">
            <input
              id="password"
              v-model="password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              class="visibility-toggle"
              :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
              :aria-pressed="passwordVisible"
              @click="passwordVisible = !passwordVisible"
            >
              <svg v-if="passwordVisible" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7a12.7 12.7 0 01-3.1 4.5M6.2 6.2A12.4 12.4 0 003 12c1 2.8 4.5 7 9 7 1.2 0 2.3-.3 3.3-.7" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }} <span aria-hidden="true">&rarr;</span>
        </button>
      </form>

      <p class="signup-prompt">New to Personal? <RouterLink to="/signup">Create an account</RouterLink></p>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(380px, 0.95fr);
  background: #f8f6f0;
  color: #1f2928;
}

.login-intro {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8vw;
  overflow: hidden;
  background: #183f3a;
  color: #f8f6f0;
}

.brand-mark {
  position: absolute;
  top: 42px;
  left: 8vw;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1px solid #eebe68;
  color: #eebe68;
  font: 700 18px Georgia, serif;
}

.eyebrow {
  margin-bottom: 18px;
  color: #c6d2c6;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.login-intro h1 {
  max-width: 600px;
  font: 400 clamp(3.2rem, 5.5vw, 6rem)/0.98 Georgia, 'Times New Roman', serif;
  letter-spacing: -0.04em;
}

.intro-copy {
  max-width: 350px;
  margin-top: 30px;
  color: #c6d2c6;
  font-size: 17px;
  line-height: 1.7;
}

.login-panel {
  align-self: center;
  width: min(100% - 80px, 460px);
  margin: 0 auto;
}

.panel-heading h2 {
  margin-bottom: 12px;
  font: 400 40px/1.1 Georgia, 'Times New Roman', serif;
  letter-spacing: -0.03em;
}

.panel-heading > p:last-child { color: #697572; font-size: 14px; }
.login-form { display: grid; gap: 25px; margin-top: 42px; }
.field-group { display: grid; gap: 9px; }
label, .field-label-row a { color: #31403c; font-size: 12px; font-weight: 700; }
.field-label-row { display: flex; justify-content: space-between; align-items: center; }
a { color: #286b60; text-decoration: none; }
.field-label-row a { color: #286b60; font-size: 11px; }

input {
  width: 100%;
  border: 1px solid #d7ddd5;
  border-radius: 2px;
  padding: 15px 16px;
  background: #fffefb;
  color: #1f2928;
  font: inherit;
  outline: none;
}

input:focus { border-color: #286b60; box-shadow: 0 0 0 3px rgba(40, 107, 96, 0.12); }
.password-input { position: relative; }
.password-input input { padding-right: 48px; }

.visibility-toggle {
  position: absolute;
  top: 50%;
  right: 12px;
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 0;
  background: transparent;
  color: #697572;
  cursor: pointer;
  transform: translateY(-50%);
}

.visibility-toggle svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.7; }
.submit-button { display: flex; justify-content: space-between; align-items: center; border: 0; border-radius: 2px; padding: 16px 18px; background: #eebe68; color: #183f3a; font-family: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.submit-button:disabled { cursor: wait; opacity: 0.65; }
.submit-button span { font-size: 20px; line-height: 0; }
.form-error { margin-top: -8px; color: #a33d32; font-size: 13px; }
.signup-prompt { margin-top: 30px; color: #697572; font-size: 13px; }
.signup-prompt a { font-weight: 700; }

@media (max-width: 760px) {
  .login-page { display: block; }
  .login-intro { min-height: 390px; padding: 110px 32px 48px; }
  .brand-mark { top: 32px; left: 32px; }
  .login-intro h1 { font-size: clamp(3rem, 14vw, 4.5rem); }
  .intro-copy { margin-top: 20px; font-size: 15px; }
  .login-panel { width: min(100% - 64px, 460px); padding: 60px 0; }
  .panel-heading h2 { font-size: 34px; }
  .login-form { margin-top: 34px; }
}
</style>
