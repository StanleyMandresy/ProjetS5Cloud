import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { authService } from '../services/auth.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BlockedUsers: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blocked, setBlocked] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role !== 'MANAGER') return;
    loadBlocked();
  }, [user]);

  const loadBlocked = async () => {
    setLoading(true);
    try {
      const data = await authService.getBlockedUsers();
      setBlocked(data);
    } catch (err) {
      console.error(err);
      alert('Erreur récupération utilisateurs bloqués');
    } finally {
      setLoading(false);
    }
  };

  const handleUnblock = async (idUtilisateur: number | null) => {
    if (!idUtilisateur) return alert('Utilisateur introuvable');
    if (!confirm('Débloquer cet utilisateur ?')) return;
    try {
      await authService.unblockUser(idUtilisateur);
      alert('Utilisateur débloqué');
      loadBlocked();
    } catch (err) {
      console.error(err);
      alert('Erreur lors du déblocage');
    }
  };

  if (user?.role !== 'MANAGER') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow">Accès refusé</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-itu-light">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Utilisateurs bloqués</h1>
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <table className="w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="p-2">#</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Identifier</th>
                <th className="p-2">Tentatives</th>
                <th className="p-2">Bloqué jusqu'à</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {blocked.length === 0 && (
                <tr><td colSpan={7} className="p-4 text-center">Aucun utilisateur bloqué</td></tr>
              )}
              {blocked.map((b, idx) => (
                <tr key={b.idAttempt ?? idx} className="border-t">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{b.username || '-'}</td>
                  <td className="p-2">{b.email || '-'}</td>
                  <td className="p-2">{b.identifier}</td>
                  <td className="p-2">{b.attempts}</td>
                  <td className="p-2">{b.blockedUntil ? new Date(b.blockedUntil).toLocaleString() : '-'}</td>
                  <td className="p-2">
                    <button onClick={() => handleUnblock(b.idUtilisateur)} className="px-3 py-1 bg-green-500 text-white rounded">Débloquer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default BlockedUsers;
