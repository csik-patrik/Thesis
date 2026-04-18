import axios from "axios";
import type {
  CreateSimCardRequest,
  SimCallControlGroupResponse,
  SimCard,
  SimCardResponse,
  UpdateSimCardRequest,
} from "../Types/MobileTypes";
import type { User } from "../Types/UserTypes";
const API_URL = import.meta.env.VITE_API_URL;

export async function GetSimCardById(id: number, user: User) {
  return await axios.get<SimCard>(`${API_URL}/sim-cards/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function UpdatesSimCard(
  id: number,
  request: UpdateSimCardRequest,
  user: User,
) {
  return await axios.put(
    `${API_URL}/api/sim-cards/${id}`,
    { request },
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetSimCardsInInventory(user: User) {
  return await axios.get<SimCardResponse[]>(`${API_URL}/sim-cards`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteSimCard(id: number, user: User) {
  return await axios.delete(`${API_URL}/sim-cards/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetSimCallControlGroups(user: User) {
  return await axios.get<SimCallControlGroupResponse[]>(
    `${API_URL}/sim-call-control-groups`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function CreateSimCard(
  formData: CreateSimCardRequest,
  user: User,
) {
  return await axios.post(`${API_URL}/sim-cards`, formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function CreateSimCardsBulk(
  request: CreateSimCardRequest[],
  user: User,
) {
  return await axios.post(`${API_URL}/sim-cards/bulk`, request, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function GetSimCardsForAllocation(
  simCallControlGroupId: number,
  user: User,
) {
  return await axios.get<SimCardResponse[]>(
    `${API_URL}/sim-cards/allocation/${simCallControlGroupId}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
