import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import '../styles/Profile.css';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const updateData: any = {};
      
      if (username !== user?.username) updateData.username = username;
      if (email !== user?.email) updateData.email = email;
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.password = newPassword;
      }

      const response = await authService.updateProfile(user!.id, updateData);
      
      // Mettre à jour le contexte avec le nouveau token
      localStorage.setItem('token', response.token);
      
      // Mettre à jour les données utilisateur
      const updatedUser = {
        ...user!,
        username: response.username,
        email: response.email,
      };
      updateUser(updatedUser);

      setSuccess('Profil mis à jour avec succès !');
      setIsEditing(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>🔐 Auth App</h2>
        </div>
        <div className="navbar-menu">
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            Accueil
          </button>
          <button onClick={handleLogout} className="btn btn-outline">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-header">
            <h1>Mon Profil</h1>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                ✏️ Modifier
              </button>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {!isEditing ? (
            <div className="profile-view">
              <div className="profile-field">
                <label>Nom d'utilisateur</label>
                <p>{user?.username}</p>
              </div>

              <div className="profile-field">
                <label>Email</label>
                <p>{user?.email}</p>
              </div>

              <div className="profile-field">
                <label>Statut du compte</label>
                <p>
                  <span className={`status-badge ${user?.isActive ? 'active' : 'inactive'}`}>
                    {user?.isActive ? '✅ Actif' : '❌ Inactif'}
                  </span>
                </p>
              </div>

              <div className="profile-field">
                <label>Membre depuis</label>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  minLength={3}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="form-divider">
                <h3>Changer le mot de passe (optionnel)</h3>
              </div>

              <div className="form-group">
                <label htmlFor="currentPassword">Mot de passe actuel</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Requis pour changer le mot de passe"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Nouveau mot de passe</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez le nouveau mot de passe"
                  disabled={loading}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setUsername(user?.username || '');
                    setEmail(user?.email || '');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="btn btn-secondary"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
