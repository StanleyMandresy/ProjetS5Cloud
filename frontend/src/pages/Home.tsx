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
