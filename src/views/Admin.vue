<template>
  <h1> Admin </h1>
  <div v-if="user">
    <strong>
      <div v-if="user.isAnonymous"> ANONYMOUS USER </div
      ><div v-else>{{ user.email }}</div></strong
    >
    <div> ({{ user.uid }})</div
    ><n-space justify="center">
      <n-button @click="logOut">Sign out</n-button>

      <n-button v-if="!user.isAnonymous">Clear data</n-button>
    </n-space>
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
import { useActions } from 'vuex-composition-helpers';
import { NButton, NSpace, NInput } from 'naive-ui';
import { computed, ref } from 'vue';
import { auth } from '@/firebase';

const store = useStore();

const email = ref('');
const password = ref('');

const user = computed(() => store.state.user);

const { loginAnon, loginEmail, logOut } = useActions([
  'loginAnon',
  'loginEmail',
  'logOut',
]);
</script>

<style lang="scss" scoped></style>
