import { FaMobile } from "react-icons/fa6";
import TableLayout from "../../Layouts/TableLayout";
import type { MobileOrderResponse, SimCardResponse } from "../../Types/MobileTypes";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Td from "../Shared/Table/Td";
import Tr from "../Shared/Table/Tr";
import { useAuth } from "../../Auth/AuthContext";
import { useEffect, useState } from "react";
import { GetSimCardsForAllocation } from "../../Services/SimCardServices";
import { toast } from "react-toastify";
import Spinner from "../Shared/Spinner";
import Button from "../Shared/Button";
import { AllocateSimCardToOrder } from "../../Services/MobileOrderServices";

export default function AllocateSimCard({ order }: { order: MobileOrderResponse }) {
  const { user } = useAuth();

  const [simCards, setSimCards] = useState<SimCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [simSearch, setSimSearch] = useState("");

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchSimCards = async () => {
      try {
        const res = await GetSimCardsForAllocation(order.simCallControlGroup.id, user);

        setSimCards(res.data);
      } catch (err) {
        console.error("Error loading mobile orders:", err);

        toast.error("Failed to load mobile orders.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimCards();
  }, [order, user]);

  const handleAllocateSim = async (simCardId: number) => {
    if (user == null) return;
    setIsLoading(true);
    try {
      await AllocateSimCardToOrder({ orderId: order.id, simCardId: simCardId }, user);

      toast.success("Sim card allocated successfully!");

      setSimCards((prev) => prev.filter((s) => s.id !== simCardId));
    } catch (err) {
      toast.error("Failed to allocate sim card.");

      console.error("Sim allocation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  const filteredSimCards = simCards.filter((sim) =>
    sim.phoneNumber.toLowerCase().includes(simSearch.toLowerCase()),
  );

  return (
    <TableLayout title="Allocate SIM card" subtitle="Select a SIM card for this order">
      {simCards.length === 0 ? (
        <EmptyState
          icon={<FaMobile />}
          title="There aren't any sim cards available"
          description=""
        />
      ) : (
        <Table>
          <Tr key="search">
            <Td>
              <input
                type="text"
                placeholder="Search by phone number..."
                value={simSearch}
                onChange={(e) => setSimSearch(e.target.value)}
                className="w-full rounded-md border border-neutral-300 px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-neutral-500"
              />
            </Td>
          </Tr>
          {filteredSimCards.map((simCard) => (
            <>
              <Tr key={simCard.phoneNumber}>
                <Td>Phone number</Td>
                <Td>{simCard.phoneNumber}</Td>
              </Tr>
              <Tr key={simCard.simCallControlGroup.name}>
                <Td>Call control group</Td>
                <Td>{simCard.simCallControlGroup.name}</Td>
              </Tr>
              <Td>
                <Button
                  color="green"
                  label="Allocate"
                  handleClick={() => handleAllocateSim(simCard.id)}
                />
              </Td>
            </>
          ))}
        </Table>
      )}
    </TableLayout>
  );
}
