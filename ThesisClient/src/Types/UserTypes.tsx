export type CreateUserRequest = {
  username: string;
  displayName: string;
  email: string;
  password: string;
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
