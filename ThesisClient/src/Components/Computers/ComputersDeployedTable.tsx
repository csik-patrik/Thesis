import { useEffect, useRef, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "react-toastify";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";

export default function ComputersDeployedTable() {
  const { user } = useAuth();

  const [computers, setComputers] = useState<ComputerResponse[]>([]);
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
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/deployed",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setComputers(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
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
      await axios.put(
        `http://localhost:5268/computers/return/${deviceId}`,
        { status, statusReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      toast.success(`Device returned to "${statusReason}" successfully!`);

      setComputers((prev) => prev.filter((d) => d.id !== deviceId));

      const res = await axios.get<ComputerResponse[]>(
        "http://localhost:5268/computers/deployed",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setComputers(res.data);
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

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
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Deployed Computers</h1>
        <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex gap-2 mb-4 flex-col">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search by hostname"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 w-auto focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          <Table
            headerItems={[
              "Id",
              "Hostname",
              "Category",
              "Model",
              "Serial number",
              "User",
              "Actions",
            ]}
          >
            {filteredData.map((computer) => (
              <tr key={computer.id} className="hover:bg-gray-50 border-b">
                <td className="px-4 py-2">{computer.id}</td>
                <td className="px-4 py-2">{computer.hostname}</td>
                <td className="px-4 py-2">{computer.computerCategory.name}</td>
                <td className="px-4 py-2">{computer.model}</td>
                <td className="px-4 py-2">{computer.serialNumber}</td>
                <td className="px-4 py-2">{computer.user?.userName || "—"}</td>
                <td className="px-4 py-2">
                  <Button
                    color="yellow"
                    handleClick={() => showModal(computer.id)}
                    label="Return"
                  />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
