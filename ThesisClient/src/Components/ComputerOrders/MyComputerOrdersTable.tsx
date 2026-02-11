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
          },
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
      <div className="flex items-center justify-center bg-gray-100">
        <h3 className="text-lg font-medium">Loading your computer orders...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 text-center p-4">
        <h1 className="text-3xl text-gray-400 mb-3">
          💻 No computer orders found
        </h1>
        <p className="text-gray-500 mb-4">
          It looks like you don't have any computer orders yet.
        </p>
        <Link
          to="/computer-orders/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
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
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Computer Orders</h1>

      <div className="w-full max-w-5xl bg-white border rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <Link
            to="/computer-orders/create"
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

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">ID</th>
                <th className="border px-4 py-2 text-left">Customer Name</th>
                <th className="border px-4 py-2 text-left">Device Type</th>
                <th className="border px-4 py-2 text-left">Pickup Location</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{d.id}</td>
                  <td className="border px-4 py-2">{d.customer.displayName}</td>
                  <td className="border px-4 py-2">
                    {d.computerCategory.name}
                  </td>
                  <td className="border px-4 py-2">{d.pickupLocation}</td>
                  <td className="border px-4 py-2">{d.status}</td>
                  <td className="border px-4 py-2 flex space-x-2">
                    <Link
                      to={`/computer-orders/${d.id}`}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      View
                    </Link>
                    {d.status !== "Delivered" &&
                      d.status !== "Rejected by group leader" && (
                        <button
                          className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
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
