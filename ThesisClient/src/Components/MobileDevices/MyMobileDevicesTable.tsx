import { useEffect, useState } from "react";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import { GetMyMobileDevices } from "../../Services/MobileDeviceServices";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaMobile } from "react-icons/fa6";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";
import Spinner from "../Shared/Spinner";

export default function MyMobileDeviceTable() {
  const { user } = useAuth();

  const [mobileDevices, setMobileDevices] = useState<MobileDeviceResponse[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetMyMobileDevices(user);
        setMobileDevices(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const categories = Array.from(
    new Set(mobileDevices.map((device) => device.mobileDeviceCategory.name)),
  );
  const statuses = Array.from(
    new Set(mobileDevices.map((device) => device.status)),
  );
  const statusReasons = Array.from(
    new Set(mobileDevices.map((device) => device.statusReason)),
  );

  const filteredData = mobileDevices.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory.name === categoryFilter
      : true;
    const statusMatch = statusFilter ? device.status === statusFilter : true;
    const reasonMatch = statusReasonFilter
      ? device.statusReason === statusReasonFilter
      : true;
    return categoryMatch && statusMatch && reasonMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <TableLayout
      title="My Mobile Devices"
      subtitle="Manage your mobile devices"
    >
      {mobileDevices.length === 0 ? (
        <EmptyState
          icon={<FaMobile />}
          title="No mobile devices yet"
          description="You don't have any mobile device yet!"
        />
      ) : (
        <>
          <FilterTabs
            statuses={categories}
            statusFilter={categoryFilter}
            setStatusFilter={setCategoryFilter}
            orders={mobileDevices}
          />
          <FilterTabs
            statuses={statuses}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            orders={mobileDevices}
          />
          <FilterTabs
            statuses={statusReasons}
            statusFilter={statusReasonFilter}
            setStatusFilter={setStatusReasonFilter}
            orders={mobileDevices}
          />
          <Table>
            <Thead
              headers={[
                "Id",
                "Hostname",
                "Category",
                "Imei number",
                "Serial number",
                "Status",
                "Status reason",
              ]}
            ></Thead>
            <tbody>
              {filteredData.map((mobile) => (
                <Tr key={mobile.id}>
                  <Td>{mobile.id}</Td>
                  <Td>{mobile.hostname}</Td>
                  <Td>{mobile.mobileDeviceCategory.name}</Td>
                  <Td>{mobile.imeiNumber}</Td>
                  <Td>{mobile.serialNumber}</Td>
                  <Td>
                    <StatusBadge status={mobile.status} />
                  </Td>
                  <Td>
                    <StatusBadge status={mobile.statusReason} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </TableLayout>
  );
}
