import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import StatusBadge from "../Shared/StatusBadge";
import CustomLink2 from "../Shared/CustomLink2";
import {
  DeleteMobileOrder,
  FetchMyMobileOrders,
} from "../../Services/MobileOrderServices";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import Thead from "../Shared/Table/Thead";
import Table2 from "../Shared/Table/Table2";
import FilterTabs from "../Shared/Table/FilterTabs";

export default function MyMobileOrdersTable() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<MobileOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchOrders = async () => {
      try {
        const res = await FetchMyMobileOrders(user);
        setOrders(res.data);
      } catch (err) {
        console.error("Error loading mobile orders:", err);
        toast.error("Failed to load mobile orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await DeleteMobileOrder(id, user);

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

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Mobile Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your mobile device requests
            </p>
          </div>
          <CustomLink2 to="/mobile-orders/create" label="New order" />
        </div>
        {/* ── Empty state ── */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No orders yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              You haven't submitted any mobile device requests. Create your
              first one to get started.
            </p>
            <CustomLink2
              to="/mobile-orders/create"
              label="Create your first order"
            />
          </div>
        ) : (
          <>
            <FilterTabs
              statuses={statuses}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              orders={orders}
            />
            <Table2>
              <Thead
                headers={[
                  "Id",
                  "Customer",
                  "Device type",
                  "Pickup location",
                  "Status",
                  "Actions",
                ]}
              />
              <tbody>
                {filteredData.map((d) => (
                  <Tr key={d.id}>
                    <Td>{d.id}</Td>
                    <Td>{d.customer.displayName}</Td>
                    <Td>{d.mobileDeviceCategory.name}</Td>
                    <Td>{d.pickupLocation}</Td>
                    <Td>
                      <StatusBadge status={d.status} />
                    </Td>
                    <Td>
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
                    </Td>
                  </Tr>
                ))}
                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No orders match the selected filter.
                  </div>
                )}
              </tbody>
            </Table2>
          </>
        )}
      </div>
    </div>
  );
}
