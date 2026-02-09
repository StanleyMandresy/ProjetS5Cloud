import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4 lg:p-8" style={{ fontFamily: 'Inter, sans-serif', background: 'linear-gradient(135deg, #f2f5fa 0%, #ecedf5 100%)' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-float" style={{ background: 'rgba(208,215,225,0.3)' }}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl animate-float" style={{ background: 'rgba(236,237,245,0.4)', animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl animate-float" style={{ background: 'rgba(241,244,249,0.5)', animationDelay: '4s' }}></div>
      </div>

      {/* Login Card - Two Columns */}
      <div className="relative w-full max-w-6xl z-10">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 rounded-3xl blur-2xl opacity-50 animate-pulse-slow" style={{ background: 'linear-gradient(135deg, #d0d7e1 0%, #ecedf5 100%)' }}></div>
        
        <div className="relative rounded-3xl shadow-2xl overflow-hidden border" style={{ background: '#ffffff', borderColor: '#d0d7e1' }}>
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Column - Visual/Marketing Side */}
            <div className="hidden lg:flex relative p-12 flex-col justify-between overflow-hidden" style={{ background: 'linear-gradient(135deg, #f2f5fa 0%, #ecedf5 100%)' }}>
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'radial-gradient(circle, #d0d7e1 1px, transparent 1px)', 
                  backgroundSize: '30px 30px' 
                }}></div>
              </div>
              
              <div className="relative z-10">
                {/* Logo & Brand */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-xl" style={{ background: 'linear-gradient(135deg, #d0d7e1 0%, #ecedf5 100%)' }}>
                    <i className="fas fa-user-circle text-4xl" style={{ color: '#6b7280' }}></i>
                  </div>
                  <h1 className="text-4xl font-bold mb-3 font-display tracking-tight" style={{ color: '#1f2937' }}>
                    ETU3111-3118-3209-3367
                  </h1>
                  <p className="text-lg" style={{ color: '#6b7280' }}>
                    Accédez à votre espace sécurisé
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6 mt-12">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecedf5 0%, #f1f4f9 100%)' }}>
                      <i className="fas fa-shield-alt text-xl" style={{ color: '#10b981' }}></i>
                    </div>
                    <div style={{ color: '#374151' }}>
                      <h3 className="font-bold text-lg mb-1">Sécurité Renforcée</h3>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Protection de vos données à 100%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecedf5 0%, #f1f4f9 100%)' }}>
                      <i className="fas fa-clock text-xl" style={{ color: '#3b82f6' }}></i>
                    </div>
                    <div style={{ color: '#374151' }}>
                      <h3 className="font-bold text-lg mb-1">Accès 24/7</h3>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Disponible à tout moment</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecedf5 0%, #f1f4f9 100%)' }}>
                      <i className="fas fa-laptop text-xl" style={{ color: '#8b5cf6' }}></i>
                    </div>
                    <div style={{ color: '#374151' }}>
                      <h3 className="font-bold text-lg mb-1">Multi-plateforme</h3>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Accédez depuis n'importe quel appareil</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ecedf5 0%, #f1f4f9 100%)' }}>
                      <i className="fas fa-headset text-xl" style={{ color: '#f59e0b' }}></i>
                    </div>
                    <div style={{ color: '#374151' }}>
                      <h3 className="font-bold text-lg mb-1">Support Dédié</h3>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Une équipe à votre écoute</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-sm" style={{ color: '#9ca3af' }}>
                  <i className="fas fa-lock"></i>
                  <span>Connexion sécurisée SSL/TLS</span>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-20 right-10 w-32 h-32 rounded-full blur-2xl animate-pulse" style={{ background: 'rgba(208,215,225,0.2)' }}></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full blur-2xl animate-pulse" style={{ background: 'rgba(241,244,249,0.3)', animationDelay: '1s' }}></div>
            </div>

            {/* Right Column - Form Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Mobile Header - Only visible on small screens */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #d0d7e1 0%, #ecedf5 100%)' }}>
                  <i className="fas fa-user-circle text-3xl" style={{ color: '#6b7280' }}></i>
                </div>
                <h1 className="text-2xl font-bold font-display" style={{ color: '#1f2937' }}>
                  ETU3111-3118-3209-3367
                </h1>
              </div>

              {/* Welcome Text */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 font-display" style={{ color: '#1f2937' }}>
                  Bienvenue !
                </h2>
                <p className="flex items-center gap-2" style={{ color: '#6b7280' }}>
                  <i className="fas fa-hand-sparkles" style={{ color: '#8b5cf6' }}></i>
                  Connectez-vous pour continuer
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 alert alert-error shadow-lg">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-exclamation-triangle text-xl"></i>
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Input */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-semibold flex items-center gap-2" style={{ color: '#374151' }}>
                      <i className="fas fa-user" style={{ color: '#6b7280' }}></i>
                      Nom d'utilisateur
                    </span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Entrez votre nom d'utilisateur"
                    disabled={loading}
                    className="input w-full border-2 rounded-xl transition-all"
                    style={{ borderColor: '#d0d7e1', background: '#ffffff' }}
                    onFocus={(e) => e.target.style.borderColor = '#6b7280'}
                    onBlur={(e) => e.target.style.borderColor = '#d0d7e1'}
                  />
                </div>

                {/* Password Input */}
                <div className="form-control">
                  <label className="label pb-1">
                    <span className="label-text font-semibold flex items-center gap-2" style={{ color: '#374151' }}>
                      <i className="fas fa-lock" style={{ color: '#6b7280' }}></i>
                      Mot de passe
                    </span>
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Entrez votre mot de passe"
                    disabled={loading}
                    className="input w-full border-2 rounded-xl transition-all"
                    style={{ borderColor: '#d0d7e1', background: '#ffffff' }}
                    onFocus={(e) => e.target.style.borderColor = '#6b7280'}
                    onBlur={(e) => e.target.style.borderColor = '#d0d7e1'}
                  />
                  <label className="label">
                    <span className="label-text-alt"></span>
                    <a href="#" className="label-text-alt link link-hover font-medium" style={{ color: '#6b7280' }}>
                      <i className="fas fa-key text-xs mr-1"></i>
                      Mot de passe oublié?
                    </a>
                  </label>
                </div>

                {/* Remember me */}
                <div className="form-control">
                  <label className="cursor-pointer flex items-center gap-3">
                    <input type="checkbox" className="checkbox" style={{ borderColor: '#d0d7e1' }} />
                    <span className="label-text" style={{ color: '#6b7280' }}>Se souvenir de moi</span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full border-0 font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #6b7280 0%, #374151 100%)', color: '#ffffff' }}
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <i className="fas fa-spinner fa-spin"></i>
                      Connexion en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <i className="fas fa-sign-in-alt"></i>
                      Se connecter
                    </span>
                  )}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="divider text-sm" style={{ color: '#9ca3af' }}>OU CONTINUEZ AVEC</div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="btn btn-outline rounded-xl" style={{ borderColor: '#d0d7e1' }}>
                    <i className="fab fa-google text-xl text-red-500"></i>
                  </button>
                  <button className="btn btn-outline rounded-xl" style={{ borderColor: '#d0d7e1' }}>
                    <i className="fab fa-facebook text-xl text-blue-600"></i>
                  </button>
                  <button className="btn btn-outline rounded-xl" style={{ borderColor: '#d0d7e1' }}>
                    <i className="fab fa-github text-xl text-gray-800"></i>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-sm" style={{ color: '#6b7280' }}>
                  Pas encore de compte ?{' '}
                  <Link
                    to="/register"
                    className="font-bold transition-all duration-200"
                    style={{ color: '#374151' }}
                  >
                    Créer un compte <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t" style={{ borderColor: '#d0d7e1' }}>
                <div className="flex items-center justify-center gap-6 text-xs" style={{ color: '#9ca3af' }}>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-shield-alt text-green-500"></i>
                    <span>Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-lock text-blue-500"></i>
                    <span>Crypté</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-check-circle text-purple-500"></i>
                    <span>Vérifié</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: 'linear-gradient(135deg, #d0d7e1 0%, #ecedf5 100%)' }}></div>
        <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: 'linear-gradient(135deg, #f2f5fa 0%, #ecedf5 100%)', animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Login;
