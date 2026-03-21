import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../Auth/AuthContext";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";

import type { CreateComputerOrderRequest } from "../../Types/ComputerTypes";

import { computerOrderReducer } from "./ComputerOrder.reducer";
import { computerOrderInitialState } from "./ComputerOrder.initialState";
import {
  CreateComputerOrder,
  GetComputerCategories,
} from "../../Services/ComputerOrderServices";
import { GetGroupLeaders } from "../../Services/UserServices";

export default function ComputerOrderCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(
    computerOrderReducer,
    computerOrderInitialState,
  );

  const { formData, computerCategories, groupLeaders } = state;

  useEffect(() => {
    GetComputerCategories()
      .then((res) => dispatch({ type: "SET_CATEGORIES", payload: res.data }))
      .catch(() => toast.error("Failed to fetch computer categories"));
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

  const numericFields: (keyof CreateComputerOrderRequest)[] = [
    "customerId",
    "computerCategoryId",
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
      field: name as keyof CreateComputerOrderRequest,
      value: numericFields.includes(name as keyof CreateComputerOrderRequest)
        ? Number(value)
        : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user?.token) return;

      CreateComputerOrder(formData, user);

      toast.success("Computer order created successfully!");
      navigate("/computer-orders/my-orders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create computer order.");
    }
  };

  /* -------------------- Render -------------------- */

  return (
    <Form
      title="Create a new computer order"
      handleSubmit={handleSubmit}
      returnUri="/computer-orders/my-orders"
    >
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
        fieldName="computerCategoryId"
        value={formData.computerCategoryId}
        options={computerCategories.map((c) => ({
          label: c.name,
          value: c.id,
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
