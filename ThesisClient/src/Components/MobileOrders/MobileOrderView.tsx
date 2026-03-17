import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";

import type { MobileOrderResponse } from "../../Types/MobileTypes";
import {
  DeliverOrder,
  GetOrderById,
  MakeDecisionAsApprover,
} from "../../Services/MobileOrderServices";
import TableLayout from "../../Layouts/TableLayout";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";
import Button from "../Shared/Button";
import AllocateSimCard from "./AllocateSimCard";
import Table from "../Shared/Table/Table";
import AllocateMobileDevice from "./AllocateMobileDevice";

export default function MobileOrderView() {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MobileOrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchOrder = async () => {
      try {
        const res = await GetOrderById(Number(id), user);
        setOrder(res.data);
      } catch (err) {
        console.error("Error loading mobile orders:", err);
        toast.error("Failed to load mobile orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  const handleDeliver = async () => {
    try {
      if (user == null) return;
      await DeliverOrder(Number(id), user);

      toast.success("Order marked as delivered!");
    } catch (err) {
      toast.error("Failed to deliver device.");
      console.error("Delivery error:", err);
    }
  };

  const handleDecision = async (id: number, decision: boolean) => {
    if (!user?.token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      await MakeDecisionAsApprover({ orderId: Number(id), decision: decision }, user);

      toast.success(`Order ${decision ? "approved" : "rejected"} successfully!`);
    } catch (err: any) {
      console.error("Error updating computer order:", err);

      const message = err.response?.data?.message || "Failed to update computer order.";
      toast.error(message);
    }
  };

  if (isLoading) return <Spinner />;

  if (!order) return <p className="text-center mt-10 text-red-600 font-medium">Order not found.</p>;

  const isDeliveryButtonVisible =
    order.mobileDevice &&
    user?.roles.includes("Admin") &&
    order.mobileDevice.simCard &&
    order.status !== "Delivered";

  const isMobileAllocationVisible =
    user?.roles.includes("Admin") && order.status == "Approved" && !order.mobileDevice;

  const isSimAllocationVisible =
    user?.roles.includes("Admin") && order.mobileDevice && !order.mobileDevice.simCard;

  return (
    <div className="flex flex-row w-full justify-center">
      <TableLayout title="Mobile order details" subtitle="View order details">
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
          <Tr key={order.mobileDeviceCategory.name}>
            <Td>Requested mobile device category:</Td>
            <Td>{order.mobileDeviceCategory.name}</Td>
          </Tr>
          <Tr key={order.simCallControlGroup.name}>
            <Td>Requested call control group:</Td>
            <Td>{order.simCallControlGroup.name}</Td>
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
              <Td>
                <Button color="green" label="Deliver Device" handleClick={handleDeliver} />
              </Td>
            </Tr>
          )}
        </Table>
      </TableLayout>

      {isMobileAllocationVisible && <AllocateMobileDevice order={order} />}

      {isSimAllocationVisible && <AllocateSimCard order={order} />}
    </div>
  );
}
