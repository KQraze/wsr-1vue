<script setup>
import TaskItem from "@/components/task/TaskItem.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";

const props = defineProps({
  columnName: {
    type: String,
    required: true
  },
  tasks: {
    type: Array,
    default: () => []
  }
})

const store = useStore()

const names = new Map([
    ['planed', 'Запланированные задачи'],
    ['inWork', 'Задачи в работе'],
    ['test', 'Тестирование'],
    ['completed', 'Выполненные задачи']
]);


const isCreate = ref(false);
const name = computed(() => names.get(props.columnName))

const createTask = (task) => {
  store.dispatch('createTask', task)
  isCreate.value = false;
}

const changeTask = (index, data) => store.dispatch('changeTask', { index, from: props.columnName, ...data })
const moveTask = (index, to, cause = null) => store.dispatch('moveTask', { index, to, cause, from: props.columnName })
const deleteTask = (index) => store.dispatch('deleteTask', { index, from: props.columnName })

const draggingElem = (event, index) => {
  event.dataTransfer.dropEffect = 'move';
  event.dataTransfer.effectAllowed = 'move';
  console.log(index, props.columnName)
  event.dataTransfer.setData('task-index', index);
  event.dataTransfer.setData('from', props.columnName);
}

const onDrop = (event) => {
  const [taskIndex, from] = [event.dataTransfer.getData('task-index'), event.dataTransfer.getData('from')];
  console.log(taskIndex, from)
  store.dispatch('moveTask', { index: taskIndex, from, to: props.columnName })
}
</script>

<template>
  <section class="task-column"
           @drop="onDrop"
           @dragover.prevent
           @dragenter.prevent
  >
    <h2>{{ name }}</h2>
    <task-item
        v-for="(task, index) in tasks"
        v-bind="task"
        @change-task="(data) => changeTask(index, data)"
        @move-task="(to, cause) => moveTask(index, to, cause)"
        @delete-task="() => deleteTask(index)"
        @start-drag="(e) => draggingElem(e, index)"
    />
    <template v-if="columnName === 'planed'">
      <task-item
          v-if="!tasks.length || isCreate"
          :edit="!tasks.length || isCreate ? 'create' : 'edit'"
          @create-task="createTask"
      />
      <button v-if="tasks.length && !isCreate" @click="isCreate = true">Создать новую задачу</button>
    </template>
  </section>
</template>

<style scoped>
.task-column {
  border: 2px solid var(--accent-color);
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 5px;
  align-items: center;
}
</style>