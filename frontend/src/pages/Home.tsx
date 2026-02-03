import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
import { useSignalements } from '../context/SignalementContext';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  ArrowUpRight,
  Package,
  Star,
  Clock
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { syncSignalements, loading } = useSignalements();
  // Données de vente simulées
  const salesData = {
    today: 12450,
    thisMonth: 245600,
    products: 156,
    customers: 1243,
  };

  const recentSales = [
    { id: 1, product: 'MacBook Pro 16"', amount: 2899, customer: 'Jean Dupont', time: '2 min' },
    { id: 2, product: 'iPhone 15 Pro', amount: 1299, customer: 'Marie Martin', time: '15 min' },
    { id: 3, product: 'AirPods Pro', amount: 279, customer: 'Pierre Bernard', time: '32 min' },
    { id: 4, product: 'iPad Air', amount: 699, customer: 'Sophie Laurent', time: '1h' },
  ];

  const topProducts = [
    { name: 'MacBook Pro', sales: 245, revenue: 710055, trend: '+12%' },
    { name: 'iPhone 15', sales: 432, revenue: 560000, trend: '+8%' },
    { name: 'AirPods Pro', sales: 656, revenue: 183024, trend: '+24%' },
  ];

  return (
    <div className="flex min-h-screen bg-itu-light">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bonjour, {user?.username} ! 👋
              </h1>
              <p className="text-gray-600">Voici un aperçu de vos ventes aujourd'hui</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-itu-accent to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-itu-accent/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        

          {/* Ventes ce mois */}
        

         

          {/* Clients */}
       
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        </div>

        {/* Signalements Sync Button */}
        {(user?.role === 'MANAGER' || user?.role === 'ADMIN') && (
          <button
            onClick={syncSignalements}
            disabled={loading}
            className="mb-8 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
          >
            {loading ? "Synchronisation..." : "Synchroniser les signalements"}
          </button>
        )}
       
        {/* Map Container */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Localisation des Points de Vente</h2>
          <div className="h-[400px] rounded-xl overflow-hidden">
            <Map />
          </div>
        </div>
      </main>
    </div>
    
  );
};

export default Home;