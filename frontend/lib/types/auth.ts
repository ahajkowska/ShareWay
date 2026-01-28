export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};
