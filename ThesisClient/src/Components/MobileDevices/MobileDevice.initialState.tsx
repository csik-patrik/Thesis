import type { MobileDeviceState } from "./MobileDevice.types.tsx";

export const mobileDeviceInitialState: MobileDeviceState = {
  formData: {
    hostname: "",
    mobileDeviceCategoryId: 0,
    imeiNumber: "",
    serialNumber: "",
  },
  categories: [],
};
