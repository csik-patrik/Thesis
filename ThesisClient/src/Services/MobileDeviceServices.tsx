import axios from 'axios';
import type {
  CreateMobileOrderRequest,
  MobileDeviceCategoryResponse,
  MobileDeviceResponse,
} from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';

export async function GetMobileDeviceCategories(user: User) {
  return await axios.get<MobileDeviceCategoryResponse[]>(
    'http://localhost:5000/mobile-device-categories',
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function CreateNewMobileOrder(
  formData: CreateMobileOrderRequest,
  user: User,
) {
  return await axios.post('http://localhost:5000/mobile-orders', formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMyMobileDevices(user: User) {
  return await axios.get<MobileDeviceResponse[]>(
    'http://localhost:5000/mobile-devices/my-devices',
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export function GetMobileDevicesForAllocation(categoryId: number, user: User) {
  return axios.get<MobileDeviceResponse[]>(
    `http://localhost:5000/mobile-devices/allocation/${categoryId}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
