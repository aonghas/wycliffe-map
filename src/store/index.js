import { createStore } from 'vuex';
import { db } from '@/firebase';
export default createStore({
  state: {
    markers: [],
  },
  mutations: {
    addAllMarkers(state, payload) {
      state.markers.push(payload);
    },
    cleanStore(state) {
      state.markers = [];
    },
  },
  actions: {
    addMarker({ commit }, marker) {
      db.collection('markers')
        .add(marker)
        .then((docref) => {
          db.collection('markers').doc(docref.id).update({
            id: docref.id,
          });
        });
    },
    deleteMarker({ commit }, marker) {
      db.collection('markers').doc(marker.id).delete();
    },
    updateMarker({ commit }, marker) {
      db.collection('markers').doc(marker.id).update({
        title: marker.title,
      });
    },
    addAllMarkers({ commit }, marker) {
      commit('addAllMarkers', marker);
    },
    cleanStore({ commit }) {
      commit('cleanStore');
    },
  },
  getters: {
    getAllMarkers(state) {
      return state.markers;
    },
  },
  modules: {},
});
