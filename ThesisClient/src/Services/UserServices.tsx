import axios from 'axios';
import type { User, UserResponse } from '../Types/UserTypes';
const API_URL = import.meta.env.VITE_API_URL;

export function GetGroupLeaders(user: User) {
  return axios.get<UserResponse[]>(`${API_URL}/users/group-leader`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetUsers(user: User) {
  return axios.get<UserResponse[]>('`${API_URL}/users', {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteUser(id: number, user: User) {
  return await axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
