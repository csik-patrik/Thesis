import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerOrderRequest,
} from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";
import Form from "../Form/Form";
import Input from "../Form/Input";
import Select from "../Form/Select";

export default function ComputerOrderCreate() {
  const { user } = useAuth();

  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [groupLeaders, setGroupLeaders] = useState<UserResponse[]>([]);

  const [formData, setFormData] = useState<CreateComputerOrderRequest>({
    customerId: 0,
    computerCategoryId: 0,
    pickupLocation: "HtvP",
    note: undefined,
    approverId: 0,
  });

  useEffect(() => {
    const fetchComputerCategories = async () => {
      try {
        const res = await axios.get<ComputerCategoryResponse[]>(
          "http://localhost:5268/computer-categories",
        );
        setComputerCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchComputerCategories();
  }, []);

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
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerId: Number(user.id),
      }));
    }
  }, [user]);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "computerCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!user || !user.token) return;
      await axios.post("http://localhost:5268/computer-orders", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      toast.success("Computer order created successfully!");
      navigate("/computer-orders/my-orders");
    } catch (err) {
      console.error("Error creating computer order:", err);
      toast.error("Failed to create computer order.");
    }
  };

  return (
    <>
      <Form
        title="Create a new computer order"
        handleSubmit={handleSubmit}
        returnUri="/computer-orders/my-orders"
      >
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
          fieldName="computerCategoryId"
          value={formData.computerCategoryId}
          options={computerCategories.map((category) => ({
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
    </>
  );
}
