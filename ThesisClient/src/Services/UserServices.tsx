import axios from 'axios';
import type { User, UserResponse } from '../Types/UserTypes';

export function GetGroupLeaders(user: User) {
  return axios.get<UserResponse[]>('http://localhost:5000/users/group-leader', {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetUsers(user: User) {
  return axios.get<UserResponse[]>('http://localhost:5000/users', {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteUser(id: number, user: User) {
  return await axios.delete(`http://localhost:5000/users/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
