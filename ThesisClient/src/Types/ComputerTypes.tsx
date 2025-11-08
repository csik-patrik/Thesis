import type { UserOrderResponse } from "./UserTypes";

export type ComputerCategoryResponse = {
  id: number;
  name: string;
};

export type CreateComputerCategoryRequest = {
  name: string;
};

export type ComputerResponse = {
  id: number;
  hostname: string;
  computerCategory: ComputerCategoryResponse;
  model: string;
  serialNumber: string;
  user: UserOrderResponse;
  status: string;
  statusReason: string;
};

export type CreateComputerRequest = {
  hostname: string;
  computerCategoryId: number;
  model: string;
  serialNumber: string;
};

export type ComputerOrderResponse = {
  id: number;
  customer: UserOrderResponse;
  computerCategory: ComputerCategoryResponse;
  pickupLocation: string;
  note: string;
  computer: ComputerResponse;
  status: string;
  approver: UserOrderResponse;
};

export type CreateComputerOrderRequest = {
  customerId: number;
  computerCategoryId: number;
  pickupLocation: string;
  note?: string;
  approverId: number;
};
