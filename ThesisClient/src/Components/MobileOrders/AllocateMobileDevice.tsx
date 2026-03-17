import { FaMobile } from "react-icons/fa6";
import TableLayout from "../../Layouts/TableLayout";
import type { MobileDeviceResponse, MobileOrderResponse } from "../../Types/MobileTypes";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import Button from "../Shared/Button";
import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import { GetMobileDevicesForAllocation } from "../../Services/MobileDeviceServices";
import { toast } from "react-toastify";
import { AllocateMobileDeviceToOrder } from "../../Services/MobileOrderServices";
import Spinner from "../Shared/Spinner";

export default function AllocateMobileDevice({ order }: { order: MobileOrderResponse }) {
  const { user } = useAuth();
  const [devices, setDevices] = useState<MobileDeviceResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !user.token) return;
    if (!order || order.mobileDevice) return;

    setIsLoading(true);

    GetMobileDevicesForAllocation(order?.mobileDeviceCategory.id, user)
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });

    setIsLoading(false);
  }, [order, user]);

  const handleAllocateMobileDevice = async (deviceId: number) => {
    setIsLoading(true);
    try {
      await AllocateMobileDeviceToOrder({ orderId: Number(order.id), mobileDeviceId: deviceId });

      toast.success("Device allocated successfully!");

      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const filteredDevices = devices.filter((device) =>
    device.hostname.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <TableLayout title="Allocate mobile device" subtitle="Select a SIM card for this order">
      {devices.length === 0 ? (
        <EmptyState
          icon={<FaMobile />}
          title="There aren't mobile devices available"
          description=""
        />
      ) : (
        <Table>
          <Tr key="search">
            <Td>
              <input
                type="text"
                placeholder="Search by phone number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </Td>
          </Tr>
          {filteredDevices.map((mobile) => (
            <>
              <Tr key={mobile.hostname}>
                <Td>Hostname</Td>
                <Td>{mobile.hostname}</Td>
              </Tr>
              <Tr key={mobile.serialNumber}>
                <Td>Serial number</Td>
                <Td>{mobile.serialNumber}</Td>
              </Tr>
              <Tr key={mobile.id}>
                <Td>
                  <Button
                    color="green"
                    label="Allocate"
                    handleClick={() => handleAllocateMobileDevice(mobile.id)}
                  />
                </Td>
              </Tr>
            </>
          ))}
        </Table>
      )}
    </TableLayout>
  );
}
