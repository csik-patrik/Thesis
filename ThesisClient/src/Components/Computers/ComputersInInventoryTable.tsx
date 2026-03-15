import { useEffect, useRef, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import StatusBadge from "../Shared/StatusBadge";
import Button from "../Shared/Button";
import {
  DeleteComputer,
  GetComputersInInventory,
} from "../../Services/ComputerServices";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaComputer } from "react-icons/fa6";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function ComputersInInventoryTable() {
  const { user } = useAuth();
  const [computers, setComputers] = useState<ComputerResponse[]>([]);
  const [selectedComputerId, setSelectedComputerId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetComputersInInventory(user);
        setComputers(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);

        toast.error("Failed to load computers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await DeleteComputer(id, user);

      setComputers((prev) => prev.filter((item) => item.id !== id));

      toast.success("Computer deleted!");
    } catch (err) {
      console.error("Error deleting computer: ", err);
      toast.error("Error deleting computer!");
    }
  };

  function showModal(id: number) {
    setSelectedComputerId(id);
    dialog.current?.open();
  }

  const categories = Array.from(
    new Set(computers.map((device) => device.computerCategory.name)),
  );

  const filteredData = computers.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.computerCategory.name === categoryFilter
      : true;

    return categoryMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected computer?"
        buttonText="Delete"
        buttonColor="red"
        handleSubmit={() => handleDelete(selectedComputerId)}
      ></Modal>
      <TableLayout
        title="Computers in inventory"
        subtitle="Manage computers"
        links={[
          { to: "/computers/create", label: "Create" },
          { to: "/computers/create-bulk", label: "Create bulk" },
        ]}
      >
        {computers.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="No computers yet"
            description="You don't have any computers yet!"
          />
        ) : (
          <>
            <FilterTabs
              statuses={categories}
              statusFilter={categoryFilter}
              setStatusFilter={setCategoryFilter}
              orders={computers}
            />
            <Table>
              <Thead
                headers={[
                  "Id",
                  "Hostname",
                  "Category",
                  "Model",
                  "Serial number",
                  "Status",
                  "Status reason",
                  "Actions",
                ]}
              />
              <tbody>
                {filteredData.map((computer) => (
                  <Tr key={computer.id}>
                    <Td>{computer.id}</Td>
                    <Td>{computer.hostname}</Td>
                    <Td>{computer.computerCategory.name}</Td>
                    <Td>{computer.model}</Td>
                    <Td>{computer.serialNumber}</Td>
                    <Td>
                      <StatusBadge status={computer.status} />
                    </Td>
                    <Td>
                      <StatusBadge status={computer.statusReason} />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Button
                          color="red"
                          handleClick={() => showModal(computer.id)}
                          label="Delete"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No computers match the selected filter.
                  </div>
                )}
              </tbody>
            </Table>
          </>
        )}
      </TableLayout>
    </>
  );
}
