import { createStore } from 'vuex';
import { db, auth } from '@/firebase';
import {
  signInAnonymously,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';

let unsub, unsubConfig;

export default createStore({
  state: {
    markers: [],
    user: null,
    config: false,
  },
  mutations: {
    addMarker(state, payload) {
      state.markers.push(payload);
    },
    removeMarker(state, payload) {
      state.markers = state.markers.filter((m) => m.id != payload);
    },
    cleanStore(state) {
      state.markers = [];
    },
    SET_STATE(state, payload) {
      state[payload.name] = payload.data;
    },
  },
  actions: {
    updateConfig(_, payload) {
      console.log('here');
      const configRef = doc(db, 'settings', 'config');
      updateDoc(configRef, payload);
    },
    deleteMarkers({ state, commit }) {
      state.markers.forEach(async (marker) => {
        await deleteDoc(doc(db, 'features', marker.id));
      });
    },
    logOut({ commit }) {
      signOut(auth).then(() => {
        commit('SET_STATE', { name: 'user', data: null });
      });
    },
    loginAnon({ commit }) {
      signInAnonymously(auth)
        .then((data) => {
          commit('SET_STATE', { name: 'user', data: data.user });
        })
        .catch((error) => {
          console.error(error);
          const errorCode = error.code;
          const errorMessage = error.message;

          alert(errorMessage);
        });
    },
    loginEmail({ commit }, payload) {
      console.log(payload);
      signInWithEmailAndPassword(auth, payload.email, payload.password)
        .then((data) => {
          commit('SET_STATE', { name: 'user', data: data.user });
        })
        .catch((error) => {
          console.error(error);
          const errorCode = error.code;
          const errorMessage = error.message;

          alert(errorMessage);
        });
    },
    addMarkerToFirestore(_, payload) {
      return addDoc(collection(db, 'features'), {
        ...payload,
        created: serverTimestamp(),
      });
    },
    subscribeConfig({ commit }) {
      unsubConfig = onSnapshot(doc(db, 'settings', 'config'), (doc) => {
        commit('SET_STATE', { name: 'config', data: doc.data() });
      });
    },
    subscribeMyMarkers({ commit, state }) {
      const q = query(
        collection(db, 'features'),
        where('author', '==', state.user.uid)
      );
      if (unsub) unsub();
      commit('SET_STATE', { name: 'markers', data: [] });
      unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case 'added':
              commit('addMarker', { id: change.doc.id, ...change.doc.data() });
              break;
            case 'modified':
              console.log('modified', change.doc.data(), change.doc.id);
              break;
            case 'removed':
              console.log('removed', change.doc.data(), change.doc.id);

              commit('removeMarker', change.doc.id);
              break;
            default:
              break;
          }
        });
      });
    },
    subscribeAllMarkers({ commit }) {
      const q = query(collection(db, 'features'));
      if (unsub) unsub();
      commit('SET_STATE', { name: 'markers', data: [] });
      unsub = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          switch (change.type) {
            case 'added':
              commit('addMarker', { id: change.doc.id, ...change.doc.data() });
              break;
            case 'modified':
              console.log('modified', change.doc.data(), change.doc.id);
              break;
            case 'removed':
              console.log('removed', change.doc.data(), change.doc.id);
              commit('removeMarker', change.doc.id);
              break;
            default:
              break;
          }
        });
      });
    },
    unsubscribe() {
      if (unsub) unsub();
      if (unsubConfig) unsubConfig();
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
    myMarkers(state) {
      return state.markers.filter((m) => m.author == state.user?.uid);
    },
    getAllMarkers(state) {
      return state.markers;
    },
  },
  modules: {},
});
