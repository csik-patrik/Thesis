import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";

import {
  GetMobileDeviceCategories,
  GetSimCallControlGroups,
} from "../../Services/MobileDeviceServices";

import type {
  CreateMobileOrderRequest,
  SimCallControlGroupResponse,
} from "../../Types/MobileTypes";
import type { UserResponse } from "../../Types/UserTypes";

export default function MobileOrdersCreate() {
  const { user } = useAuth();

  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  const [simCallControlGroups, setSimCallControlGroups] = useState<
    SimCallControlGroupResponse[]
  >([]);

  const [groupLeaders, setGroupLeaders] = useState<UserResponse[]>([]);

  const [formData, setFormData] = useState<CreateMobileOrderRequest>({
    customerId: 0,
    mobileDeviceCategoryId: 0,
    simCallControlGroupId: 0,
    pickupLocation: "HtvP",
    note: undefined,
    approverId: 0,
  });

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => setMobileDeviceCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    GetSimCallControlGroups()
      .then((response) => setSimCallControlGroups(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
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
      [name]: name === "mobileDeviceCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/mobile-orders", formData);
      toast.success("Mobile order created successfully!");
      navigate("/mobile-orders");
    } catch (err) {
      console.error("Error creating mobile order:", err);
      toast.error("Failed to create mobile order.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-xl rounded-lg bg-white border border-neutral-200 shadow-md px-6 py-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-neutral-800">
          Create a New Mobile Order
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Requester */}
          <div>
            <label
              htmlFor="customerId"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Requester
            </label>
            <input
              type="text"
              id="customerId"
              value={user?.displayname ?? ""}
              disabled
              className="
              w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2
              text-neutral-600 cursor-not-allowed
            "
            />
          </div>

          {/* Device category */}
          <div>
            <label
              htmlFor="mobileDeviceCategoryId"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Device category
            </label>
            <select
              id="mobileDeviceCategoryId"
              name="mobileDeviceCategoryId"
              value={formData.mobileDeviceCategoryId}
              onChange={handleChange}
              required
              className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
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

          {/* Sim call control group */}
          <div>
            <label
              htmlFor="simCallControlGroupId"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Sim call control group
            </label>
            <select
              id="simCallControlGroupId"
              name="simCallControlGroupId"
              value={formData.simCallControlGroupId}
              onChange={handleChange}
              required
              className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
            >
              <option value={0} disabled>
                Select call control group...
              </option>
              {simCallControlGroups.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Pickup location */}
          <div>
            <label
              htmlFor="pickupLocation"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Pickup location
            </label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
            >
              <option value="HtvP">HtvP</option>
              <option value="cHub">cHub</option>
            </select>
          </div>

          {/* Note */}
          <div>
            <label
              htmlFor="note"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={2}
              placeholder="Additional notes..."
              value={formData.note}
              onChange={handleChange}
              className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
            />
          </div>

          {/* Approver */}
          <div>
            <label
              htmlFor="approverId"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Approver
            </label>
            <select
              id="approverId"
              name="approverId"
              value={formData.approverId}
              onChange={handleChange}
              required
              className="
              w-full rounded-md border border-neutral-300 px-3 py-2
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
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

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={formData.mobileDeviceCategoryId === 0}
              className="
              rounded-md bg-green-600 px-5 py-2 text-white font-medium
              hover:bg-green-500 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
            >
              Submit
            </button>

            <Link
              to="/mobile-orders"
              className="
              rounded-md bg-neutral-800 px-5 py-2 text-white font-medium
              hover:bg-neutral-700 transition
            "
            >
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
