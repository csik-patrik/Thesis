import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { useAuth } from "../../Auth/AuthContext";
import { GetMyComputers } from "../../Services/ComputerServices";
import Spinner from "../Shared/Spinner";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaComputer } from "react-icons/fa6";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import StatusBadge from "../Shared/StatusBadge";

export default function MyComputersTable() {
  const { user } = useAuth();

  const [computers, setComputers] = useState<ComputerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await GetMyComputers(user);
        setComputers(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <TableLayout title="My computers" subtitle="Manage and track you computers">
      {computers.length === 0 ? (
        <EmptyState
          icon={<FaComputer />}
          title="No mobile devices yet"
          description="You don't have any mobile device yet!"
        />
      ) : (
        <Table>
          <Thead
            headers={[
              "Hostname",
              "Category",
              "Model",
              "Serial number",
              "Status",
              "Status reason",
            ]}
          />
          {computers.map((computer) => (
            <Tr key={computer.id}>
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
            </Tr>
          ))}
        </Table>
      )}
    </TableLayout>
  );
}
