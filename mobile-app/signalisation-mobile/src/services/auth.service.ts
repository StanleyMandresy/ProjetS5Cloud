import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/firebase'

class AuthService {
  async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  async logout() {
    return signOut(auth)
  }

  onAuthChange(callback: (user: any) => void) {
    onAuthStateChanged(auth, callback)
  }
}

export const authService = new AuthService()
