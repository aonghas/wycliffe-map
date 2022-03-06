<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';

import { useActions } from 'vuex-composition-helpers';

const store = useStore();

const user = computed(() => store.state.user);

const { unsubscribe } = useActions(['unsubscribe']);

onMounted(() => {
  if (!user.value) {
    store.dispatch('loginAnon');
  }
});

onUnmounted(() => {
  console.log('unsubscribing');
  unsubscribe();
});
</script>

<template>
  <router-view />
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
