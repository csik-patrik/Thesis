import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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

export default function SimCardEdit() {
  const { id } = useParams<{ id: string }>(); // get ID from URL
  const [simCard, setSimCard] = useState<SimCard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get<SimCard>(
          `http://localhost:5268/api/sim-cards/${id}`
        );
        setSimCard(res.data);
      } catch (err) {
        console.error("Error fetching sim card:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (!simCard)
    return <p className="text-center text-danger mt-5">Sim card not found.</p>;

  return (
    <div className="container mt-5">
      <h2>Edit: {simCard.phoneNumber}</h2>
      <div className="card shadow p-4 mt-3">
        <p>
          <strong>Id:</strong> {simCard.id}
        </p>
        <p>
          <strong>Phone number:</strong> {simCard.phoneNumber}
        </p>
        <p>
          <strong>Department:</strong> {simCard.department}
        </p>
        <p>
          <strong>Call control group:</strong> {simCard.callControlGroup}
        </p>
        <p>
          <strong>Data enabled:</strong>{" "}
          {simCard.isDataEnabled ? "True" : "False"}
        </p>
        <p>
          <strong>Type:</strong> {simCard.type}
        </p>
        <p>
          <strong>Status:</strong> {simCard.status}
        </p>
        <p>
          <strong>Created By:</strong> {simCard.createdBy}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(simCard.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Modified By:</strong> {simCard.modifiedBy}
        </p>
        <p>
          <strong>Modified At:</strong>{" "}
          {new Date(simCard.modifiedAt).toLocaleString()}
        </p>
      </div>
      <div className="mt-3">
        <Link to="/sim-cards" className="btn btn-primary">
          Back
        </Link>
      </div>
    </div>
  );
}
