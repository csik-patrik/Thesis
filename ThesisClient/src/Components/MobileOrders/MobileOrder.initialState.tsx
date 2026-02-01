import type { MobileOrderState } from "./MobileOrder.types";

export const mobileOrderInitialState: MobileOrderState = {
  formData: {
    customerId: 0,
    mobileDeviceCategoryId: 0,
    simCallControlGroupId: 0,
    pickupLocation: "HtvP",
    note: "",
    approverId: 0,
  },
  mobileDeviceCategories: [],
  simCallControlGroups: [],
  groupLeaders: [],
};
