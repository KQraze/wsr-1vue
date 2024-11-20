import {createStore} from "vuex";

export default createStore({
    state: () => {
        return {
            planed: [],
            inWork: [],
            test: [],
            completed: []
        }
    },
    mutations: {
        createTask: (state, task) => state.planed.push(task),

        moveTask: (state, { index, from, to, cause = null }) => {
            const task = state[from].splice(index, 1)[0];
            task.status = to;
            cause ? task.causes.push(cause) : null
            state[to].push(task);
        },

        deleteTask: (state, { index, from }) => state[from].splice(index, 1),

        changeTask: (state, { index, from, data }) => {
            state[from][index] = { ...state[from][index], ...data, changedAt: new Date() }
        },
    },
    actions: {
        createTask: ({ commit, state }, { title, description, deadline }) => {
            commit('createTask', {
                createdAt: new Date(),
                title,
                description,
                deadline,
                changedAt: null,
                causes: [],
                status: 'planed'
            })
        },

        changeTask: ({ commit }, { index, from, title, description, deadline }) => {
            commit('changeTask', {
                index,
                from,
                data: {
                    title,
                    description,
                    deadline
                }
            })
        },

        moveTask: ({ commit }, { index, from, to, cause }) => commit('moveTask', { index, from, to, cause }),

        deleteTask: ({ commit }, { index, from }) => commit('deleteTask', { index, from }),
    }
})
