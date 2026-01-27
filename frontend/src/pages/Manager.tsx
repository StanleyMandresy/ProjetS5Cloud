import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTravaux } from '../context/TravauxContext';
import { travauxService, CreateTravailRequest, UpdateTravailRequest } from '../services/travaux.service';
import { useNavigate } from 'react-router-dom';

const Manager: React.FC = () => {
  const { user, logout } = useAuth();
  const { travaux, refresh } = useTravaux();
  const navigate = useNavigate();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  
  const [formData, setFormData] = useState<CreateTravailRequest>({
    titre: '',
    description: '',
    latitude: -18.8792,
    longitude: 47.5079,
    statut: 'NOUVEAU',
    surfaceM2: undefined,
    budget: undefined,
  });

  // Vérifier si l'utilisateur est MANAGER
  if (user?.role !== 'MANAGER') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Accès refusé</h1>
          <p className="text-gray-300 mb-6">Vous devez être MANAGER pour accéder à cette page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await travauxService.create(formData);
      await refresh();
      setShowCreateForm(false);
      resetForm();
      alert('Point de réparation créé avec succès !');
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création');
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      const updateData: UpdateTravailRequest = {
        titre: formData.titre,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        statut: formData.statut,
        surfaceM2: formData.surfaceM2,
        budget: formData.budget,
      };
      await travauxService.update(id, updateData);
      await refresh();
      setEditingId(null);
      resetForm();
      alert('Point de réparation mis à jour !');
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce point ?')) return;
    
    try {
      await travauxService.delete(id);
      await refresh();
      alert('Point de réparation supprimé !');
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      latitude: -18.8792,
      longitude: 47.5079,
      statut: 'NOUVEAU',
      surfaceM2: undefined,
      budget: undefined,
    });
  };

  const startEdit = (travail: any) => {
    setFormData({
      titre: travail.titre,
      description: travail.description,
      latitude: travail.latitude,
      longitude: travail.longitude,
      statut: travail.statut,
      surfaceM2: travail.surfaceM2,
      budget: travail.budget ? parseFloat(travail.budget) : undefined,
    });
    setEditingId(travail.id);
    setShowCreateForm(true);
  };

  const filteredTravaux = filterStatut === 'TOUS' 
    ? travaux 
    : travaux.filter(t => t.statut === filterStatut);

  const stats = {
    total: travaux.length,
    nouveau: travaux.filter(t => t.statut === 'NOUVEAU').length,
    enCours: travaux.filter(t => t.statut === 'EN_COURS').length,
    termine: travaux.filter(t => t.statut === 'TERMINE').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-bold text-white">Dashboard Manager - {user?.username}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all"
              >
                Accueil
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-2">Total</h3>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-red-500/30">
            <h3 className="text-red-200 text-sm font-semibold mb-2">Nouveau</h3>
            <p className="text-3xl font-bold text-white">{stats.nouveau}</p>
          </div>
          <div className="bg-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-orange-500/30">
            <h3 className="text-orange-200 text-sm font-semibold mb-2">En cours</h3>
            <p className="text-3xl font-bold text-white">{stats.enCours}</p>
          </div>
          <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-green-200 text-sm font-semibold mb-2">Terminé</h3>
            <p className="text-3xl font-bold text-white">{stats.termine}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterStatut('TOUS')}
              className={`px-4 py-2 rounded-lg ${filterStatut === 'TOUS' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterStatut('NOUVEAU')}
              className={`px-4 py-2 rounded-lg ${filterStatut === 'NOUVEAU' ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              Nouveau
            </button>
            <button
              onClick={() => setFilterStatut('EN_COURS')}
              className={`px-4 py-2 rounded-lg ${filterStatut === 'EN_COURS' ? 'bg-orange-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              En cours
            </button>
            <button
              onClick={() => setFilterStatut('TERMINE')}
              className={`px-4 py-2 rounded-lg ${filterStatut === 'TERMINE' ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              Terminé
            </button>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingId(null);
              setShowCreateForm(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nouveau point</span>
          </button>
        </div>

        {/* Formulaire Create/Edit */}
        {showCreateForm && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
            <h3 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Modifier' : 'Créer'} un point de réparation
            </h3>
            <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate(editingId); } : handleCreate} className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Titre *"
                value={formData.titre}
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                required
                className="col-span-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="col-span-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                rows={3}
              />
              <input
                type="number"
                step="0.000001"
                placeholder="Latitude *"
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value)})}
                required
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="number"
                step="0.000001"
                placeholder="Longitude *"
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value)})}
                required
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
              <select
                value={formData.statut}
                onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                <option value="NOUVEAU">Nouveau</option>
                <option value="EN_COURS">En cours</option>
                <option value="TERMINE">Terminé</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Surface (m²)"
                value={formData.surfaceM2 || ''}
                onChange={(e) => setFormData({...formData, surfaceM2: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Budget (Ar)"
                value={formData.budget || ''}
                onChange={(e) => setFormData({...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined})}
                className="col-span-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
              />
              <div className="col-span-2 flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  {editingId ? 'Mettre à jour' : 'Créer'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des travaux */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Surface</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredTravaux.map((travail) => (
                  <tr key={travail.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{travail.titre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        travail.statut === 'NOUVEAU' ? 'bg-red-500/20 text-red-300' :
                        travail.statut === 'EN_COURS' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {travail.statut === 'NOUVEAU' ? 'Nouveau' : travail.statut === 'EN_COURS' ? 'En cours' : 'Terminé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {travail.dateSignalement ? new Date(travail.dateSignalement).toLocaleDateString('fr-FR') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {travail.surfaceM2 ? `${travail.surfaceM2} m²` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {travail.budget ? `${parseFloat(travail.budget).toLocaleString('fr-FR')} Ar` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => startEdit(travail)}
                        className="px-3 py-1 bg-blue-500/80 text-white rounded hover:bg-blue-600"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(travail.id)}
                        className="px-3 py-1 bg-red-500/80 text-white rounded hover:bg-red-600"
                      >
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manager;
