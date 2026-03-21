import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";
import {
  CreateNewMobileOrder,
  GetMobileDeviceCategories,
} from "../../Services/MobileDeviceServices";

import type { CreateMobileOrderRequest } from "../../Types/MobileTypes";

import { mobileOrderReducer } from "./MobileOrder.reducer";
import { mobileOrderInitialState } from "./MobileOrder.initialState";
import { GetGroupLeaders } from "../../Services/UserServices";
import { GetSimCallControlGroups } from "../../Services/SimCardServices";

export default function MobileOrdersCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    mobileOrderReducer,
    mobileOrderInitialState,
  );

  const {
    formData,
    mobileDeviceCategories,
    simCallControlGroups,
    groupLeaders,
  } = state;

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((res) => dispatch({ type: "SET_CATEGORIES", payload: res.data }))
      .catch(() => toast.error("Error fetching device categories"));
  }, [user]);

  useEffect(() => {
    GetSimCallControlGroups()
      .then((res) => dispatch({ type: "SET_SIM_GROUPS", payload: res.data }))
      .catch(() => toast.error("Error fetching SIM call control groups"));
  }, [user]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchGroupLeaders = async () => {
      try {
        await GetGroupLeaders(user)
          .then((res) =>
            dispatch({ type: "SET_GROUP_LEADERS", payload: res.data }),
          )
          .catch(() => toast.error("Failed to fetch approvers"));
      } catch (err) {
        console.error("Failed to fetch approvers", err);
      }
    };

    fetchGroupLeaders();
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch({
        type: "SET_CUSTOMER",
        payload: Number(user.id),
      });
    }
  }, [user]);

  const numericFields: (keyof CreateMobileOrderRequest)[] = [
    "customerId",
    "mobileDeviceCategoryId",
    "simCallControlGroupId",
    "approverId",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    dispatch({
      type: "SET_FIELD",
      field: name as keyof CreateMobileOrderRequest,
      value: numericFields.includes(name as keyof CreateMobileOrderRequest)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user == null) return;

    try {
      await CreateNewMobileOrder(formData, user);
      toast.success("Mobile order created successfully!");
      navigate("/mobile-orders/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create mobile order");
    }
  };

  return (
    <Form
      title="Create a new mobile order"
      handleSubmit={handleSubmit}
      returnUri="/mobile-orders/my-orders"
    >
      <Input
        title="Requester"
        fieldName="requester"
        type="text"
        value={user?.displayname ?? ""}
        handleChange={() => {}}
        placeHolder=""
      />

      <Select
        title="Device category"
        fieldName="mobileDeviceCategoryId"
        value={formData.mobileDeviceCategoryId}
        options={mobileDeviceCategories.map((c) => ({
          label: c.name,
          value: c.id,
        }))}
        handleChange={handleChange}
      />

      <Select
        title="Sim call control group"
        fieldName="simCallControlGroupId"
        value={formData.simCallControlGroupId}
        options={simCallControlGroups.map((g) => ({
          label: g.name,
          value: g.id,
        }))}
        handleChange={handleChange}
      />

      <Select
        title="Pickup location"
        fieldName="pickupLocation"
        value={formData.pickupLocation}
        options={[
          { label: "HtvP", value: "HtvP" },
          { label: "cHub", value: "cHub" },
        ]}
        handleChange={handleChange}
      />

      <Input
        title="Note"
        fieldName="note"
        type="text"
        value={formData?.note ?? ""}
        handleChange={handleChange}
        placeHolder=""
      />

      <Select
        title="Approver"
        fieldName="approverId"
        value={formData.approverId}
        options={groupLeaders.map((leader) => ({
          label: leader.displayName,
          value: leader.id,
        }))}
        handleChange={handleChange}
      />
    </Form>
  );
}
