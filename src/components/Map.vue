<template>
  <div>
    <div class="headerfade">
      <h1 style="text-align: center; margin: 10px auto; right: 0; left: 0"
        >Wycliffe Community</h1
      ></div
    >

    <ol-map
      style="height: 100vh; width: 100vw"
      :pixelRatio="2"
      :loadTilesWhileAnimating="true"
      :loadTilesWhileInteracting="true"
      ref="map"
    >
      <ol-view
        ref="view"
        :zoom="zoom"
        :center="center"
        :enableRotation="false"
        :projection="projection"
        @centerChanged="centerChanged"
        @zoomChanged="zoomChanged"
      />

      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>

      <ol-vector-layer :features="features">
        <ol-source-vector :projection="projection">
          <ol-interaction-modify v-if="!drawEnable"> </ol-interaction-modify>
          <ol-interaction-draw
            v-if="drawEnable"
            :type="drawType"
            @drawend="drawend"
            @drawstart="drawstart"
          >
          </ol-interaction-draw>
        </ol-source-vector>
      </ol-vector-layer>

      <!-- <ol-vector-layer>
        <ol-source-vector
          ref="cities"
          url="reading.json"
          :format="topoJson"
          :projection="projection"
        >
        </ol-source-vector>

        <ol-style>
          <ol-style-stroke color="red" :width="1"></ol-style-stroke>
          <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
          <ol-style-circle :radius="7">
            <ol-style-fill color="blue"></ol-style-fill>
          </ol-style-circle>
        </ol-style>
      </ol-vector-layer>
      <ol-vector-layer>
        <ol-source-vector
          ref="cities"
          url="wokingham.json"
          :format="topoJson"
          :projection="projection"
        >
        </ol-source-vector>

        <ol-style>
          <ol-style-stroke color="red" :width="1"></ol-style-stroke>
          <ol-style-fill color="rgba(255,255,255,0.1)"></ol-style-fill>
          <ol-style-circle :radius="7">
            <ol-style-fill color="blue"></ol-style-fill>
          </ol-style-circle>
        </ol-style>
      </ol-vector-layer> -->
    </ol-map>
  </div>

  <v-card class="drawer" :class="expanded ? 'expanded' : ''" dark>
    <div class="d-flex justify-space-between">
      <v-btn @click="resetMap">Reset</v-btn>
      <v-btn @click="drawEnable = !drawEnable">{{
        !drawEnable ? 'Add' : 'Edit'
      }}</v-btn>
      <v-btn @click="expanded = !expanded"
        ><v-icon>{{
          !expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
        }}</v-icon></v-btn
      >
    </div>
    <ul style="overflow-y: scroll; height: 100%">
      <li v-for="feature in features" :key="feature.ol_uid">{{ feature }}</li>
    </ul>

    <v-spacer></v-spacer>
    center : {{ center }} zoom : {{ zoom }}
  </v-card>
</template>

<script setup>
const WYCLIFFE_COORDS = [-105725.32128740975, 6701866.775847095];

import { ref } from 'vue';

import { Collection } from 'ol';

const expanded = ref(false);

const features = ref([]);

const view = ref();
const map = ref();

const selectedFeatures = ref(new Collection());

const drawEnable = ref(true);

const drawType = ref('Point');

const center = ref(WYCLIFFE_COORDS);
const zoom = ref(14);

function centerChanged(newCenter) {
  center.value = newCenter;
}

function zoomChanged(newZoom) {
  zoom.value = newZoom;
}

function resetMap() {
  center.value = WYCLIFFE_COORDS;
  zoom.value = 14;
  features.value = [];
}

function drawstart(e) {
  console.log(e);
}

function editDrawend(e) {
  console.log(e);
}

function drawend(e) {
  console.log(e);
  features.value.push(e.feature);
}

function featureSelected(e) {
  console.log(e);
}

const projection = 'EPSG:3857';
</script>

<style lang="scss" scoped>
.headerfade {
  color: white;
  width: 100%;
  position: fixed;
  top: 0;
  height: 100px;
  background: rgb(40, 9, 55);
  background: linear-gradient(
    0deg,
    rgba(40, 9, 55, 0) 19%,
    rgba(0, 0, 0, 0.8071603641456583) 100%
  );
  z-index: 1;
  h1 {
    opacity: 0.8;
    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);
  }
}

.drawer {
  position: fixed;
  height: 20%;
  bottom: 0;
  width: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
  transition: height 0.25s ease;

  &.expanded {
    height: 100%;
  }
}
</style>
