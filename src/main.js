import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import router from './router';
import cache from './utils/cache';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

library.add(faCopy, faCheck);

createApp(App).use(router).use(cache, { expires: 5 }).component('font-awesome-icon', FontAwesomeIcon).mount('#app');
