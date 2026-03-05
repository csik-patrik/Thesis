import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
<<<<<<< HEAD
import Spinner from "../Shared/Spinner";

// ── Status badge ──────────────────────────────────────────────────────────

const statusStyles: Record<string, string> = {
  Pending:   "bg-amber-50 text-amber-700 border border-amber-200",
  Approved:  "bg-blue-50 text-blue-700 border border-blue-200",
  Delivered: "bg-teal-50 text-teal-700 border border-teal-200",
  Rejected:  "bg-red-50 text-red-700 border border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  const cls = statusStyles[status] ?? "bg-gray-50 text-gray-600 border border-gray-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────
=======
import Table from "../Shared/Table";
import Spinner from "../Shared/Spinner";
import CustomLink from "../Shared/CustomLink";
import Button from "../Shared/Button";
>>>>>>> b5b8d170148db73a3d99658052c237c45d4b3a8f

export default function MyMobileOrdersTable() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<MobileOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    try {
      if (!user || !user.token) return;
      setIsLoading(true);
      axios
        .get<MobileOrderResponse[]>(
          "http://localhost:5268/mobile-orders/my-orders",
          { headers: { Authorization: `Bearer ${user.token}` } },
        )
        .then((res) => setOrders(res.data))
        .catch((err) => {
          toast.error("Failed to fetch mobile orders.");
          console.log(err);
        })
        .finally(() => setIsLoading(false));
    } catch (err) {
      console.error("Error loading mobile orders:", err);
      toast.error("Error loading mobile orders:");
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;
      await axios.delete(`http://localhost:5268/mobile-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setOrders((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mobile order deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile order:", err);
      toast.error("Failed to delete mobile order.");
    }
  };

  const statuses = Array.from(new Set(orders.map((o) => o.status)));
  const filteredData =
    statusFilter === "All"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

<<<<<<< HEAD
  if (isLoading) return <Spinner />;
=======
  if (isLoading) {
    return <Spinner />;
  }

  if (orders.length == 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">
          You haven't started an order yet!
        </h1>
        <CustomLink
          color="green"
          to="/mobile-orders/create"
          label="Create an order"
        />
      </div>
    );
  }
>>>>>>> b5b8d170148db73a3d99658052c237c45d4b3a8f

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Mobile Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your mobile device requests
            </p>
          </div>
          <Link
            to="/mobile-orders/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Order
          </Link>
        </div>

        {/* ── Empty state ── */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No orders yet</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              You haven't submitted any mobile device requests. Create your first one to get started.
            </p>
            <Link
              to="/mobile-orders/create"
              className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
            >
              Create your first order
            </Link>
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
                  <span className={`ml-1.5 text-xs ${statusFilter === s ? "text-teal-200" : "text-gray-400"}`}>
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
                      {["#", "Customer", "Device type", "Pickup location", "Status", "Actions"].map((h) => (
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
                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{d.id}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">{d.customer.displayName}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{d.mobileDeviceCategory.name}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600">{d.pickupLocation}</td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/mobile-orders/${d.id}`}
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
