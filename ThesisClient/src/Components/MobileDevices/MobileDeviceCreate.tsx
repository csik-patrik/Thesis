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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        }
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
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Create a New Mobile Device</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="hostname" className="form-label">
              Hostname
            </label>
            <input
              type="text"
              name="hostname"
              id="hostname"
              className="form-control"
              placeholder="HTV-M-00001"
              value={formData.hostname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="mobileDeviceCategoryId" className="form-label">
              Category
            </label>
            <select
              name="mobileDeviceCategoryId"
              id="mobileDeviceCategoryId"
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
            <label htmlFor="imeiNumber" className="form-label">
              IMEI Number
            </label>
            <input
              type="text"
              name="imeiNumber"
              id="imeiNumber"
              className="form-control"
              placeholder="3525..."
              value={formData.imeiNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="serialNumber" className="form-label">
              Serial Number
            </label>
            <input
              type="text"
              name="serialNumber"
              id="serialNumber"
              className="form-control"
              placeholder="SFZ213"
              value={formData.serialNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="d-flex flex-wrap">
            <Link to="/mobiles" className="btn btn-primary me-2">
              Back
            </Link>
            <button type="submit" className="btn btn-success ">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
