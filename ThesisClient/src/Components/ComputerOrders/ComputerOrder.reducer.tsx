import type {
  ComputerOrderAction,
  ComputerOrderState,
} from "./ComputerOrder.types";

export function computerOrderReducer(
  state: ComputerOrderState,
  action: ComputerOrderAction,
): ComputerOrderState {
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
        state.formData.computerCategoryId === 0 && action.payload.length > 0
          ? action.payload[0].id
          : state.formData.computerCategoryId;

      return {
        ...state,
        computerCategories: action.payload,
        formData: {
          ...state.formData,
          computerCategoryId: defaultCategory,
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
