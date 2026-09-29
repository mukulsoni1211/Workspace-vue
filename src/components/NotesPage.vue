<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { listNotes } from '../services/noteService'

const notes = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

async function fetchNotes() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    notes.value = await listNotes()
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to load your notes.'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchNotes)
</script>

<template>
  <div class="notes-page">
    <header class="page-header">
      <div>
        <h1>Notes</h1>
        <p>Your ideas and reminders, gathered in one place.</p>
      </div>
      <RouterLink class="new-note-button" to="/dashboard/notes/new">New note</RouterLink>
    </header>

    <p v-if="errorMessage" class="notes-error" role="alert">{{ errorMessage }}</p>
    <p v-if="isLoading" class="notes-feedback" role="status">Loading notes...</p>

    <div v-else-if="notes.length" class="notes-list" aria-label="Notes">
      <RouterLink v-for="note in notes" :key="note.id" class="note-entry" :to="`/dashboard/notes/${note.id}`">
        <h2>{{ note.title || 'Untitled note' }}</h2>
        <p>{{ note.content || 'No content' }}</p>

        <p class="notes-feedback" v-if="note.updated_at">
          Last updated: {{ new Date(note.updated_at).toLocaleString() }}
        </p>
      </RouterLink>
    </div>

    <div v-else-if="!isLoading && !errorMessage" class="empty-state">
      <span class="empty-mark" aria-hidden="true">≡</span>
      <h2>No notes yet</h2>
      <p>Your notes will appear here when you create one.</p>
    </div>
  </div>
</template>

<style scoped>
.notes-page { max-width: 1100px; }
.page-header { margin-bottom: 36px; }
.page-header { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.eyebrow { margin: 0 0 12px; color: #78877b; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { margin: 0; color: #183f3a; font: 400 48px/1.1 Georgia, 'Times New Roman', serif; }
.page-header > p:last-child { margin-top: 12px; color: #718077; font-size: 14px; }
.notes-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-auto-rows: 220px; gap: 14px; }
.note-entry { display: flex; min-width: 0; height: 220px; flex-direction: column; overflow: hidden; border: 1px solid #d9ddd4; border-radius: 4px; padding: 22px; background: #fffefa; color: inherit; text-decoration: none; transition: border-color 140ms ease, background-color 140ms ease; }
.note-entry:hover { border-color: #9eaf9e; background: #fff; }
.note-entry h2 { display: -webkit-box; overflow: hidden; margin: 0 0 10px; color: #294b41; font: 400 22px/1.25 Georgia, 'Times New Roman', serif; overflow-wrap: anywhere; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.note-entry > p:not(.notes-feedback) { display: -webkit-box; overflow: hidden; margin: 0; color: #65766c; font-size: 14px; line-height: 1.65; white-space: pre-wrap; overflow-wrap: anywhere; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
.new-note-button { flex: 0 0 auto; border-radius: 2px; padding: 12px 16px; background: #183f3a; color: #fffefa; font-size: 13px; font-weight: 700; text-decoration: none; }
.new-note-button:hover { background: #286b60; }
.notes-error { margin: 20px 0; color: #a33d32; font-size: 13px; }
.notes-feedback { margin-top: auto; padding-top: 12px; color: #718077; font-size: 12px; }
.empty-state { max-width: 560px; padding: 32px 0; border-top: 1px solid #d9ddd4; }
.empty-mark { display: grid; width: 42px; height: 42px; margin-bottom: 24px; place-items: center; border: 1px solid #b9c8bb; color: #557064; font-size: 19px; }
.empty-state h2 { margin: 0 0 8px; color: #294b41; font: 400 24px/1.25 Georgia, 'Times New Roman', serif; }
.empty-state p { margin: 0; color: #718077; font-size: 14px; }
@media (max-width: 760px) {
  h1 { font-size: 40px; }
  .notes-list { grid-template-columns: 1fr; }
  .notes-list { grid-auto-rows: 200px; }
  .note-entry { height: 200px; padding: 18px; }
  .page-header { align-items: flex-start; }
  .new-note-button { padding: 10px 12px; }
}
</style>