import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
  ComputerOrderResponse,
  ComputerResponse,
} from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputerOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ComputerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<ComputerResponse[]>([]);
  const [allocating, setAllocating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!user || !user.token) return;
        const res = await axios.get<ComputerOrderResponse>(
          `http://localhost:5268/computer-orders/${id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setOrder(res.data);
      } catch (err) {
        toast.error("Error fetching mobile orders.");
        console.error("Error fetching mobile orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!user || !user.token) return;
    if (order?.computerCategory.id === undefined) return;
    axios
      .get<ComputerResponse[]>(
        `http://localhost:5268/computers/allocation/${order?.computerCategory.id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      )
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });
  }, [order]);

  const handleAllocateComputer = async (deviceId: number) => {
    try {
      if (!user || !user.token) return;

      setAllocating(deviceId);

      await axios.put(
        `http://localhost:5268/computer-orders/allocate`,
        {
          orderId: id,
          computerId: deviceId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      toast.success("Device allocated successfully!");
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));

      // Refresh order to show allocated device
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    }
  };

  const handleDeliver = async () => {
    try {
      if (!user || !user.token) return;

      await axios.put(
        `http://localhost:5268/computer-orders/deliver/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      toast.success("Order marked as delivered!");

      // Refresh order to show allocated device
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to deliver device.");

      console.error("Delivery error:", err);
    }
  };

  const handleDecision = async (id: number, decision: boolean) => {
    if (!user?.token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      // 🔹 Call approval endpoint
      await axios.put(
        `http://localhost:5268/computer-orders/approval/${id}`,
        decision,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      // 🔹 Refresh order
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        },
      );

      setOrder(res.data);
      toast.success(
        `Order ${decision ? "approved" : "rejected"} successfully!`,
      );
    } catch (err: any) {
      console.error("Error updating computer order:", err);

      const message =
        err.response?.data?.message || "Failed to update computer order.";
      toast.error(message);
    }
  };

  // Filter devices by hostname
  const filteredDevices = devices.filter((device) =>
    device.hostname.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">Order not found.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="grid lg:grid-cols-12 gap-6">
        {/* 🧾 Order Details Section */}
        <div className="lg:col-span-8">
          <h2 className="text-2xl font-semibold mb-4">🧾 Order Details</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <dl className="grid grid-cols-1 gap-3">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Order ID:</dt>
                <dd>{order.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Customer Name:</dt>
                <dd>{order.customer.displayName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Cost Center:</dt>
                <dd>{order.customer.costCenter}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Device Category:</dt>
                <dd>{order.computerCategory.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Pickup Location:</dt>
                <dd>{order.pickupLocation}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Note:</dt>
                <dd>{order.note || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Status:</dt>
                <dd>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      order.status === "Approved"
                        ? "bg-green-200 text-green-800"
                        : order.status === "Rejected by group leader"
                          ? "bg-red-200 text-red-800"
                          : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {order.status}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-700">Approver:</dt>
                <dd>
                  {order.approver.displayName} - {order.approver.department}
                </dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {user?.roles.includes("Admin") && (
              <Link
                to="/computer-orders"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
              >
                ⬅ Back to Orders
              </Link>
            )}

            {user?.roles.includes("Group leader") && order && (
              <>
                <Link
                  to="/computer-orders/approval"
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                >
                  ⬅ Back to Orders
                </Link>

                {order.status === "Waiting for approval" && (
                  <>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                      onClick={() => handleDecision(order.id, true)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
                      onClick={() => handleDecision(order.id, false)}
                    >
                      ❌ Reject
                    </button>
                  </>
                )}
              </>
            )}

            {user?.roles.includes("Admin") &&
              order.computer &&
              order.status !== "Delivered" && (
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                  onClick={handleDeliver}
                >
                  🚚 Deliver Device
                </button>
              )}
          </div>
        </div>

        {/* 💻 Device Allocation Section */}
        {user?.roles.includes("Admin") && (
          <div className="lg:col-span-4">
            {order.computer ? (
              <>
                <h2 className="text-xl font-semibold mb-3">
                  💻 Allocated Device
                </h2>
                <div className="bg-white shadow-md rounded-lg p-4">
                  <ul className="space-y-2">
                    <li>
                      <strong>Hostname:</strong> {order.computer.hostname}
                    </li>
                    <li>
                      <strong>Category:</strong>{" "}
                      {order.computer.computerCategory.name}
                    </li>
                    <li>
                      <strong>Model:</strong> {order.computer.model}
                    </li>
                    <li>
                      <strong>Serial:</strong> {order.computer.serialNumber}
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-3">
                  🧩 Allocate Device
                </h2>
                <input
                  type="text"
                  placeholder="🔍 Search by hostname..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <div className="bg-white shadow-md rounded-lg p-3">
                  {filteredDevices.length === 0 ? (
                    <p className="text-gray-500">No available devices found.</p>
                  ) : (
                    <ul className="space-y-2">
                      {filteredDevices.map((device) => (
                        <li
                          key={device.id}
                          className="flex flex-col border-b border-gray-200 pb-2"
                        >
                          <strong>{device.hostname}</strong>
                          <small>
                            Category: {device.computerCategory.name}
                          </small>
                          <small>Model: {device.model}</small>
                          <small>Serial: {device.serialNumber}</small>
                          <small>Status: {device.status}</small>
                          <button
                            disabled={allocating === device.id}
                            onClick={() => handleAllocateComputer(device.id)}
                            className={`mt-2 self-end px-3 py-1 rounded text-white ${
                              allocating === device.id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-600 hover:bg-green-500"
                            } text-sm`}
                          >
                            {allocating === device.id
                              ? "Allocating..."
                              : "Allocate"}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
