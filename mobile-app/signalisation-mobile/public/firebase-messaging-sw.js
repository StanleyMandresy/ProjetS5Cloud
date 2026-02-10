importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
   apiKey: 'AIzaSyBCajuBJbaEVFop9GbKetSbssS2XDbetws',
  authDomain: 'signalisation-s5.firebaseapp.com',
  projectId: 'signalisation-s5',
  storageBucket: 'signalisation-s5.firebasestorage.app',
  messagingSenderId: '551839325042',
  appId: '1:551839325042:web:f0578177513afa84cedbeb'
});

const messaging = firebase.messaging();
