import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { SimCardResponse } from "../../Types/MobileTypes";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";

export default function SimCardsTable() {
  const [data, setData] = useState<SimCardResponse[]>([]);
  const [callControlGroupFilter, setCallControlGroupFilter] =
    useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const dialog = useRef<ModalHandle>(null);
  const [selectedSimCardId, setSelectedSimCardId] = useState(0);

  function showModal(id: number) {
    setSelectedSimCardId(id);
    dialog.current?.open();
  }

  useEffect(() => {
    axios
      .get<SimCardResponse[]>("http://localhost:5268/sim-cards")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/sim-cards/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Sim card deleted successfully!");
    } catch (err) {
      console.error("Error deleting sim card:", err);
      alert("Failed to delete sim card.");
    }
  };

  const callControlGroups = Array.from(
    new Set(data.map((device) => device.simCallControlGroup.name)),
  );
  const statuses = Array.from(new Set(data.map((device) => device.status)));

  const filteredData = data.filter((device) => {
    const callControlGroupMatch = callControlGroupFilter
      ? device.simCallControlGroup.name === callControlGroupFilter
      : true;

    const statusMatch = statusFilter ? device.status === statusFilter : true;
    return callControlGroupMatch && statusMatch;
  });

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected sim card?"
        buttonColor="red"
        buttonText="Delete"
        handleSubmit={() => handleDelete(selectedSimCardId)}
      />
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Sim Cards</h1>
        <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="mb-4 flex gap-4 flex-col">
            <div className="flex gap-2">
              <CustomLink color="green" to="/sim-cards/create" label="Create" />
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span>Call control group</span>
                <select
                  value={callControlGroupFilter}
                  onChange={(e) => setCallControlGroupFilter(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">All</option>
                  {callControlGroups.map((callControlGroup) => (
                    <option key={callControlGroup} value={callControlGroup}>
                      {callControlGroup}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span>Status</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">All</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div>
            <Table
              headerItems={[
                "Id",
                "Phone number",
                "Call control group",
                "Data enabled",
                "Status",
                "Actions",
              ]}
            >
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 border-b">
                  <td className="px-4 py-2">{d.id}</td>
                  <td className="px-4 py-2">{d.phoneNumber}</td>
                  <td className="px-4 py-2">{d.simCallControlGroup.name}</td>
                  <td className="px-4 py-2">
                    {d.simCallControlGroup.isDataEnabled ? "True" : "False"}
                  </td>
                  <td className="px-4 py-2">{d.status}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <CustomLink
                      to={`/sim-cards/${d.id}`}
                      label="Edit"
                      color={"yellow"}
                    />
                    <Button
                      color="red"
                      label="Delete"
                      handleClick={() => showModal(d.id)}
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
