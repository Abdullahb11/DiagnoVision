import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAMUgHQRjj0OjjqsM5z6QKlcQBntMzcFso",
  authDomain: "diagnovision-6bd9d.firebaseapp.com",
  projectId: "diagnovision-6bd9d",
  storageBucket: "diagnovision-6bd9d.firebasestorage.app",
  messagingSenderId: "404961014974",
  appId: "1:404961014974:web:84d00bc3c9984801605aef"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app

