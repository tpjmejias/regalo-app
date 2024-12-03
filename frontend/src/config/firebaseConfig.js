import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB_qtSnUVannfJvFFadNLB7FrJ8JtFGc5s",
    authDomain: "regalame-af4b6.firebaseapp.com",
    projectId: "regalame-af4b6",
    storageBucket: "regalame-af4b6.firebasestorage.app",
    messagingSenderId: "776713797725",
    appId: "1:776713797725:web:b99ba2c850519fb20c0db4",
    measurementId: "G-HGYZ47HJZX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
auth.useDeviceLanguage();

// Initialize Firestore with persistence using the new method
const db = getFirestore(app, {
    cacheSizeBytes: 50 * 1024 * 1024, // 50 MB
    experimentalForceLongPolling: true,
    experimentalAutoDetectLongPolling: true,
    ignoreUndefinedProperties: true,
});

export { auth, db };
export default app;
