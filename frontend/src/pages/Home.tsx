import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import Sidebar from '../components/Sidebar';
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
          {/* Ventes aujourd'hui */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-itu-accent/10 to-purple-100 rounded-xl">
                <DollarSign className="w-6 h-6 text-itu-accent" />
              </div>
              <span className="flex items-center text-itu-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +12.5%
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Ventes Aujourd'hui</h3>
            <p className="text-2xl font-bold text-gray-900">{salesData.today.toLocaleString('fr-FR')} €</p>
          </div>

          {/* Ventes ce mois */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-itu-success/10 to-emerald-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-itu-success" />
              </div>
              <span className="flex items-center text-itu-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +8.2%
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Ventes ce Mois</h3>
            <p className="text-2xl font-bold text-gray-900">{salesData.thisMonth.toLocaleString('fr-FR')} €</p>
          </div>

          {/* Produits */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <span className="flex items-center text-itu-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +5
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Produits Actifs</h3>
            <p className="text-2xl font-bold text-gray-900">{salesData.products}</p>
          </div>

          {/* Clients */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30 hover:shadow-xl transition-all duration-300 card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="flex items-center text-itu-success text-sm font-semibold">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +24
              </span>
            </div>
            <h3 className="text-sm font-semibold text-gray-600 mb-1">Clients Total</h3>
            <p className="text-2xl font-bold text-gray-900">{salesData.customers.toLocaleString('fr-FR')}</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ventes Récentes */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Ventes Récentes</h2>
              <button className="text-itu-accent hover:text-purple-600 text-sm font-semibold transition-colors">
                Voir tout
              </button>
            </div>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 bg-itu-lighter rounded-xl hover:bg-itu-purple transition-all duration-200 cursor-pointer group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-itu-accent to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{sale.product}</p>
                      <p className="text-sm text-gray-600">{sale.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{sale.amount} €</p>
                    <p className="text-sm text-gray-500">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Produits */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-itu-gray/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Top Produits</h2>
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="p-4 bg-itu-lighter rounded-xl hover:bg-itu-purple transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <span className="text-xs font-semibold text-itu-success bg-itu-success/10 px-2 py-1 rounded-full">
                      {product.trend}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{product.sales} ventes</p>
                  <p className="text-lg font-bold text-itu-accent">{product.revenue.toLocaleString('fr-FR')} €</p>
                </div>
              ))}
            </div>
          </div>
        </div>

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#48cae4]/20 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-[#90e0ef] to-[#48cae4] w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Auth App</h2>
            </div>
            <div className="flex items-center space-x-3">
              {user?.role === 'MANAGER' && (
                <button
                  onClick={() => navigate('/manager')}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-purple-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Dashboard Manager</span>
                </button>
              )}
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Mon Profil</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-[#90e0ef]/20 to-[#48cae4]/20 backdrop-blur-lg rounded-3xl p-8 mb-8 border border-white/20 shadow-2xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gradient-to-r from-[#90e0ef] to-[#48cae4] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg animate-float">
              <span className="text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Bienvenue, {user?.username}!
              </h1>
              <p className="text-purple-200">
                Ravi de vous revoir dans votre espace personnel
              </p>
            </div>
          </div>
        </div>


        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Username Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">
              Nom d'utilisateur
            </h3>
            <p className="text-2xl font-bold text-white">{user?.username}</p>
          </div>

          {/* Email Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">
              Email
            </h3>
            <p className="text-2xl font-bold text-white break-all">{user?.email}</p>
          </div>

          {/* Status Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">
              Statut
            </h3>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
                user?.isActive 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {user?.isActive ? '✓ Actif' : '✗ Inactif'}
              </span>
            </div>
          </div>

          {/* Member Since Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-pink-500/20 w-12 h-12 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-2">
              Membre depuis
            </h3>
            <p className="text-2xl font-bold text-white">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-4 bg-gradient-to-r from-[#90e0ef] to-[#48cae4] text-white font-bold rounded-2xl hover:from-[#ade8f4] hover:to-[#48cae4] focus:ring-4 focus:ring-[#48cae4]/30 transform transition-all duration-200 hover:scale-105 shadow-2xl hover:shadow-[#48cae4]/50 flex items-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Modifier mon profil</span>
          </button>
        </div>


        {/* Map Container */}
<div className="mt-16 flex justify-center">
  <div className="w-full max-w-4xl h-[400px] bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl">
    <Map />
  </div>
</div>
      </div>
    </div>
  );
};

export default Home;
