import axios from "axios";
import type { UserResponse } from "../Types/UserTypes";

export function GetGroupLeaders() {
  return axios.get<UserResponse[]>("http://localhost:5268/users/group-leader");
}
