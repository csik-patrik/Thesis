import { useEffect, useState } from "react";
import { useAuth } from "../../Auth/AuthContext";
import type { ComputerOrderResponse, ComputerResponse } from "../../Types/ComputerTypes";
import {
  AllocateComputerToOrder,
  GetComputersForAllocation,
} from "../../Services/ComputerServices";
import { toast } from "react-toastify";
import Spinner from "../Shared/Spinner";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaComputer } from "react-icons/fa6";
import Table from "../Shared/Table/Table";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import Button from "../Shared/Button";

export default function AllocateComputer({ order }: { order: ComputerOrderResponse }) {
  const { user } = useAuth();
  const [computers, setComputers] = useState<ComputerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchComputers = async () => {
      try {
        const res = await GetComputersForAllocation(order.computerCategory.id, user);

        setComputers(res.data);
      } catch (err) {
        console.error("Error loading mobile orders:", err);

        toast.error("Failed to load mobile orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComputers();
  }, [order, user]);

  console.log(computers);

  const handleAllocateComputer = async (computerId: number) => {
    try {
      if (!user || !user.token) return;

      setIsLoading(true);

      await AllocateComputerToOrder({ orderId: order.id, computerId: computerId }, user);

      toast.success("Device allocated successfully!");
    } catch (err) {
      toast.error("Failed to allocate device.");

      console.error("Allocation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredComputers = computers.filter((computer) =>
    computer.hostname.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) return <Spinner />;

  return (
    <TableLayout title="Allocate computer" subtitle="Select a computer for this order">
      {computers.length === 0 ? (
        <EmptyState
          icon={<FaComputer />}
          title="There aren't any computers available"
          description=""
        />
      ) : (
        <Table>
          <Tr key="search">
            <Td>
              <input
                type="text"
                placeholder="Search by hostname..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </Td>
          </Tr>
          {filteredComputers.map((computer) => (
            <>
              <Tr key={computer.hostname}>
                <Td>Hostname</Td>
                <Td>{computer.hostname}</Td>
              </Tr>
              <Tr key={computer.serialNumber}>
                <Td>Serial number</Td>
                <Td>{computer.serialNumber}</Td>
              </Tr>
              <Tr key={computer.id}>
                <Td>
                  <Button
                    color="green"
                    label="Allocate"
                    handleClick={() => handleAllocateComputer(computer.id)}
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
