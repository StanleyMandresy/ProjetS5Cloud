import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Schema de la base de données locale
interface LocalDBSchema extends DBSchema {
  users: {
    key: string; // UUID temporaire
    value: {
      id: string;
      username: string;
      email: string;
      password: string;
      createdAt: string;
      syncedToFirebase: boolean;
      firebaseUid?: string;
      syncError?: string;
    };
    indexes: { 'by-sync-status': boolean };
  };
}

class LocalDBService {
  private dbName = 'signalisation-local-db';
  private version = 1;
  private db: IDBPDatabase<LocalDBSchema> | null = null;

  // Initialiser la base de données
  async init() {
    if (this.db) return this.db;

    this.db = await openDB<LocalDBSchema>(this.dbName, this.version, {
      upgrade(db) {
        // Créer le store pour les utilisateurs
        const userStore = db.createObjectStore('users', { keyPath: 'id' });
        userStore.createIndex('by-sync-status', 'syncedToFirebase');
      },
    });

    return this.db;
  }

  // Générer un UUID simple
  private generateUUID(): string {
    return 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Créer un utilisateur en local
  async createLocalUser(username: string, email: string, password: string) {
    const db = await this.init();
    
    const localUser = {
      id: this.generateUUID(),
      username,
      email,
      password,
      createdAt: new Date().toISOString(),
      syncedToFirebase: false,
    };

    await db.add('users', localUser);
    console.log('✅ Utilisateur créé en local:', localUser.id);
    
    return localUser;
  }

  // Récupérer tous les utilisateurs non synchronisés
  async getUnsyncedUsers() {
    const db = await this.init();
    const tx = db.transaction('users', 'readonly');
    const index = tx.store.index('by-sync-status');
    
    return await index.getAll(false);
  }

  // Récupérer tous les utilisateurs
  async getAllUsers() {
    const db = await this.init();
    return await db.getAll('users');
  }

  // Marquer un utilisateur comme synchronisé
  async markAsSynced(localId: string, firebaseUid: string) {
    const db = await this.init();
    const user = await db.get('users', localId);
    
    if (user) {
      user.syncedToFirebase = true;
      user.firebaseUid = firebaseUid;
      user.syncError = undefined;
      await db.put('users', user);
      console.log('✅ Utilisateur marqué comme synchronisé:', localId);
    }
  }

  // Marquer une erreur de synchronisation
  async markSyncError(localId: string, error: string) {
    const db = await this.init();
    const user = await db.get('users', localId);
    
    if (user) {
      user.syncError = error;
      await db.put('users', user);
      console.error('❌ Erreur de synchronisation:', localId, error);
    }
  }

  // Supprimer un utilisateur local
  async deleteLocalUser(localId: string) {
    const db = await this.init();
    await db.delete('users', localId);
    console.log('🗑️ Utilisateur local supprimé:', localId);
  }

  // Compter les utilisateurs non synchronisés
  async countUnsyncedUsers(): Promise<number> {
    const unsyncedUsers = await this.getUnsyncedUsers();
    return unsyncedUsers.length;
  }
}

export const localDBService = new LocalDBService();
