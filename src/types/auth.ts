export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};
