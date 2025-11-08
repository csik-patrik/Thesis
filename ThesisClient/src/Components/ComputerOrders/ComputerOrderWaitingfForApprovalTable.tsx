import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputerOrderWaitingForApprovalTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse[]>(
          "http://localhost:5268/computer-orders/approval",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Error loading computer orders:", err);
        toast.error("Failed to load computer orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <h3>Loading your computer orders...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
        <h1 className="text-muted mb-3">
          💻 There aren't any orders waiting for approval
        </h1>
      </div>
    );
  }

  const statuses = Array.from(new Set(data.map((order) => order.status)));
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Computer orders waiting for approval</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <label htmlFor="statusFilter" className="me-2">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              className="form-select d-inline-block w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer Name</th>
                <th>Device Type</th>
                <th>Pickup Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.customer.displayName}</td>
                  <td>{d.computerCategory.name}</td>
                  <td>{d.pickupLocation}</td>
                  <td>{d.status}</td>
                  <td>
                    <Link
                      to={`/computer-orders/${d.id}`}
                      className="btn btn-primary btn-sm me-2 text-light"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
