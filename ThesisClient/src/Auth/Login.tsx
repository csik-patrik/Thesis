import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // get login function from context

  interface LoginRequest {
    email: string;
    password: string;
  }

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5268/api/users/login",
        formData
      );

      // assuming your backend returns { id, email, name, token }
      login(res.data);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error.");
      alert("Failed to login.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="container p-3" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className="form-control"
          id="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-primary mt-2">
        Submit
      </button>
    </form>
  );
}
