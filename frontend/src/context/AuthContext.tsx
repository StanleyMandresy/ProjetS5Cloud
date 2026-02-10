import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { userSyncService } from '../services/userSync.service';
import { localDBService } from '../services/localDB.service';
import type { AuthResponse, User, LoginRequest, RegisterRequest } from '../types/auth.types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  unsyncedUsersCount: number;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  syncPendingUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unsyncedUsersCount, setUnsyncedUsersCount] = useState(0);

  // Fonction pour mettre à jour le compteur d'utilisateurs non synchronisés
  const updateUnsyncedCount = async () => {
    try {
      const count = await localDBService.countUnsyncedUsers();
      setUnsyncedUsersCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des utilisateurs non synchronisés:', error);
    }
  };

  useEffect(() => {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    // Initialiser le compteur d'utilisateurs non synchronisés
    updateUnsyncedCount();
    
    setIsLoading(false);
  }, []);

  // Écouter les changements de statut réseau
  useEffect(() => {
    const handleOnline = async () => {
      console.log('🌐 Connexion rétablie - Tentative de synchronisation automatique');
      try {
        const count = await localDBService.countUnsyncedUsers();
        if (count > 0) {
          await syncPendingUsers();
        }
      } catch (error) {
        console.error('Erreur lors de la synchronisation automatique:', error);
      }
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Fonction pour synchroniser les utilisateurs en attente
  const syncPendingUsers = async () => {
    try {
      console.log('🔄 Synchronisation des utilisateurs en attente...');
      await userSyncService.syncAllPendingUsers();
      await updateUnsyncedCount();
      console.log('✅ Synchronisation terminée');
    } catch (error) {
      console.error('❌ Erreur lors de la synchronisation:', error);
      throw error;
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response: AuthResponse = await authService.login(credentials);
      
      const userData: User = {
        id: response.userId,
        username: response.username,
        email: response.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        role: response.role,
      };

      setToken(response.token);
      setUser(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response: AuthResponse = await authService.register(data);
      
      const userData: User = {
        id: response.userId,
        username: response.username,
        email: response.email,
        isActive: true,
        createdAt: new Date().toISOString(),
        role: response.role,
      };

      setToken(response.token);
      setUser(userData);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    unsyncedUsersCount,
    login,
    register,
    logout,
    updateUser,
    syncPendingUsers,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
