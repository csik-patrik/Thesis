import axios from "axios";

export interface MobileDeviceCategory {
  id: number;
  name: string;
}

export function GetMobileDeviceCategories() {
  return axios.get<MobileDeviceCategory[]>(
    "http://localhost:5268/api/mobile-devices/categories"
  );
}
