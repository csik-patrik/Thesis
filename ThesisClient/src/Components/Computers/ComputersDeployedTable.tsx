import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "react-toastify";
import Table from "../Shared/Table";
import Button from "../Shared/Button";

export default function ComputersDeployedTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerResponse[]>([]);
  const [search, setSearch] = useState<string>("");

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [returnData, setReturnData] = useState({
    status: "In inventory",
    statusReason: "In inventory",
  });

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
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, [user]);

  const filteredData = data.filter((device) => {
    const searchMatch = device.hostname
      .toLowerCase()
      .includes(search.toLowerCase()); // Filter by hostname
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

      setData((prev) => prev.filter((d) => d.id !== deviceId));

      const res = await axios.get<ComputerResponse[]>(
        "http://localhost:5268/computers/deployed",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setData(res.data);
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* Return Device Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-stone-50 bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h5 className="text-lg font-semibold">Return Device</h5>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowReturnModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="px-4 py-4">
              <div className="mb-4">
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
                  <option>In inventory</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block font-semibold mb-1">
                  Status Reason
                </label>
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
                  <option>In inventory</option>
                  <option>In repair</option>
                  <option>Pending disposal</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-4 py-3 border-t">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowReturnModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                onClick={() => {
                  if (selectedDeviceId) {
                    handleReturn(
                      selectedDeviceId,
                      returnData.status,
                      returnData.statusReason,
                    );
                  }
                  setShowReturnModal(false);
                }}
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
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
          {filteredData.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.hostname}</td>
              <td className="px-4 py-2">{d.computerCategory.name}</td>
              <td className="px-4 py-2">{d.model}</td>
              <td className="px-4 py-2">{d.serialNumber}</td>
              <td className="px-4 py-2">{d.user?.userName || "—"}</td>
              <td className="px-4 py-2">
                <Button
                  color="green"
                  handleClick={() => {
                    setSelectedDeviceId(d.id);
                    setShowReturnModal(true);
                  }}
                  label="Return"
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
