<template>
  <div class="mapfeatureselect">
    <Transition name="slide-down">
      <div
        class="pa-3"
        style="background: rgba(0, 0, 0, 0.5)"
        v-if="!selectedFeatureKey"
      >
        <div style="width: 100%; padding: 20px 0">
          <n-h2 style="color: white; font-weight: bold">Add location of</n-h2>

          <n-space justify="center" inline align="center">
            <n-button
              strong
              round
              @click="selectedFeatureKey = featureType.name"
              v-for="featureType in featureTypes"
              :key="featureType.name"
              :color="featureType.color"
              ><n-icon
                size="24"
                color="#ffffff"
                :component="featureType.icon"
              ></n-icon
              ><span strong style="padding-left: 5px">{{
                featureType.name
              }}</span></n-button
            >
          </n-space>
        </div>
      </div>
    </Transition>
  </div>
  <div class="mapcontrolbar">
    <Transition name="slide-down">
      <div v-if="selectedFeatureKey">
        <div :style="`background: ${selectedFeature.color}; color: white;`"
          ><n-space justify="space-between" align="center"
            ><div>
              <n-button
                style="margin: 5px"
                :color="selectedFeature.color"
                circle
                @click="resetNewMarker"
                icon
                ><n-icon size="20" color="white"><ChevronBack /></n-icon
              ></n-button>
              <n-h2
                align-text
                color="white"
                style="
                  display: inline-block;
                  font-weight: bold;
                  color: white;
                  padding: 0;
                  margin: 5px;
                  line-height: 100%;
                "
                >Add {{ selectedFeature.name }}</n-h2
              >
            </div>
          </n-space></div
        >
        <n-auto-complete
          size="large"
          style="text-align: left"
          :clear-after-select="true"
          placeholder="Search or tap anywhere on the map"
          @update:value="searchFor"
          :on-select="goTo"
          v-model:value="searchQuery"
          :options="searchResults"
          :render-label="renderLabel"
        ></n-auto-complete>
      </div>
    </Transition>
  </div>
  <div class="map-view">
    <div class="map-container">
      <mapbox-map
        height="100%"
        width="100%"
        :accessToken="ACCESS_TOKEN"
        :mapStyle="mapStyle"
        :center="center"
        :zoom="zoom"
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
            <n-icon
              size="30"
              style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4)"
              :color="getFeature(marker.type).color"
              :component="getFeature(marker.type).icon"
            ></n-icon
          ></template>
        </mapbox-marker>

        <mapbox-marker
          v-if="newMarker.show"
          :color="selectedFeature.color"
          :lngLat="newMarker.lngLat"
        >
          <template v-slot:icon>
            <div
              class="selected-border"
              :style="`border: 2px dotted ${selectedFeature.color};`"
            >
              <n-icon
                size="30"
                style="text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4)"
                :color="selectedFeature.color"
                :component="selectedFeature.icon"
              ></n-icon> </div></template
        ></mapbox-marker>

        <mapbox-marker @click="clickMarker" :lngLat="WYCLIFFE">
          <template v-slot:icon>
            <n-icon-wrapper color="purple" :size="40" :border-radius="15">
              <n-icon :component="Church" color="white" size="30"></n-icon>
            </n-icon-wrapper>
          </template>
        </mapbox-marker>
      </mapbox-map>

      <Transition name="slide-up">
        <div class="bottom-button" v-if="newMarker.lngLat" key="addmarker">
          <n-button @click="addMarker" type="success" round class="text-success"
            ><n-icon size="15" style="padding-right: 10px"><Check /></n-icon>
            Add</n-button
          ></div
        >

        <div v-else-if="!centered" class="bottom-button" key="resetmap">
          <n-button round @click="resetMap" size="small" color="purple">
            <n-icon
              size="15"
              style="padding-right: 10px"
              :component="Church"
              color="white"
            ></n-icon>
            Back to church</n-button
          >
        </div>
      </Transition>

      <!-- <v-card dark class="ma-3 pa-4" v-if="newMarker.show">
        <v-form>
          <v-text-field
            autofocus
            label="Description"
            v-model="newMarker.description"
          ></v-text-field></v-form
      ></v-card> -->
    </div>
  </div>
</template>

<script setup>
import {
  NH2,
  NButton,
  NSpace,
  NIcon,
  NIconWrapper,
  NAutoComplete,
} from 'naive-ui';
import { Home, Business, School, People, ChevronBack } from '@vicons/ionicons5';
import { VolunteerActivismRound } from '@vicons/material';
import { Church, Check } from '@vicons/fa';
import { Sport16Filled } from '@vicons/fluent';

import { ref, computed, onUnmounted, h } from 'vue';

import { find, debounce } from 'lodash';

import {
  collection,
  addDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import db from '@/firebase';

import axios from 'axios';

const searchBox = axios.create({
  baseURL: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
});

const WYCLIFFE = [-0.9497075714282346, 51.45333227533655];
const mapStyle = 'mapbox://styles/aonghas/cl0bpn4r9002r14v20lfnw3g2';
const ACCESS_TOKEN =
  'pk.eyJ1IjoiYW9uZ2hhcyIsImEiOiJjbDBicGNnZzQweHY2M2RxdXc3aWR2aGJ1In0.bEoO3hknIQLxRp1ujiN01Q';

const q = query(collection(db, 'features'));

const unsub = onSnapshot(q, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    switch (change.type) {
      case 'added':
        markers.value.push({ id: change.doc.id, ...change.doc.data() });
        break;
      case 'modified':
        console.log('modified', change.doc.data(), change.doc.id);
        break;
      case 'removed':
        console.log('removed', change.doc.data(), change.doc.id);
        break;
      default:
        break;
    }
  });
});

onUnmounted(() => {
  unsub();
});

function renderLabel(option) {
  console.log(option);
  return [
    h('div', { style: 'font-weight: bold' }, option.text),
    h('div', { style: 'color: #ccc; width: 100%' }, option.place_name),
  ];
}

function goTo(index) {
  newMarker.value.lngLat = {
    lng: searchResults.value[index].center[0],
    lat: searchResults.value[index].center[1],
  };
  newMarker.value.show = true;
  map.value.flyTo({
    zoom: 13,
    center: searchResults.value[index].center,
    duration: 1000,
  });
}

const searchResults = ref([]);

const searchQuery = ref('');

const searchFor = debounce(async (event) => {
  console.log('searching', event);
  searchResults.value = await searchBox
    .get(`${searchQuery.value}.json`, {
      params: {
        types: 'place,postcode,address,poi',
        access_token: ACCESS_TOKEN,
      },
    })
    .then((resp) =>
      resp.data.features.map((feature, i) => {
        return {
          ...feature,
          value: i,
        };
      })
    );
  console.log(searchResults.value);
}, 1000);

function getFeature(name) {
  return find(featureTypes, { name });
}

const featureTypes = [
  {
    name: 'Home',
    icon: Home,
    color: '#F9A825',
  },
  {
    name: 'Work',
    icon: Business,
    color: '#689F38',
  },
  {
    name: 'School',
    icon: School,
    color: '#388E3C',
  },
  {
    name: 'Sport',
    icon: Sport16Filled,
    color: '#0277BD',
  },
  {
    name: 'Volunteering',
    icon: VolunteerActivismRound,
    color: '#FF5722',
  },
  {
    name: 'Social',
    icon: People,
    color: '#FF4081',
  },
];

const selectedFeatureKey = ref(null);

const centered = computed(() => {
  if (center.value) {
    return (
      Math.abs(WYCLIFFE[0] - center.value[0]) < 0.03 &&
      Math.abs(WYCLIFFE[1] - center.value[1]) < 0.03
    );
  } else {
    return true;
  }
});

const selectedFeature = computed(() => {
  if (selectedFeatureKey.value != null) {
    return find(featureTypes, { name: selectedFeatureKey.value });
  } else {
    return null;
  }
});
const newMarker = ref({
  show: false,
  lngLat: null,
  type: null,
});

function resetNewMarker() {
  newMarker.value.show = false;
  selectedFeatureKey.value = false;
  newMarker.value.lngLat = null;
}

const center = ref();
const zoom = ref();
const init = ref(false);
const map = ref();

const markers = ref([]);

function resetMap() {
  map.value.flyTo({
    zoom: 13,
    center: WYCLIFFE,
    duration: 1000,
  });
}

function clickMarker(marker) {
  console.log(marker);
}

function updateCenter(event) {
  console.log(event, WYCLIFFE);
  center.value = event;
}
function updateZoom(event) {
  zoom.value = event;
}

async function addMarker() {
  console.log(newMarker.value, selectedFeature.value);

  const docRef = await addDoc(collection(db, 'features'), {
    type: selectedFeature.value.name,
    lngLat: [newMarker.value.lngLat.lng, newMarker.value.lngLat.lat],
    created: serverTimestamp(),
  });

  resetNewMarker();

  console.log('Doc', docRef.id);
}

function onLoad(event) {
  init.value = true;
  map.value = event;
  center.value = [map.value.getCenter().lng, map.value.getCenter().lat];
  map.value.setZoom(20);
  map.value.flyTo({ zoom: 13, duration: 4000 });

  map.value.dragRotate.disable();

  // disable map rotation using touch rotation gesture
  map.value.touchZoomRotate.disableRotation();

  map.value.on('click', (event) => {
    if (selectedFeatureKey.value) {
      newMarker.value.show = true;
      newMarker.value.lngLat = event.lngLat;
    }
  });
}
</script>

<style lang="scss">
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

.bottom-button {
  position: fixed;
  z-index: 1;
  width: 100%;
  bottom: 10px;
}

.selected-border {
  height: 35px;
  width: 35px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  animation: expand infinite 0.5s linear;
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
