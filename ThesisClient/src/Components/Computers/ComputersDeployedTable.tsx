import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "react-toastify";

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
    <div className="flex flex-col justify-center items-center bg-gray-100 p-6">
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

      <h1 className="text-2xl font-semibold mb-6">Deployed Computers</h1>

      <div className="w-full max-w-6xl bg-white shadow-md rounded-lg p-4">
        {/* Search */}
        <div className="flex mb-4">
          <input
            type="text"
            placeholder="Search by hostname"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 w-auto focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Id
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Hostname
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Category
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Model
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Serial number
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  User
                </th>
                <th className="px-3 py-2 text-left text-gray-700 font-medium border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">{d.id}</td>
                  <td className="px-3 py-2 border-b">{d.hostname}</td>
                  <td className="px-3 py-2 border-b">
                    {d.computerCategory.name}
                  </td>
                  <td className="px-3 py-2 border-b">{d.model}</td>
                  <td className="px-3 py-2 border-b">{d.serialNumber}</td>
                  <td className="px-3 py-2 border-b">
                    {d.user?.userName || "—"}
                  </td>
                  <td className="px-3 py-2 border-b">
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-400 text-sm"
                      onClick={() => {
                        setSelectedDeviceId(d.id);
                        setShowReturnModal(true);
                      }}
                    >
                      Return
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
