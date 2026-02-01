import type {
  CreateMobileOrderRequest,
  MobileDeviceCategoryResponse,
  SimCallControlGroupResponse,
} from "../../Types/MobileTypes";
import type { UserResponse } from "../../Types/UserTypes";

export type MobileOrderState = {
  formData: CreateMobileOrderRequest;
  mobileDeviceCategories: MobileDeviceCategoryResponse[];
  simCallControlGroups: SimCallControlGroupResponse[];
  groupLeaders: UserResponse[];
};

export type MobileOrderAction =
  | {
      type: "SET_FIELD";
      field: keyof CreateMobileOrderRequest;
      value: string | number;
    }
  | { type: "SET_CATEGORIES"; payload: MobileDeviceCategoryResponse[] }
  | { type: "SET_SIM_GROUPS"; payload: SimCallControlGroupResponse[] }
  | { type: "SET_GROUP_LEADERS"; payload: UserResponse[] }
  | { type: "SET_CUSTOMER"; payload: number };
