import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  User,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShoppingCart,
  Package,
  ChevronRight
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { icon: Home, label: 'Accueil', path: '/', badge: null },
    { icon: Package, label: 'Ventes', path: '/ventes', badge: '12' },
    { icon: User, label: 'Profil', path: '/profile', badge: null },
    ...(user?.role === 'MANAGER' 
      ? [{ icon: BarChart3, label: 'Dashboard', path: '/manager', badge: 'NEW' }] 
      : []
    ),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-itu-white to-itu-light border-r border-itu-gray/30 shadow-xl z-50 transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-itu-gray/30">
          <div
            className={`flex items-center space-x-3 transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-itu-accent to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <ShoppingCart className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-itu-success rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-itu-accent to-purple-600 bg-clip-text text-transparent">
                ITU Project
              </h1>
              <p className="text-xs text-gray-500">Sales Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-itu-lighter rounded-lg transition-all duration-200"
          >
            {isOpen ? (
              <X className="w-5 h-5 text-gray-600" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-itu-gray/30">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-itu-accent to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-itu-success rounded-full border-2 border-white" />
            </div>
            <div
              className={`transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}
            >
              <p className="font-semibold text-gray-800 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              {user?.role === 'MANAGER' && (
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                  Manager
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-itu-accent to-purple-600 text-white shadow-lg shadow-itu-accent/30'
                    : 'hover:bg-itu-lighter text-gray-700 hover:text-itu-accent'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-5 h-5 ${
                      active ? 'text-white' : 'text-gray-600 group-hover:text-itu-accent'
                    }`}
                  />
                  <span
                    className={`font-medium transition-all duration-300 ${
                      isOpen ? 'opacity-100' : 'opacity-0 w-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {isOpen && item.badge && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-itu-accent/10 text-itu-accent'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isOpen && active && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-itu-gray/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5" />
            <span
              className={`font-medium transition-all duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}
            >
              Déconnexion
            </span>
          </button>
        </div>
      </aside>

      {/* Toggle button pour mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-6 lg:hidden z-50 p-4 bg-gradient-to-r from-itu-accent to-purple-600 text-white rounded-full shadow-2xl hover:shadow-itu-accent/50 transition-all duration-200"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
};

export default Sidebar;
