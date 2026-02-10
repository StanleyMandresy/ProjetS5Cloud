import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'
import { getFcmToken } from './fcm.service';
import axios from 'axios';

class AuthService {

  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Récupérer le token FCM
    const token = await getFcmToken();
    if (token) {
      await axios.post("http://localhost:8081/api/auth/users/fcm-token", {
        userEmail: email,
        fcmToken: token,
        deviceType: "MOBILE"
      });
    }

    return cred;


 

  async logout() {
    return signOut(auth);
  }

  onAuthChange(callback: (user: any) => void) {
    onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();
