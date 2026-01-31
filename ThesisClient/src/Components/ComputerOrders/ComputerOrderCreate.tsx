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
      navigate("/computer-orders");
    } catch (err) {
      console.error("Error creating computer order:", err);
      toast.error("Failed to create computer order.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create a new computer order
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Requester */}
          <div>
            <label
              htmlFor="customerId"
              className="block text-gray-700 font-medium mb-1"
            >
              Requester:
            </label>
            <input
              type="text"
              id="customerId"
              value={user?.displayname ?? ""}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Device Category */}
          <div>
            <label
              htmlFor="computerCategoryId"
              className="block text-gray-700 font-medium mb-1"
            >
              Device category:
            </label>
            <select
              id="computerCategoryId"
              name="computerCategoryId"
              value={formData.computerCategoryId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
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

          {/* Pickup Location */}
          <div>
            <label
              htmlFor="pickupLocation"
              className="block text-gray-700 font-medium mb-1"
            >
              Pickup location:
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            >
              <option value="HtvP">HtvP</option>
              <option value="cHub">cHub</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="note"
              className="block text-gray-700 font-medium mb-1"
            >
              Note:
            </label>
            <textarea
              id="note"
              name="note"
              placeholder="Additional notes..."
              value={formData.note}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          {/* Approver */}
          <div>
            <label
              htmlFor="approverId"
              className="block text-gray-700 font-medium mb-1"
            >
              Approver:
            </label>
            <select
              id="approverId"
              name="approverId"
              value={formData.approverId}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
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

          {/* Buttons */}
          <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
            <button
              type="submit"
              disabled={formData.computerCategoryId === 0 || user == null}
              className={`px-4 py-2 rounded-md text-white font-medium transition ${
                formData.computerCategoryId === 0 || user == null
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-500"
              }`}
            >
              Submit
            </button>
            <Link
              to="/computer-orders"
              className="px-4 py-2 rounded-md text-white font-medium bg-blue-600 hover:bg-blue-500 transition"
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
