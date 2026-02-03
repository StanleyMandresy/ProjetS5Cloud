import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTravaux } from '../context/TravauxContext';
import { travauxService } from '../services/travaux.service';
import etapesService from '../services/etapes.service';
import type { CreateTravailRequest, UpdateTravailRequest, Statistiques, StatistiquesTraitement } from '../types/travaux.types';
import type { EtapeTravaux, CreateEtapeRequest } from '../types/etapes.types';
import type { HistoriqueEtape } from '../types/historique.types';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSignalements } from '../context/SignalementContext';

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
  CheckCircle2,
  Clock,
  ListOrdered
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Manager: React.FC = () => {
  const { user } = useAuth();
  const { travaux, refresh } = useTravaux();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { signalements, loading, syncSignalements } = useSignalements();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [filterStatut, setFilterStatut] = useState<string>('TOUS');
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [statsTraitement, setStatsTraitement] = useState<StatistiquesTraitement | null>(null);
  const [showEtapesModal, setShowEtapesModal] = useState(false);
  const [etapes, setEtapes] = useState<EtapeTravaux[]>([]);
  const [editingEtape, setEditingEtape] = useState<EtapeTravaux | null>(null);
  const [newEtape, setNewEtape] = useState<CreateEtapeRequest>({
    nom: '',
    description: '',
    pourcentageAvancement: 0,
    ordre: 1,
    couleur: '#6366F1'
  });
  const [showHistoriqueModal, setShowHistoriqueModal] = useState(false);
  const [historiquePoint, setHistoriquePoint] = useState<HistoriqueEtape[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<number | null>(null);
  
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
    loadStatistiquesTraitement();
  }, [travaux]);

  const loadStatistiques = async () => {
    try {
      const stats = await travauxService.getStatistiques();
      setStatistiques(stats);
    } catch (error) {
      console.error('Erreur chargement statistiques:', error);
    }
  };

  const loadStatistiquesTraitement = async () => {
    try {
      const stats = await travauxService.getStatistiquesTraitement();
      setStatsTraitement(stats);
    } catch (error) {
      console.error('Erreur chargement statistiques traitement:', error);
    }
  };

  const loadEtapes = async () => {
    try {
      const data = await etapesService.getAll();
      setEtapes(data);
    } catch (error) {
      console.error('Erreur chargement étapes:', error);
    }
  };

  const handleCreateEtape = async () => {
    try {
      await etapesService.create(newEtape);
      setNewEtape({ nom: '', description: '', pourcentageAvancement: 0, ordre: 1, couleur: '#6366F1' });
      loadEtapes();
      alert('Étape créée avec succès');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la création de l\'étape');
    }
  };

  const handleUpdateEtape = async (id: number, data: Partial<CreateEtapeRequest>) => {
    try {
      await etapesService.update(id, data);
      setEditingEtape(null);
      loadEtapes();
      alert('Étape modifiée avec succès');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la modification de l\'étape');
    }
  };

  const handleDeleteEtape = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cette étape ?')) return;
    try {
      await etapesService.delete(id);
      loadEtapes();
      alert('Étape supprimée avec succès');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression de l\'étape');
    }
  };

  useEffect(() => {
    if (showEtapesModal) {
      loadEtapes();
    }
  }, [showEtapesModal]);

  const handleShowHistorique = async (pointId: number) => {
    try {
      const historique = await travauxService.getHistorique(pointId);
      setHistoriquePoint(historique);
      setSelectedPointId(pointId);
      setShowHistoriqueModal(true);
    } catch (error) {
      console.error('Erreur chargement historique:', error);
      alert('Erreur lors du chargement de l\'historique');
    }
  };

  const handleQuickStatusChange = async (pointId: number, newStatut: string) => {
    if (!confirm(`Changer le statut vers "${newStatut}" ?`)) return;
    try {
      await travauxService.update(pointId, { statut: newStatut });
      await refresh();
      loadStatistiques();
      loadStatistiquesTraitement();
      alert('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur changement statut:', error);
      alert('Erreur lors du changement de statut');
    }
  };

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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Manager</h1>
            <p className="text-gray-600">Gérez vos points de réparation et suivez les statistiques</p>
          </div>
          <button
            onClick={() => setShowEtapesModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg"
          >
            <ListOrdered className="w-5 h-5" />
            Gérer les Étapes
          </button>
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

        {/* Tableau des statistiques de traitement */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 mb-8">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-itu-accent mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Statistiques de Traitement Moyen</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Temps de Traitement Total</h3>
              <p className="text-4xl font-bold text-blue-700 mb-1">
                {statsTraitement?.tempsTraitementMoyenJours?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-blue-600">jours (signalement → fin)</p>
              <div className="mt-3 text-xs text-blue-700">
                NOUVEAU (0%) → TERMINE (100%)
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
              <h3 className="text-sm font-semibold text-orange-900 mb-2">Temps d'Attente</h3>
              <p className="text-4xl font-bold text-orange-700 mb-1">
                {statsTraitement?.tempsAttenteMoyenJours?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-orange-600">jours (avant début)</p>
              <div className="mt-3 text-xs text-orange-700">
                NOUVEAU (0%) → EN_COURS (50%)
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <h3 className="text-sm font-semibold text-green-900 mb-2">Temps d'Exécution</h3>
              <p className="text-4xl font-bold text-green-700 mb-1">
                {statsTraitement?.tempsExecutionMoyenJours?.toFixed(1) || 0}
              </p>
              <p className="text-sm text-green-600">jours (début → fin)</p>
              <div className="mt-3 text-xs text-green-700">
                EN_COURS (50%) → TERMINE (100%)
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Travaux en Attente</p>
              <p className="text-2xl font-bold text-gray-800">{statsTraitement?.nombreTravauxEnAttente || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Travaux en Cours</p>
              <p className="text-2xl font-bold text-blue-600">{statsTraitement?.nombreTravauxEnCours || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Travaux Terminés</p>
              <p className="text-2xl font-bold text-green-600">{statsTraitement?.nombreTravauxTermines || 0}</p>
            </div>
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
              <div className="bg-black p-6 flex items-center justify-between">
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
                    {/* Menu déroulant pour changer le statut */}
                    <select
                      value={travail.statut}
                      onChange={(e) => handleQuickStatusChange(travail.id, e.target.value)}
                      className="px-3 py-2 border-2 border-gray-300 rounded-lg font-semibold text-sm hover:border-itu-accent transition-all cursor-pointer"
                    >
                      {etapes.length > 0 ? (
                        etapes.map(etape => (
                          <option key={etape.idEtape} value={etape.nom}>
                            {etape.nom} ({etape.pourcentageAvancement}%)
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="NOUVEAU">NOUVEAU (0%)</option>
                          <option value="EN_COURS">EN_COURS (50%)</option>
                          <option value="TERMINE">TERMINE (100%)</option>
                        </>
                      )}
                    </select>
                    <button
                      onClick={() => handleShowHistorique(travail.id)}
                      className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all"
                      title="Voir l'historique"
                    >
                      <Clock className="w-5 h-5" />
                    </button>
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

        {/* Signalements */}
<div className="bg-white rounded-2xl shadow-lg border border-itu-gray/30 overflow-hidden mt-8">
  <div className="p-6 border-b border-itu-gray/30 flex items-center justify-between">
    <h2 className="text-xl font-bold text-gray-900">
      Signalements mobiles ({signalements.length})
    </h2>

    <button
      onClick={syncSignalements}
      disabled={loading}
      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
    >
      {loading ? "Chargement..." : "Actualiser"}
    </button>
  </div>

  <div className="divide-y divide-itu-gray/30">
    {signalements.map((s) => (
      <div key={s.id} className="p-6 hover:bg-blue-50 transition-all">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {s.titre ?? "Signalement"}
              </h3>

              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                Signalement
              </span>
            </div>

            <p className="text-gray-600 mb-3">
              {s.description || "Pas de description"}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {s.latitude.toFixed(4)}, {s.longitude.toFixed(4)}
              </span>

              {s.createdAt && (
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Actions futures possibles */}
          <div className="ml-4 text-blue-500 font-semibold text-sm">
            En attente
          </div>
        </div>
      </div>
    ))}

    {signalements.length === 0 && !loading && (
      <div className="p-6 text-center text-gray-500">
        Aucun signalement chargé
      </div>
    )}
  </div>
</div>
      </main>

      {/* Modal Gestion des Étapes */}
      {showEtapesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gestion des Étapes du Workflow</h2>
              <button
                onClick={() => {
                  setShowEtapesModal(false);
                  setEditingEtape(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Formulaire de création d'étape */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border border-purple-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">➕ Créer une nouvelle étape</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'étape *</label>
                    <input
                      type="text"
                      value={newEtape.nom}
                      onChange={(e) => setNewEtape({ ...newEtape, nom: e.target.value })}
                      placeholder="Ex: EN_VALIDATION"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={newEtape.description}
                      onChange={(e) => setNewEtape({ ...newEtape, description: e.target.value })}
                      placeholder="Ex: En attente de validation"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pourcentage d'avancement (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newEtape.pourcentageAvancement}
                      onChange={(e) => setNewEtape({ ...newEtape, pourcentageAvancement: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Ordre *</label>
                    <input
                      type="number"
                      min="1"
                      value={newEtape.ordre}
                      onChange={(e) => setNewEtape({ ...newEtape, ordre: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={newEtape.couleur}
                        onChange={(e) => setNewEtape({ ...newEtape, couleur: e.target.value })}
                        className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={newEtape.couleur}
                        onChange={(e) => setNewEtape({ ...newEtape, couleur: e.target.value })}
                        placeholder="#6366F1"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleCreateEtape}
                      className="w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
                    >
                      Créer l'étape
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des étapes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Étapes existantes</h3>
                <div className="space-y-3">
                  {etapes.map((etape) => (
                    <div
                      key={etape.idEtape}
                      className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all"
                      style={{ borderLeftWidth: '6px', borderLeftColor: etape.couleur || '#6366F1' }}
                    >
                      {editingEtape?.idEtape === etape.idEtape ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom</label>
                            <input
                              type="text"
                              value={editingEtape.nom}
                              onChange={(e) => setEditingEtape({ ...editingEtape, nom: e.target.value })}
                              disabled={etape.estSysteme}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <input
                              type="text"
                              value={editingEtape.description || ''}
                              onChange={(e) => setEditingEtape({ ...editingEtape, description: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Pourcentage</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={editingEtape.pourcentageAvancement}
                              onChange={(e) => setEditingEtape({ ...editingEtape, pourcentageAvancement: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Ordre</label>
                            <input
                              type="number"
                              min="1"
                              value={editingEtape.ordre}
                              onChange={(e) => setEditingEtape({ ...editingEtape, ordre: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Couleur</label>
                            <input
                              type="color"
                              value={editingEtape.couleur || '#6366F1'}
                              onChange={(e) => setEditingEtape({ ...editingEtape, couleur: e.target.value })}
                              className="w-16 h-10 rounded-lg border border-gray-300 cursor-pointer"
                            />
                          </div>
                          <div className="flex gap-2 items-end">
                            <button
                              onClick={() => handleUpdateEtape(etape.idEtape, editingEtape)}
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                            >
                              <Save className="w-4 h-4 inline mr-1" />
                              Sauvegarder
                            </button>
                            <button
                              onClick={() => setEditingEtape(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                                {etape.ordre}
                              </span>
                              <h4 className="text-lg font-bold text-gray-900">{etape.nom}</h4>
                              {etape.estSysteme && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                                  Système
                                </span>
                              )}
                              <span className="px-3 py-1 rounded-full text-sm font-bold text-white" style={{ backgroundColor: etape.couleur }}>
                                {etape.pourcentageAvancement}%
                              </span>
                            </div>
                            {etape.description && (
                              <p className="text-gray-600 ml-11">{etape.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingEtape(etape)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            {!etape.estSysteme && (
                              <button
                                onClick={() => handleDeleteEtape(etape.idEtape)}
                                className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Modal Historique des Étapes */}
      {showHistoriqueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">📜 Historique des Étapes</h2>
              <button
                onClick={() => {
                  setShowHistoriqueModal(false);
                  setHistoriquePoint([]);
                  setSelectedPointId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {historiquePoint.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucun historique disponible</p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline verticale */}
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
                  
                  <div className="space-y-6">
                    {historiquePoint.map((h, index) => (
                      <div key={h.idHistorique} className="relative pl-20">
                        {/* Point de la timeline */}
                        <div className="absolute left-6 top-1 w-5 h-5 bg-white border-4 border-purple-500 rounded-full z-10"></div>
                        
                        {/* Carte de l'étape */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-5 shadow-md border-2 border-gray-200 hover:shadow-xl transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              {h.etapePrecedente && (
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                  <span className="px-3 py-1 bg-gray-100 rounded-full">{h.etapePrecedente}</span>
                                  <span>→</span>
                                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold">
                                    {h.etapeActuelle}
                                  </span>
                                </div>
                              )}
                              {!h.etapePrecedente && (
                                <div className="flex items-center gap-2 text-sm mb-2">
                                  <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold">
                                    {h.etapeActuelle}
                                  </span>
                                  <span className="text-gray-500">(État initial)</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-semibold">
                                  {new Date(h.dateTransition).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(h.dateTransition).toLocaleTimeString('fr-FR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                            </div>
                          </div>
                          
                          {h.commentaire && (
                            <p className="text-gray-600 text-sm mt-2 pl-4 border-l-2 border-purple-300">
                              {h.commentaire}
                            </p>
                          )}
                          
                          {index === 0 && (
                            <div className="mt-3 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-xs text-green-700 font-semibold">✓ État actuel</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;