import axios from "axios";
import type {
  CreateMobileOrderRequest,
  MobileDeviceCategoryResponse,
  SimCallControlGroupResponse,
} from "../Types/MobileTypes";
import type { User } from "../Types/UserTypes";

export async function GetMobileDeviceCategories() {
  return await axios.get<MobileDeviceCategoryResponse[]>(
    "http://localhost:5268/mobile-device-categories",
  );
}

export async function GetSimCallControlGroups() {
  return await axios.get<SimCallControlGroupResponse[]>(
    "http://localhost:5268/sim-call-control-groups",
  );
}

export async function CreateNewMobileOrder(
  formData: CreateMobileOrderRequest,
  user: User,
) {
  return await axios.post("http://localhost:5268/mobile-orders", formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
