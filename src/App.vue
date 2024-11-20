<script setup>
import TaskColumn from "@/components/task/TaskColumn.vue";
import {useStore} from "vuex";
import {computed} from "vue";

const { state, dispatch } = useStore();

const columns = computed(() => state)
</script>

<template>
  <div class="wrapper">
    <header class="header">
      <h1>Кабан доска</h1>
    </header>
    <main class="task-columns">
      <task-column
          v-for="(tasks, columnName) in columns"
          :tasks="tasks"
          :column-name="columnName"
      />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}
.header {
  display: flex;
  background: var(--accent-color);
  justify-content: center;
  color: white;
  padding: 5px;
}
.task-columns {
  padding: 10px;
  display: grid;
  min-height: 100%;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
</style>
