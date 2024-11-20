<script setup>
import {computed, reactive, ref} from "vue";

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: new Date()
  },
  changedAt: {
    type: [Date, String],
    default: null
  },
  deadline: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    required: true
  },
  causes: {
    type: Array,
    default: () => []
  },
  edit: {
    type: [String],
    default: null
  }
})

const emit = defineEmits(['create-task', 'change-task', 'move-task', 'start-drag', 'delete-task'])

const inEditing = ref(props.edit === 'edit');
const inCreating = ref(props.edit === 'create');
const inReturn = ref(false);

const model = reactive({
  title: props.title,
  description: props.description,
  deadline: props.deadline,
  cause: ''
})

const timeFormat = computed(() => (date) => {
  if (!date) return;

  return new Intl.DateTimeFormat('ru', {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
})

const isExpired = computed(() => {
  return props.deadline && new Date() > new Date(props.deadline);
})

const sendEmit = () => {
  emit(inCreating.value ? 'create-task' : 'change-task', model)
  inEditing.value = false;
  inCreating.value = false;
}

const moveTask = (to, cause = null) => {
  emit('move-task', to, cause)
  model.cause = ''
}

const deleteTask = () => emit('delete-task')

const startDrag = (event) => emit('start-drag', event)
</script>

<template>
<article
    class="task-item"
    :draggable="status !== 'completed' && !inReturn && !inCreating && !inEditing"
    @dragstart="startDrag"
>
  <template v-if="!inEditing && !inCreating">
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <p>Дата создания: {{ timeFormat(createdAt) }}</p>
    <p v-if="changedAt">Дата изменения: {{ timeFormat(changedAt) }}</p>
    <p v-if="deadline">Дедлайн: {{ timeFormat(deadline) }}</p>
    <p v-if="status === 'completed'">
      <span v-if="isExpired">Задача просрочена</span>
      <span v-else>Задача выполнена вовремя</span>
    </p>
    <div v-if="['inWork', 'test'].includes(status) && causes.length">
      Причина возврата:
      <ol>
        <li v-for="cause in causes">{{ cause }}</li>
      </ol>
    </div>
    <p></p>
    <button v-if="status !== 'completed'" @click="inEditing = true">Изменить</button>
    <template v-if="status === 'planed'">
      <button @click="moveTask('inWork')">Переместить "В работу"</button>
      <button @click="deleteTask">Удалить задачу</button>
    </template>
    <button v-if="status === 'inWork'" @click="moveTask('test')">Переместить "В тестирование"</button>
    <button v-if="status === 'test'" @click="moveTask('completed')">Переместить "В выполненные"</button>
    <template v-if="inReturn">
      <label>
        Причина возврата:
        <input type="text" v-model="model.cause">
      </label>
      <button :disabled="!model.cause" @click="() => {
        moveTask('inWork', model.cause)
        inReturn = false
      }">
        Вернуть
      </button>
    </template>
    <button v-if="status === 'test' && !inReturn" @click="inReturn = true">Вернуть карточку "В работу"</button>
  </template>

  <template v-else>
    <label>
      Название:
      <input type="text" v-model="model.title">
    </label>
    <label>
      Описание:
      <textarea v-model="model.description" />
    </label>
    <label>
      Дедлайн:
      <input type="datetime-local" v-model="model.deadline">
    </label>
    <button :disabled="!model.title" @click="sendEmit">
      {{ inCreating ? 'Создать' : 'Редактировать' }}
    </button>
  </template>
</article>
</template>

<style scoped>
.task-item {
  display: flex;
  padding: 10px;
  background: rgba(255, 77, 0, 0.2);
  flex-direction: column;
  width: 100%;
  gap: 10px;
}

.task-item > label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.task-item :where(input, textarea) {
  font-family: var(--ff), sans-serif;
  font-size: 16px;
  padding: 4px;
  resize: none;
  outline: none;
  border: none;
}

ol {
  padding-block: 10px;
  margin-left: 20px;
}
</style>