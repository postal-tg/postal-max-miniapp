export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
