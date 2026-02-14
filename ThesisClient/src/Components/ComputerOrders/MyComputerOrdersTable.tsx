import { useEffect, useState } from "react";
import type { ComputerOrderResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import Table from "../Shared/Table";
import CustomLink from "../Shared/CustomLink";
import Button from "../Shared/Button";

export default function MyComputerOrdersTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse[]>(
          "http://localhost:5268/computer-orders/my-orders",
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

  const handleDelete = async (id: number) => {
    if (!user?.token) return;

    try {
      await axios.delete(`http://localhost:5268/computer-orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Computer order deleted successfully!");
    } catch (err) {
      console.error("Error deleting computer order:", err);
      toast.error("Failed to delete computer order.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-gray-100">
        <h3 className="text-lg font-medium">Loading your computer orders...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 text-center p-4">
        <h1 className="text-3xl text-gray-400 mb-3">
          💻 No computer orders found
        </h1>
        <p className="text-gray-500 mb-4">
          It looks like you don't have any computer orders yet.
        </p>
        <Link
          to="/computer-orders/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Create a new computer order
        </Link>
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
      <h1 className="text-3xl font-bold mb-6">My computer Orders</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-2">
            <CustomLink
              color="green"
              to="/computer-orders/create"
              label="Create"
            />
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

        <div>
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
                  {d.computerCategory.name}
                </td>
                <td className="px-4 py-2 border-b">{d.pickupLocation}</td>
                <td className="px-4 py-2 border-b">{d.status}</td>
                <td className="px-4 py-2 border-b">
                  <CustomLink
                    color="blue"
                    label="View"
                    to={`/computer-orders/${d.id}`}
                  />
                  {d.status !== "Delivered" &&
                    d.status !== "Rejected by group leader" && (
                      <Button
                        color="red"
                        label="Delete"
                        handleClick={() => handleDelete(d.id)}
                      />
                    )}
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
