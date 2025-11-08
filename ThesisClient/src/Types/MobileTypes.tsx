import type { UserOrderResponse } from "./UserTypes";

export interface CreateMobileDeviceCategoryRequest {
  name: string;
}

export interface MobileDeviceCategoryResponse {
  id: number;
  name: string;
}

export interface SimCallControlGroupResponse {
  id: number;
  name: string;
  isDataEnabled: boolean;
}

export interface SimCardResponse {
  id: number;
  phoneNumber: string;
  simCallControlGroup: SimCallControlGroupResponse;
  status: string;
}

export interface MobileDeviceResponse {
  id: number;
  hostname: string;
  mobileDeviceCategory: MobileDeviceCategoryResponse;
  imeiNumber: string;
  serialNumber: string;
  user: UserOrderResponse;
  simCard: SimCardResponse;
  status: string;
  statusReason: string;
}

export interface MobileOrderResponse {
  id: number;
  customer: UserOrderResponse;
  mobileDeviceCategory: MobileDeviceCategoryResponse;
  simCallControlGroup: SimCallControlGroupResponse;
  pickupLocation: string;
  mobileDevice: MobileDeviceResponse;
  note: string;
  status: string;
}

export interface CreateMobileDeviceRequest {
  hostname: string;
  mobileDeviceCategoryId: number;
  imeiNumber: string;
  serialNumber: string;
}

export interface CreateSimCardRequest {
  phoneNumber: string;
  simCallControlGroupId: number;
}

export type CreateMobileOrderRequest = {
  customerId: number;
  mobileDeviceCategoryId: number;
  simCallControlGroupId: number;
  pickupLocation: string;
  note?: string;
  approverId: number;
};
