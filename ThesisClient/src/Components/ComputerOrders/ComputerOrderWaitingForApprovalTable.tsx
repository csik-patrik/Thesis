import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import Table from "../Shared/Table";
import CustomLink from "../Shared/CustomLink";

export default function ComputerOrderWaitingForApprovalTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse[]>(
          "http://localhost:5268/computer-orders/approval",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setData(res.data);
      } catch (err) {
        console.error("Error loading computer orders:", err);
        toast.error("Failed to load computer orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <h3>Loading your computer orders...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
        <h1 className="text-muted mb-3">
          💻 There aren't any orders waiting for approval
        </h1>
      </div>
    );
  }

  const statuses = Array.from(new Set(data.map((order) => order.status)));
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">
        Computer orders waiting for approval
      </h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-6">
          <div className="flex flex-col">
            <span>Status</span>
            <select
              id="statusFilter"
              className="form-select d-inline-block w-auto"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            <tr key={d.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.customer.displayName}</td>
              <td className="px-4 py-2">{d.computerCategory.name}</td>
              <td className="px-4 py-2">{d.pickupLocation}</td>
              <td className="px-4 py-2">{d.status}</td>
              <td>
                <CustomLink
                  color="blue"
                  to={`/computer-orders/${d.id}`}
                  label="View"
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
