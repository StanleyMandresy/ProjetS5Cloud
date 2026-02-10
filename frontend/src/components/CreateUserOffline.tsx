import React, { useState, useEffect } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { localDBService } from '../services/localDB.service';
import { userSyncService } from '../services/userSync.service';

export const CreateUserOffline: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const [localUsers, setLocalUsers] = useState<any[]>([]);

  // Charger le nombre d'utilisateurs non synchronisés
  const loadUnsyncedCount = async () => {
    const count = await localDBService.countUnsyncedUsers();
    setUnsyncedCount(count);
    
    const users = await localDBService.getAllUsers();
    setLocalUsers(users);
  };

  useEffect(() => {
    loadUnsyncedCount();
  }, []);

  // Créer un utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await userSyncService.createAndSyncUser(
        username,
        email,
        password,
        isOnline
      );

      if (result.synced) {
        setMessage(`✅ Utilisateur créé et synchronisé avec Firebase (UID: ${result.firebaseUid})`);
      } else if (result.error) {
        setMessage(`⚠️ Utilisateur créé en local mais erreur de synchronisation: ${result.error}`);
      } else {
        setMessage('📱 Utilisateur créé en local. Sera synchronisé quand vous serez en ligne.');
      }

      // Réinitialiser le formulaire
      setUsername('');
      setEmail('');
      setPassword('');

      // Recharger le compteur
      await loadUnsyncedCount();
    } catch (error: any) {
      setMessage(`❌ Erreur: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser manuellement tous les utilisateurs
  const handleSyncAll = async () => {
    setLoading(true);
    setMessage('🔄 Synchronisation en cours...');

    try {
      const results = await userSyncService.syncAllPendingUsers();
      setMessage(
        `✅ Synchronisation terminée: ${results.success} réussi(s), ${results.failed} échoué(s)`
      );
      
      if (results.errors.length > 0) {
        console.error('Erreurs:', results.errors);
      }

      await loadUnsyncedCount();
    } catch (error: any) {
      setMessage(`❌ Erreur de synchronisation: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Indicateur de connexion */}
      <div className={`alert mb-4 ${isOnline ? 'alert-success' : 'alert-warning'}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{isOnline ? '🌐' : '📡'}</span>
          <span>
            {isOnline ? 'En ligne - Les utilisateurs seront synchronisés immédiatement' : 'Hors ligne - Les utilisateurs seront créés localement'}
          </span>
        </div>
      </div>

      {/* Badge d'utilisateurs non synchronisés */}
      {unsyncedCount > 0 && (
        <div className="alert alert-info mb-4">
          <div className="flex items-center justify-between w-full">
            <span>📊 {unsyncedCount} utilisateur(s) en attente de synchronisation</span>
            {isOnline && (
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSyncAll}
                disabled={loading}
              >
                Synchroniser maintenant
              </button>
            )}
          </div>
        </div>
      )}

      {/* Formulaire de création */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Créer un utilisateur</h2>
          
          <form onSubmit={handleCreateUser}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Nom d'utilisateur</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Création en cours...' : 'Créer l\'utilisateur'}
            </button>
          </form>

          {message && (
            <div className="alert mt-4">
              <span>{message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Liste des utilisateurs locaux */}
      {localUsers.length > 0 && (
        <div className="card bg-base-100 shadow-xl mt-6">
          <div className="card-body">
            <h3 className="card-title">Utilisateurs locaux ({localUsers.length})</h3>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Username</th>
                    <th>Créé le</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {localUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.username}</td>
                      <td>{new Date(user.createdAt).toLocaleString()}</td>
                      <td>
                        {user.syncedToFirebase ? (
                          <span className="badge badge-success">✅ Synchronisé</span>
                        ) : user.syncError ? (
                          <span className="badge badge-error" title={user.syncError}>
                            ❌ Erreur
                          </span>
                        ) : (
                          <span className="badge badge-warning">⏳ En attente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
