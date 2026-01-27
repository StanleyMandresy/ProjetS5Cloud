import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    { icon: '🏠', label: 'Accueil', path: '/', badge: null },
    { icon: '📦', label: 'Ventes', path: '/ventes', badge: '12' },
    { icon: '👤', label: 'Profil', path: '/profile', badge: null },
    ...(user?.role === 'MANAGER' 
      ? [{ icon: '📊', label: 'Dashboard', path: '/manager', badge: 'NEW' }] 
      : []
    ),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300 ${
          isOpen ? 'w-72' : 'w-20'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div
            className={`flex items-center space-x-3 transition-all duration-300 ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
              🛒
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                ITU Project
              </h1>
              <p className="text-xs text-gray-500">Sales Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {isOpen ? (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
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
                <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Manager
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
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
                        : 'bg-indigo-100 text-indigo-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isOpen && active && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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
        className="fixed bottom-6 left-6 lg:hidden z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </>
  );
};

export default Sidebar;
