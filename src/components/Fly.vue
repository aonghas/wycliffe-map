<template>
  <div class="map-view">
    <div class="map-container">
      <mapbox-map
        height="100%"
        width="100%"
        :accessToken="ACCESS_TOKEN"
        :mapStyle="mapStyle"
        :center="center"
        :zoom="zoom"
        :maxPitch="85"
        :rotation="false"
        @update:center="updateCenter"
        @update:zoom="updateZoom"
        @loaded="onLoad"
      >
        <mapbox-marker
          :lngLat="marker.lngLat"
          v-for="marker in markers"
          :key="marker.id"
        >
          <template v-slot:icon>
            <div class="icon-border">
              <n-icon
                size="45"
                :color="featureTypes[marker.type]?.color"
                :component="featureTypes[marker.type]?.icon"
              ></n-icon> </div
          ></template>
        </mapbox-marker>

        <mapbox-marker :lngLat="WYCLIFFE">
          <template v-slot:icon>
            <n-icon-wrapper color="purple" :size="60" :border-radius="15">
              <n-icon :component="Church" color="white" size="50"></n-icon>
            </n-icon-wrapper>
          </template>
        </mapbox-marker>
      </mapbox-map>
    </div>
    <Transition name="slide-down">
      <Statistics
        :markers="markers"
        class="statistics-overlay"
        v-if="toggleStatistics"
      />
    </Transition>
    <Transition name="fade">
      <div class="controls" v-if="displayControls">
        <n-space vertical>
          <n-space justify="center">
            <n-button color="gray" @click="toggleStatistics = !toggleStatistics"
              >{{ toggleStatistics ? 'Hide' : 'Show' }}
            </n-button>
            <n-button icon color="white" @click="togglePlay">
              <n-icon
                :color="playPause == 'play' ? 'gray' : 'green'"
                :component="playPause == 'play' ? Pause : Play"
              ></n-icon
            ></n-button>
            <router-link to="/realtime">
              <n-button icon type="success"> Realtime</n-button>
            </router-link>
          </n-space>
          <n-slider
            v-model:value="speed"
            :step="1000"
            :max="60000"
            :min="10000"
          />
          <n-input v-model:value="speed" type="number"></n-input> </n-space
      ></div>
    </Transition>
  </div>
</template>

<script setup>
import Statistics from '@/components/Statistics.vue';
import {
  NSlider,
  NSpace,
  NIcon,
  NIconWrapper,
  NButton,
  NInput,
} from 'naive-ui';

import { Church, Play, Pause } from '@vicons/fa';

import { featureTypes } from '@/utils';

import { ref, onUnmounted, computed } from 'vue';

import { useState, useActions } from 'vuex-composition-helpers';

const { markers } = useState(['markers']);

const { subscribeAllMarkers } = useActions(['subscribeAllMarkers']);

const WYCLIFFE = [-0.9497075714282346, 51.45333227533655];
const mapStyle = 'mapbox://styles/aonghas/cl0e545k9000615o0oyu54bva';
const ACCESS_TOKEN =
  'pk.eyJ1IjoiYW9uZ2hhcyIsImEiOiJjbDBicGNnZzQweHY2M2RxdXc3aWR2aGJ1In0.bEoO3hknIQLxRp1ujiN01Q';

const center = ref();
const zoom = ref();
const init = ref(false);
const map = ref();

const playPause = ref('pause');

function updateCenter(event) {
  center.value = event;
}
function updateZoom(event) {
  zoom.value = event;
}

let timer;

onUnmounted(() => {
  clearInterval(timer);
});

const toggleStatistics = ref(true);

const displayControls = ref(true);
let fadeTimer = null;

let roamTimer = null;

const speed = ref(40 * 1000);

function togglePlay() {
  if (playPause.value == 'play') {
    clearInterval(roamTimer);
    map.value.stop();
    playPause.value = 'pause';
  } else {
    clearInterval(roamTimer);
    playPause.value = 'play';
    // flyBackToChurch().then(() => {
    let i = 1;
    roam(i, parseInt(speed.value));
    roamTimer = setInterval(() => {
      i++;
      roam(i, parseInt(speed.value));
    }, parseInt(speed.value) + 100);
    // });
  }
}

function roam(i, duration) {
  if (playPause.value == 'play') {
    map.value.flyTo({
      duration,
      center: WYCLIFFE,
      bearing: 90 * (i % 4),
      easing(t) {
        return t;
      },
    });
  }
}

function flyBackToChurch() {
  return new Promise((resolve) => {
    map.value.flyTo({
      duration: 2000,
      center: WYCLIFFE,
      bearing: 0,
      easing(t) {
        return t;
      },
    });
    setTimeout(() => {
      resolve();
    }, 2100);
  });
}

function onLoad(event) {
  subscribeAllMarkers();
  init.value = true;
  map.value = event;
  map.value.setCenter(WYCLIFFE);
  // map.value.flyTo({ zoom: 16, duration: 4000, pitch: 110 });

  map.value.flyTo({
    zoom: 16,
    duration: 3000,
    center: WYCLIFFE,
    pitch: 80,
    bearing: 0,
    easing(t) {
      return t;
    },
  });

  map.value.on('mousemove', (event) => {
    clearTimeout(fadeTimer);

    if (playPause.value != 'paused') {
      displayControls.value = true;

      fadeTimer = setTimeout(() => {
        displayControls.value = false;
      }, 3000);
    } else {
      displayControls.value = true;
    }
  });

  // map.value.dragRotate.disable();

  // // disable map rotation using touch rotation gesture
  // map.value.touchZoomRotate.disableRotation();
}
</script>

<style lang="scss">
.statistics-overlay {
  position: fixed;
  top: 20px;
  width: 100%;
}
.mapboxgl-control-container {
  display: none !important;
}

.mapcontrolbar {
  position: absolute;
  background: rgba(255, 255, 255, 0.65);
  z-index: 1;
  top: 0;
  width: 100%;
}

.mapfeatureselect {
  position: absolute;
  margin-bottom: 20vh;
  width: 100%;
  display: block;
  z-index: 1;
}

.map-view {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
}

.map-container {
  display: block;
  z-index: 0;
  height: 100%;
  width: 100%;
}

.slide-up-enter-active {
  transition: all 0.3s ease;
}

.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.3s ease;
}

.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.top-button {
  position: fixed;
  z-index: 1;
  width: 100%;
  top: 100px;
  button {
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.3);
  }
}

.bottom-button {
  position: fixed;
  z-index: 1;
  width: 100%;
  bottom: 10px;
  button {
    box-shadow: 1px 3px 5px rgba(0, 0, 0, 0.3);
  }
}

.icon-border {
  height: 35px;
  width: 35px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;

  &.selected {
    animation: expand infinite 0.5s linear;
  }
}

.controls {
  padding: 20px;
  width: 300px;

  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  bottom: 20px;
  margin: 0 auto;
  right: 0;
  left: 0;
  z-index: 10;
}

@keyframes expand {
  from {
    opacity: 0.6;
    transform: scale(1);
  }

  50% {
    opacity: 1;
    transform: scale(1.1);
  }

  to {
    opacity: 0.6;
    transform: scale(1);
  }
}
</style>
