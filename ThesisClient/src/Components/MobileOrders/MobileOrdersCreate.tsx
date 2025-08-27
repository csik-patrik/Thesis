import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

interface CreateMobileOrderRequest {
  customerName: string;
  customerUsername: string;
  deviceType: string;
  deviceCount: number;
  pickupLocation: string;
  createdBy: string;
}

function MobileOrdersCreate() {
  const [formData, setFormData] = useState<CreateMobileOrderRequest>({
    customerName: "",
    customerUsername: "",
    deviceType: "Standard Smartphone",
    deviceCount: 1,
    pickupLocation: "HtvP",
    createdBy: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "deviceCount" ? Number(value) : value, // convert number input properly
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/api/mobile-orders", formData);
      navigate("/mobile-orders");
    } catch (err) {
      console.error("Error creating sim card:", err);
      alert("Failed to create sim card.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
        <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
          <h1>Create a new mobile order</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="customerName">Customer's name:</label>
              <input
                type="text"
                name="customerName"
                className="form-control"
                placeholder="Patrik Csik"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="customerUsername">Customer's username:</label>
              <input
                type="text"
                name="customerUsername"
                className="form-control"
                placeholder="CSP8HTV"
                value={formData.customerUsername}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="deviceType">Device type:</label>
              <select
                name="deviceType"
                className="form-control"
                value={formData.deviceType}
                onChange={handleChange}
              >
                <option value="Standard Smartphone">Standard Smartphone</option>
                <option value="Enhanced Smartphone">Enhanced Smartphone</option>
                <option value="Feature Phone">Feature Phone</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="deviceCount">Device count:</label>
              <input
                type="number"
                min={1}
                name="deviceCount"
                className="form-control"
                placeholder="1"
                value={formData.deviceCount}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="pickupLocation">Pickup location:</label>
              <select
                name="pickupLocation"
                className="form-control"
                value={formData.pickupLocation}
                onChange={handleChange}
              >
                <option value="HtvP">HtvP</option>
                <option value="cHub">cHub</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="createdBy">Created by:</label>
              <input
                type="text"
                name="createdBy"
                className="form-control"
                placeholder="Username"
                value={formData.createdBy}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
            <Link to="/sim-cards" className="btn btn-primary ms-3">
              Back
            </Link>
          </form>
        </div>
      </div>
    </>
  );
}

export default MobileOrdersCreate;
