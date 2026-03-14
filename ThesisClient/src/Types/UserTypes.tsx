export type UserOrderResponse = {
  id: number;
  userName: string;
  displayName: string;
  email: string;
  department: string;
  costCenter: string;
};

export type CreateUserRequest = {
  username: string;
  displayName: string;
  email: string;
  password: string;
  department: string;
  costCenter: string;
  userRoleIds: number[];
};

export type UpdateUserRequest = {
  id: number;
  username: string;
  displayName: string;
  email: string;
  department: string;
  costCenter: string;
  userRoleIds: number[];
};

export type UserResponse = {
  id: number;
  username: string;
  displayName: string;
  email: string;
  department: string;
  costCenter: string;
  userRoles: UserRoleResponse[];
};

export type UserRoleResponse = {
  id: number;
  name: string;
};

export interface User {
  id: string;
  displayname: string;
  email?: string;
  name?: string;
  roles: string[];
  username?: string;
  department?: string;
  costCenter?: string;
  token: string;
}

export interface JwtPayload {
  sub: string;
  displayname: string;
  email?: string;
  name?: string;
  role?: string | string[];
  username?: string;
  department?: string;
  costCenter?: string;
  exp?: number;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}
