import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";

function MobileOrdersTable() {
  const { user } = useAuth();

  const [data, setData] = useState<MobileOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

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
    <div className="flex flex-col items-center justify-center bg-neutral-100 px-4">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-800">
        Mobile Orders
      </h1>

      <div className="w-full max-w-6xl rounded-lg bg-white border border-neutral-200 shadow-md p-6">
        {/* Top controls */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Link
            to="/mobile-orders/create"
            className="
            rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white
            hover:bg-green-500 transition
          "
          >
            Create
          </Link>

          <div className="flex items-center gap-2">
            <label
              htmlFor="statusFilter"
              className="text-sm font-medium text-neutral-700"
            >
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="
              rounded-md border border-neutral-300 px-3 py-2 text-sm
              focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500
            "
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

        {/* Content */}
        {loading ? (
          <div className="py-6 text-center text-neutral-500">Loading...</div>
        ) : filteredData.length === 0 ? (
          <div className="py-6 text-center text-neutral-500">
            No mobile orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">List of mobile orders</caption>

              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                  <th className="px-3 py-2 font-medium text-neutral-700">ID</th>
                  <th className="px-3 py-2 font-medium text-neutral-700">
                    Customer Name
                  </th>
                  <th className="px-3 py-2 font-medium text-neutral-700">
                    Device Type
                  </th>
                  <th className="px-3 py-2 font-medium text-neutral-700">
                    Pickup Location
                  </th>
                  <th className="px-3 py-2 font-medium text-neutral-700">
                    Status
                  </th>
                  <th className="px-3 py-2 font-medium text-neutral-700">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((d) => (
                  <tr
                    key={d.id}
                    className="border-b border-neutral-100 even:bg-neutral-50 hover:bg-neutral-100 transition"
                  >
                    <td className="px-3 py-2">{d.id}</td>
                    <td className="px-3 py-2">{d.customer.displayName}</td>
                    <td className="px-3 py-2">{d.mobileDeviceCategory.name}</td>
                    <td className="px-3 py-2">{d.pickupLocation}</td>
                    <td className="px-3 py-2">{d.status}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/mobile-orders/${d.id}`}
                          className="
                          rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white
                          hover:bg-blue-500 transition
                        "
                        >
                          View
                        </Link>

                        {d.status !== "Delivered" && (
                          <button
                            onClick={() => handleDelete(d.id)}
                            className="
                            rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white
                            hover:bg-red-500 transition
                          "
                          >
                            Delete
                          </button>
                        )}
                      </div>
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
