import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import {
  DeliverComputerOrder,
  GetComputerOrderById,
  MakeDecisionAsApprover,
} from "../../Services/ComputerOrderServices";
import Spinner from "../Shared/Spinner";
import TableLayout from "../../Layouts/TableLayout";
import Table from "../Shared/Table/Table";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";
import Button from "../Shared/Button";
import AllocateComputer from "./AllocateComputer";

export default function ComputerOrderView() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  const [order, setOrder] = useState<ComputerOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchOrder = async () => {
      try {
        const res = await GetComputerOrderById(Number(id), user);
        setOrder(res.data);
      } catch (err) {
        toast.error("Error fetching mobile orders.");

        console.error("Error fetching mobile orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const handleDeliver = async () => {
    try {
      if (!user || !user.token) return;
      if (!id) return;

      await DeliverComputerOrder(Number(id), user);

      const res = await GetComputerOrderById(Number(id), user);
      setOrder(res.data);

      toast.success("Order marked as delivered!");
    } catch (err) {
      toast.error("Failed to deliver device.");

      console.error("Delivery error:", err);
    }
  };

  const handleDecision = async (id: number, decision: boolean) => {
    if (!user || !user.token) return;

    try {
      await MakeDecisionAsApprover(id, decision, user);

      const res = await GetComputerOrderById(Number(id), user);

      setOrder(res.data);

      toast.success(
        `Order ${decision ? "approved" : "rejected"} successfully!`,
      );
    } catch (err: any) {
      toast.error("Failed to update computer order.");

      console.log(err);
    }
  };

  if (isLoading) return <Spinner fullPage />;

  if (!order)
    return (
      <p className="text-center mt-10 text-red-600 font-medium">
        Order not found.
      </p>
    );

  const isDeliveryButtonVisible =
    order.computer &&
    user?.roles.includes("Admin") &&
    order.status !== "Delivered";

  const isComputerAllocationVisible =
    user?.roles.includes("Admin") &&
    order.status == "Approved" &&
    !order.computer;

  return (
    <div className="flex flex-row w-full justify-center">
      <TableLayout title="Computer order details" subtitle="View order details">
        <Table>
          <Tr key={order.id}>
            <Td>Order Id:</Td>
            <Td>{order.id}</Td>
          </Tr>
          <Tr key={order.customer.userName}>
            <Td>Customer's username:</Td>
            <Td>{order.customer.userName}</Td>
          </Tr>
          <Tr key={order.customer.displayName}>
            <Td>Customer's displayName:</Td>
            <Td>{order.customer.displayName}</Td>
          </Tr>
          <Tr key={order.customer.email}>
            <Td>Customer's e-mail address:</Td>
            <Td>{order.customer.email}</Td>
          </Tr>
          <Tr key={order.customer.costCenter}>
            <Td>Customer's cost center:</Td>
            <Td>{order.customer.costCenter}</Td>
          </Tr>
          <Tr key={order.computerCategory.name}>
            <Td>Requested computer category:</Td>
            <Td>{order.computerCategory.name}</Td>
          </Tr>
          <Tr key={order.pickupLocation}>
            <Td>Requested pickup location:</Td>
            <Td>{order.pickupLocation}</Td>
          </Tr>
          <Tr key={order.note}>
            <Td>Notes from the customer:</Td>
            <Td>{order.note}</Td>
          </Tr>
          <Tr key={order.approver.displayName}>
            <Td>Approver:</Td>
            <Td>
              {order.approver.displayName} ({order.approver.department})
            </Td>
          </Tr>
          <Tr key={order.status}>
            <Td>Order status:</Td>
            <Td>
              <StatusBadge status={order.status} />
            </Td>
          </Tr>

          {order.status === "Waiting for approval" && (
            <Tr key="approve">
              <Td>
                <div className="flex gap-2">
                  <Button
                    color="green"
                    label="Approve"
                    handleClick={() => handleDecision(order.id, true)}
                  />
                  <Button
                    color="red"
                    label="Reject"
                    handleClick={() => handleDecision(order.id, false)}
                  />
                </div>
              </Td>
            </Tr>
          )}

          {isDeliveryButtonVisible && (
            <Tr key="deliver">
              <Td colSpan={2}>
                <Button
                  color="green"
                  label="Deliver Device"
                  handleClick={handleDeliver}
                />
              </Td>
            </Tr>
          )}
        </Table>
      </TableLayout>

      {isComputerAllocationVisible && <AllocateComputer order={order} />}
    </div>
  );
}
