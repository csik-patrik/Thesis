import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerOrderRequest,
} from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";

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
          "http://localhost:5268/computer-categories"
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
          "http://localhost:5268/users/group-leader"
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
    >
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
      navigate("/computer-orders");
    } catch (err) {
      console.error("Error creating computer order:", err);
      toast.error("Failed to create computer order.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Create a new computer order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="customerId" className="form-label">
              Requester:
            </label>
            <input
              type="text"
              id="customerId"
              className="form-control"
              value={user?.displayname ?? ""}
              disabled
            />
          </div>
          <div className="mb-3">
            <label htmlFor="computerCategoryId" className="form-label">
              Device category:
            </label>
            <select
              id="computerCategoryId"
              name="computerCategoryId"
              className="form-select"
              value={formData.computerCategoryId}
              onChange={handleChange}
              required
            >
              <option value={0} disabled>
                Select category...
              </option>
              {computerCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="pickupLocation" className="form-label">
              Pickup location:
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              className="form-select"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            >
              <option value="HtvP">HtvP</option>
              <option value="cHub">cHub</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="note" className="form-label">
              Note:
            </label>
            <textarea
              id="note"
              name="note"
              className="form-control"
              placeholder="Additional notes..."
              value={formData.note}
              onChange={handleChange}
              rows={2}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="approverId" className="form-label">
              Approver:
            </label>
            <select
              id="approverId"
              name="approverId"
              className="form-select"
              value={formData.approverId}
              onChange={handleChange}
              required
            >
              <option value={0} disabled>
                Select an approver...
              </option>
              {groupLeaders.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mt-4">
            <button
              type="submit"
              className="btn btn-success mb-2 mb-md-0"
              disabled={formData.computerCategoryId === 0 || user == null}
            >
              Submit
            </button>
            <Link to="/computer-orders" className="btn btn-primary ms-md-3">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
