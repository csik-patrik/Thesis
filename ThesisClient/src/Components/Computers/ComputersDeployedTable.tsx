import { useEffect, useRef, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "react-toastify";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import Spinner from "../Shared/Spinner";
import { FaComputer } from "react-icons/fa6";
import {
  GetDeployedComputers,
  ReturnComputer,
} from "../../Services/ComputerServices";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function ComputersDeployedTable() {
  const { user } = useAuth();

  const [computers, setComputers] = useState<ComputerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComputerId, setSelectedComputerId] = useState(0);

  const [returnData, setReturnData] = useState({
    status: "In inventory",
    statusReason: "In inventory",
  });

  const returnDialog = useRef<ModalHandle>(null);

  const [search, setSearch] = useState<string>("");

  function showModal(id: number) {
    setSelectedComputerId(id);
    returnDialog.current?.open();
  }

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await GetDeployedComputers(user);
        setComputers(res.data);
      } catch (err) {
        console.error("Error loading deployed computers:", err);

        toast.error("Failed to load deployed computers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const filteredData = computers.filter((device) => {
    const searchMatch = device.hostname
      .toLowerCase()
      .includes(search.toLowerCase());
    return searchMatch;
  });

  const handleReturn = async (
    deviceId: number,
    status: string,
    statusReason: string,
  ) => {
    if (!user?.token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      await ReturnComputer(deviceId, status, statusReason, user);

      toast.success(`Device returned to "${statusReason}" successfully!`);

      setComputers((prev) => prev.filter((d) => d.id !== deviceId));
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Modal
        ref={returnDialog}
        title="Return computer"
        buttonColor="yellow"
        buttonText="Return"
        handleSubmit={() =>
          handleReturn(
            selectedComputerId,
            returnData.status,
            returnData.statusReason,
          )
        }
      >
        <div className="flex gap-1 flex-col pb-2">
          <label className="block font-semibold mb-1">Status</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={returnData.status}
            onChange={(e) =>
              setReturnData((prev) => ({
                ...prev,
                status: e.target.value,
              }))
            }
          >
            <option value={"In inventory"}>In inventory</option>
          </select>
          <label className="block font-semibold mb-1">Status reason</label>
          <select
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={returnData.statusReason}
            onChange={(e) =>
              setReturnData((prev) => ({
                ...prev,
                statusReason: e.target.value,
              }))
            }
          >
            <option value={"In inventory"}>In inventory</option>
          </select>
        </div>
      </Modal>
      <TableLayout
        title="Deployed computers"
        subtitle="Track and manage deployed computers"
      >
        {computers.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="Not found any deployed computers"
            description="There aren't any deployed computers yet."
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by hostname..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            />
            {filteredData.length > 0 ? (
              <Table>
                <Thead
                  headers={[
                    "Id",
                    "Hostname",
                    "Category",
                    "Model",
                    "Serial number",
                    "User",
                    "Actions",
                  ]}
                />
                <tbody>
                  {filteredData.map((d) => (
                    <Tr key={d.id}>
                      <Td>{d.id}</Td>
                      <Td>{d.hostname}</Td>
                      <Td>{d.computerCategory.name}</Td>
                      <Td>{d.model}</Td>
                      <Td>{d.serialNumber}</Td>
                      <Td>{d.user.displayName}</Td>
                      <Td>
                        <div className="flex items-center gap-3">
                          <Button
                            color="yellow"
                            handleClick={() => showModal(d.id)}
                            label="Return"
                          />
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="py-12 text-center text-sm text-gray-400">
                No computers match the selected filter.
              </div>
            )}
          </>
        )}
      </TableLayout>
    </>
  );
}
