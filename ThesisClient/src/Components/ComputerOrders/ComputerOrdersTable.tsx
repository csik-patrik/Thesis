import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";
import Button from "../Shared/Button";

export default function ComputerOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    try {
      if (!user || !user.token) return;

      axios
        .get<ComputerOrderResponse[]>("http://localhost:5268/computer-orders", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => setData(res.data))
        .catch((err) => {
          toast.error("Failed to fetch computer orders.");
          console.log(err);
        });
    } catch (err) {
      console.error("Error loading computer orders:", err);
      toast.error("Failed to load computer orders.");
    }
  }, []);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      await axios.delete(`http://localhost:5268/api/computer-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setData((prev) => prev.filter((item) => item.id !== id));

      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);

      toast.error("Failed to delete computer order.");
    }
  };

  // Get unique statuses for the filter dropdown
  const statuses = Array.from(new Set(data.map((order) => order.status)));

  // Filter data by status
  const filteredData =
    statusFilter === "All"
      ? data
      : data.filter((order) => order.status === statusFilter);

  if (data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-100 text-center px-4">
        <h1 className="text-gray-400 text-2xl mb-3">
          💻 No computer orders found
        </h1>
        <p className="text-gray-500 mb-4">
          It looks like you don't have any computer orders yet.
        </p>
        <Link
          to="/computer-orders/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-500 transition"
        >
          Create a new computer order
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Computer Orders</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-2">
            <CustomLink
              to="/computer-orders/create"
              label="Create"
              color="green"
            />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span>Status</span>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-neutral-400"
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
            <tr key={d.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.customer.displayName}</td>
              <td className="px-4 py-2">{d.computerCategory.name}</td>
              <td className="px-4 py-2">{d.pickupLocation}</td>
              <td className="px-4 py-2">{d.status}</td>
              <td className="px-4 py-2">
                <CustomLink
                  color="blue"
                  to={`/computer-orders/${d.id}`}
                  label="View"
                />
                {d.status !== "Delivered" && (
                  <Button
                    handleClick={() => handleDelete(d.id)}
                    color="red"
                    label="Delete"
                  />
                )}
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
