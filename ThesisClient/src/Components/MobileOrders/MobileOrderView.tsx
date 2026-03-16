import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";

import type {
  MobileOrderResponse,
  MobileDeviceResponse,
  SimCardResponse,
} from "../../Types/MobileTypes";
import {
  AllocateMobileDeviceToOrder,
  AllocateSimCardToOrder,
  DeliverOrder,
  GetOrderById,
  MakeDecisionAsApprover,
} from "../../Services/MobileOrderServices";
import { GetMobileDevicesForAllocation } from "../../Services/MobileDeviceServices";
import { GetSimCardsForAllocation } from "../../Services/SimCardServices";
import TableLayout from "../../Layouts/TableLayout";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";
import Button from "../Shared/Button";
import AllocateSimCard from "./AllocateSimCard";
import Table from "../Shared/Table/Table";

export default function MobileOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MobileOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<MobileDeviceResponse[]>([]);
  const [allocating, setAllocating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [simCards, setSimCards] = useState<SimCardResponse[]>([]);
  const [allocatingSim, setAllocatingSim] = useState<number | null>(null);
  const [simSearch, setSimSearch] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchOrder = async () => {
      try {
        const res = await GetOrderById(Number(id), user);
        setOrder(res.data);
      } catch (err) {
        toast.error("Error fetching mobile orders.");
        console.error("Error fetching mobile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  useEffect(() => {
    if (!user || !user.token) return;
    if (!order || order.mobileDevice) return;

    GetMobileDevicesForAllocation(order?.mobileDeviceCategory.id, user)
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });
  }, [order, user]);

  // Only fetch allocable sim cards if a device is allocated and no sim card is allocated
  useEffect(() => {
    if (!user || !user.token) return;
    if (!order || !order.mobileDevice || order.mobileDevice.simCard) return;

    GetSimCardsForAllocation(order.simCallControlGroup.id, user)
      .then((res) => setSimCards(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable sim cards.");
        console.error("Error fetching allocable sim cards:", err);
      });
  }, [order, user]);

  const handleAllocateMobileDevice = async (deviceId: number) => {
    setAllocating(deviceId);
    try {
      await AllocateMobileDeviceToOrder({ orderId: Number(id), mobileDeviceId: deviceId });

      toast.success("Device allocated successfully!");

      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    }
  };

  const handleAllocateSim = async (simCardId: number) => {
    setAllocatingSim(simCardId);
    try {
      await AllocateSimCardToOrder({ orderId: Number(id), simCardId: simCardId });

      toast.success("Sim card allocated successfully!");

      setSimCards((prev) => prev.filter((s) => s.id !== simCardId));
    } catch (err) {
      toast.error("Failed to allocate sim card.");
      console.error("Sim allocation error:", err);
    } finally {
      setAllocatingSim(null);
    }
  };

  const handleDeliver = async () => {
    try {
      await DeliverOrder(Number(id));

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

  // Filter devices by hostname
  const filteredDevices = devices.filter((device) =>
    device.hostname.toLowerCase().includes(search.toLowerCase()),
  );

  // Filter sim cards by phone number
  const filteredSimCards = simCards.filter((sim) =>
    sim.phoneNumber.toLowerCase().includes(simSearch.toLowerCase()),
  );

  if (loading) return <Spinner />;

  if (!order) return <p className="text-center mt-10 text-red-600 font-medium">Order not found.</p>;

  const isOrderReadyForDelivery =
    order.mobileDevice &&
    user?.roles.includes("Admin") &&
    order.mobileDevice.simCard &&
    order.status !== "Delivered";

  const isOrderReadyForSimAllocation = user?.roles.includes("Admin") && order.status == "Approved";

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
          {isOrderReadyForDelivery && (
            <Tr key="deliver">
              <Td>
                <Button color="green" label="Deliver Device" handleClick={handleDeliver} />
              </Td>
            </Tr>
          )}
        </Table>
      </TableLayout>

      {isOrderReadyForSimAllocation && (
        <AllocateSimCard simCards={simCards} setSimSearch={setSimSearch} simSearch={simSearch} />
      )}
    </div>
  );
}

//         {/* Device / Sim Allocation Section */}
//         {user?.roles.includes("Admin") && (
//           <div className="md:w-80 shrink-0 space-y-6">
//             {/* Allocated Device */}
//             {order.mobileDevice ? (
//               <>
//                 <h2 className="text-lg font-semibold text-neutral-800">Allocated Device</h2>
//                 <div className="rounded-lg bg-white p-4 shadow">
//                   <ul className="space-y-2">
//                     <li>
//                       <strong>Hostname:</strong> {order.mobileDevice.hostname}
//                     </li>
//                     <li>
//                       <strong>Category:</strong> {order.mobileDevice.mobileDeviceCategory.name}
//                     </li>
//                     <li>
//                       <strong>IMEI:</strong> {order.mobileDevice.imeiNumber}
//                     </li>
//                     <li>
//                       <strong>Serial:</strong> {order.mobileDevice.serialNumber}
//                     </li>
//                   </ul>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h2 className="text-lg font-semibold text-neutral-800">Allocate Device</h2>
//                 <input
//                   type="text"
//                   placeholder="Search by hostname..."
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
//                 />
//                 <div className="rounded-lg bg-white p-3 shadow space-y-2">
//                   {filteredDevices.length === 0 ? (
//                     <p className="text-neutral-500">No devices available for allocation.</p>
//                   ) : (
//                     <ul className="space-y-2">
//                       {filteredDevices.map((device) => (
//                         <li
//                           key={device.id}
//                           className="flex flex-col rounded border border-neutral-200 p-2"
//                         >
//                           <strong>{device.hostname}</strong>
//                           <span>Category: {device.mobileDeviceCategory.name}</span>
//                           <span>IMEI: {device.imeiNumber}</span>
//                           <span>Serial: {device.serialNumber}</span>
//                           <span>Status: {device.status}</span>
//                           <button
//                             disabled={allocating === device.id}
//                             onClick={() => handleAllocateMobileDevice(device.id)}
//                             className="
//                             mt-2 self-end rounded-md bg-green-600 px-3 py-1 text-white text-sm
//                             hover:bg-green-500 transition disabled:opacity-60 disabled:cursor-not-allowed
//                           "
//                           >
//                             {allocating === device.id ? "Allocating..." : "Allocate"}
//                           </button>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </div>
//               </>
//             )}

//             {/* Allocated Sim Card */}
//             {order.mobileDevice &&
//               (order.mobileDevice.simCard ? (
//                 <>
//                   <h2 className="text-lg font-semibold text-neutral-800 mt-4">
//                     Allocated Sim Card
//                   </h2>
//                   <div className="rounded-lg bg-white p-4 shadow space-y-2">
//                     <ul className="space-y-1">
//                       <li>
//                         <strong>Phone Number:</strong> {order.mobileDevice.simCard.phoneNumber}
//                       </li>
//                       <li>
//                         <strong>Call Control Group:</strong>{" "}
//                         {order.mobileDevice.simCard.simCallControlGroup.name}
//                       </li>
//                       <li>
//                         <strong>Data Enabled:</strong>{" "}
//                         {order.mobileDevice.simCard.simCallControlGroup.isDataEnabled
//                           ? "Yes"
//                           : "No"}
//                       </li>
//                     </ul>
//                   </div>
//                 </>
//               ) : (
//                 <>
//
//                 </>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
