import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store';
import { loadFonts } from './plugins/webfontloader';

import VueMapboxTs from 'vue-mapbox-ts';

loadFonts();
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// import OpenLayersMap from 'vue3-openlayers';
// import 'vue3-openlayers/dist/vue3-openlayers.css';
let app;
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('user', user);
    store.commit('SET_STATE', { name: 'user', data: user });
  }

  if (!app) {
    console.log('creating');
    app = createApp(App);
    app.use(store);

    // app.use(OpenLayersMap);
    app.use(VueMapboxTs);
    app.use(router);
    app.mount('#app');
  }
});
