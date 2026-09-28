import apiClient from './apiClient'

const loginAuthToken = import.meta.env.VITE_LOGIN_AUTH_TOKEN

export async function login(email, password) {
  const formData = new FormData()
  formData.append('email', email)
  formData.append('password', password)

  const { data } = await apiClient.post('/login', formData, {
    headers: loginAuthToken ? { Authorization: `Bearer ${loginAuthToken}` } : {},
  })
  const token = data.token

  if (!token) {
    throw new Error(data.message || data.error || 'The login response did not include an authentication token.')
  }

  return {
    token,
    name: data.name || '',
    email: data.email || '',
  }
}

export async function signup(name, email, password) {
  const formData = new FormData()
  formData.append('name', name)
  formData.append('email', email)
  formData.append('password', password)
  formData.append('password_confirmation', password)

  const { data } = await apiClient.post('/signup', formData, {
    headers: loginAuthToken ? { Authorization: `Bearer ${loginAuthToken}` } : {},
  })

  const responseData = data.data || data
  const user = responseData.user || data.user || responseData
  const token = responseData.token || responseData.access_token || data.token || data.access_token

  if (!token) {
    throw new Error(data.message || data.error || 'The signup response did not include an authentication token.')
  }

  return {
    token,
    name: user.name || user.full_name || name,
    email: user.email || email,
  }
}