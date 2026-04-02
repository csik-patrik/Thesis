import { useState } from "react";
import type { CreateComputerCategoryRequest } from "../../Types/ComputerTypes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../Form/Input";
import Form from "../Form/Form";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputerCategoriesCreate() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<CreateComputerCategoryRequest>({
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

    if (!user || !user.token) return;

    try {
      await axios.post(
        "http://localhost:5268/computer-categories",
        { name: formData.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      toast.success("Category created successfully!");
      navigate("/admin/computers/categories");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create category.");
    }
  };

  return (
    <Form
      title="Create computer category"
      handleSubmit={handleSubmit}
      returnUri="/admin/computers/categories"
    >
      <Input
        title="Name:"
        fieldName="name"
        placeHolder=""
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
