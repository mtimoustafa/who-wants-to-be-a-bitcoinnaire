import { createRouter, createWebHashHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';
import Questions from '../views/Questions.vue';
import Summary from '../views/Summary.vue';

const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: Lobby,
  },
  {
    path: '/questions',
    name: 'Questions',
    component: Questions,
  },
  {
    path: '/summary',
    name: 'Summary',
    component: Summary,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
