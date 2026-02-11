import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";

export default function MyMobileOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<MobileOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    try {
      if (!user || !user.token) return;

      axios
        .get<MobileOrderResponse[]>(
          "http://localhost:5268/mobile-orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => setData(res.data))
        .catch((err) => {
          toast.error("Failed to fetch mobile orders.");
          console.log(err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Error loading mobile orders:", err);
      toast.error("Error loading mobile orders:");
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await axios.delete(`http://localhost:5268/mobile-orders/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

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
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Orders</h1>

      <div className="w-full max-w-5xl bg-white border rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <Link
            to="/mobile-orders/create"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-2 md:mb-0"
          >
            Create
          </Link>

          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
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

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-4">No mobile orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <caption className="sr-only">List of mobile orders</caption>
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-4 py-2 text-left">ID</th>
                  <th className="border px-4 py-2 text-left">Customer Name</th>
                  <th className="border px-4 py-2 text-left">Device Type</th>
                  <th className="border px-4 py-2 text-left">
                    Pickup Location
                  </th>
                  <th className="border px-4 py-2 text-left">Status</th>
                  <th className="border px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((d) => (
                  <tr key={d.id} className="even:bg-gray-50">
                    <td className="border px-4 py-2">{d.id}</td>
                    <td className="border px-4 py-2">
                      {d.customer.displayName}
                    </td>
                    <td className="border px-4 py-2">
                      {d.mobileDeviceCategory.name}
                    </td>
                    <td className="border px-4 py-2">{d.pickupLocation}</td>
                    <td className="border px-4 py-2">{d.status}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <Link
                        to={`/mobile-orders/${d.id}`}
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View
                      </Link>
                      {d.status !== "Delivered" && (
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
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
