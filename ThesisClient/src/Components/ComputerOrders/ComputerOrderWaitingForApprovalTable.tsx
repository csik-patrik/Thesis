import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import CustomLink from "../Shared/CustomLink";
import { GetComputerOrdersWaitingForApproval } from "../../Services/ComputerOrderServices";
import Spinner from "../Shared/Spinner";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaComputer } from "react-icons/fa6";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";

export default function ComputerOrderWaitingForApprovalTable() {
  const { user } = useAuth();
  const [ordersApproved, setOrdersApproved] = useState<ComputerOrderResponse[]>(
    [],
  );
  const [ordersWaitingForApproval, setOrdersWaitingForApproval] = useState<
    ComputerOrderResponse[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await GetComputerOrdersWaitingForApproval(user);
        setOrdersApproved(
          res.data.filter((order) => order.status != "Waiting for approval"),
        );
        setOrdersWaitingForApproval(
          res.data.filter((order) => order.status == "Waiting for approval"),
        );
      } catch (err) {
        console.error("Error loading computer orders:", err);
        toast.error("Failed to load computer orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-row w-full justify-center">
      <TableLayout
        title="Computer orders waiting for approval"
        subtitle="Computer orders are waiting for your decision."
      >
        {ordersWaitingForApproval.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="There aren't any orders waiting for your approval."
            description="If there are orders waiting for your approval you can see them below."
          />
        ) : (
          <Table>
            <Thead
              headers={[
                "Id",
                "Customer name",
                "Device type",
                "Pickup location",
                "Status",
                "Actions",
              ]}
            />
            <tbody>
              {ordersWaitingForApproval.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.customer.displayName}</Td>
                  <Td>{order.computerCategory.name}</Td>
                  <Td>{order.pickupLocation}</Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <CustomLink
                      color="blue"
                      to={`/computer-orders/${order.id}`}
                      label="View"
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableLayout>

      <TableLayout
        title="Approved computer orders"
        subtitle="Computer orders which you already approved."
      >
        {ordersWaitingForApproval.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="There aren't any approved orders yet."
            description="If you made a decision about an order before, then you can see it below."
          />
        ) : (
          <Table>
            <Thead
              headers={[
                "Id",
                "Customer name",
                "Device type",
                "Pickup location",
                "Status",
                "Actions",
              ]}
            />
            <tbody>
              {ordersApproved.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.id}</Td>
                  <Td>{order.customer.displayName}</Td>
                  <Td>{order.computerCategory.name}</Td>
                  <Td>{order.pickupLocation}</Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <CustomLink
                      color="blue"
                      to={`/computer-orders/${order.id}`}
                      label="View"
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </TableLayout>
    </div>
  );
}
