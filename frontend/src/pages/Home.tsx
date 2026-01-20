import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <h2>🔐 Auth App</h2>
        </div>
        <div className="navbar-menu">
          <button onClick={() => navigate('/profile')} className="btn btn-secondary">
            Mon Profil
          </button>
          <button onClick={handleLogout} className="btn btn-outline">
            Déconnexion
          </button>
        </div>
      </nav>

      <div className="home-content">
        <div className="welcome-card">
          <h1>Bienvenue, {user?.username}! 👋</h1>
          <p className="welcome-subtitle">
            Vous êtes connecté avec succès à votre espace personnel
          </p>

          <div className="user-info-grid">
            <div className="info-card">
              <div className="info-icon">👤</div>
              <div className="info-content">
                <h3>Nom d'utilisateur</h3>
                <p>{user?.username}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📧</div>
              <div className="info-content">
                <h3>Email</h3>
                <p>{user?.email}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">✅</div>
              <div className="info-content">
                <h3>Statut</h3>
                <p>{user?.isActive ? 'Actif' : 'Inactif'}</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">📅</div>
              <div className="info-content">
                <h3>Membre depuis</h3>
                <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="actions">
            <button onClick={() => navigate('/profile')} className="btn btn-primary">
              Modifier mon profil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
