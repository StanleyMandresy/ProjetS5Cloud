import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Composant pour afficher le statut de synchronisation
 */
export const SyncStatusBadge: React.FC = () => {
  const { unsyncedUsersCount, syncPendingUsers } = useAuth();
  const isOnline = useOnlineStatus();
  const [syncing, setSyncing] = React.useState(false);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncPendingUsers();
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (unsyncedUsersCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="alert alert-warning shadow-lg">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div>
            <h3 className="font-bold">
              {unsyncedUsersCount} utilisateur(s) non synchronisé(s)
            </h3>
            <div className="text-xs">
              {isOnline ? (
                <button
                  className="btn btn-xs btn-primary mt-1"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? 'Synchronisation...' : 'Synchroniser maintenant'}
                </button>
              ) : (
                <span>Synchronisation dès que vous serez en ligne</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
