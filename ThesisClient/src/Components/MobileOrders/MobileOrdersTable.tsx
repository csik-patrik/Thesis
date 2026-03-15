import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import { Link } from "react-router-dom";
import StatusBadge from "../Shared/StatusBadge";
import {
  DeleteMobileOrder,
  FetchMobileOrders,
} from "../../Services/MobileOrderServices";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaMobile } from "react-icons/fa6";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function MobileOrdersTable() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<MobileOrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchOrders = async () => {
      try {
        const res = await FetchMobileOrders(user);

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

  const statuses = Array.from(new Set(orders.map((order) => order.status)));
  const filteredData =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <TableLayout
      title="Mobile Orders"
      subtitle="Track and manage mobile device requests"
    >
      {orders.length === 0 ? (
        <EmptyState
          icon={<FaMobile />}
          title="No orders yet"
          description="There aren't any orders in the database yet!"
        />
      ) : (
        <>
          <FilterTabs
            statuses={statuses}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            orders={orders}
          />
          <Table>
            <Thead
              headers={[
                "Id",
                "Customer",
                "Device type",
                "Pickup location",
                "Status",
                "Actions",
              ]}
            ></Thead>
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
          </Table>
        </>
      )}
    </TableLayout>
  );
}
