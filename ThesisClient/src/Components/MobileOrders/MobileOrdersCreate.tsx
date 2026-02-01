import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { useAuth } from "../../Auth/AuthContext";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";

import {
  GetMobileDeviceCategories,
  GetSimCallControlGroups,
} from "../../Services/MobileDeviceServices";

import type { CreateMobileOrderRequest } from "../../Types/MobileTypes";
import type { UserResponse } from "../../Types/UserTypes";

import { mobileOrderReducer } from "./MobileOrder.reducer";
import { mobileOrderInitialState } from "./MobileOrder.initialState";

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

  /* -------------------- Load data -------------------- */

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((res) => dispatch({ type: "SET_CATEGORIES", payload: res.data }))
      .catch(() => toast.error("Error fetching device categories"));
  }, []);

  useEffect(() => {
    GetSimCallControlGroups()
      .then((res) => dispatch({ type: "SET_SIM_GROUPS", payload: res.data }))
      .catch(() => toast.error("Error fetching SIM call control groups"));
  }, []);

  useEffect(() => {
    axios
      .get<UserResponse[]>("http://localhost:5268/users/group-leader")
      .then((res) => dispatch({ type: "SET_GROUP_LEADERS", payload: res.data }))
      .catch(() => toast.error("Error fetching approvers"));
  }, []);

  /* -------------------- Set customer -------------------- */

  useEffect(() => {
    if (user) {
      dispatch({
        type: "SET_CUSTOMER",
        payload: Number(user.id),
      });
    }
  }, [user]);

  /* -------------------- Handlers -------------------- */

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

    try {
      await axios.post("http://localhost:5268/mobile-orders", formData);
      toast.success("Mobile order created successfully!");
      navigate("/mobile-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create mobile order");
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <Form title="Create a new mobile order" handleSubmit={handleSubmit}>
      {/* Requester (display only) */}
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
