import { useEffect, useState } from "react";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import Table from "../Shared/Table";

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
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">My Mobile Devices</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span>Category</span>
              <select
                id="categoryFilter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
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
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
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
                id="statusReasonFilter"
                value={statusReasonFilter}
                onChange={(e) => setStatusReasonFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
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
          <Table
            headerItems={[
              "Id",
              "Hostname",
              "Category",
              "Imei number",
              "Serial number",
              "Status",
              "Status reason",
            ]}
          >
            {filteredData.map((d) => (
              <tr key={d.id} className="even:bg-gray-50 border-b">
                <td className="px-4 py-2 border-b">{d.id}</td>
                <td className="px-4 py-2 border-b">{d.hostname}</td>
                <td className="px-4 py-2 border-b">
                  {d.mobileDeviceCategory.name}
                </td>
                <td className="px-4 py-2 border-b">{d.imeiNumber}</td>
                <td className="px-4 py-2 border-b">{d.serialNumber}</td>
                <td className="px-4 py-2 border-b">{d.status}</td>
                <td className="px-4 py-2 border-b">{d.statusReason}</td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
