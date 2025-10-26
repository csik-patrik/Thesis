import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type {
  ComputerOrderResponse,
  ComputerResponse,
} from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";

export default function ComputerOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ComputerOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<ComputerResponse[]>([]);
  const [allocating, setAllocating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get<ComputerOrderResponse>(
          `http://localhost:5268/computer-orders/${id}`
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
    if (order?.computerCategory.id === undefined) return;
    axios
      .get<ComputerResponse[]>(
        `http://localhost:5268/computers/allocation/${order?.computerCategory.id}`
      )
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });
  }, [order]);

  const handleAllocateComputer = async (deviceId: number) => {
    setAllocating(deviceId);
    try {
      await axios.put(
        `http://localhost:5268/computer-orders/allocate`,
        {
          orderId: id,
          computerId: deviceId,
        },
        {
          headers: { "Content-Type": "application/json" },
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
                    order.status === "Delivered"
                      ? "bg-success"
                      : "bg-warning text-dark"
                  }`}
                >
                  {order.status}
                </span>
              </dd>
            </dl>
          </div>

          {/* Actions */}
          <div className="mt-4">
            <Link
              to="/computer-orders"
              className="btn btn-outline-primary me-2"
            >
              ⬅ Back to Orders
            </Link>
            {order.computer && order.status !== "Delivered" && (
              <button className="btn btn-success" onClick={handleDeliver}>
                🚚 Deliver Device
              </button>
            )}
          </div>
        </div>

        {/* 💻 Device Allocation Section */}
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
                  <p className="text-muted mb-0">No available devices found.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {filteredDevices.map((device) => (
                      <li
                        key={device.id}
                        className="list-group-item d-flex flex-column"
                      >
                        <strong>{device.hostname}</strong>
                        <small>Category: {device.computerCategory.name}</small>
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
      </div>
    </div>
  );
}
