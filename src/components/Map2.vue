<template>
  <div class="mapfeatureselect">
    <v-fade-transition>
      <div
        class="pa-3"
        style="background: rgba(0, 0, 0, 0.5)"
        v-if="!selectedFeatureKey"
      >
        <div class="text-center" style="width: 100%; margin: 0 auto">
          <h2 class="text-white font-weight-bold">Add location of</h2>

          <div class="ma-3">
            <v-btn
              rounded="lg"
              class="ma-3"
              :active="false"
              @click="selectedFeatureKey = featureType.name"
              v-for="featureType in featureTypes"
              :key="featureType.name"
              :color="
                selectedFeatureKey == featureType.name
                  ? `${featureType.color}`
                  : ''
              "
              ><v-icon class="mr-1" :color="featureType.color">{{
                featureType.icon
              }}</v-icon
              ><span strong>{{ featureType.name }}</span></v-btn
            >
          </div>
        </div>
      </div>
    </v-fade-transition>
  </div>
  <div class="mapcontrolbar">
    <v-slide-y-transition leave-absolute>
      <div v-if="selectedFeatureKey">
        <v-alert
          key="selected"
          rounded="0"
          :border-color="`${selectedFeature.color}-lighten-4`"
          :color="selectedFeature.color"
          border="bottom"
          ><div class="d-flex justify-space-between align-center"
            ><div class="align-center">
              <v-btn
                @click="resetNewMarker"
                icon
                size="x-small"
                class="d-inline-block"
                ><v-icon :color="`${selectedFeature.color}`"
                  >mdi-chevron-left</v-icon
                ></v-btn
              ><h2 class="ml-2 text-white d-inline-block"
                >Add {{ selectedFeature.name }}</h2
              ></div
            >
            <v-btn
              @click="addMarker"
              v-if="newMarker.lngLat"
              icon
              size="small"
              class="text-success"
              ><v-icon>mdi-check</v-icon></v-btn
            ></div
          ></v-alert
        >
        <v-card>hello</v-card>
        <v-autocomplete></v-autocomplete>
        <div class="white-bg"> </div>
        <v-autocomplete
          :items="searchResults"
          item-text="place_name"
          v-model="searchQuery"
          @keyup="searchFor"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details="auto"
        ></v-autocomplete>
        <v-text-field></v-text-field>
        <v-select></v-select>
        <v-autocomplete></v-autocomplete>
      </div>
    </v-slide-y-transition>
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
            <v-icon
              style="
                transform: scale(2);
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
              "
              :color="getFeature(marker.type).color"
              >{{ getFeature(marker.type).icon }}</v-icon
            ></template
          >
        </mapbox-marker>

        <v-fade-transition>
          <mapbox-marker
            v-if="newMarker.show"
            :color="selectedFeature.color"
            :lngLat="newMarker.lngLat"
          >
            <template v-slot:icon>
              <v-icon
                style="
                  transform: scale(2);
                  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
                "
                :color="selectedFeature.color"
                >{{ selectedFeature.icon }}</v-icon
              >
            </template></mapbox-marker
          >
        </v-fade-transition>

        <mapbox-marker @click="clickMarker" :lngLat="WYCLIFFE">
          <template v-slot:icon>
            <v-icon style="transform: scale(1.3)" color="purple"
              >mdi-church</v-icon
            >
          </template>
        </mapbox-marker>
      </mapbox-map>

      <v-slide-y-reverse-transition>
        <div
          v-if="!centered"
          style="position: fixed; z-index: 1; width: 100%; bottom: 10px"
        >
          <v-btn @click="resetMap" size="small" color="purple"
            >Back to church</v-btn
          >
        </div>
      </v-slide-y-reverse-transition>

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
import { ref, computed, onUnmounted } from 'vue';

import { find, debounce } from 'lodash';

import { collection, addDoc, onSnapshot, query } from 'firebase/firestore';

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

const searchResults = ref([]);
const searchQuery = ref('');

const searchFor = debounce(async () => {
  console.log('searching');
  searchResults.value = await searchBox.get(`${searchQuery.value}.json`, {
    params: {
      types: 'place,postcode,address',
      access_token: ACCESS_TOKEN,
    },
  });
  console.log(searchResults.value);
}, 1000);

function getFeature(name) {
  return find(featureTypes, { name });
}

const featureTypes = [
  {
    name: 'Home',
    icon: 'mdi-home',
    color: 'amber',
  },
  {
    name: 'Work',
    icon: 'mdi-office-building',
    color: 'green',
  },
  {
    name: 'School',
    icon: 'mdi-school',
    color: 'green',
  },
  {
    name: 'Sport',
    icon: 'mdi-soccer-field',
    color: 'blue',
  },
  {
    name: 'Social',
    icon: 'mdi-account-group',
    color: 'pink',
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
  margin-top: 20vh;
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
</style>
