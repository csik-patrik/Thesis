import axios from 'axios';
import type {
  ComputerResponse,
  CreateComputerRequest,
} from '../Types/ComputerTypes';
import type { User } from '../Types/UserTypes';
import type { AllocateComputerRequest } from '../Components/ComputerOrders/ComputerOrder.types';
const API_URL = import.meta.env.VITE_API_URL;

export async function CreateComputer(
  request: CreateComputerRequest,
  user: User,
) {
  return await axios.post(`${API_URL}/computers`, request, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function CreateComputersBulk(
  request: CreateComputerRequest[],
  user: User,
) {
  return await await axios.post(`${API_URL}/computers/bulk`, request, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function GetDeployedComputers(user: User) {
  return await axios.get<ComputerResponse[]>(`${API_URL}/computers/deployed`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function CreateComputerCategory(name: string, user: User) {
  return await axios.post(
    `${API_URL}/computer-categories`,
    { name: name },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function ReturnComputer(
  id: number,
  status: string,
  statusReason: string,
  user: User,
) {
  return await axios.put(
    `${API_URL}/computers/return/${id}`,
    { status, statusReason },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function GetComputersInInventory(user: User) {
  return await axios.get<ComputerResponse[]>(`${API_URL}/computers/inventory`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteComputer(id: number, user: User) {
  return await axios.delete(`${API_URL}/computers/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMyComputers(user: User) {
  return await axios.get<ComputerResponse[]>(
    `${API_URL}/computers/my-devices`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetComputersForAllocation(
  computerCategoryId: number,
  user: User,
) {
  return await axios.get<ComputerResponse[]>(
    `${API_URL}/computers/allocation/${computerCategoryId}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function AllocateComputerToOrder(
  request: AllocateComputerRequest,
  user: User,
) {
  return await axios.put(
    `${API_URL}/computer-orders/allocate`,
    {
      orderId: request.orderId,
      computerId: request.computerId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}
