import axios from 'axios';
import type { MobileDeviceResponse } from '../Types/MobileTypes';
import type { User } from '../Types/UserTypes';
const API_URL = import.meta.env.VITE_API_URL;

export async function GetDeployedMobileDevices(user: User) {
  return await axios.get<MobileDeviceResponse[]>(
    `${API_URL}/mobile-devices/deployed`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function ReturnMobileDevice(
  id: number,
  status: string,
  statusReason: string,
  user: User,
) {
  return await axios.put(
    `${API_URL}/mobile-devices/return/${id}`,
    { status, statusReason },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function GetMobileDevices(user: User) {
  return await axios.get<MobileDeviceResponse[]>(`${API_URL}/mobile-devices/`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function DeleteMobileDevice(id: number, user: User) {
  return await axios.delete(`${API_URL}/mobile-devices/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
