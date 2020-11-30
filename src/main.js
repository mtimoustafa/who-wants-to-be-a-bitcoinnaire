import { createApp } from 'vue';
import { createStore } from 'vuex';

import App from './App.vue';
import router from './router';

import Store from './store/store.js';

const app = createApp(App);

app.config.devtools = (process.env.NODE_ENV === 'development');

const store = createStore(Store);

app.use(store).use(router);
app.mount('#app');
