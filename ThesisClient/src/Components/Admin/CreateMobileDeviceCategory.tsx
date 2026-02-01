import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Form from "../Form/Form";
import Input from "../Form/Input";
import type { CreateMobileDeviceCategoryRequest } from "../../Types/MobileTypes";

export default function CreateMobileDeviceCategory() {
  const [formData, setFormData] = useState<CreateMobileDeviceCategoryRequest>({
    name: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5268/mobile-device-categories",
        { name: formData.name },
        { headers: { "Content-Type": "application/json" } },
      );
      toast.success("Category created successfully!");
      navigate("/admin/mobile-device-categories");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category.");
    }
  };

  return (
    <Form
      title="Create mobile device category"
      handleSubmit={handleSubmit}
      returnUri="/admin/mobile-device-categories"
    >
      <Input
        title="Name:"
        fieldName="name"
        placeHolder="Feature phone"
        type="text"
        value={formData.name}
        handleChange={handleChange}
      />
      <Link
        to="/admin/mobile-device-categories"
        className="btn btn-primary me-2"
      >
        Back
      </Link>
    </Form>
  );
}
