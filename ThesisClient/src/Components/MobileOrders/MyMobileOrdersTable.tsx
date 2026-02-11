import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MobileOrderResponse } from "../../Types/MobileTypes";
import { useAuth } from "../../Auth/AuthContext";
import Table from "../Shared/Table";
import CustomLink from "../Shared/CustomLink";
import DeleteButton from "../Shared/DeleteButton";

export default function MyMobileOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<MobileOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    try {
      if (!user || !user.token) return;

      axios
        .get<MobileOrderResponse[]>(
          "http://localhost:5268/mobile-orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        )
        .then((res) => setData(res.data))
        .catch((err) => {
          toast.error("Failed to fetch mobile orders.");
          console.log(err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Error loading mobile orders:", err);
      toast.error("Error loading mobile orders:");
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await axios.delete(`http://localhost:5268/mobile-orders/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mobile order deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile order:", err);
      toast.error("Failed to delete mobile order.");
    }
  };

  // Get unique statuses for the filter dropdown
  const statuses = Array.from(new Set(data.map((order) => order.status)));

  // Filter data by status
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">My mobile orders</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-2">
            <CustomLink to="/mobile-orders/create" label="Create" />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span>Status</span>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="All">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Table
          headerItems={[
            "Id",
            "Customer name",
            "Device type",
            "Pickup location",
            "Status",
            "Actions",
          ]}
        >
          {filteredData.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{d.id}</td>
              <td className="px-4 py-2 border-b">{d.customer.displayName}</td>
              <td className="px-4 py-2 border-b">
                {d.mobileDeviceCategory.name}
              </td>
              <td className="px-4 py-2 border-b">{d.pickupLocation}</td>
              <td className="px-4 py-2 border-b">{d.status}</td>
              <td className="px-4 py-2 border-b gap-2 flex">
                <Link
                  to={`/mobile-orders/${d.id}`}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                >
                  View
                </Link>
                {d.status !== "Delivered" && (
                  <DeleteButton handleDelete={() => handleDelete(d.id)} />
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
