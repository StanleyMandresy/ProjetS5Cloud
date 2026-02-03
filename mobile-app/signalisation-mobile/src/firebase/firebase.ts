import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyBCajuBJbaEVFop9GbKetSbssS2XDbetws',
  authDomain: 'signalisation-s5.firebaseapp.com',
  projectId: 'signalisation-s5',
  storageBucket: 'signalisation-s5.firebasestorage.app',
  messagingSenderId: '551839325042',
  appId: '1:551839325042:web:f0578177513afa84cedbeb'
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Initialize Firebase Authentication
export const auth = getAuth(firebaseApp)

export default firebaseApp
