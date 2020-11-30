import { createRouter, createWebHashHistory } from 'vue-router';
import Lobby from '../views/Lobby.vue';

const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: Lobby,
  },
  {
    path: '/questions',
    name: 'Questions',
    component: () => import('../views/Questions.vue'),
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
