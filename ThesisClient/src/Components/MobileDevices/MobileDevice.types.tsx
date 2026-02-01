import type {
  CreateMobileDeviceRequest,
  MobileDeviceCategoryResponse,
} from "../../Types/MobileTypes";

export type MobileDeviceState = {
  formData: CreateMobileDeviceRequest;
  categories: MobileDeviceCategoryResponse[];
};

export type MobileDeviceAction =
  | {
      type: "SET_FIELD";
      field: keyof CreateMobileDeviceRequest;
      value: string | number;
    }
  | {
      type: "SET_CATEGORIES";
      payload: MobileDeviceCategoryResponse[];
    };
