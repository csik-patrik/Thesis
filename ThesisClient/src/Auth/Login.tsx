import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../Auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const res = await axios.post("http://localhost:5268/login", formData);

      login(res.data);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error.");
      alert("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAsDemoUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5268/login", {
        email: "demo.user1@demo.com",
        password: "PasswordDev01",
      });

      login(res.data);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error.");
      alert("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAsDemoAdmin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5268/login", {
        email: "demo.user2@demo.com",
        password: "PasswordDev02",
      });

      login(res.data);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error.");
      alert("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAsDemoApprover = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5268/login", {
        email: "demo.user3@demo.com",
        password: "PasswordDev03",
      });

      login(res.data);

      toast.success("Logged in successfully!");
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login error.");
      alert("Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center">
        <div className="w-87.5 rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-6 text-center text-xl font-semibold text-neutral-800">
            Sign In
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block font-medium text-neutral-700"
              >
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
              disabled:bg-neutral-100 disabled:cursor-not-allowed
            "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block font-medium text-neutral-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
              disabled:bg-neutral-100 disabled:cursor-not-allowed
            "
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
            mt-2 w-full rounded-md bg-neutral-800 py-2 text-white
            hover:bg-neutral-700 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-87.5 rounded-lg bg-white p-6 shadow-md">
          <button
            onClick={handleSubmitAsDemoUser}
            disabled={loading}
            className="
            mt-2 w-full rounded-md bg-neutral-800 py-2 text-white
            hover:bg-neutral-700 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
          >
            {loading ? "Signing in..." : "Login as demo user"}
          </button>

          <button
            onClick={handleSubmitAsDemoAdmin}
            disabled={loading}
            className="
            mt-2 w-full rounded-md bg-neutral-800 py-2 text-white
            hover:bg-neutral-700 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
          >
            {loading ? "Signing in..." : "Login as demo admin"}
          </button>

          <button
            onClick={handleSubmitAsDemoApprover}
            disabled={loading}
            className="
            mt-2 w-full rounded-md bg-neutral-800 py-2 text-white
            hover:bg-neutral-700 transition
            disabled:opacity-60 disabled:cursor-not-allowed
          "
          >
            {loading ? "Signing in..." : "Login as demo approver"}
          </button>
        </div>
      </div>
    </div>
  );
}
