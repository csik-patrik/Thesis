import { useEffect, useState } from "react";
import type {
  ComputerCategoryResponse,
  CreateComputerRequest,
} from "../../Types/ComputerTypes";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function ComputersCreate() {
  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  const [formData, setFormData] = useState<CreateComputerRequest>({
    hostname: "",
    computerCategoryId: 0,
    serialNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchComputerCategories = async () => {
      try {
        const res = await axios.get<ComputerCategoryResponse[]>(
          "http://localhost:5268/computer-categories"
        );
        setComputerCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch device categories:", err);
      }
    };

    fetchComputerCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "computerCategoryId" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5268/computers", formData);

      toast.success("Computer created successfully!");
      navigate("/computers");
    } catch (err) {
      console.error("Error creating computer:", err);
      toast.error("Failed to create computer.");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex justify-content-center align-items-center">
      <div className="col-12 col-md-8 col-lg-6 col-xl-5 border bg-white shadow px-4 py-5 rounded">
        <h1 className="mb-4 text-center">Create a new computer</h1>
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
              placeholder="HTV-C-00001"
              value={formData.hostname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="computerCategoryId" className="form-label">
              Category
            </label>
            <select
              name="computerCategoryId"
              id="computerCategoryId"
              className="form-select"
              value={formData.computerCategoryId}
              onChange={handleChange}
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
            <Link to="/computers" className="btn btn-primary me-2">
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
