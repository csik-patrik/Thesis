import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import StatusBadge from "../Shared/StatusBadge";
import { FaComputer } from "react-icons/fa6";
import { DeleteComputerOrder, GetComputerOrders } from "../../Services/ComputerOrderServices";
import TableLayout from "../../Layouts/TableLayout";
import CustomLink2 from "../Shared/CustomLink2";
import EmptyState from "../Shared/Table/EmptyState";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

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
        const res = await GetComputerOrders(user);

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

      await DeleteComputerOrder(id, user);

      setOrders((prev) => prev.filter((item) => item.id !== id));

      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);

      toast.error("Failed to delete computer order.");
    }
  };

  const statuses = Array.from(new Set(orders.map((order) => order.status)));
  const filteredData =
    statusFilter === "All" ? orders : orders.filter((order) => order.status === statusFilter);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <TableLayout title="Computer Orders" subtitle="Track and manage computer requests">
      {orders.length === 0 ? (
        <EmptyState
          icon={<FaComputer />}
          title="No orders yet"
          description="You haven't submitted any mobile device requests. Create your
                first one to get started."
          action={<CustomLink2 to="/computer-orders/create" label="Create your first order" />}
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
              headers={["Id", "Customer", "Device type", "Pickup location", "Status", "Actions"]}
            />
            <tbody>
              {filteredData.map((d) => (
                <Tr key={d.id}>
                  <Td>{d.id}</Td>
                  <Td>{d.customer.displayName}</Td>
                  <Td>{d.computerCategory.name}</Td>
                  <Td>{d.pickupLocation}</Td>
                  <Td>
                    <StatusBadge status={d.status} />
                  </Td>
                  <Td>
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
