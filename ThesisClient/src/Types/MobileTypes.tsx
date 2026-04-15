import type { UserOrderResponse } from './UserTypes';

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
  approver: UserOrderResponse;
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

export type SimCard = {
  id: number;
  phoneNumber: string;
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  type: string;
  status: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
};

export type UpdateSimCardRequest = {
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  status: string;
};
