import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Map2.vue'),
  },
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/map',
    name: 'Map',
    component: () => import('@/views/Map2.vue'),
  },
  {
    path: '/realtime',
    name: 'Realtime',
    component: () => import('@/views/Realtime.vue'),
  },
  {
    path: '/fly',
    name: 'Fly',
    component: () => import('@/views/Fly.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/Admin.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
