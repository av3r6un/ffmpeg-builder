import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import App from './App.vue';
import store from './store';
import '@/assets/main.scss';

library.add(fab, fas, far);

createApp(App)
  .component('FAI', FontAwesomeIcon)
  .use(store).mount('#app');
