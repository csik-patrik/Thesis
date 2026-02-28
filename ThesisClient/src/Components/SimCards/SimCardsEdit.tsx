import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../Shared/Spinner";

interface SimCard {
  id: number;
  phoneNumber: string;
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  type: string;
  status: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

interface UpdateSimCardRequest {
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  status: string;
}

export default function SimCardsEdit() {
  const { id } = useParams<{ id: string }>(); // get ID from URL
  const [simCard, setSimCard] = useState<SimCard | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<UpdateSimCardRequest>({
    department: "",
    callControlGroup: "",
    isDataEnabled: false,
    status: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get<SimCard>(
          `http://localhost:5268/api/sim-cards/${id}`
        );
        setSimCard(res.data);
        setFormData({
          department: res.data.department,
          callControlGroup: res.data.callControlGroup,
          isDataEnabled: res.data.isDataEnabled,
          status: res.data.status,
        });
      } catch (err) {
        console.error("Error fetching sim card:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isDataEnabled"
          ? value === "true" // convert dropdown string -> boolean
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5268/api/sim-cards/${id}`, formData);
      toast.success("Sim card updated successfully!");
      navigate("/sim-cards");
    } catch (err) {
      console.error("Failed to update sim card:", err);
      alert("Failed to update sim card.");
    }
  };

  if (loading) return <Spinner />;

  if (!simCard)
    return <p className="text-center text-danger mt-5">Sim card not found.</p>;

  return (
    <div className="d-flex w-100 vh-100 justify-content-center align-items-center bg-light">
      <div className="w-50 border bg-white shadow px-5 pt-3 pb-5 rounded">
        <h1>Edit: {simCard.phoneNumber}</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="phoneNumber">Phone number:</label>
            <input
              type="text"
              name="phoneNumber"
              className="form-control"
              placeholder="+36208288073"
              disabled
              value={simCard.phoneNumber}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="department">Department:</label>
            <input
              type="text"
              name="department"
              className="form-control"
              placeholder="BD/SLE-EET3"
              value={formData.department}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="callControlGroup">Call control group:</label>
            <select
              name="callControlGroup"
              className="form-control"
              value={formData.callControlGroup}
              onChange={handleChange}
            >
              <option value="SPECIAL F">SPECIAL F</option>
              <option value="MIX 10">MIX 10</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="isDataEnabled">Data enabled:</label>
            <select
              name="isDataEnabled"
              className="form-control"
              value={formData.isDataEnabled ? "true" : "false"}
              onChange={handleChange}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="type">Type:</label>
            <select
              name="type"
              disabled
              className="form-control"
              value={simCard.type}
              onChange={handleChange}
            >
              <option value="Voice">Voice</option>
              <option value="Data">Data</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="status">Status:</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="In inventory">In inventory</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="mb-2">
            <label htmlFor="createdBy">Created by:</label>
            <input
              type="text"
              name="createdBy"
              disabled
              className="form-control"
              placeholder="Username"
              value={simCard.createdBy}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="createdBy">Created at:</label>
            <input
              type="text"
              name="createdBy"
              disabled
              className="form-control"
              placeholder="Username"
              value={new Date(simCard.modifiedAt).toLocaleString()}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="modifiedBy">Modified by:</label>
            <input
              type="text"
              name="modifiedBy"
              disabled
              className="form-control"
              placeholder="Username"
              value={simCard.modifiedBy}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="modifiedAt">Modified at:</label>
            <input
              type="text"
              name="modifiedAt"
              disabled
              className="form-control"
              placeholder="Username"
              value={new Date(simCard.modifiedAt).toLocaleString()}
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
  );
}
