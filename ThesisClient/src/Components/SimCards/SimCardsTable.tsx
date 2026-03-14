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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sim cards</h1>
              <p className="text-sm text-gray-500 mt-1">Manage sim cards</p>
            </div>
            <div className="flex gap-2">
              <CustomLink2 to="/sim-cards/create" label="Create" />
              <CustomLink2 to="/sim-cards/create-bulk" label="Create bulk" />
            </div>
          </div>
          {/* ── Empty state ── */}
          {simCards.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4"></div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No sim cards yet!
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                There aren't any sim cards in the database yet! Create your
                first one!
              </p>
              <CustomLink2
                to="/sim-cards/create"
                label="Create a new computer"
              />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {["All", ...callControlGroups].map((callControlGroup) => (
                  <button
                    key={callControlGroup}
                    onClick={() => setCallControlGroupFilter(callControlGroup)}
                    className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                      callControlGroupFilter === callControlGroup
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {callControlGroup}
                    <span
                      className={`ml-1.5 text-xs ${callControlGroupFilter === callControlGroup ? "text-teal-200" : "text-gray-400"}`}
                    >
                      {callControlGroup === "All"
                        ? simCards.length
                        : simCards.filter(
                            (simCard) =>
                              simCard.simCallControlGroup.name ===
                              callControlGroup,
                          ).length}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {["All", ...statuses].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {status}
                    <span
                      className={`ml-1.5 text-xs ${statusFilter === status ? "text-teal-200" : "text-gray-400"}`}
                    >
                      {status === "All"
                        ? simCards.length
                        : simCards.filter(
                            (simCard) => simCard.status === status,
                          ).length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {[
                          "Id",
                          "Phone number",
                          "Call control group",
                          "Data enabled",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                            {d.id}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                            {d.phoneNumber}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.simCallControlGroup.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.simCallControlGroup.isDataEnabled
                              ? "True"
                              : "False"}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Button
                                color="red"
                                handleClick={() => showModal(d.id)}
                                label="Delete"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No sim cards match the selected filter.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
