import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      await register({ username, email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-4 lg:p-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Register Card - Two Columns */}
      <div className="relative w-full max-w-6xl z-10">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl blur-2xl opacity-75 animate-pulse-slow"></div>
        
        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            
            {/* Left Column - Visual/Marketing Side */}
            <div className="hidden lg:flex relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 p-12 flex-col justify-between overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
                  backgroundSize: '30px 30px' 
                }}></div>
              </div>
              
              <div className="relative z-10">
                {/* Logo & Brand */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 shadow-2xl">
                    <i className="fas fa-rocket text-4xl text-white"></i>
                  </div>
                  <h1 className="text-4xl font-bold text-white mb-3 font-display tracking-tight">
                    ETU3111-3118-3209-3367
                  </h1>
                  <p className="text-white/90 text-lg">
                    Votre passerelle vers l'excellence
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-6 mt-12">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className="fas fa-bolt text-yellow-300 text-xl"></i>
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">Rapide & Efficace</h3>
                      <p className="text-white/80 text-sm">Inscription en moins de 2 minutes</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className="fas fa-shield-alt text-green-300 text-xl"></i>
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">Sécurité Maximale</h3>
                      <p className="text-white/80 text-sm">Vos données sont cryptées end-to-end</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className="fas fa-users text-blue-300 text-xl"></i>
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">Communauté Active</h3>
                      <p className="text-white/80 text-sm">Rejoignez plus de 1000+ utilisateurs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className="fas fa-heart text-red-300 text-xl"></i>
                    </div>
                    <div className="text-white">
                      <h3 className="font-bold text-lg mb-1">100% Gratuit</h3>
                      <p className="text-white/80 text-sm">Aucun frais caché, toujours gratuit</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom decoration */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 text-white/60 text-sm">
                  <i className="fas fa-check-circle"></i>
                  <span>Aucune carte de crédit requise</span>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Right Column - Form Side */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              {/* Mobile Header - Only visible on small screens */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-600 to-indigo-600 rounded-2xl mb-4">
                  <i className="fas fa-rocket text-3xl text-white"></i>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent font-display">
                  ETU3111-3118-3209-3367
                </h1>
              </div>

              {/* Welcome Text */}
              <div className="mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 font-display">
                  Créez votre compte
                </h2>
                <p className="text-gray-600 flex items-center gap-2">
                  <i className="fas fa-sparkles text-pink-500"></i>
                  Inscription rapide et gratuite
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
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username & Email in two columns on larger screens */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Username Input */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                        <i className="fas fa-user text-indigo-500"></i>
                        Nom d'utilisateur
                      </span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      minLength={3}
                      placeholder="johndoe"
                      disabled={loading}
                      className="input input-bordered w-full focus:input-primary"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                        <i className="fas fa-envelope text-purple-500"></i>
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="john@example.com"
                      disabled={loading}
                      className="input input-bordered w-full focus:input-secondary"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password in two columns */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Password Input */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                        <i className="fas fa-lock text-pink-500"></i>
                        Mot de passe
                      </span>
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      disabled={loading}
                      className="input input-bordered w-full focus:input-accent"
                    />
                  </div>

                  {/* Confirm Password Input */}
                  <div className="form-control">
                    <label className="label pb-1">
                      <span className="label-text font-semibold text-gray-700 flex items-center gap-2">
                        <i className="fas fa-check-circle text-green-500"></i>
                        Confirmer
                      </span>
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      disabled={loading}
                      className="input input-bordered w-full focus:input-success"
                    />
                  </div>
                </div>

                {/* Terms and conditions */}
                <div className="form-control">
                  <label className="cursor-pointer flex items-start gap-3">
                    <input type="checkbox" required className="checkbox checkbox-primary mt-1" />
                    <span className="label-text text-gray-600 text-sm leading-relaxed">
                      J'accepte les <a href="#" className="text-indigo-600 font-semibold hover:underline">conditions d'utilisation</a> et la <a href="#" className="text-purple-600 font-semibold hover:underline">politique de confidentialité</a>
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-700 hover:via-purple-700 hover:to-indigo-700 border-0 text-white font-bold text-lg h-14 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <i className="fas fa-spinner fa-spin"></i>
                      Inscription en cours...
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <i className="fas fa-rocket"></i>
                      Créer mon compte
                    </span>
                  )}
                </button>
              </form>

              {/* Social Login */}
              <div className="mt-6">
                <div className="divider text-sm text-gray-500">OU CONTINUEZ AVEC</div>
                <div className="grid grid-cols-3 gap-3">
                  <button className="btn btn-outline hover:bg-gray-50 rounded-xl">
                    <i className="fab fa-google text-xl text-red-500"></i>
                  </button>
                  <button className="btn btn-outline hover:bg-gray-50 rounded-xl">
                    <i className="fab fa-facebook text-xl text-blue-600"></i>
                  </button>
                  <button className="btn btn-outline hover:bg-gray-50 rounded-xl">
                    <i className="fab fa-github text-xl text-gray-800"></i>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-gray-600 text-sm">
                  Déjà un compte ?{' '}
                  <Link
                    to="/login"
                    className="font-bold bg-gradient-to-r from-pink-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Se connecter <i className="fas fa-arrow-right ml-1"></i>
                  </Link>
                </p>
              </div>
            </div>
            
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Register;
