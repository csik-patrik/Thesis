import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from "../../Types/ComputerTypes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputersCreate() {
  const { user } = useAuth();

  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [formData, setFormData] = useState<CreateComputerRequest>({
    hostname: "",
    computerCategoryId: 0,
    model: "",
    serialNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) return;
    const fetchComputerCategories = async () => {
      try {
        const res = await axios.get<ComputerCategoryResponse[]>(
          "http://localhost:5268/computer-categories",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setComputerCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchComputerCategories();
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "computerCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user || !user.token) return;

    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/computers", formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      toast.success("Computer created successfully!");
      navigate("/computers");
    } catch (err) {
      console.error("Error creating computer:", err);
      toast.error("Failed to create computer.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create a new computer
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hostname */}
          <div>
            <label
              htmlFor="hostname"
              className="block text-gray-700 font-medium mb-1"
            >
              Hostname
            </label>
            <input
              type="text"
              name="hostname"
              id="hostname"
              placeholder="HTV-C-00001"
              value={formData.hostname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="computerCategoryId"
              className="block text-gray-700 font-medium mb-1"
            >
              Category
            </label>
            <select
              name="computerCategoryId"
              id="computerCategoryId"
              value={formData.computerCategoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Model */}
          <div>
            <label
              htmlFor="model"
              className="block text-gray-700 font-medium mb-1"
            >
              Model
            </label>
            <input
              type="text"
              name="model"
              id="model"
              placeholder="Lenovo T14 G2"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label
              htmlFor="serialNumber"
              className="block text-gray-700 font-medium mb-1"
            >
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              id="serialNumber"
              placeholder="SFZ213"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Link
              to="/computers"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Back
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
