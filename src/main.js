import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import VueMapboxTs from 'vue-mapbox-ts';

loadFonts();

// import OpenLayersMap from 'vue3-openlayers';
// import 'vue3-openlayers/dist/vue3-openlayers.css';

const app = createApp(App);

app.use(vuetify);
// app.use(OpenLayersMap);
app.use(VueMapboxTs);
app.use(router);
app.mount('#app');
