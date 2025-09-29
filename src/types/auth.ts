export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // hashed
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  address?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
  token?: string;
}

export interface ProfileUpdateRequest {
  username?: string;
  email?: string;
  bio?: string;
  phone?: string;
  address?: string;
  social?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
