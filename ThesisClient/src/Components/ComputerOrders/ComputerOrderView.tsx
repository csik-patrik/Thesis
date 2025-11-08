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
          }
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
        }
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
        }
      );

      toast.success("Device allocated successfully!");
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));

      // Refresh order to show allocated device
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`
      );

      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    }
  };

  const handleDeliver = async () => {
    try {
      await axios.put(`http://localhost:5268/computer-orders/deliver/${id}`);
      toast.success("Order marked as delivered!");
      // Optionally refresh order data
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`
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
        }
      );

      // 🔹 Refresh order
      const res = await axios.get<ComputerOrderResponse>(
        `http://localhost:5268/computer-orders/${id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setOrder(res.data);
      toast.success(
        `Order ${decision ? "approved" : "rejected"} successfully!`
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
    device.hostname.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );

  if (!order)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fs-4">Order not found.</p>
      </div>
    );

  return (
    <div className="container m-5">
      <div className="row g-4">
        {/* 🧾 Order Details Section */}
        <div className="col-lg-8">
          <h2 className="mb-3">🧾 Order Details</h2>
          <div className="card shadow-sm border-0 p-4">
            <dl className="row mb-0">
              <dt className="col-sm-4">Order ID:</dt>
              <dd className="col-sm-8">{order.id}</dd>

              <dt className="col-sm-4">Customer Name:</dt>
              <dd className="col-sm-8">{order.customer.displayName}</dd>

              <dt className="col-sm-4">Cost Center:</dt>
              <dd className="col-sm-8">{order.customer.costCenter}</dd>

              <dt className="col-sm-4">Device Category:</dt>
              <dd className="col-sm-8">{order.computerCategory.name}</dd>

              <dt className="col-sm-4">Pickup Location:</dt>
              <dd className="col-sm-8">{order.pickupLocation}</dd>

              <dt className="col-sm-4">Note:</dt>
              <dd className="col-sm-8">{order.note || "—"}</dd>

              <dt className="col-sm-4">Status:</dt>
              <dd className="col-sm-8">
                <span
                  className={`badge ${
                    order.status === "Approved"
                      ? "bg-success"
                      : order.status === "Rejected by group leader"
                      ? "bg-danger"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.status}
                </span>
              </dd>
              <dt className="col-sm-4">Approver:</dt>
              <dd className="col-sm-8">
                {order.approver.displayName} - {order.approver.department}
              </dd>
            </dl>
          </div>

          {/* Actions */}
          <div className="mt-4">
            {user?.roles.includes("Admin") && (
              <Link
                to="/computer-orders"
                className="btn btn-outline-primary me-2"
              >
                ⬅ Back to Orders
              </Link>
            )}

            {user?.roles.includes("Group leader") && order && (
              <>
                <Link
                  to="/computer-orders/approval"
                  className="btn btn-outline-primary me-2"
                >
                  ⬅ Back to Orders
                </Link>

                {order.status == "Waiting for approval" && (
                  <>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => handleDecision(order.id, true)}
                    >
                      ✅ Approve
                    </button>

                    <button
                      className="btn btn-danger"
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
                <button className="btn btn-success" onClick={handleDeliver}>
                  🚚 Deliver Device
                </button>
              )}
          </div>
        </div>

        {/* 💻 Device Allocation Section */}
        {user?.roles.includes("Admin") && (
          <div className="col-lg-4">
            {order.computer ? (
              <>
                <h2 className="mb-3">💻 Allocated Device</h2>
                <div className="card shadow-sm border-0 p-3">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      <strong>Hostname:</strong> {order.computer.hostname}
                    </li>
                    <li className="list-group-item">
                      <strong>Category:</strong>{" "}
                      {order.computer.computerCategory.name}
                    </li>
                    <li className="list-group-item">
                      <strong>Model:</strong> {order.computer.model}
                    </li>
                    <li className="list-group-item">
                      <strong>Serial:</strong> {order.computer.serialNumber}
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <h2 className="mb-3">🧩 Allocate Device</h2>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="🔍 Search by hostname..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="card shadow-sm border-0 p-3">
                  {filteredDevices.length === 0 ? (
                    <p className="text-muted mb-0">
                      No available devices found.
                    </p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {filteredDevices.map((device) => (
                        <li
                          key={device.id}
                          className="list-group-item d-flex flex-column"
                        >
                          <strong>{device.hostname}</strong>
                          <small>
                            Category: {device.computerCategory.name}
                          </small>
                          <small>Model: {device.model}</small>
                          <small>Serial: {device.serialNumber}</small>
                          <small>Status: {device.status}</small>
                          <button
                            className="btn btn-outline-success btn-sm mt-2 align-self-end"
                            disabled={allocating === device.id}
                            onClick={() => handleAllocateComputer(device.id)}
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
