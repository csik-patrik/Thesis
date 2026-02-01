import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Form from "../Form/Form";
import Input from "../Form/Input";

import {
  GetMobileDeviceCategories,
  GetSimCallControlGroups,
} from "../../Services/MobileDeviceServices";

import type {
  CreateMobileOrderRequest,
  SimCallControlGroupResponse,
} from "../../Types/MobileTypes";
import type { UserResponse } from "../../Types/UserTypes";
import Select from "../Form/Select";

export default function MobileOrdersCreate() {
  const { user } = useAuth();

  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  const [simCallControlGroups, setSimCallControlGroups] = useState<
    SimCallControlGroupResponse[]
  >([]);

  const [groupLeaders, setGroupLeaders] = useState<UserResponse[]>([]);

  const [formData, setFormData] = useState<CreateMobileOrderRequest>({
    customerId: 0,
    mobileDeviceCategoryId: 0,
    simCallControlGroupId: 0,
    pickupLocation: "HtvP",
    note: undefined,
    approverId: 0,
  });

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => setMobileDeviceCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (
      mobileDeviceCategories.length > 0 &&
      formData.mobileDeviceCategoryId === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        mobileDeviceCategoryId: mobileDeviceCategories[0].id,
      }));
    }
  }, [mobileDeviceCategories]);

  useEffect(() => {
    GetSimCallControlGroups()
      .then((response) => setSimCallControlGroups(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    if (
      simCallControlGroups.length > 0 &&
      formData.simCallControlGroupId === 0
    ) {
      setFormData((prev) => ({
        ...prev,
        simCallControlGroupId: simCallControlGroups[0].id,
      }));
    }
  }, [simCallControlGroups]);

  useEffect(() => {
    const fetchGroupLeaders = async () => {
      try {
        const res = await axios.get<UserResponse[]>(
          "http://localhost:5268/users/group-leader",
        );
        setGroupLeaders(res.data);
      } catch (err) {
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchGroupLeaders();
  }, []);

  useEffect(() => {
    if (groupLeaders.length > 0 && formData.approverId === 0) {
      setFormData((prev) => ({
        ...prev,
        approverId: groupLeaders[0].id,
      }));
    }
  }, [groupLeaders]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerId: Number(user.id),
      }));
    }
  }, [user]);

  const navigate = useNavigate();

  const numericFields = [
    "mobileDeviceCategoryId",
    "simCallControlGroupId",
    "approverId",
    "customerId",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/mobile-orders", formData);
      toast.success("Mobile order created successfully!");
      navigate("/mobile-orders/my-orders");
    } catch (err) {
      console.error("Error creating mobile order:", err);
      toast.error("Failed to create mobile order.");
    }
  };

  return (
    <Form title="Create a new mobile order" handleSubmit={handleSubmit}>
      <Input
        title="Requester"
        fieldName="customerId"
        placeHolder=""
        type="text"
        value={user?.displayname ?? ""}
        handleChange={handleChange}
      />
      <Select
        title="Device category"
        fieldName="mobileDeviceCategoryId"
        value={formData.mobileDeviceCategoryId}
        options={mobileDeviceCategories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        handleChange={handleChange}
      />

      <Select
        title="Sim call control group"
        fieldName="simCallControlGroupId"
        value={formData.simCallControlGroupId}
        options={simCallControlGroups.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
        handleChange={handleChange}
      />

      <Select
        title="Pickup location"
        fieldName="pickupLocation"
        value={formData.pickupLocation}
        options={[
          {
            label: "HtvP",
            value: "HtvP",
          },
          {
            label: "cHub",
            value: "cHub",
          },
        ]}
        handleChange={handleChange}
      />

      <Input
        title="Note"
        fieldName="note"
        placeHolder=""
        type="text"
        value={formData?.note ?? ""}
        handleChange={handleChange}
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
