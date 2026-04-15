import axios from 'axios';
import type {
  CreateMobileDeviceRequest,
  CreateMobileOrderRequest,
  MobileDeviceCategoryResponse,
  MobileDeviceResponse,
} from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';
import type { MobileDeviceCategory } from '../Types/MobileDeviceCategory';
const API_URL = import.meta.env.VITE_API_URL;

export async function CreateMobileDevice(
  request: CreateMobileDeviceRequest,
  user: User,
) {
  return await axios.post(`${API_URL}/mobile-devices`, request, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function CreateMobileDevicesBulk(
  request: CreateMobileDeviceRequest[],
  user: User,
) {
  await axios.post(`${API_URL}/mobile-devices/bulk`, request, {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
}

export async function CreateMobileDeviceCategoryService(
  name: string,
  user: User,
) {
  return await axios.post(
    `${API_URL}/mobile-device-categories`,
    { name: name },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function GetMobileDeviceCategoryById(id: number, user: User) {
  return await axios.get<MobileDeviceCategory>(
    `${API_URL}/mobile-device-categories/${id}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function UpdateMobileDeviceCategory(
  id: number,
  name: string,
  user: User,
) {
  return await axios.put(
    `${API_URL}/mobile-device-categories/${id}`,
    JSON.stringify(name),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

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
