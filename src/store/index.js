import { createStore } from 'vuex';

export default createStore({
  state: {
    autocomplete: localStorage.getItem('__ac') ? JSON.parse(localStorage.getItem('__ac')) : false,
  },
  getters: {
    autocomplete: (state) => state.autocomplete,
  },
  mutations: {
    changeAC(state, value) {
      state.autocomplete = value;
      localStorage.setItem('__ac', value);
    },
  },
  actions: {
  },
  modules: {
  },
});
