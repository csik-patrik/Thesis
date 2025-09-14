import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import type { MobileDeviceCategory } from "../../Services/MobileDeviceServices";

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
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategory[]
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
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Create a new mobile order</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="requesterName">Requester's name:</label>
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
          <div className="mb-2">
            <label htmlFor="requesterUsername">Requester's username:</label>
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
          <div className="mb-2">
            <label htmlFor="customerName">Customer's name:</label>
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
          <div className="mb-2">
            <label htmlFor="customerUsername">Customer's username:</label>
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
          <div className="mb-2">
            <label htmlFor="customersCostCenter">Customer's cost center:</label>
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
          <div className="mb-2">
            <label htmlFor="mobileDeviceCategoryId">Device category:</label>
            <select
              id="mobileDeviceCategoryId"
              name="mobileDeviceCategoryId"
              className="form-control"
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
          <div className="mb-2">
            <label htmlFor="callControlGroup">Call control group:</label>
            <select
              id="callControlGroup"
              name="callControlGroup"
              className="form-control"
              value={formData.callControlGroup}
              onChange={handleChange}
              required
            >
              <option value="SPECIAL F">SPECIAL F</option>
              <option value="MIX 10">MIX 10</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="pickupLocation">Pickup location:</label>
            <select
              id="pickupLocation"
              name="pickupLocation"
              className="form-control"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
            >
              <option value="HtvP">HtvP</option>
              <option value="cHub">cHub</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="note">Note:</label>
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
          <div className="mb-2">
            <label htmlFor="createdBy">Created by:</label>
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
          <button
            type="submit"
            className="btn btn-success"
            disabled={formData.mobileDeviceCategoryId === 0}
          >
            Submit
          </button>
          <Link to="/mobile-orders" className="btn btn-primary ms-3">
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}

export default MobileOrdersCreate;
