import React from 'react';
import { CreateUserOffline } from '../components/CreateUserOffline';
import { SyncStatusBadge } from '../components/SyncStatusBadge';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

/**
 * Page de démonstration de la création d'utilisateurs offline
 */
export const OfflineUserDemo: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Gestion des utilisateurs Offline</h1>
          <p className="text-lg opacity-70">
            Créez des utilisateurs même sans connexion, ils seront synchronisés automatiquement avec Firebase
          </p>
        </div>

        {/* Statut de connexion */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className={`stats shadow w-full ${isOnline ? 'bg-success' : 'bg-warning'}`}>
            <div className="stat">
              <div className="stat-figure text-4xl">
                {isOnline ? '🌐' : '📡'}
              </div>
              <div className="stat-title text-base-content">Statut de connexion</div>
              <div className="stat-value text-base-content">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </div>
              <div className="stat-desc text-base-content">
                {isOnline 
                  ? 'Les utilisateurs seront synchronisés immédiatement' 
                  : 'Mode offline activé - Synchronisation différée'}
              </div>
            </div>
          </div>
        </div>

        {/* Composant principal */}
        <CreateUserOffline />

        {/* Instructions */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">💡 Comment ça marche ?</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>1️⃣</span> Création en local
                  </h3>
                  <p className="text-sm opacity-70 ml-6">
                    Les utilisateurs sont d'abord enregistrés dans IndexedDB (base de données locale du navigateur)
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>2️⃣</span> Synchronisation automatique
                  </h3>
                  <p className="text-sm opacity-70 ml-6">
                    Si vous êtes en ligne, l'utilisateur est immédiatement envoyé à Firebase Auth et Firestore
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>3️⃣</span> Mode offline
                  </h3>
                  <p className="text-sm opacity-70 ml-6">
                    Si vous êtes hors ligne, l'utilisateur reste en local et sera synchronisé automatiquement dès que la connexion sera rétablie
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    <span>4️⃣</span> Gestion des erreurs
                  </h3>
                  <p className="text-sm opacity-70 ml-6">
                    En cas d'erreur de synchronisation (ex: email déjà existant), l'utilisateur reste en local avec l'erreur affichée
                  </p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="alert alert-info">
                <span className="text-sm">
                  <strong>Astuce :</strong> Pour tester le mode offline, ouvrez les DevTools (F12) et allez dans l'onglet Network,
                  puis cochez "Offline" pour simuler une perte de connexion.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Badge de statut de synchronisation */}
      <SyncStatusBadge />
    </div>
  );
};
