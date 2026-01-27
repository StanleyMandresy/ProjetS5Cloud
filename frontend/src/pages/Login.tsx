import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Mail, AlertCircle, ShoppingCart, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-itu-light via-itu-lighter to-itu-purple p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-itu-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float animation-delay-4000" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-itu-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-itu-gray/20">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-itu-accent via-purple-600 to-pink-600 p-8 text-center relative">
            <div className="absolute inset-0 bg-black/5"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 animate-float">
                <ShoppingCart className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">ITU Project</h1>
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Sparkles className="w-4 h-4" />
                <p className="text-sm font-medium">Sales Management Platform</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Bon retour !</h2>
              <p className="text-gray-600">Connectez-vous pour continuer</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Input */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                  Nom d'utilisateur
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-itu-accent transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-itu-accent/50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-itu-accent transition-colors" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Entrez votre mot de passe"
                    disabled={loading}
                    className="w-full pl-12 pr-4 py-3 border-2 border-itu-gray/30 rounded-xl focus:border-itu-accent focus:ring-4 focus:ring-itu-accent/10 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed hover:border-itu-accent/50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-itu-accent via-purple-600 to-pink-600 text-white font-bold py-3.5 px-6 rounded-xl hover:shadow-lg hover:shadow-itu-accent/50 focus:ring-4 focus:ring-itu-accent/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                {loading ? (
                  <span className="flex items-center justify-center relative z-10">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </span>
                ) : (
                  <span className="relative z-10">Se connecter</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-semibold bg-gradient-to-r from-itu-accent to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-itu-accent to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse" />
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-600 to-purple-600 rounded-full blur-2xl opacity-20 animate-pulse animation-delay-2000" />
      </div>
    </div>
  );
};

export default Login;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#caf0f8] via-[#90e0ef] to-[#48cae4] animate-gradient bg-[length:400%_400%] p-4">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ade8f4] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#90e0ef] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#48cae4] rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-300 hover:scale-[1.02]">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-[#90e0ef] to-[#48cae4] w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent mb-2">
              Bienvenue !
            </h1>
            <p className="text-gray-600">Connectez-vous pour continuer</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Entrez votre nom d'utilisateur"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#48cae4] focus:ring-4 focus:ring-[#90e0ef]/30 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Entrez votre mot de passe"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#48cae4] focus:ring-4 focus:ring-[#90e0ef]/30 transition-all duration-200 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#90e0ef] to-[#48cae4] text-white font-bold py-3 px-4 rounded-xl hover:from-[#ade8f4] hover:to-[#48cae4] focus:ring-4 focus:ring-[#48cae4]/30 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </span>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="font-semibold bg-gradient-to-r from-[#90e0ef] to-[#48cae4] bg-clip-text text-transparent hover:from-[#ade8f4] hover:to-[#48cae4] transition-all duration-200"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
