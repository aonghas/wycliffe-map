<template>
  <div>
    <h1 class="page-title">OUR LOCAL COMMUNITY</h1>
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 10px 0;
      "
    >
      <img src="@/assets/qr-code.svg" class="qr" /><div
        style="font-size: 3em; text-align: left"
        >or go to <br /><span style="font-size: 1.5em; font-weight: bold"
          >wycliffecommunity.web.app</span
        ></div
      ></div
    >
    <div>
      <Statistics :markers="markers" />
    </div>
    <div class="gomap"
      ><router-link to="/fly"
        ><v-icon><PaperPlane /></v-icon></router-link
    ></div>
  </div>
</template>

<script setup>
import Statistics from '@/components/Statistics.vue';
import { NBadge, NSpace } from 'naive-ui';
import { groupBy } from 'lodash';
import { onMounted, computed } from 'vue';
import { useState, useActions } from 'vuex-composition-helpers';
import { PaperPlane } from '@vicons/ionicons5';

const { subscribeAllMarkers } = useActions(['subscribeAllMarkers']);
const { markers } = useState(['markers']);

onMounted(() => {
  subscribeAllMarkers();
});
</script>

<style lang="scss" scoped>
.qr {
  width: 50%;
  max-width: 300px;
}
.gomap {
  position: fixed;
  bottom: 5px;
  right: 5px;
  width: 30px;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  background: #ccc;
  a {
    color: white;
    text-decoration: none;
  }
}
.page-title {
  font-size: 7em;
  font-weight: black;
  margin-bottom: 0;
}
.stats-bg {
  background: rgb(189, 189, 189);
  background: linear-gradient(
    32deg,
    rgba(189, 189, 189, 1) 5%,
    rgba(255, 255, 255, 1) 100%
  );
  height: 100vh;
  padding: 20px;
  overflow: hidden;
}
</style>
