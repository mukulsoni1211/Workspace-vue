import apiClient from './apiClient'

function noteFormData(fields) {
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    formData.append(`note[${key}]`, value)
  }
  return formData
}

export async function listNotes() {
  const { data } = await apiClient.get('/notes')
  const responseData = data.data ?? data
  return Array.isArray(responseData) ? responseData : responseData.notes ?? responseData.items ?? []
}

export async function createNote(fields) {
  const { data } = await apiClient.post('/notes', noteFormData(fields))
  return data.data ?? data
}

export async function updateNote(id, fields) {
  const { data } = await apiClient.patch(`/notes/${id}`, noteFormData(fields))
  return data.data ?? data
}

export async function getNote(id) {
  const { data } = await apiClient.get(`/notes/${id}`)
  return data.data ?? data
}

export async function deleteNote(note) {
  await apiClient.delete(`/notes/${note.id}`, {
    data: noteFormData({ title: note.title }),
  })
}
