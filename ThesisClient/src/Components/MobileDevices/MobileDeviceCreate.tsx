import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import type { MobileDeviceCategory } from "../../Services/MobileDeviceServices";

interface CreateMobileDeviceRequest {
  hostname: string;
  type: string;
  imeiNumber: string;
  serialNumber: string;
  iosVersion: string;
  createdBy: string;
}

function MobileDeviceCreate() {
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategory[]
  >([]);

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => {
        setMobileDeviceCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const [formData, setFormData] = useState<CreateMobileDeviceRequest>({
    hostname: "",
    type: "",
    imeiNumber: "",
    serialNumber: "",
    iosVersion: "",
    createdBy: "",
  });

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/api/mobile-devices", formData);
      toast.success("Mobile created successfully!");
      navigate("/mobiles");
    } catch (err) {
      console.error("Error creating mobile device:", err);
      toast.error("Failed to create mobile order.");
      alert("Failed to create sim card.");
    }
  };

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Create a new mobile device</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="hostname">Hostname:</label>
            <input
              type="text"
              name="hostname"
              className="form-control"
              placeholder="HTV-M-00001"
              value={formData.hostname}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="type">Category</label>
            <input
              type="text"
              name="type"
              className="form-control"
              placeholder="iPhone SE 2 64Gb"
              value={formData.type}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="imeiNumber">Imei number:</label>
            <input
              type="text"
              name="imeiNumber"
              className="form-control"
              placeholder="3512..."
              value={formData.imeiNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="serialNumber">Serial number:</label>
            <input
              type="text"
              name="serialNumber"
              className="form-control"
              placeholder="SFZ213"
              value={formData.serialNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="iosVersion">Ios version::</label>
            <input
              type="text"
              name="iosVersion"
              className="form-control"
              placeholder="18.6.2"
              value={formData.iosVersion}
              onChange={handleChange}
            />
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
          <Link to="/mobiles" className="btn btn-primary ms-3">
            Back
          </Link>
        </form>
      </div>
    </div>
  );
}

export default MobileDeviceCreate;
