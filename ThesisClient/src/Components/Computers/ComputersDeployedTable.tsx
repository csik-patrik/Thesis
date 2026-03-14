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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Deployed computers
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Track and manage deployed computers
              </p>
            </div>
          </div>
          {/* ── Empty state ── */}
          {computers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <FaComputer />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Not found any deployed computers
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                There aren't any deployed computers yet.
              </p>
            </div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Search by hostname"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 mb-2 w-auto focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {[
                          "Id",
                          "Hostname",
                          "Category",
                          "Model",
                          "Serial number",
                          "User",
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
                            {d.hostname}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.computerCategory.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.model}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.serialNumber}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.user?.displayName || "—"}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Button
                                color="yellow"
                                handleClick={() => showModal(d.id)}
                                label="Return"
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
                    No orders match the selected filter.
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
