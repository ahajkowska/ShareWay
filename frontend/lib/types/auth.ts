export type AuthUser = {
  id: string;
  name: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  nickname: string;
  email: string;
  password: string;
};
