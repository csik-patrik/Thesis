import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function MyComputerOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse[]>(
          "http://localhost:5268/computer-orders/my-orders",
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

  const handleDelete = async (id: number) => {
    if (!user?.token) return;

    try {
      await axios.delete(`http://localhost:5268/computer-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);
      toast.error("Failed to delete computer order.");
    }
  };

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
        <h1 className="text-muted mb-3">💻 No computer orders found</h1>
        <p className="text-secondary">
          It looks like you don't have any computer orders yet.
        </p>
        <Link to="/computer-orders/create" className="btn btn-success mt-3">
          Create a new computer order
        </Link>
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
      <h1>My Computer Orders</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link className="btn btn-success me-2" to="/computer-orders/create">
            Create
          </Link>
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
              <option value="All">All</option>
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
                    {d.status !== "Delivered" &&
                      d.status !== "Rejected by group leader" && (
                        <button
                          className="btn btn-danger btn-sm text-light"
                          onClick={() => handleDelete(d.id)}
                        >
                          Cancel
                        </button>
                      )}
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
