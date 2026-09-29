<script setup>
import { computed, onMounted, ref } from 'vue'
import { createTodo, deleteTodo, listTodos, updateTodo } from '../services/todoService'

const todos = ref([])

const newTodoTitle = ref('')
const newTodoDueDate = ref('')
const newTodoPriority = ref('medium')

const editTodoId = ref(null)
const editTodoTitle = ref('')
const editTodoDueDate = ref('')
const editTodoPriority = ref('')

const priorityOptions = ['low', 'medium', 'high']

const todoFilter = ref('all')
const isLoadingTodos = ref(false)
const isSavingTodo = ref(false)
const todoError = ref('')

const pendingTodoCount = computed(() => todos.value.filter((todo) => todo.status !== 'completed').length)
const completedTodoCount = computed(() => todos.value.filter((todo) => todo.status === 'completed').length)
const visibleTodos = computed(() => {
  if (todoFilter.value === 'pending') return todos.value.filter((todo) => todo.status !== 'completed')
  if (todoFilter.value === 'completed') return todos.value.filter((todo) => todo.status === 'completed')
  return todos.value
})

function errorText(error, fallback) {
  return error.response?.data?.message || error.response?.data?.error || error.message || fallback
}

function formatUpdatedAt(value) {
  if (!value) return 'Not updated yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Update time unavailable'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function formatDueDate(value) {
  if (!value) return 'No due date'
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00` : value
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'Invalid due date'
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

async function loadTodos() {
  isLoadingTodos.value = true
  todoError.value = ''
  try {
    todos.value = await listTodos()
  } catch (error) {
    todoError.value = errorText(error, 'Unable to load TODOs.')
  } finally {
    isLoadingTodos.value = false
  }
}

async function addTodo() {
  const title = newTodoTitle.value.trim()
  if (!title) return

  isSavingTodo.value = true
  todoError.value = ''
  try {
    const todo = await createTodo({ title, due_date: newTodoDueDate.value, priority: newTodoPriority.value })
    todos.value = [todo, ...todos.value]
    newTodoTitle.value = ''
    newTodoDueDate.value = ''
    newTodoPriority.value = 'medium'
  } catch (error) {
    todoError.value = errorText(error, 'Unable to create this TODO.')
  } finally {
    isSavingTodo.value = false
  }
}

function startEditing(todo) {
  editTodoId.value = todo.id
  editTodoTitle.value = todo.title
  editTodoDueDate.value = todo.due_date ? String(todo.due_date).slice(0, 10) : ''
  editTodoPriority.value = todo.priority ? String(todo.priority).toLowerCase() : ''
}

async function saveTodo(todo) {
  const title = editTodoTitle.value.trim()
  if (!title) {
    todoError.value = 'TODO title cannot be empty.'
    return
  }

  isSavingTodo.value = true
  todoError.value = ''
  try {
    const updatedTodo = await updateTodo(todo.id, {
      title,
      due_date: editTodoDueDate.value,
      priority: editTodoPriority.value,
    })
    todos.value = todos.value.map((item) => item.id === todo.id ? { ...item, ...updatedTodo } : item)
    editTodoId.value = null
  } catch (error) {
    todoError.value = errorText(error, 'Unable to update this TODO.')
  } finally {
    isSavingTodo.value = false
  }
}

async function setTodoDone(todo, done) {
  isSavingTodo.value = true
  todoError.value = ''
  try {
    const updatedTodo = await updateTodo(todo.id, { status: done ? 'completed' : 'pending' })
    todos.value = todos.value.map((item) => item.id === todo.id ? { ...item, ...updatedTodo } : item)
  } catch (error) {
    todoError.value = errorText(error, 'Unable to update TODO status.')
  } finally {
    isSavingTodo.value = false
  }
}

async function removeTodo(todo) {
  isSavingTodo.value = true
  todoError.value = ''
  try {
    await deleteTodo(todo)
    todos.value = todos.value.filter((item) => item.id !== todo.id)
  } catch (error) {
    todoError.value = errorText(error, 'Unable to delete this TODO.')
  } finally {
    isSavingTodo.value = false
  }
}

onMounted(loadTodos)
</script>

<template>
  <div class="todos-page">
    <header class="page-header">
      <p class="eyebrow">Personal workspace</p>
      <h1>TODOs</h1>
    </header>

    <form class="todo-create" @submit.prevent="addTodo">
      <label class="sr-only" for="new-todo-title">New TODO title</label>
      <input id="new-todo-title" v-model="newTodoTitle" type="text" placeholder="Add a TODO..." maxlength="240" required />
      <label class="sr-only" for="new-todo-due-date">Due date</label>
      <input id="new-todo-due-date" v-model="newTodoDueDate" type="date" aria-label="Due date" />
      <label class="sr-only" for="new-todo-priority">Priority</label>
      <select id="new-todo-priority" v-model="newTodoPriority" aria-label="Priority">
        <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
      </select>
      <button type="submit" :disabled="isSavingTodo || !newTodoTitle.trim()">Add TODO</button>
    </form>

    <div class="todo-toolbar">
      <p>{{ pendingTodoCount }} pending <span aria-hidden="true">·</span> {{ completedTodoCount }} completed</p>
      <div class="todo-filters" role="group" aria-label="Filter TODOs">
        <button type="button" :aria-pressed="todoFilter === 'all'" @click="todoFilter = 'all'">All <span>{{ todos.length }}</span></button>
        <button type="button" :aria-pressed="todoFilter === 'pending'" @click="todoFilter = 'pending'">Pending <span>{{ pendingTodoCount }}</span></button>
        <button type="button" :aria-pressed="todoFilter === 'completed'" @click="todoFilter = 'completed'">Completed <span>{{ completedTodoCount }}</span></button>
      </div>
    </div>

    <p v-if="todoError" class="todo-error" role="alert">{{ todoError }}</p>
    <p v-if="isLoadingTodos" class="todo-feedback" role="status">Loading TODOs...</p>
    <div v-else-if="visibleTodos.length" class="todo-list" aria-label="TODO list">
      <article v-for="todo in visibleTodos" :key="todo.id" class="todo-row">
        <input
          :id="`todo-${todo.id}`"
          class="todo-checkbox"
          type="checkbox"
          :checked="todo.status === 'completed'"
          :disabled="isSavingTodo"
          :aria-label="todo.status === 'completed' ? 'Mark as pending' : 'Mark as completed'"
          @change="setTodoDone(todo, $event.target.checked)"
        />
        <div class="todo-main">
          <template v-if="editTodoId === todo.id">
            <label class="sr-only" :for="`edit-todo-${todo.id}`">Edit TODO title</label>
            <input :id="`edit-todo-${todo.id}`" v-model="editTodoTitle" class="todo-edit-input" maxlength="240" @keyup.enter="saveTodo(todo)" />
            <div class="todo-edit-fields">
              <label class="sr-only" :for="`edit-due-date-${todo.id}`">Due date</label>
              <input :id="`edit-due-date-${todo.id}`" v-model="editTodoDueDate" type="date" class="todo-edit-input" />
              <label class="sr-only" :for="`edit-priority-${todo.id}`">Priority</label>
              <select :id="`edit-priority-${todo.id}`" v-model="editTodoPriority" class="todo-edit-input">
                <option value="">No priority</option>
                <option v-if="editTodoPriority && !priorityOptions.includes(editTodoPriority)" :value="editTodoPriority">{{ editTodoPriority }}</option>
                <option v-for="priority in priorityOptions" :key="priority" :value="priority">{{ priority }}</option>
              </select>
            </div>
          </template>
          <label v-else class="todo-title" :class="{ done: todo.status === 'completed' }" :for="`todo-${todo.id}`">{{ todo.title }}</label>
          <div class="todo-meta">
            <span class="todo-status" :class="{ completed: todo.status === 'completed' }">{{ todo.status || 'pending' }}</span>
            <span class="todo-priority" :class="`priority-${String(todo.priority || 'none').toLowerCase()}`">{{ todo.priority || 'No priority' }}</span>
            <span class="todo-due-date">Due {{ formatDueDate(todo.due_date) }}</span>
            <span class="todo-updated">Updated {{ formatUpdatedAt(todo.updated_at) }}</span>
          </div>
        </div>
        <div class="todo-actions">
          <template v-if="editTodoId === todo.id">
            <button type="button" :disabled="isSavingTodo" @click="saveTodo(todo)">Save</button>
            <button type="button" :disabled="isSavingTodo" @click="editTodoId = null">Cancel</button>
          </template>
          <template v-else>
            <button type="button" :disabled="isSavingTodo" @click="startEditing(todo)">Edit</button>
            <button type="button" class="delete-action" :disabled="isSavingTodo" @click="removeTodo(todo)">Delete</button>
          </template>
        </div>
      </article>
    </div>
    <div v-else-if="!isLoadingTodos" class="empty-state">
      <span class="empty-mark" aria-hidden="true">{{ todos.length ? '⌕' : '✓' }}</span>
      <h2>{{ todos.length ? 'No TODOs in this view' : 'Nothing on your list yet' }}</h2>
      <p>{{ todos.length ? 'Choose another filter to see your TODOs.' : 'Add a TODO above to get started.' }}</p>
    </div>
  </div>
</template>

<style scoped>
.eyebrow { margin: 0 0 12px; color: #78877b; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
h1 { margin: 0; color: #183f3a; font: 400 48px/1.1 Georgia, 'Times New Roman', serif; }
.todo-create { display: grid; grid-template-columns: minmax(140px, 1fr) minmax(140px, 180px) minmax(120px, 140px) auto; gap: 10px; max-width: 900px; margin-top: 34px; }
.todo-create input, .todo-create select, .todo-edit-input { min-width: 0; border: 1px solid #d2d9d0; border-radius: 2px; padding: 12px 14px; background: #fffefa; color: #183f3a; font: inherit; }
.todo-create input:focus, .todo-create select:focus, .todo-edit-input:focus { border-color: #688b76; outline: 2px solid rgba(104, 139, 118, 0.18); }
.todo-create button { border: 0; border-radius: 2px; padding: 0 18px; background: #183f3a; color: #fffefa; font: inherit; font-size: 13px; font-weight: 700; cursor: pointer; }
.todo-create button:disabled, .todo-actions button:disabled { cursor: not-allowed; opacity: 0.55; }
.todo-toolbar { max-width: 900px; display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 28px; }
.todo-toolbar > p { color: #718077; font-size: 12px; }
.todo-filters { display: flex; gap: 3px; border: 1px solid #d9ddd4; border-radius: 3px; padding: 3px; background: #eeefe8; }
.todo-filters button { display: flex; align-items: center; gap: 7px; min-height: 32px; border: 0; border-radius: 2px; padding: 0 10px; background: transparent; color: #52665c; font: inherit; font-size: 11px; cursor: pointer; }
.todo-filters button[aria-pressed='true'] { background: #fffefa; color: #183f3a; box-shadow: 0 1px 2px rgba(24, 63, 58, 0.12); }
.todo-filters button span { color: #849087; font-size: 10px; }
.todo-error { max-width: 760px; margin-top: 16px; color: #a33d32; font-size: 13px; }
.todo-feedback { margin-top: 28px; color: #718077; font-size: 14px; }
.todo-list { max-width: 900px; margin-top: 14px; border-top: 1px solid #d9ddd4; }
.todo-row { display: flex; align-items: center; gap: 16px; min-height: 76px; border-bottom: 1px solid #d9ddd4; padding: 12px 4px; }
.todo-row:hover { background: rgba(255, 254, 250, 0.65); }
.todo-checkbox { width: 18px; height: 18px; flex: 0 0 auto; accent-color: #286b60; cursor: pointer; }
.todo-main { min-width: 0; flex: 1; display: grid; gap: 6px; }
.todo-title { overflow-wrap: anywhere; color: #294b41; font-size: 15px; font-weight: 600; }
.todo-title.done { color: #839087; text-decoration: line-through; }
.todo-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.todo-status { border: 1px solid #ead9ad; border-radius: 99px; padding: 2px 7px; background: #fbf2dc; color: #82672f; font-size: 10px; line-height: 1.4; text-transform: capitalize; }
.todo-status.completed { border-color: #c7d8c8; background: #e8f0e7; color: #426a4e; }
.todo-priority { border-radius: 99px; padding: 2px 7px; background: #e9ece7; color: #58665c; font-size: 10px; line-height: 1.4; text-transform: capitalize; }
.todo-priority.priority-high { background: #f5e3df; color: #984b3a; }
.todo-priority.priority-medium { background: #f5edd8; color: #80652d; }
.todo-priority.priority-low { background: #e5eee5; color: #47704d; }
.todo-due-date, .todo-updated { color: #839087; font-size: 11px; }
.todo-edit-input { width: 100%; }
.todo-edit-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.todo-actions { display: flex; gap: 14px; }
.todo-actions button { border: 0; padding: 8px 0; background: transparent; color: #38695b; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
.todo-actions .delete-action { color: #a24d32; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.empty-state { max-width: 560px; margin-top: 64px; padding: 32px 0; border-top: 1px solid #d9ddd4; }
.empty-mark { display: grid; width: 42px; height: 42px; margin-bottom: 24px; place-items: center; border: 1px solid #b9c8bb; color: #557064; font-size: 19px; }
.empty-state h2 { margin: 0 0 8px; color: #294b41; font: 400 24px/1.25 Georgia, 'Times New Roman', serif; }
.empty-state p { margin: 0; color: #718077; font-size: 14px; }
@media (max-width: 760px) {
  h1 { font-size: 40px; }
  .todo-create { grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); }
  .todo-create input:first-of-type { grid-column: 1 / -1; }
  .todo-create button { min-height: 42px; padding: 0 12px; }
  .todo-toolbar { align-items: flex-start; flex-direction: column; gap: 10px; }
  .todo-filters { width: 100%; }
  .todo-filters button { flex: 1; justify-content: center; padding: 0 6px; }
  .todo-row { gap: 10px; }
  .todo-actions { gap: 10px; }
}
</style>