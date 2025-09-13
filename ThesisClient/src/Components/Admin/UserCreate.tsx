import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "../Form/Form";
import Input from "../Form/Input";
import SelectMultiple from "../Form/SelectMultiple";

interface UserRole {
  id: number;
  name: string;
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  department: string;
  costCenter: string;
  userRoleIds: number[];
}

export default function UserCreate() {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    axios
      .get<UserRole[]>("http://localhost:5268/api/admin/users/roles")
      .then((response) => {
        setUserRoles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const [formData, setFormData] = useState<CreateUserRequest>({
    username: "",
    email: "",
    password: "",
    department: "",
    costCenter: "",
    userRoleIds: [],
  });

  const navigate = useNavigate();

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
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
      await axios.post("http://localhost:5268/api/admin/users", formData);
      toast.success("User created successfully!");
      navigate("/admin/users");
    } catch (err) {
      console.error("Error creating user:", err);
      toast.error("Failed to create user.");
    }
  };

  return (
    <>
      <Form title="Create user" handleSubmit={handleSubmit}>
        <Input
          title="Username:"
          fieldName="username"
          placeHolder=""
          type="text"
          value={formData.username}
          handleChange={handleChange}
        />
        <Input
          title="Email address:"
          fieldName="email"
          placeHolder="patrik.csik@bosch.com"
          type="text"
          value={formData.email}
          handleChange={handleChange}
        />
        <Input
          title="Password:"
          fieldName="password"
          placeHolder="********"
          type="password"
          value={formData.password}
          handleChange={handleChange}
        />
        <Input
          title="Department:"
          fieldName="department"
          placeHolder="BD/SLE-EET3"
          type="text"
          value={formData.department}
          handleChange={handleChange}
        />
        <Input
          title="Cost center:"
          fieldName="costCenter"
          placeHolder="658091"
          type="text"
          value={formData.costCenter}
          handleChange={handleChange}
        />
        <SelectMultiple
          title="Roles:"
          fieldName="userRoleIds"
          value={formData.userRoleIds} // e.g. ["1", "3"]
          options={userRoles.map((r) => ({
            label: r.name,
            value: r.id,
          }))}
          handleChange={handleChange}
        />
        <Link to="/admin/users" className="btn btn-primary ms-3">
          Back
        </Link>
      </Form>
    </>
  );
}
