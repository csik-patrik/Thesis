import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import Table from "../Shared/Table";
import CustomLink from "../Shared/CustomLink";
import { GetMobileOrdersWaitingForApproval } from "../../Services/MobileOrderServices";

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
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <h3>Loading your mobile orders...</h3>
      </div>
    );
  }

  if (ordersApproved.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
        <h1 className="text-muted mb-3">
          💻 There aren't any orders waiting for approval
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {ordersWaitingForApproval.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mb-6">
            Mobile orders waiting for approval
          </h1>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <Table
              headerItems={[
                "Id",
                "Customer name",
                "Device type",
                "Pickup location",
                "Status",
                "Actions",
              ]}
            >
              {ordersWaitingForApproval.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{d.id}</td>
                  <td className="px-4 py-2">{d.customer.displayName}</td>
                  <td className="px-4 py-2">{d.mobileDeviceCategory.name}</td>
                  <td className="px-4 py-2">{d.pickupLocation}</td>
                  <td className="px-4 py-2">{d.status}</td>
                  <td className="px-4 py-2">
                    <CustomLink
                      color="blue"
                      to={`/mobile-orders/${d.id}`}
                      label="View"
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </>
      ) : (
        <h1 className="text-3xl font-bold mb-6">
          There aren't any orders waiting for approval
        </h1>
      )}
      <div className="mt-10" />
      {ordersApproved.length > 0 ? (
        <>
          <h1 className="text-3xl font-bold mb-6">Approved mobile orders</h1>
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <Table
              headerItems={[
                "Id",
                "Customer name",
                "Device type",
                "Pickup location",
                "Status",
                "Actions",
              ]}
            >
              {ordersApproved.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{d.id}</td>
                  <td className="px-4 py-2">{d.customer.displayName}</td>
                  <td className="px-4 py-2">{d.mobileDeviceCategory.name}</td>
                  <td className="px-4 py-2">{d.pickupLocation}</td>
                  <td className="px-4 py-2">{d.status}</td>
                  <td className="px-4 py-2">
                    <CustomLink
                      color="blue"
                      to={`/mobile-orders/${d.id}`}
                      label="View"
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </>
      ) : (
        <h1 className="text-3xl font-bold mb-6">
          There aren't any approved orders
        </h1>
      )}
    </div>
  );
}
