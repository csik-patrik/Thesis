import axios from "axios";
import type { UserResponse } from "../Types/UserTypes";

export function GetGroupLeaders() {
  return axios.get<UserResponse[]>("http://localhost:5268/users/group-leader");
}

export async function GetUsers() {
  return axios.get<UserResponse[]>("http://localhost:5268/users");
}

export async function DeleteUser(id: number) {
  return await axios.delete(`http://localhost:5268/users/${id}`);
}
