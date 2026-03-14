import axios from "axios";
import type { MobileDeviceResponse } from "../Types/MobileTypes";
import type { User } from "../Types/UserTypes";

export async function GetDeployedMobileDevices(user: User) {
  return await axios.get<MobileDeviceResponse[]>(
    "http://localhost:5268/mobile-devices/deployed",
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
    `http://localhost:5268/mobile-devices/return/${id}`,
    { status, statusReason },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}
