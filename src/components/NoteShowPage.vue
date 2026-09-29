<script setup>
import { onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { getNote } from '../services/noteService'

const route = useRoute()
const note = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

async function loadNote() {
  isLoading.value = true
  errorMessage.value = ''
  note.value = null
  try {
    note.value = await getNote(route.params.id)
    if (!note.value) errorMessage.value = 'This note could not be found.'
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to load this note.'
  } finally {
    isLoading.value = false
  }
}

function formatUpdatedAt(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

onMounted(loadNote)
watch(() => route.params.id, loadNote)
</script>

<template>
  <div class="note-page">
    <RouterLink class="back-link" to="/dashboard/notes">&larr; All notes</RouterLink>
    <p v-if="isLoading" class="feedback" role="status">Loading note...</p>
    <p v-else-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
    <article v-else-if="note" class="note-content">
      <div class="note-heading">
        <div>
          <p class="eyebrow">Personal workspace / Notes</p>
          <h1>{{ note.title || 'Untitled note' }}</h1>
          <p v-if="note.updated_at" class="updated-at">Last updated {{ formatUpdatedAt(note.updated_at) }}</p>
        </div>
        <RouterLink class="edit-button" :to="`/dashboard/notes/${note.id}/edit`">Edit note</RouterLink>
      </div>
      <div class="note-body">{{ note.content || 'This note has no content.' }}</div>
    </article>
  </div>
</template>

<style scoped>
.note-page { max-width: 900px; }
.back-link { display: inline-block; margin-bottom: 36px; color: #557064; font-size: 13px; font-weight: 700; text-decoration: none; }
.back-link:hover { color: #183f3a; }
.note-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; padding-bottom: 26px; border-bottom: 1px solid #d9ddd4; }
.eyebrow { margin: 0 0 12px; color: #78877b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
h1 { margin: 0; color: #183f3a; font: 400 44px/1.15 Georgia, 'Times New Roman', serif; overflow-wrap: anywhere; }
.updated-at { margin-top: 12px; color: #839087; font-size: 12px; }
.edit-button { flex: 0 0 auto; border: 1px solid #c9d3ca; border-radius: 2px; padding: 10px 14px; color: #345b4d; font-size: 13px; font-weight: 700; text-decoration: none; }
.edit-button:hover { background: #e8eee7; }
.note-body { padding: 30px 0; color: #40594d; font-size: 16px; line-height: 1.8; white-space: pre-wrap; overflow-wrap: anywhere; }
.feedback, .error-message { margin: 24px 0; font-size: 14px; }
.feedback { color: #718077; }
.error-message { color: #a33d32; }
@media (max-width: 640px) {
  .note-heading { flex-direction: column; gap: 18px; }
  h1 { font-size: 36px; }
  .back-link { margin-bottom: 28px; }
}
</style>