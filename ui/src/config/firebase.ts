import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyB_qtSnUVannfJvFFadNLB7FrJ8JtFGc5s",
    authDomain: "regalame-af4b6.firebaseapp.com",
    projectId: "regalame-af4b6",
    storageBucket: "regalame-af4b6.firebasestorage.app",
    messagingSenderId: "776713797725",
    appId: "1:776713797725:web:b99ba2c850519fb20c0db4",
    measurementId: "G-HGYZ47HJZX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 