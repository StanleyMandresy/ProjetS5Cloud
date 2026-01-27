import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTravaux } from '../context/TravauxContext';
import { travauxService } from '../services/travaux.service';
import type { CreateTravailRequest, UpdateTravailRequest, Statistiques } from '../types/travaux.types';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Layers,
  TrendingUp,
  X,
  Save,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Manager: React.FC = () => {
  const { user } = useAuth();
  const { travaux, refresh } = useTravaux();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  
  const [formData, setFormData] = useState<CreateTravailRequest>({
    titre: '',
    description: '',
    latitude: -18.8792,
    longitude: 47.5079,
    statut: 'NOUVEAU',
    surfaceM2: undefined,
    budget: undefined,
  });

  useEffect(() => {
    loadStatistiques();
  }, [travaux]);

  useEffect(() => {
    if (showCreateForm) {
      initMap();
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [showCreateForm]);

  const initMap = () => {
    setTimeout(() => {
      const mapContainer = document.getElementById('map-container');
      if (!mapContainer || mapRef.current) return;

      // Initialiser la carte centrée sur Madagascar
      const map = L.map('map-container').setView([formData.latitude, formData.longitude], 6);
      mapRef.current = map;

      // Ajouter le layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      // Ajouter un marker initial
      const marker = L.marker([formData.latitude, formData.longitude], {
        draggable: true,
      }).addTo(map);
      markerRef.current = marker;

      // Mettre à jour les coordonnées quand on déplace le marker
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setFormData(prev => ({
          ...prev,
          latitude: position.lat,
          longitude: position.lng,
        }));
      });

      // Ajouter un marker en cliquant sur la carte
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
      });
    }, 100);
  };

  const loadStatistiques = async () => {
    try {
      const stats = await travauxService.getStatistiques();
      setStatistiques(stats);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  if (user?.role !== 'MANAGER') {
    return (
      <div className="min-h-screen bg-itu-light flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-2xl border border-itu-gray/30">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accès refusé</h1>
          <p className="text-gray-600 mb-6">Vous devez être MANAGER pour accéder à cette page.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-itu-accent text-white rounded-xl hover:shadow-lg transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

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
      setShowCreateForm(false);
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

  // Mettre à jour le marker quand les coordonnées changent manuellement
  useEffect(() => {
    if (markerRef.current && mapRef.current) {
      markerRef.current.setLatLng([formData.latitude, formData.longitude]);
      mapRef.current.setView([formData.latitude, formData.longitude]);
    }
  }, [formData.latitude, formData.longitude]);

  const filteredTravaux = filterStatut === 'TOUS' 
    ? travaux 
    : travaux.filter(t => t.statut === filterStatut);

  const stats = {
    total: travaux.length,
    nouveau: travaux.filter(t => t.statut === 'NOUVEAU').length,
    enCours: travaux.filter(t => t.statut === 'EN_COURS').length,
    termine: travaux.filter(t => t.statut === 'TERMINE').length,
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'NOUVEAU':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'EN_COURS':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'TERMINE':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex min-h-screen bg-itu-light">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Manager</h1>
          <p className="text-gray-600">Gérez vos points de réparation et suivez les statistiques</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-itu-accent/10 rounded-xl">
                <MapPin className="w-6 h-6 text-itu-accent" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Total Points</h3>
            <p className="text-3xl font-bold text-gray-900">{statistiques?.nombrePoints || 0}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Surface Totale</h3>
            <p className="text-3xl font-bold text-gray-900">{statistiques?.surfaceTotaleM2?.toFixed(0) || 0}</p>
            <p className="text-sm text-gray-500 mt-1">m²</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Avancement</h3>
            <p className="text-3xl font-bold text-gray-900">{statistiques?.avancementPourcentage?.toFixed(1) || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${statistiques?.avancementPourcentage || 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Budget Total</h3>
            <p className="text-3xl font-bold text-gray-900">{statistiques?.budgetTotal?.toLocaleString() || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Ar</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border-l-4 border-gray-400 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-red-500 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Nouveau</p>
            <p className="text-2xl font-bold text-red-600">{stats.nouveau}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-orange-500 shadow-md">
            <p className="text-sm text-gray-600 mb-1">En cours</p>
            <p className="text-2xl font-bold text-orange-600">{stats.enCours}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border-l-4 border-green-500 shadow-md">
            <p className="text-sm text-gray-600 mb-1">Terminé</p>
            <p className="text-2xl font-bold text-green-600">{stats.termine}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {['TOUS', 'NOUVEAU', 'EN_COURS', 'TERMINE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatut(status)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    filterStatut === status
                      ? 'bg-black text-white shadow-lg shadow-itu-accent/30'
                      : 'bg-itu-lighter text-gray-700 hover:bg-itu-purple'
                  }`}
                >
                  {status === 'TOUS' ? 'Tous' : status === 'EN_COURS' ? 'En cours' : status === 'TERMINE' ? 'Terminé' : 'Nouveau'}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
                setShowCreateForm(true);
              }}
              className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-itu-accent/50 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nouveau Point
            </button>
          </div>
        </div>

        {/* Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="bg-gradient-to-r from-itu-accent to-purple-600 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {editingId ? (
                    <>
                      <Edit className="w-6 h-6" />
                      Modifier le point
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6" />
                      Nouveau point de réparation
                    </>
                  )}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editingId ? handleUpdate(editingId) : handleCreate(e);
                }}
                className="p-6 space-y-6"
              >
                {/* Carte de Madagascar */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-2xl border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-itu-accent" />
                    <h3 className="text-lg font-bold text-gray-900">Sélectionner l'emplacement</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Cliquez sur la carte ou déplacez le marqueur pour définir la position
                  </p>
                  <div 
                    id="map-container" 
                    className="w-full h-80 rounded-xl overflow-hidden shadow-lg border-2 border-white"
                  />
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="text-gray-600 font-medium">Latitude:</span>
                      <span className="ml-2 font-bold text-itu-accent">{formData.latitude.toFixed(6)}</span>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <span className="text-gray-600 font-medium">Longitude:</span>
                      <span className="ml-2 font-bold text-itu-accent">{formData.longitude.toFixed(6)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    required
                    placeholder="Ex: Réparation route RN7"
                    className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    placeholder="Décrivez les travaux à effectuer..."
                    className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || -18.8792 })}
                      required
                      className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 47.5079 })}
                      required
                      className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                    className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                  >
                    <option value="NOUVEAU">🔴 Nouveau</option>
                    <option value="EN_COURS">🟠 En cours</option>
                    <option value="TERMINE">🟢 Terminé</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Surface (m²)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.surfaceM2 || ''}
                      onChange={(e) => setFormData({ ...formData, surfaceM2: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="Ex: 150.5"
                      className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Budget (Ar)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.budget || ''}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value ? parseFloat(e.target.value) : undefined })}
                      placeholder="Ex: 5000000"
                      className="w-full px-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-itu-gray/30">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingId(null);
                      resetForm();
                    }}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-black to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-itu-accent/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? 'Mettre à jour' : 'Créer le point'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Points List */}
        <div className="bg-white rounded-2xl shadow-lg border border-itu-gray/30 overflow-hidden">
          <div className="p-6 border-b border-itu-gray/30">
            <h2 className="text-xl font-bold text-gray-900">
              Points de réparation ({filteredTravaux.length})
            </h2>
          </div>
          <div className="divide-y divide-itu-gray/30">
            {filteredTravaux.map((travail) => (
              <div key={travail.id} className="p-6 hover:bg-itu-lighter transition-all duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900">{travail.titre}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatutBadge(travail.statut)}`}>
                        {travail.statut === 'EN_COURS' ? 'En cours' : travail.statut === 'TERMINE' ? 'Terminé' : 'Nouveau'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{travail.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {travail.latitude.toFixed(4)}, {travail.longitude.toFixed(4)}
                      </span>
                      {travail.surfaceM2 && (
                        <span className="flex items-center gap-1">
                          <Layers className="w-4 h-4" />
                          {travail.surfaceM2} m²
                        </span>
                      )}
                      {travail.budget && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {parseFloat(travail.budget).toLocaleString()} Ar
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => startEdit(travail)}
                      className="p-2 bg-itu-accent/10 text-itu-accent rounded-lg hover:bg-itu-accent hover:text-white transition-all"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(travail.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manager;
