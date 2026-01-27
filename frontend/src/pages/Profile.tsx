import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import Sidebar from '../components/Sidebar';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [changePassword, setChangePassword] = useState(false);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (changePassword && newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (changePassword && newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (changePassword && !currentPassword) {
      setError('Le mot de passe actuel est requis pour changer le mot de passe');
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {};
      
      if (username !== user?.username) updateData.username = username;
      if (email !== user?.email) updateData.email = email;
      if (changePassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.password = newPassword;
      }

      const response = await authService.updateProfile(user!.id, updateData);
      
      localStorage.setItem('token', response.token);
      
      const updatedUser = {
        ...user!,
        username: response.username,
        email: response.email,
      };
      updateUser(updatedUser);

      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      setChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setChangePassword(false);
    setUsername(user?.username || '');
    setEmail(user?.email || '');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen bg-itu-light">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 ml-72 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
              <p className="text-green-700 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-itu-gray/30 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-itu-accent via-purple-600 to-pink-600 p-8 relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                  <p className="text-white/80">{user?.email}</p>
                  {user?.role === 'MANAGER' && (
                    <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/30">
                      <Shield className="w-3 h-3 mr-1" />
                      Manager
                    </span>
                  )}
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 border border-white/30"
                >
                  <Edit className="w-5 h-5" />
                  Modifier
                </button>
              )}
            </div>
          </div>

          <div className="p-8">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-itu-lighter rounded-xl p-6 border border-itu-gray/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-itu-accent/10 rounded-lg">
                        <User className="w-5 h-5 text-itu-accent" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Nom d'utilisateur
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{user?.username}</p>
                  </div>

                  <div className="bg-itu-lighter rounded-xl p-6 border border-itu-gray/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Email
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900 break-all">{user?.email}</p>
                  </div>

                  <div className="bg-itu-lighter rounded-xl p-6 border border-itu-gray/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Statut du compte
                      </h3>
                    </div>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      user?.isActive 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {user?.isActive ? '✅ Actif' : '❌ Inactif'}
                    </span>
                  </div>

                  <div className="bg-itu-lighter rounded-xl p-6 border border-itu-gray/30">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="w-5 h-5 text-orange-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                        Membre depuis
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-itu-lighter rounded-xl p-6 border border-itu-gray/30 space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Informations de base</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                      Nom d'utilisateur
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-itu-accent transition-colors" />
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        minLength={3}
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all duration-200 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-itu-accent transition-colors" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full pl-12 pr-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all duration-200 outline-none disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-yellow-50 rounded-xl p-6 border-2 border-yellow-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-yellow-600" />
                      <h3 className="text-lg font-bold text-gray-900">Changer le mot de passe</h3>
                    </div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        className="w-5 h-5 rounded text-itu-accent focus:ring-itu-accent border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-700">Modifier</span>
                    </label>
                  </div>

                  {changePassword && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Au moins 6 caractères"
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez le nouveau mot de passe"
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border-2 border-itu-gray/30 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-itu-accent to-purple-600 hover:shadow-lg hover:shadow-itu-accent/50 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-10 h-10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Auth App</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Accueil</span>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mon Profil</h1>
                <p className="text-blue-100">Gérez vos informations personnelles</p>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl backdrop-blur-sm border border-white/30"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Modifier</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="px-8 pt-6">
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-200 font-medium">{error}</p>
                </div>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-500/20 border-l-4 border-green-500 rounded-lg backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-200 font-medium">{success}</p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {!isEditing ? (
              <div className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                      Nom d'utilisateur
                    </h3>
                    <p className="text-2xl font-bold text-white">{user?.username}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                      Email
                    </h3>
                    <p className="text-2xl font-bold text-white break-all">{user?.email}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                      Statut du compte
                    </h3>
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${
                      user?.isActive 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {user?.isActive ? '✅ Actif' : '❌ Inactif'}
                    </span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide mb-2">
                      Membre depuis
                    </h3>
                    <p className="text-2xl font-bold text-white">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">Informations de base</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-blue-300">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      minLength={3}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-blue-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Change */}
                <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Changer le mot de passe</h3>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={changePassword}
                        onChange={(e) => setChangePassword(e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <span className="text-sm font-medium text-white">Modifier le mot de passe</span>
                    </label>
                  </div>

                  {changePassword && (
                    <>
                      <div className="space-y-2">
                        <label htmlFor="currentPassword" className="block text-sm font-semibold text-yellow-300">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe actuel"
                          disabled={loading}
                          className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-500/30 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-yellow-300">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Au moins 6 caractères"
                          disabled={loading}
                          className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-500/30 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-yellow-300">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez le nouveau mot de passe"
                          disabled={loading}
                          className="w-full px-4 py-3 bg-white/10 border-2 border-yellow-500/30 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/20 transition-all duration-200 outline-none disabled:opacity-50"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 border border-white/20"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enregistrement...
                      </span>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
