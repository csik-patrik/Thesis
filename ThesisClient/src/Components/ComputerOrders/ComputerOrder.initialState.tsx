import type { ComputerOrderState } from "./ComputerOrder.types";

export const computerOrderInitialState: ComputerOrderState = {
  formData: {
    customerId: 0,
    computerCategoryId: 0,
    pickupLocation: "HtvP",
    note: "",
    approverId: 0,
  },
  computerCategories: [],
  groupLeaders: [],
};
