import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import CustomLink from "../Shared/CustomLink";

export default function MobileDevicesTable() {
  const { user } = useAuth();
  const [data, setData] = useState<MobileDeviceResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  // const [updateData, setUpdateData] = useState({
  //   statusReason: "In inventory",
  // });

  console.log(user);

  useEffect(() => {
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<MobileDeviceResponse[]>(
          "http://localhost:5268/mobile-devices/",
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

  const handleDelete = async (id: number) => {
    if (!user) return;
    if (!user.token) return;

    try {
      await axios.delete(`http://localhost:5268/mobile-devices/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mobile deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile device:", err);
      alert("Failed to delete sim card.");
    }
  };

  // Get unique device categories for the filter dropdown
  const categories = Array.from(
    new Set(data.map((device) => device.mobileDeviceCategory.name)),
  );
  const statuses = Array.from(new Set(data.map((device) => device.status)));
  const statusReasons = Array.from(
    new Set(data.map((device) => device.statusReason)),
  );

  // Filter data by device category, status, and status reason
  const filteredData = data.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory.name === categoryFilter
      : true;
    const statusMatch = statusFilter ? device.status === statusFilter : true;
    const reasonMatch = statusReasonFilter
      ? device.statusReason === statusReasonFilter
      : true;
    return categoryMatch && statusMatch && reasonMatch;
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Devices</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="mb-4 flex gap-4 flex-col">
          <div className="flex gap-2">
            <CustomLink to="/mobiles/create" label="Create" />
            <CustomLink to="/mobiles/create-bulk" label="Create bulk" />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span>Category</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
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
            <div className="flex flex-col">
              <span>Status reason</span>
              <select
                value={statusReasonFilter}
                onChange={(e) => setStatusReasonFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All</option>
                {statusReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 border-b">Id</th>
                <th className="text-left px-4 py-2 border-b">Hostname</th>
                <th className="text-left px-4 py-2 border-b">Category</th>
                <th className="text-left px-4 py-2 border-b">IMEI Number</th>
                <th className="text-left px-4 py-2 border-b">Serial Number</th>
                <th className="text-left px-4 py-2 border-b">Status</th>
                <th className="text-left px-4 py-2 border-b">Status Reason</th>
                <th className="text-left px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((mobile) => (
                <tr key={mobile.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{mobile.id}</td>
                  <td className="px-4 py-2 border-b">{mobile.hostname}</td>
                  <td className="px-4 py-2 border-b">
                    {mobile.mobileDeviceCategory.name}
                  </td>
                  <td className="px-4 py-2 border-b">{mobile.imeiNumber}</td>
                  <td className="px-4 py-2 border-b">{mobile.serialNumber}</td>
                  <td className="px-4 py-2 border-b">{mobile.status}</td>
                  <td className="px-4 py-2 border-b">{mobile.statusReason}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      onClick={() => handleDelete(mobile.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition"
                    >
                      Delete
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
