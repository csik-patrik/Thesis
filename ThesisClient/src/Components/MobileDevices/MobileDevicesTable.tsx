import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import {
  DeleteMobileDevice,
  GetMobileDevices,
} from "../../Services/MobileServices";
import Spinner from "../Shared/Spinner";
import CustomLink2 from "../Shared/CustomLink2";
import StatusBadge from "../Shared/StatusBadge";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaMobile } from "react-icons/fa6";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table2 from "../Shared/Table/Table2";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function MobileDevicesTable() {
  const { user } = useAuth();
  const [mobileDevices, setMobileDevices] = useState<MobileDeviceResponse[]>(
    [],
  );
  const [selectedMobileDeviceId, setSelectedMobileDeviceId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetMobileDevices(user);
        setMobileDevices(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!user || !user.token) return;

    try {
      await DeleteMobileDevice(id, user);

      setMobileDevices((prev) => prev.filter((item) => item.id !== id));

      toast.success("Mobile deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile device:", err);
      alert("Failed to delete sim card.");
    }
  };

  function showModal(id: number) {
    setSelectedMobileDeviceId(id);
    dialog.current?.open();
  }

  const categories = Array.from(
    new Set(mobileDevices.map((device) => device.mobileDeviceCategory.name)),
  );
  const statusReasons = Array.from(
    new Set(mobileDevices.map((device) => device.statusReason)),
  );

  const filteredData = mobileDevices.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory.name === categoryFilter
      : true;
    const reasonMatch = statusReasonFilter
      ? device.statusReason === statusReasonFilter
      : true;
    return categoryMatch && reasonMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected mobile device?"
        buttonText="Delete"
        buttonColor="red"
        handleSubmit={() => handleDelete(selectedMobileDeviceId)}
      />
      <TableLayout
        title="Mobile devices in inventory"
        subtitle="Manage mobile devices"
        links={[
          { to: "/mobiles/create", label: "Create" },
          { to: "/mobiles/create-bulk", label: "Create bulk" },
        ]}
      >
        {mobileDevices.length === 0 ? (
          <EmptyState
            icon={<FaMobile />}
            title="No mobile devices yet"
            description="There aren't any mobiles in the database yet!"
            action={
              <CustomLink2
                to="/mobiles/create"
                label="Create your first mobile device"
              />
            }
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
              statuses={statusReasons}
              statusFilter={statusReasonFilter}
              setStatusFilter={setStatusReasonFilter}
              orders={mobileDevices}
            />
            <Table2>
              <Thead
                headers={[
                  "Id",
                  "Hostname",
                  "Category",
                  "IMEI number",
                  "Serial number",
                  "Status",
                  "Status reason",
                  "Actions",
                ]}
              />
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
                    <Td>
                      <div className="flex items-center gap-3">
                        <Button
                          color="red"
                          handleClick={() => showModal(mobile.id)}
                          label="Delete"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No mobile device match the selected filter.
                  </div>
                )}
              </tbody>
            </Table2>
          </>
        )}
      </TableLayout>
    </>
  );
}
