<template>
  <div style="height: 50vh">
    <div id="map" style="height: 100%; width: 100%"></div>
    hey
  </div>
</template>

<script setup>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import style from '@/assets/style.json';

import { onMounted } from 'vue';

onMounted(() => {
  console.log('mounted');
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYW9uZ2hhcyIsImEiOiJjbDBicGNnZzQweHY2M2RxdXc3aWR2aGJ1In0.bEoO3hknIQLxRp1ujiN01Q';

  const map = new mapboxgl.Map({
    container: 'map',
    style: style,
  });

  map.on('load', () => {
    console.log('loaded');
    // TODO: Here we want to load a layer
    // TODO: Here we want to load/setup the popup
    map.addSource('usa', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json',
    });

    map.addLayer({
      id: 'usa-fill',
      type: 'fill',
      source: 'usa',
      paint: {
        'fill-color': 'red',
      },
    });
    map.on('click', 'usa-fill', function (e) {
      new mapboxgl.Popup().setLngLat(e.lngLat).setHTML('hey').addTo(map);
    });
  });
});
</script>

<style lang="scss">
.mapboxgl-control-container {
  display: none !important;
}
</style>
