import axios from 'axios';
import type { MobileOrderResponse } from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';
import type {
  CreateMobileDeviceAllocationRequest,
  CreateOrderDecisionRequest,
  CreateSimCardAllocationRequest,
} from '../Components/MobileOrders/MobileOrder.types';

const API_URL = import.meta.env.VITE_API_URL;

export async function FetchMyMobileOrders(user: User) {
  return await axios.get<MobileOrderResponse[]>(
    `${API_URL}/mobile-orders/my-orders`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeleteMobileOrder(id: number, user: User) {
  return await axios.delete(`${API_URL}/mobile-orders/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function FetchMobileOrders(user: User) {
  return await axios.get<MobileOrderResponse[]>(`${API_URL}/mobile-orders`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMobileOrdersWaitingForApproval(user: User) {
  return await axios.get<MobileOrderResponse[]>(
    `${API_URL}/mobile-orders/approval`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetOrderById(id: number, user: User) {
  return await axios.get<MobileOrderResponse>(
    `${API_URL}/mobile-orders/${id}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function AllocateMobileDeviceToOrder(
  request: CreateMobileDeviceAllocationRequest,
  user: User,
) {
  return await axios.put(
    `${API_URL}/mobile-orders/allocate/device/`,
    {
      orderId: request.orderId,
      mobileDeviceId: request.mobileDeviceId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function AllocateSimCardToOrder(
  request: CreateSimCardAllocationRequest,
  user: User,
) {
  return await axios.put(
    `${API_URL}/mobile-orders/allocate/sim-card`,
    {
      orderId: request.orderId,
      simCardId: request.simCardId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function DeliverOrder(id: number, user: User) {
  return await axios.put(`${API_URL}/mobile-orders/deliver/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function MakeDecisionAsApprover(
  request: CreateOrderDecisionRequest,
  user: User,
) {
  return await axios.put(
    `${API_URL}/mobile-orders/approval/${request.orderId}`,
    request.decision,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}
