import { initializeApp } from '@react-native-firebase/app';
import '@react-native-firebase/auth';

const firebaseConfig = {
  projectId: 'whatzapp-74a76',
  apiKey: 'AIzaSyCbbYttechtqFKvmJN8hTdm7suiPDiwtTk',
  appId: '1:892895109225:android:7020e0ec14222448cd42f8',
  storageBucket: 'whatzapp-74a76.firebasestorage.app',
  messagingSenderId: '892895109225',
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
