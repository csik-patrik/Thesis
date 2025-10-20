import axios from "axios";
import type {
  MobileDeviceCategoryResponse,
  SimCallControlGroupResponse,
} from "../Types/MobileTypes";

export function GetMobileDeviceCategories() {
  return axios.get<MobileDeviceCategoryResponse[]>(
    "http://localhost:5268/mobile-device-categories"
  );
}

export function GetSimCallControlGroups() {
  return axios.get<SimCallControlGroupResponse[]>(
    "http://localhost:5268/sim-call-control-groups"
  );
}
