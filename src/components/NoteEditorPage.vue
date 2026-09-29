<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { createNote, getNote, updateNote } from '../services/noteService'

const route = useRoute()
const router = useRouter()
const title = ref('')
const content = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const isEditing = computed(() => Boolean(route.params.id))

async function loadNote() {
  if (!isEditing.value) {
    title.value = ''
    content.value = ''
    errorMessage.value = ''
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  try {
    note.value = await getNote(route.params.id)
    if (!note.value) {
      errorMessage.value = 'This note could not be found.'
      return
    }
    title.value = note.title || ''
    content.value = note.content || ''
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to load this note.'
  } finally {
    isLoading.value = false
  }
}

async function saveNote() {
  if (!title.value.trim()) {
    errorMessage.value = 'Enter a title for your note.'
    return
  }

  isSaving.value = true
  errorMessage.value = ''
  try {
    const fields = { title: title.value.trim(), content: content.value }
    const savedNote = isEditing.value
      ? await updateNote(route.params.id, fields)
      : await createNote(fields)
    const noteId = savedNote.id || route.params.id
    if (!noteId) throw new Error('The API did not return a note ID.')
    await router.replace({ name: 'dashboard-note-show', params: { id: noteId } })
  } catch (error) {
    errorMessage.value = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || 'Unable to save this note.'
  } finally {
    isSaving.value = false
  }
}

onMounted(loadNote)
watch(() => route.params.id, loadNote)
</script>

<template>
  <div class="editor-page">
    <RouterLink class="back-link" :to="isEditing ? `/dashboard/notes/${route.params.id}` : '/dashboard/notes'">
      &larr; {{ isEditing ? 'Cancel editing' : 'All notes' }}
    </RouterLink>

    <p v-if="isLoading" class="feedback" role="status">Loading note...</p>
    <form v-else class="note-form" @submit.prevent="saveNote">
      <header class="editor-heading">
        <div>
          <p class="eyebrow">Personal workspace / Notes</p>
          <h1>{{ isEditing ? 'Edit note' : 'New note' }}</h1>
        </div>
        <button class="save-button" type="submit" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Save note' }}
        </button>
      </header>

      <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
      <label class="sr-only" for="note-title">Note title</label>
      <input id="note-title" v-model="title" class="title-input" type="text" maxlength="240" placeholder="Note title" required />
      <label class="sr-only" for="note-content">Note content</label>
      <textarea id="note-content" v-model="content" class="content-input" placeholder="Write your note..." rows="14"></textarea>
    </form>
  </div>
</template>

<style scoped>
.editor-page { max-width: 900px; }
.back-link { display: inline-block; margin-bottom: 36px; color: #557064; font-size: 13px; font-weight: 700; text-decoration: none; }
.back-link:hover { color: #183f3a; }
.editor-heading { display: flex; align-items: center; justify-content: space-between; gap: 24px; margin-bottom: 30px; padding-bottom: 24px; border-bottom: 1px solid #d9ddd4; }
.eyebrow { margin: 0 0 12px; color: #78877b; font-size: 11px; font-weight: 700; text-transform: uppercase; }
h1 { margin: 0; color: #183f3a; font: 400 42px/1.15 Georgia, 'Times New Roman', serif; }
.save-button { flex: 0 0 auto; border: 0; border-radius: 2px; padding: 12px 16px; background: #183f3a; color: #fffefa; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.save-button:disabled { cursor: wait; opacity: 0.6; }
.title-input, .content-input { display: block; width: 100%; border: 1px solid #d9ddd4; border-radius: 3px; background: #fffefa; color: #294b41; font: inherit; }
.title-input { padding: 16px 18px; font: 400 24px/1.3 Georgia, 'Times New Roman', serif; }
.content-input { min-height: 340px; margin-top: 14px; padding: 18px; color: #40594d; font-size: 15px; line-height: 1.8; resize: vertical; }
.title-input:focus, .content-input:focus { border-color: #829d87; outline: 2px solid rgba(104, 139, 118, 0.15); }
.error-message { margin: 16px 0; color: #a33d32; font-size: 13px; }
.feedback { color: #718077; font-size: 14px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
@media (max-width: 640px) {
  .editor-heading { align-items: flex-start; flex-direction: column; }
  h1 { font-size: 36px; }
  .content-input { min-height: 260px; }
}
</style>