import axios from 'axios';
import type {
  CreateMobileOrderRequest,
  MobileDeviceCategoryResponse,
  MobileDeviceResponse,
} from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';
const API_URL = import.meta.env.VITE_API_URL;

export async function GetMobileDeviceCategories(user: User) {
  return await axios.get<MobileDeviceCategoryResponse[]>(
    `${API_URL}/mobile-device-categories`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function CreateNewMobileOrder(
  formData: CreateMobileOrderRequest,
  user: User,
) {
  return await axios.post(`${API_URL}/mobile-orders`, formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMyMobileDevices(user: User) {
  return await axios.get<MobileDeviceResponse[]>(
    `${API_URL}/mobile-devices/my-devices`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export function GetMobileDevicesForAllocation(categoryId: number, user: User) {
  return axios.get<MobileDeviceResponse[]>(
    `${API_URL}/mobile-devices/allocation/${categoryId}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
