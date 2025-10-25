import type { UserOrderResponse } from "./UserTypes";

export type ComputerCategoryResponse = {
  id: number;
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
