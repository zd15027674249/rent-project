export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    cn: ''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updateCn (state, cn) {
      state.cn = cn
    }
  }
}
