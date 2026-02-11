import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputerOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    try {
      if (!user || !user.token) return;

      axios
        .get<ComputerOrderResponse[]>("http://localhost:5268/computer-orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setData(res.data))
        .catch((err) => {
          toast.error("Failed to fetch computer orders.");
          console.log(err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Error loading computer orders:", err);
      toast.error("Failed to load computer orders.");
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await axios.delete(`http://localhost:5268/api/computer-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setData((prev) => prev.filter((item) => item.id !== id));

      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);

      toast.error("Failed to delete computer order.");
    }
  };

  // Get unique statuses for the filter dropdown
  const statuses = Array.from(new Set(data.map((order) => order.status)));

  // Filter data by status
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-100 text-center px-4">
        <h1 className="text-gray-400 text-2xl mb-3">
          💻 No computer orders found
        </h1>
        <p className="text-gray-500 mb-4">
          It looks like you don't have any computer orders yet.
        </p>
        <Link
          to="/computer-orders/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
        >
          Create a new computer order
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 px-4 py-6">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
        Computer Orders
      </h1>

      <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-lg shadow p-6">
        {/* Top controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <Link
            to="/computer-orders/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
          >
            Create
          </Link>

          <div className="flex items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="text-neutral-700 font-medium"
            >
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-400"
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

        {/* Table */}
        {loading ? (
          <p className="text-center text-neutral-500 mt-4">Loading...</p>
        ) : filteredData.length === 0 ? (
          <p className="text-center text-neutral-500 mt-4">
            No computer orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
              <caption className="sr-only">List of computer orders</caption>
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "ID",
                    "Customer Name",
                    "Device Type",
                    "Pickup Location",
                    "Status",
                    "Actions",
                  ].map((th) => (
                    <th
                      key={th}
                      scope="col"
                      className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                    >
                      {th}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((d) => (
                  <tr key={d.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">{d.id}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {d.customer.displayName}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {d.computerCategory.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {d.pickupLocation}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {d.status}
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <Link
                        to={`/computer-orders/${d.id}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-500 transition"
                      >
                        View
                      </Link>
                      {d.status !== "Delivered" && (
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-500 transition"
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
