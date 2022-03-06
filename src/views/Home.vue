<template>
  <h2> Wycliffe Community </h2>
  <n-space justify="center">
    <router-link to="/map"><n-button>Map</n-button></router-link>
    <router-link to="/admin"><n-button>Admin</n-button></router-link>
    <router-link to="/realtime"><n-button>View</n-button></router-link>
  </n-space>
</template>

<script setup>
import { NButton, NSpace } from 'naive-ui';
</script>

<style lang="scss" scoped></style>
