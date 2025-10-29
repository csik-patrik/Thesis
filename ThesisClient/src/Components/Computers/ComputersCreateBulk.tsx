import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from "../../Types/ComputerTypes";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function ComputersCreateBulk() {
  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [deviceCount, setDeviceCount] = useState<number>(1);

  const [devices, setDevices] = useState<CreateComputerRequest[]>([]);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;
    const fetchComputerCategories = async () => {
      try {
        const res = await axios.get<ComputerCategoryResponse[]>(
          "http://localhost:5268/computer-categories",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setComputerCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchComputerCategories();
  }, [user]);

  useEffect(() => {
    setDevices(
      Array.from({ length: deviceCount }, () => ({
        hostname: "",
        computerCategoryId: 0,
        model: "",
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
              [name]: name === "computerCategoryId" ? Number(value) : value,
            }
          : dev
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.token) return;

    try {
      await axios.post("http://localhost:5268/computers/bulk", devices, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success("Computers created successfully!");
      navigate("/computers");
    } catch (err) {
      console.error("Error creating computers:", err);
      toast.error("Failed to create computers.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-xl-10 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Bulk create computers</h1>
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
                  <th>Model</th>
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
                        placeholder="HTV-C-00001"
                        value={dev.hostname}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
                      />
                    </td>
                    <td>
                      <select
                        name="computerCategoryId"
                        className="form-select"
                        value={dev.computerCategoryId}
                        onChange={(e) => handleDeviceChange(idx, e)}
                        required
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
                    </td>
                    <td>
                      <input
                        type="text"
                        name="model"
                        className="form-control"
                        placeholder="Lenovo T14 G2"
                        value={dev.model}
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
            <Link to="/computers" className="btn btn-primary me-2">
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
