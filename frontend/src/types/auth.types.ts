export interface User {
  id: number;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  userId: number;
  username: string;
  email: string;
  token: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  currentPassword?: string;
  password?: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  timestamp: string;
}
