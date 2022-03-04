import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
let config = {
  apiKey: 'AIzaSyAwRm--7R_JzBn3WNx7nWdmsp9d5jMnlv8',
  authDomain: 'hax-maps.firebaseapp.com',
  projectId: 'hax-maps',
  storageBucket: 'hax-maps.appspot.com',
  messagingSenderId: '696419747737',
  appId: '1:696419747737:web:b9da9cd0dc14c6df12f508',
  measurementId: 'G-XTV789ZR1X',
};
const app = initializeApp(config);
export default getFirestore(app);
