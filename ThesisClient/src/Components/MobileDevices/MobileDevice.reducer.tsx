import type {
  MobileDeviceAction,
  MobileDeviceState,
} from "./MobileDevice.types";

export function mobileDeviceReducer(
  state: MobileDeviceState,
  action: MobileDeviceAction,
): MobileDeviceState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };

    case "SET_CATEGORIES":
      return {
        ...state,
        categories: action.payload,
        formData: {
          ...state.formData,
          mobileDeviceCategoryId:
            action.payload.length > 0 ? action.payload[0].id : 0,
        },
      };

    default:
      return state;
  }
}
