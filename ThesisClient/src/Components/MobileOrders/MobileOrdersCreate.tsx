import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";

interface CreateMobileOrderRequest {
  requesterName: string;
  requesterUsername: string;
  customerName: string;
  customerUsername: string;
  customersCostCenter: string;
  mobileDeviceCategoryId: number;
  callControlGroup: string;
  pickupLocation: string;
  note: string;
  createdBy: string;
}

function MobileOrdersCreate() {
  const { user } = useAuth();
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);
  const [formData, setFormData] = useState<CreateMobileOrderRequest>({
    requesterName: "",
    requesterUsername: "",
    customerName: "",
    customerUsername: "",
    customersCostCenter: "",
    mobileDeviceCategoryId: 0,
    callControlGroup: "SPECIAL F",
    pickupLocation: "HtvP",
    note: "",
    createdBy: "",
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
    if (user) {
      setFormData((prev) => ({
        ...prev,
        requesterName: user.displayname || "",
        requesterUsername: user.username || "",
        customerName: user.displayname || "",
        customerUsername: user.username || "",
        customersCostCenter: user.costCenter || "",
        createdBy: user.username || "",
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
      [name]: name === "mobileDeviceCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/api/mobile-orders", formData);
      toast.success("Mobile order created successfully!");
      navigate("/mobile-orders");
    } catch (err) {
      console.error("Error creating mobile order:", err);
      toast.error("Failed to create mobile order.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Create a New Mobile Order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="requesterName" className="form-label">
              Requester's name:
            </label>
            <input
              type="text"
              id="requesterName"
              name="requesterName"
              className="form-control"
              placeholder="Patrik Csik"
              value={formData.requesterName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="requesterUsername" className="form-label">
              Requester's username:
            </label>
            <input
              type="text"
              id="requesterUsername"
              name="requesterUsername"
              className="form-control"
              placeholder="CSP8HTV"
              value={formData.requesterUsername}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="customerName" className="form-label">
              Customer's name:
            </label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              className="form-control"
              placeholder="Patrik Csik"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="customerUsername" className="form-label">
              Customer's username:
            </label>
            <input
              type="text"
              id="customerUsername"
              name="customerUsername"
              className="form-control"
              placeholder="CSP8HTV"
              value={formData.customerUsername}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="customersCostCenter" className="form-label">
              Customer's cost center:
            </label>
            <input
              type="text"
              id="customersCostCenter"
              name="customersCostCenter"
              className="form-control"
              placeholder="658091"
              value={formData.customersCostCenter}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileDeviceCategoryId" className="form-label">
              Device category:
            </label>
            <select
              id="mobileDeviceCategoryId"
              name="mobileDeviceCategoryId"
              className="form-select"
              value={formData.mobileDeviceCategoryId}
              onChange={handleChange}
              required
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
          <div className="mb-3">
            <label htmlFor="callControlGroup" className="form-label">
              Call control group:
            </label>
            <select
              id="callControlGroup"
              name="callControlGroup"
              className="form-select"
              value={formData.callControlGroup}
              onChange={handleChange}
              required
            >
              <option value="SPECIAL F">SPECIAL F</option>
              <option value="MIX 10">MIX 10</option>
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
            <label htmlFor="createdBy" className="form-label">
              Created by:
            </label>
            <input
              type="text"
              id="createdBy"
              name="createdBy"
              className="form-control"
              placeholder="Username"
              value={formData.createdBy}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center mt-4">
            <button
              type="submit"
              className="btn btn-success mb-2 mb-md-0"
              disabled={formData.mobileDeviceCategoryId === 0}
            >
              Submit
            </button>
            <Link to="/mobile-orders" className="btn btn-primary ms-md-3">
              Back
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MobileOrdersCreate;
