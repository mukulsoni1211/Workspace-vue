<script setup>
import { ref } from 'vue'
import Login from './components/Login.vue'
import LoggedIn from './components/LoggedIn.vue'

const AUTH_TOKEN_KEY = 'personal-auth-token'
const authToken = ref(localStorage.getItem(AUTH_TOKEN_KEY))

function handleLogin(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
  authToken.value = token
}

function handleLogout() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  authToken.value = null
}
</script>

<template>
  <LoggedIn v-if="authToken" @logout="handleLogout" />
  <Login v-else @login="handleLogin" />
</template>
