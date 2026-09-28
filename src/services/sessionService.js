const AUTH_TOKEN_KEY = 'personal-auth-token'
const AUTH_NAME_KEY = 'personal-auth-name'
const AUTH_EMAIL_KEY = 'personal-auth-email'

export function hasSession() {
  return Boolean(localStorage.getItem(AUTH_TOKEN_KEY))
}

export function getSessionName() {
  return localStorage.getItem(AUTH_NAME_KEY) || ''
}

export function saveSession(account) {
  localStorage.setItem(AUTH_TOKEN_KEY, account.token)
  localStorage.setItem(AUTH_NAME_KEY, account.name || '')
  localStorage.setItem(AUTH_EMAIL_KEY, account.email || '')
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_NAME_KEY)
  localStorage.removeItem(AUTH_EMAIL_KEY)
}