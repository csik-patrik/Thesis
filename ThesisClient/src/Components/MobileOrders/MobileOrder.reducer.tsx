import type { MobileOrderAction, MobileOrderState } from "./MobileOrder.types";

export function mobileOrderReducer(
  state: MobileOrderState,
  action: MobileOrderAction,
): MobileOrderState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };

    case "SET_CUSTOMER":
      return {
        ...state,
        formData: {
          ...state.formData,
          customerId: action.payload,
        },
      };

    case "SET_CATEGORIES": {
      const defaultCategory =
        state.formData.mobileDeviceCategoryId === 0 && action.payload.length > 0
          ? action.payload[0].id
          : state.formData.mobileDeviceCategoryId;

      return {
        ...state,
        mobileDeviceCategories: action.payload,
        formData: {
          ...state.formData,
          mobileDeviceCategoryId: defaultCategory,
        },
      };
    }

    case "SET_SIM_GROUPS": {
      const defaultGroup =
        state.formData.simCallControlGroupId === 0 && action.payload.length > 0
          ? action.payload[0].id
          : state.formData.simCallControlGroupId;

      return {
        ...state,
        simCallControlGroups: action.payload,
        formData: {
          ...state.formData,
          simCallControlGroupId: defaultGroup,
        },
      };
    }

    case "SET_GROUP_LEADERS": {
      const defaultApprover =
        state.formData.approverId === 0 && action.payload.length > 0
          ? action.payload[0].id
          : state.formData.approverId;

      return {
        ...state,
        groupLeaders: action.payload,
        formData: {
          ...state.formData,
          approverId: defaultApprover,
        },
      };
    }

    default:
      return state;
  }
}
