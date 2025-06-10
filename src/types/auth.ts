export interface User {
  id: string;
  email?: string;
  accessCode?: string;
  isAnonymous: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface EmailAuthRequest {
  email: string;
}

export interface PinAuthRequest {
  email: string;
  pin: string;
}

export interface AccessCodeAuthRequest {
  accessCode: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
