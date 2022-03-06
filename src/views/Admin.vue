<template>
  <h1> Admin </h1>
  <div v-if="user">
    <div v-if="user.isAnonymous">
      <strong> <div> ANONYMOUS USER </div></strong>
      <n-space justify="center">
        <n-button @click="logOut">Sign out</n-button>
      </n-space>
    </div>
    <div v-else>
      <strong>
        ADMIN
        <div>{{ user.email }}</div>
      </strong>
      <div> ({{ user.uid }})</div>
      <n-space justify="center">
        <n-button @click="logOut">Sign out</n-button>

        <n-button @click="deleteMarkers"
          >Clear data ({{ markers.length }})</n-button
        >
        <n-button @click="toggleTestMode"
          >Test Mode is {{ config?.testMode ? 'ON' : 'OFF' }}</n-button
        >
      </n-space>
    </div>
  </div>

  <div v-else style="padding: 20px">
    <n-space vertical>
      Not logged in <br />
      <n-input v-model:value="email" placeholder="Email"></n-input>
      <n-input
        v-model:value="password"
        placeholder="Password"
        type="password"
      ></n-input>
      <n-button @click="loginEmail({ email, password })">Log in</n-button>
      <n-button @click="loginAnon">Log in anonymously</n-button></n-space
    ></div
  >
</template>

<script setup>
import { useStore } from 'vuex';
import { useActions, useState } from 'vuex-composition-helpers';
import { NButton, NSpace, NInput } from 'naive-ui';
import { computed, onMounted, ref } from 'vue';

const store = useStore();

const email = ref('');
const password = ref('');

const user = computed(() => store.state.user);

function toggleTestMode() {
  if (config.value.testMode) {
    updateConfig({ testMode: false });
  } else {
    updateConfig({ testMode: true });
  }
}

const { markers, config } = useState(['markers', 'config']);

onMounted(() => {
  subscribeAllMarkers();
});

const {
  updateConfig,
  deleteMarkers,
  subscribeAllMarkers,
  loginAnon,
  loginEmail,
  logOut,
} = useActions([
  'updateConfig',
  'deleteMarkers',
  'subscribeAllMarkers',
  'loginAnon',
  'loginEmail',
  'logOut',
]);
</script>

<style lang="scss" scoped></style>
