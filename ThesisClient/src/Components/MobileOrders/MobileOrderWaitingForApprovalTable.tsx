import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import CustomLink from "../Shared/CustomLink";
import { GetMobileOrdersWaitingForApproval } from "../../Services/MobileOrderServices";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaMobile } from "react-icons/fa6";
import Table2 from "../Shared/Table/Table2";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import StatusBadge from "../Shared/StatusBadge";
import Td from "../Shared/Table/Td";
import Spinner from "../Shared/Spinner";

export default function MobileOrderWaitingForApprovalTable() {
  const { user } = useAuth();

  const [ordersApproved, setOrdersApproved] = useState<MobileOrderResponse[]>(
    [],
  );

  const [ordersWaitingForApproval, setOrdersWaitingForApproval] = useState<
    MobileOrderResponse[]
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await GetMobileOrdersWaitingForApproval(user);
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
        title="Mobile orders waiting for approval"
        subtitle="Mobile orders are waiting for your decision."
      >
        {ordersWaitingForApproval.length === 0 ? (
          <EmptyState
            icon={<FaMobile />}
            title="There aren't any orders waiting for your approval."
            description="If there are orders waiting for your approval you can see them below."
          />
        ) : (
          <Table2>
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
                  <Td>{order.mobileDeviceCategory.name}</Td>
                  <Td>{order.pickupLocation}</Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <CustomLink
                      color="blue"
                      to={`/mobile-orders/${order.id}`}
                      label="View"
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table2>
        )}
      </TableLayout>

      <TableLayout
        title="Approved mobile order"
        subtitle="Mobile orders which you already approved."
      >
        {ordersWaitingForApproval.length === 0 ? (
          <EmptyState
            icon={<FaMobile />}
            title="There aren't any approved orders yet."
            description="If you made a decision about an order before, then you can see it below."
          />
        ) : (
          <Table2>
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
                  <Td>{order.mobileDeviceCategory.name}</Td>
                  <Td>{order.pickupLocation}</Td>
                  <Td>
                    <StatusBadge status={order.status} />
                  </Td>
                  <Td>
                    <CustomLink
                      color="blue"
                      to={`/mobile-orders/${order.id}`}
                      label="View"
                    />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table2>
        )}
      </TableLayout>
    </div>
  );
}
