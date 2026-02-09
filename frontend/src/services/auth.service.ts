import api from './api';
import type { 
  LoginRequest, 
  RegisterRequest, 
  UpdateUserRequest, 
  AuthResponse, 
  User 
} from '../types/auth.types';

export const authService = {
  // Inscription
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Connexion
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Récupérer le profil utilisateur
  async getProfile(userId: number): Promise<User> {
    const response = await api.get<User>(`/auth/profile/${userId}`);
    return response.data;
  },

  // Mettre à jour le profil
  async updateProfile(userId: number, data: UpdateUserRequest): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>(`/auth/profile/${userId}`, data);
    return response.data;
  },

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await api.get('/auth/health');
    return response.data;
  },

  // Déconnexion (côté client)
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Récupérer le token stocké
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Manager: récupérer la liste des utilisateurs bloqués
  async getBlockedUsers(): Promise<any[]> {
    const response = await api.get<any[]>('/auth/blocked');
    return response.data;
  },

  // Manager: débloquer un utilisateur
  async unblockUser(userId: number): Promise<any> {
    const response = await api.post(`/auth/unblock/${userId}`);
    return response.data;
  },

  // User: demander un déblocage
  async requestUnblock(username: string): Promise<any> {
    const response = await api.post('/auth/request-unblock', { username });
    return response.data;
  }
};
