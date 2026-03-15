import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { SimCardResponse } from "../../Types/MobileTypes";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import {
  DeleteSimCard,
  GetSimCardsInInventory,
} from "../../Services/SimCardServices";
import Spinner from "../Shared/Spinner";
import CustomLink2 from "../Shared/CustomLink2";
import StatusBadge from "../Shared/StatusBadge";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import { FaMobile } from "react-icons/fa6";
import FilterTabs from "../Shared/Table/FilterTabs";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function SimCardsTable() {
  const [simCards, setSimCards] = useState<SimCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [callControlGroupFilter, setCallControlGroupFilter] =
    useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const [selectedSimCardId, setSelectedSimCardId] = useState(0);

  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchSimCards = async () => {
      try {
        const res = await GetSimCardsInInventory();
        setSimCards(res.data);
      } catch (err) {
        console.error("Failed to fetch sim cards:", err);

        toast.error("Failed to load sim cards.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimCards();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await DeleteSimCard(id);
      setSimCards((prev) => prev.filter((item) => item.id !== id));
      toast.success("Sim card deleted successfully!");
    } catch (err) {
      console.error("Error deleting sim card:", err);
      alert("Failed to delete sim card.");
    }
  };

  function showModal(id: number) {
    setSelectedSimCardId(id);
    dialog.current?.open();
  }

  const callControlGroups = Array.from(
    new Set(simCards.map((device) => device.simCallControlGroup.name)),
  );
  const statuses = Array.from(new Set(simCards.map((device) => device.status)));

  const filteredData = simCards.filter((device) => {
    const callControlGroupMatch = callControlGroupFilter
      ? device.simCallControlGroup.name === callControlGroupFilter
      : true;

    const statusMatch = statusFilter ? device.status === statusFilter : true;
    return callControlGroupMatch && statusMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected sim card?"
        buttonColor="red"
        buttonText="Delete"
        handleSubmit={() => handleDelete(selectedSimCardId)}
      />
      <TableLayout
        title="Sim cards"
        subtitle="Manage sim cards"
        links={[
          { to: "/sim-cards/create", label: "Create" },
          { to: "/sim-cards/create-bulk", label: "Create bulk" },
        ]}
      >
        {simCards.length === 0 ? (
          <EmptyState
            icon={<FaMobile />}
            title="No sim cards yet"
            description="There aren't any sim cards in the database yet! Create your
                first one!"
            action={
              <CustomLink2
                to="/sim-cards/create"
                label="Create your first sim card"
              />
            }
          />
        ) : (
          <>
            <FilterTabs
              statuses={callControlGroups}
              statusFilter={callControlGroupFilter}
              setStatusFilter={setCallControlGroupFilter}
              orders={simCards}
            />
            <FilterTabs
              statuses={statuses}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              orders={simCards}
            />
            <Table>
              <Thead
                headers={[
                  "Id",
                  "Phone number",
                  "Call control group",
                  "Data enabled",
                  "Status",
                  "Actions",
                ]}
              />
              <tbody>
                {filteredData.map((simCard) => (
                  <Tr key={simCard.id}>
                    <Td>{simCard.id}</Td>
                    <Td>{simCard.phoneNumber}</Td>
                    <Td>{simCard.simCallControlGroup.name}</Td>
                    <Td>
                      {simCard.simCallControlGroup.isDataEnabled
                        ? "True"
                        : "False"}
                    </Td>
                    <Td>
                      <StatusBadge status={simCard.status} />
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Button
                          color="red"
                          handleClick={() => showModal(simCard.id)}
                          label="Delete"
                        />
                      </div>
                    </Td>
                  </Tr>
                ))}
                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No sim cards match the selected filter.
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
