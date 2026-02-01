import type {
  ComputerCategoryResponse,
  CreateComputerOrderRequest,
} from "../../Types/ComputerTypes";
import type { UserResponse } from "../../Types/UserTypes";

export type ComputerOrderState = {
  formData: CreateComputerOrderRequest;
  computerCategories: ComputerCategoryResponse[];
  groupLeaders: UserResponse[];
};

export type ComputerOrderAction =
  | {
      type: "SET_FIELD";
      field: keyof CreateComputerOrderRequest;
      value: string | number;
    }
  | { type: "SET_CATEGORIES"; payload: ComputerCategoryResponse[] }
  | { type: "SET_GROUP_LEADERS"; payload: UserResponse[] }
  | { type: "SET_CUSTOMER"; payload: number };
