import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/Map2.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
