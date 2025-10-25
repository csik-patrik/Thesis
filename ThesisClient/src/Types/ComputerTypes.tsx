import type { UserOrderResponse } from "./UserTypes";

type ComputerCategoryResponse = {
  id: number;
  name: string;
};

export type ComputerResponse = {
  id: number;
  hostname: string;
  computerCategory: ComputerCategoryResponse;
  serialNumber: string;
  user: UserOrderResponse;
  status: string;
  statusReason: string;
};
