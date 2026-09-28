<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import LoggedIn from './components/LoggedIn.vue'
import Signup from './components/Signup.vue'

const AUTH_TOKEN_KEY = 'personal-auth-token'
const AUTH_NAME_KEY = 'personal-auth-name'
const AUTH_EMAIL_KEY = 'personal-auth-email'
const authToken = ref(localStorage.getItem(AUTH_TOKEN_KEY))
const authName = ref(localStorage.getItem(AUTH_NAME_KEY))
const authEmail = ref(localStorage.getItem(AUTH_EMAIL_KEY))
const authView = ref('login')

function handleLogin(data) {
  localStorage.setItem(AUTH_TOKEN_KEY, data.token)
  authToken.value = data.token
  localStorage.setItem(AUTH_NAME_KEY, data.name)
  authName.value = data.name
  localStorage.setItem(AUTH_EMAIL_KEY, data.email)
  authEmail.value = data.email
}

function handleLogout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  authToken.value = null
  localStorage.removeItem(AUTH_NAME_KEY)
  authName.value = null
  localStorage.removeItem(AUTH_EMAIL_KEY)
  authEmail.value = null
}
</script>

<template>
  <LoggedIn v-if="authToken" :name="authName" @logout="handleLogout" />
  <Signup v-else-if="authView === 'signup'" @login="authView = 'login'" />
  <Login v-else @login="handleLogin" @signup="authView = 'signup'" />
</template>
