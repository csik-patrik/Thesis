import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import StatusBadge from "../Shared/StatusBadge";
import { FaComputer } from "react-icons/fa6";

export default function ComputerOrdersTable() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<ComputerOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user?.token) return;

    setIsLoading(true);

    const fetchOrders = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse[]>(
          "http://localhost:5268/computer-orders",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );

        setOrders(res.data);
      } catch (err) {
        console.error("Error loading computer orders:", err);

        toast.error("Failed to load computer orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await axios.delete(`http://localhost:5268/api/computer-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setOrders((prev) => prev.filter((item) => item.id !== id));

      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);

      toast.error("Failed to delete computer order.");
    }
  };

  const statuses = Array.from(new Set(orders.map((order) => order.status)));
  const filteredData =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Computer Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage computer requests
            </p>
          </div>
        </div>
        {/* ── Empty state ── */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <FaComputer />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              You haven't submitted any computer requests. Create your first one
              to get started.
            </p>
          </div>
        ) : (
          <>
            {/* ── Status filter tabs ── */}
            <div className="flex flex-wrap gap-2 mb-5">
              {["All", ...statuses].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                    statusFilter === s
                      ? "bg-teal-600 text-white shadow-sm"
                      : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {s}
                  <span
                    className={`ml-1.5 text-xs ${statusFilter === s ? "text-teal-200" : "text-gray-400"}`}
                  >
                    {s === "All"
                      ? orders.length
                      : orders.filter((o) => o.status === s).length}
                  </span>
                </button>
              ))}
            </div>

            {/* ── Table card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {[
                        "Id",
                        "Customer",
                        "Device type",
                        "Pickup location",
                        "Status",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                          {d.id}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                          {d.customer.displayName}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">
                          {d.computerCategory.name}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">
                          {d.pickupLocation}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/computer-orders/${d.id}`}
                              className="text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
                            >
                              View
                            </Link>
                            {d.status !== "Delivered" && (
                              <button
                                onClick={() => handleDelete(d.id)}
                                className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
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

              {filteredData.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">
                  No orders match the selected filter.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
