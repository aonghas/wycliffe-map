<template>
  <div class="statistics">
    <n-space justify="space-around">
      <div
        v-for="(feature, key) in featureTypes"
        :key="key"
        class="type-widget"
        :style="`background: ${feature.color}`"
      >
        <div class="widget-count">{{
          markersByType[feature.name]?.length || 0
        }}</div>
        <div class="widget-title" :style="`background: ${feature.color}`">
          {{ feature.plural }}</div
        >
      </div>
    </n-space>
  </div>
</template>

<script setup>
import { NSpace } from 'naive-ui';
import { featureTypes } from '@/utils';
import { groupBy } from 'lodash';
import { computed } from 'vue';

const props = defineProps(['markers']);

const markersByType = computed(() => {
  return groupBy(props.markers, 'type');
});
</script>

<style lang="scss" scoped>
.statistics {
  width: 100%;
}

.type-widget {
  width: 60px;
  height: 60px;
  border-radius: 100%;
  position: relative;
  text-align: center;
  margin: 0 auto;
  display: flex;
  align-content: center;
  justify-content: center;
  color: white;

  .widget-count {
    padding-top: 5px;
    font-weight: bold;
    display: inline-block;
    font-size: 2em;
  }
  .widget-title {
    border-radius: 5px;
    padding: 0px;
    color: white;
    font-size: 0.6em;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
  }
}

@media screen and (min-width: 600px) {
  .type-widget {
    width: 200px;
    height: 200px;

    .widget-count {
      padding-top: 20px;
      font-size: 7em;
    }
    .widget-title {
      font-size: 1.8em;
    }
  }
}
</style>
