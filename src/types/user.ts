export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'contributor' | 'maintainer' | 'admin';
  avatar_url?: string;
  bio?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}
