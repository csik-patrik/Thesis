import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import type {
  CreateMobileDeviceRequest,
  MobileDeviceCategoryResponse,
} from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";

export default function MobileDeviceCreate() {
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  const [formData, setFormData] = useState<CreateMobileDeviceRequest>({
    hostname: "",
    mobileDeviceCategoryId: 0,
    imeiNumber: "",
    serialNumber: "",
  });

  const navigate = useNavigate();
  const { user } = useAuth();

  console.log(user);

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => {
        setMobileDeviceCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "mobileDeviceCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.token) {
      toast.error("You must be logged in to create a device.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5268/mobile-devices",
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      toast.success("Mobile device created successfully!");
      console.log("Created device:", res.data);
      navigate("/mobiles");
    } catch (err) {
      console.error("Error creating mobile device:", err);
      toast.error("Failed to create mobile device.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white border shadow-lg rounded-lg px-6 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create a New Mobile Device
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Hostname */}
          <div>
            <label
              htmlFor="hostname"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hostname
            </label>
            <input
              type="text"
              id="hostname"
              name="hostname"
              placeholder="HTV-M-00001"
              value={formData.hostname}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="mobileDeviceCategoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="mobileDeviceCategoryId"
              name="mobileDeviceCategoryId"
              value={formData.mobileDeviceCategoryId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value={0} disabled>
                Select category...
              </option>
              {mobileDeviceCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* IMEI Number */}
          <div>
            <label
              htmlFor="imeiNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              IMEI Number
            </label>
            <input
              type="text"
              id="imeiNumber"
              name="imeiNumber"
              placeholder="3525..."
              value={formData.imeiNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Serial Number */}
          <div>
            <label
              htmlFor="serialNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Serial Number
            </label>
            <input
              type="text"
              id="serialNumber"
              name="serialNumber"
              placeholder="SFZ213"
              value={formData.serialNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to="/mobiles"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Back
            </Link>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
