import { createStore } from 'vuex';

export default createStore({
  state: {
    autocomplete: localStorage.getItem('__ac') ? JSON.parse(localStorage.getItem('__ac')) : false,
    usePowerShell: localStorage.getItem('__ps') ? JSON.parse(localStorage.getItem('__ps')) : false,
  },
  getters: {
    autocomplete: (state) => state.autocomplete,
    usePowerShell: (state) => state.usePowerShell,
  },
  mutations: {
    changeAC(state, value) {
      state.autocomplete = value;
      localStorage.setItem('__ac', JSON.stringify(value));
    },
    usePowershell(state, value) {
      state.usePowerShell = value;
      localStorage.setItem('__ps', JSON.stringify(value));
    },
  },
  actions: {
  },
  modules: {
  },
});
