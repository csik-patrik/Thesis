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
  }, [id, user]);

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
  }, [order, user]);

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
    } finally {
      setAllocating(null);
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
      <div className="flex items-center justify-center">
        <div className="size-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (!order)
    return (
      <div className="flex items-center justify-center">
        <p className="text-lg text-red-600">Order not found.</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 🧾 Order Details Section */}
        <div className="lg:col-span-8">
          <h2 className="mb-4 text-2xl font-semibold">🧾 Order Details</h2>
          <div className="rounded-lg bg-white p-6 shadow-md">
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
                    className={`rounded-full px-2 py-1 text-sm font-semibold ${
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
                className="rounded border border-blue-500 px-4 py-2 text-blue-500 transition hover:bg-blue-50"
              >
                ⬅ Back to Orders
              </Link>
            )}

            {user?.roles.includes("Group leader") && order && (
              <>
                <Link
                  to="/computer-orders/approval"
                  className="rounded border border-blue-500 px-4 py-2 text-blue-500 transition hover:bg-blue-50"
                >
                  ⬅ Back to Orders
                </Link>

                {order.status === "Waiting for approval" && (
                  <>
                    <button
                      className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
                      onClick={() => handleDecision(order.id, true)}
                    >
                      ✅ Approve
                    </button>
                    <button
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-500"
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
                  className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-500"
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
                <h2 className="mb-3 text-xl font-semibold">
                  💻 Allocated Device
                </h2>
                <div className="rounded-lg bg-white p-4 shadow-md">
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
                <h2 className="mb-3 text-xl font-semibold">
                  🧩 Allocate Device
                </h2>
                <input
                  type="text"
                  placeholder="🔍 Search by hostname..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="mb-3 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <div className="rounded-lg bg-white p-3 shadow-md">
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
                            className={`mt-2 self-end rounded px-3 py-1 text-sm text-white ${
                              allocating === device.id
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-green-600 hover:bg-green-500"
                            }`}
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
