import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import type {
  CreateMobileDeviceRequest,
  MobileDeviceCategoryResponse,
} from "../../Types/MobileTypes";

export default function MobileDeviceCreateBulk() {
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);
  const [deviceCount, setDeviceCount] = useState<number>(1);
  const [devices, setDevices] = useState<CreateMobileDeviceRequest[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => setMobileDeviceCategories(response.data))
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Generate empty rows when deviceCount changes
  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: "",
        mobileDeviceCategoryId: 0,
        imeiNumber: "",
        serialNumber: "",
      }))
    );
  }, [deviceCount]);

  const handleDeviceChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDevices((prev) =>
      prev.map((dev, i) =>
        i === idx
          ? {
              ...dev,
              [name]: name === "mobileDeviceCategoryId" ? Number(value) : value,
            }
          : dev
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5268/mobile-devices/bulk", devices);
      toast.success("Mobile devices created successfully!");
      navigate("/mobiles");
    } catch (err) {
      console.error("Error creating mobile devices:", err);
      toast.error("Failed to create mobile devices.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-xl-10 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Bulk Create Mobile Devices</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 d-flex align-items-center">
            <label htmlFor="deviceCount" className="form-label me-2 mb-0">
              Number of devices:
            </label>
            <input
              type="number"
              id="deviceCount"
              min={1}
              max={100}
              className="form-control w-auto"
              value={deviceCount}
              onChange={(e) => setDeviceCount(Number(e.target.value))}
              required
            />
          </div>
          <div className="table-responsive mb-4">
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Hostname</th>
                  <th>Category</th>
                  <th>IMEI Number</th>
                  <th>Serial Number</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((dev, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <input
                        type="text"
                        name="hostname"
                        className="form-control"
                        placeholder="HTV-M-00001"
                        value={dev.hostname}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                      />
                    </td>
                    <td>
                      <select
                        name="mobileDeviceCategoryId"
                        className="form-select"
                        value={dev.mobileDeviceCategoryId}
                        onChange={(e) => handleDeviceChange(idx, e)}
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
                    </td>
                    <td>
                      <input
                        type="text"
                        name="imeiNumber"
                        className="form-control"
                        placeholder="3525..."
                        value={dev.imeiNumber}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="serialNumber"
                        className="form-control"
                        placeholder="SFZ213"
                        value={dev.serialNumber}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-wrap">
            <Link to="/mobiles" className="btn btn-primary me-2">
              Back
            </Link>
            <button type="submit" className="btn btn-success">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
