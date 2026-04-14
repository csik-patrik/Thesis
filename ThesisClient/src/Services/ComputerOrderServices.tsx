import axios from 'axios';
import type {
  ComputerOrderResponse,
  CreateComputerOrderRequest,
} from '../Types/ComputerTypes';
import type { User } from '../Types/UserTypes';
const API_URL = import.meta.env.VITE_API_URL;

export async function GetComputerCategories(user: User) {
  return await axios.get(`${API_URL}/computer-categories`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function CreateComputerOrder(
  formData: CreateComputerOrderRequest,
  user: User,
) {
  await axios.post(`${API_URL}/computer-orders`, formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMyComputerOrders(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    `${API_URL}/computer-orders/my-orders`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeleteComputerOrder(id: number, user: User) {
  return await axios.delete(`${API_URL}/computer-orders/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetComputerOrders(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    `${API_URL}/computer-orders`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetComputerOrdersWaitingForApproval(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    `${API_URL}/computer-orders/approval`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetComputerOrderById(id: number, user: User) {
  return await axios.get<ComputerOrderResponse>(
    `${API_URL}/computer-orders/${id}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeliverComputerOrder(id: number, user: User) {
  return await axios.put(
    `${API_URL}/computer-orders/deliver/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function MakeDecisionAsApprover(
  id: number,
  decision: boolean,
  user: User,
) {
  return await axios.put(
    `${API_URL}/computer-orders/approval/${id}`,
    decision,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}
