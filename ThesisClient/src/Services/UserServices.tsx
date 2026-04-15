import axios from 'axios';
import type {
  CreateUserRequest,
  LoginRequest,
  UpdateUserRequest,
  User,
  UserResponse,
  UserRoleResponse,
} from '../Types/UserTypes';

const API_URL = import.meta.env.VITE_API_URL;

export async function GetUserRoles(user: User) {
  return await axios.get<UserRoleResponse[]>(`${API_URL}/roles`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function CreateUser(formData: CreateUserRequest, user: User) {
  await axios.post(`${API_URL}/users`, formData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function GetUserById(id: number, user: User) {
  return await axios.get<UserResponse>(`${API_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function UpdateUser(formData: UpdateUserRequest, user: User) {
  return await axios.put(`${API_URL}/users/`, formData, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function GetGroupLeaders(user: User) {
  return await axios.get<UserResponse[]>(`${API_URL}/users/group-leader`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetUsers(user: User) {
  return await axios.get<UserResponse[]>(`${API_URL}/users`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteUser(id: number, user: User) {
  return await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function LoginWithCreditentials(request: LoginRequest) {
  return await axios.post(`${API_URL}/login`, request);
}

export async function LoginWithDemoUser() {
  return await axios.post(`${API_URL}/login`, {
    email: 'demo.user1@demo.com',
    password: 'PasswordDev01',
  });
}

export async function LoginWithDemoAdmin() {
  return await axios.post(`${API_URL}/login`, {
    email: 'demo.user2@demo.com',
    password: 'PasswordDev02',
  });
}

export async function LoginWithDemoApprover() {
  return await axios.post(`${API_URL}/login`, {
    email: 'demo.user3@demo.com',
    password: 'PasswordDev03',
  });
}
