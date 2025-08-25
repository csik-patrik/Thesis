import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

interface CreateSimCardRequest {
  phoneNumber: string;
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  type: string;
  createdBy: string;
}

function SimCardsCreate() {
  const [formData, setFormData] = useState<CreateSimCardRequest>({
    phoneNumber: "",
    department: "",
    callControlGroup: "",
    isDataEnabled: false,
    type: "Voice",
    createdBy: "",
  });

  const navigate = useNavigate();

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
      await axios.post("http://localhost:5268/api/sim-cards", formData);
      navigate("/sim-cards");
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
          <h1>Create a new Sim Card</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label htmlFor="phoneNumber">Phone number:</label>
              <input
                type="text"
                name="phoneNumber"
                className="form-control"
                placeholder="+36208288073"
                value={formData.phoneNumber}
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
                className="form-control"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Voice">Voice</option>
                <option value="Data">Data</option>
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

export default SimCardsCreate;
