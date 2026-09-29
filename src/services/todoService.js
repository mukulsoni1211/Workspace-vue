import apiClient from './apiClient'

function todoFormData(fields) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(`todo[${key}]`, value)
  }
  return formData
}

export async function listTodos() {
  const { data } = await apiClient.get('/todos')
  const responseData = data.data ?? data
  return Array.isArray(responseData) ? responseData : responseData.todos ?? responseData.items ?? []
}

export async function createTodo(fields) {
  const { data } = await apiClient.post('/todos', todoFormData(fields))
  return data.data ?? data
}

export async function updateTodo(id, fields) {
  const { data } = await apiClient.patch(`/todos/${id}`, todoFormData(fields))
  return data.data ?? data
}

export async function deleteTodo(todo) {
  await apiClient.delete(`/todos/${todo.id}`, {
    data: todoFormData({ title: todo.title }),
  })
}