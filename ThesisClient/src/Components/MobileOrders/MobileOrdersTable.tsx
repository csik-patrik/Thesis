import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MobileOrderResponse } from "../../Types/MobileOrderResponse";

function MobileOrdersTable() {
  const [data, setData] = useState<MobileOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("New");

  useEffect(() => {
    axios
      .get<MobileOrderResponse[]>("http://localhost:5268/mobile-orders")
      .then((res) => setData(res.data))
      .catch((err) => {
        toast.error("Failed to fetch mobile orders.");
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/mobile-orders/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mobile order deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile order:", err);
      toast.error("Failed to delete mobile order.");
    }
  };

  // Get unique statuses for the filter dropdown
  const statuses = Array.from(new Set(data.map((order) => order.status)));

  // Filter data by status
  const filteredData = statusFilter
    ? data.filter((order) => order.status === statusFilter)
    : data;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Mobile Orders</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link className="btn btn-success me-2" to="/mobile-orders/create">
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
              <option value="">All</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : filteredData.length === 0 ? (
          <div>No mobile orders found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <caption className="visually-hidden">
                List of mobile orders
              </caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Device Type</th>
                  <th scope="col">Pickup Location</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d) => (
                  <tr key={d.id}>
                    <td>{d.id}</td>
                    <td>{d.customer.displayName}</td>
                    <td>{d.mobileDeviceCategory.name}</td>
                    <td>{d.pickupLocation}</td>
                    <td>{d.status}</td>
                    <td>
                      <Link
                        to={`/mobile-orders/${d.id}`}
                        className="btn btn-primary btn-sm me-2 text-light"
                      >
                        View
                      </Link>
                      {d.status !== "Delivered" && (
                        <button
                          className="btn btn-danger btn-sm text-light"
                          onClick={() => handleDelete(d.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileOrdersTable;
