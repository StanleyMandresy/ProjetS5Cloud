import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection } from 'firebase/firestore';
import { firebaseAuth, db } from '../firebase/firebase';
import { localDBService } from './localDB.service';

class UserSyncService {
  private isSyncing = false;

  // Synchroniser un utilisateur local vers Firebase
  async syncUserToFirebase(localUser: {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: string;
  }) {
    try {
      console.log('🔄 Début de la synchronisation pour:', localUser.email);

      // 1. Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        localUser.email,
        localUser.password
      );

      const firebaseUser = userCredential.user;
      console.log('✅ Utilisateur créé dans Firebase Auth:', firebaseUser.uid);

      // 2. Sauvegarder les données utilisateur dans Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userDocRef, {
        username: localUser.username,
        email: localUser.email,
        createdAt: localUser.createdAt,
        syncedAt: new Date().toISOString(),
        localId: localUser.id,
        isActive: true,
      });

      console.log('✅ Données utilisateur sauvegardées dans Firestore');

      // 3. Marquer comme synchronisé dans la base locale
      await localDBService.markAsSynced(localUser.id, firebaseUser.uid);

      return {
        success: true,
        firebaseUid: firebaseUser.uid,
      };
    } catch (error: any) {
      console.error('❌ Erreur de synchronisation:', error);
      
      // Enregistrer l'erreur dans la base locale
      await localDBService.markSyncError(
        localUser.id,
        error.message || 'Erreur inconnue'
      );

      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Synchroniser tous les utilisateurs non synchronisés
  async syncAllPendingUsers() {
    if (this.isSyncing) {
      console.log('⏳ Synchronisation déjà en cours...');
      return;
    }

    this.isSyncing = true;
    console.log('🚀 Début de la synchronisation de masse...');

    try {
      const unsyncedUsers = await localDBService.getUnsyncedUsers();
      console.log(`📊 ${unsyncedUsers.length} utilisateur(s) à synchroniser`);

      const results = {
        total: unsyncedUsers.length,
        success: 0,
        failed: 0,
        errors: [] as string[],
      };

      for (const user of unsyncedUsers) {
        const result = await this.syncUserToFirebase(user);
        
        if (result.success) {
          results.success++;
        } else {
          results.failed++;
          results.errors.push(`${user.email}: ${result.error}`);
        }

        // Petite pause entre chaque sync pour éviter de surcharger Firebase
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log('✅ Synchronisation terminée:', results);
      return results;
    } catch (error: any) {
      console.error('❌ Erreur lors de la synchronisation de masse:', error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  // Vérifier si une synchronisation est en cours
  isSyncInProgress(): boolean {
    return this.isSyncing;
  }

  // Créer un utilisateur local et le synchroniser immédiatement si en ligne
  async createAndSyncUser(
    username: string,
    email: string,
    password: string,
    isOnline: boolean
  ) {
    // 1. Toujours créer en local d'abord
    const localUser = await localDBService.createLocalUser(username, email, password);

    // 2. Si en ligne, tenter la synchronisation immédiatement
    if (isOnline) {
      const syncResult = await this.syncUserToFirebase(localUser);
      return {
        localUser,
        synced: syncResult.success,
        firebaseUid: syncResult.firebaseUid,
        error: syncResult.error,
      };
    }

    // 3. Si hors ligne, retourner juste l'utilisateur local
    return {
      localUser,
      synced: false,
      message: 'Utilisateur créé en local. Sera synchronisé quand vous serez en ligne.',
    };
  }
}

export const userSyncService = new UserSyncService();
