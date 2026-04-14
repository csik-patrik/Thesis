import axios from 'axios';
import type {
  CreateSimCardRequest,
  SimCallControlGroupResponse,
  SimCardResponse,
} from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';

export async function GetSimCardsInInventory(user: User) {
  return await axios.get<SimCardResponse[]>('http://localhost:5000/sim-cards', {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteSimCard(id: number, user: User) {
  return await axios.delete(`http://localhost:5000/sim-cards/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetSimCallControlGroups(user: User) {
  return await axios.get<SimCallControlGroupResponse[]>(
    'http://localhost:5000/sim-call-control-groups',
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function CreateSimCard(
  formData: CreateSimCardRequest,
  user: User,
) {
  return await axios.post('http://localhost:5000/sim-cards', formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetSimCardsForAllocation(
  simCallControlGroupId: number,
  user: User,
) {
  return await axios.get<SimCardResponse[]>(
    `http://localhost:5000/sim-cards/allocation/${simCallControlGroupId}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
