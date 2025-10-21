export type UserResponse = {
  id: number;
  username: string;
  displayName: string;
  email: string;
  department: string;
  costCenter: string;
  userRoles: UserRoleResponse[];
};

type UserRoleResponse = {
  id: number;
  name: string;
};
