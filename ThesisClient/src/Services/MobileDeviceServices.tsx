import axios from "axios";
import type { MobileDeviceCategoryResponse } from "../Types/MobileTypes";

export function GetMobileDeviceCategories() {
  return axios.get<MobileDeviceCategoryResponse[]>(
    "http://localhost:5268/MobileDeviceCategory/mobile-device-categories"
  );
}
