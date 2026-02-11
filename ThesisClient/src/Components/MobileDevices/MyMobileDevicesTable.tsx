import { useEffect, useState } from "react";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";

export default function MyMobileDeviceTable() {
  const [data, setData] = useState<MobileDeviceResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const { user } = useAuth();

  console.log(user);

  useEffect(() => {
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<MobileDeviceResponse[]>(
          "http://localhost:5268/mobile-devices/my-devices",
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
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Mobile Devices</h1>

      <div className="w-full max-w-5xl bg-white border rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Id</th>
                <th className="border px-4 py-2 text-left">Hostname</th>
                <th className="border px-4 py-2 text-left">
                  Category
                  <select
                    id="categoryFilter"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="block mt-1 w-full border-gray-300 rounded-md text-sm p-1"
                  >
                    <option value="">All</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="border px-4 py-2 text-left">IMEI Number</th>
                <th className="border px-4 py-2 text-left">Serial Number</th>
                <th className="border px-4 py-2 text-left">
                  Status
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block mt-1 w-full border-gray-300 rounded-md text-sm p-1"
                  >
                    <option value="">All</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="border px-4 py-2 text-left">
                  Status Reason
                  <select
                    id="statusReasonFilter"
                    value={statusReasonFilter}
                    onChange={(e) => setStatusReasonFilter(e.target.value)}
                    className="block mt-1 w-full border-gray-300 rounded-md text-sm p-1"
                  >
                    <option value="">All</option>
                    {statusReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{d.id}</td>
                  <td className="border px-4 py-2">{d.hostname}</td>
                  <td className="border px-4 py-2">
                    {d.mobileDeviceCategory.name}
                  </td>
                  <td className="border px-4 py-2">{d.imeiNumber}</td>
                  <td className="border px-4 py-2">{d.serialNumber}</td>
                  <td className="border px-4 py-2">{d.status}</td>
                  <td className="border px-4 py-2">{d.statusReason}</td>
                  <td className="border px-4 py-2">
                    {/* Add action buttons here if needed */}
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
