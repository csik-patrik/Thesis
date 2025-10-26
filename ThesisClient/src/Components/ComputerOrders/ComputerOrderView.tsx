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

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (!order)
    return <p className="text-center text-danger mt-5">Order not found.</p>;

  return (
    <div className="container mt-5">
      <div className="row align-items-start">
        {/* Order Details */}
        <div className="col-md-8">
          <h2>Computer order details</h2>
          <div className="card shadow p-4 mt-3">
            <dl>
              <dt>Id:</dt>
              <dd>{order.id}</dd>
              <dt>Customer's Name:</dt>
              <dd>{order.customer.displayName}</dd>
              <dt>Customer's Cost Center:</dt>
              <dd>{order.customer.costCenter}</dd>
              <dt>Device Category:</dt>
              <dd>{order.computerCategory.name}</dd>
              <dt>Pickup Location:</dt>
              <dd>{order.pickupLocation}</dd>
              <dt>Note:</dt>
              <dd>{order.note}</dd>
              <dt>Order's Status:</dt>
              <dd>{order.status}</dd>
            </dl>
          </div>
          <div className="mt-3 mb-2">
            <Link to="/computer-orders" className="btn btn-primary me-2">
              Back to Orders
            </Link>
            {order.computer !== null && order.status !== "Delivered" && (
              <button className="btn btn-success" onClick={handleDeliver}>
                Deliver Device
              </button>
            )}
          </div>
        </div>
        {/* Allocated Device or Allocation Section */}
        <div className="col-md-4">
          {order.computer ? (
            <>
              <h2>Allocated Device</h2>
              <div className="card shadow p-4 mt-3">
                <ul className="list-group">
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
                    <strong>Serial number:</strong>{" "}
                    {order.computer.serialNumber}
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h2>Allocate Device</h2>
              <input
                type="text"
                className="form-control mb-3 mt-3"
                placeholder="Search by hostname..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="card shadow p-3">
                {filteredDevices.length === 0 ? (
                  <div>No devices available for allocation.</div>
                ) : (
                  <ul className="list-group">
                    {filteredDevices.map((device) => (
                      <li
                        key={device.id}
                        className="list-group-item d-flex flex-column"
                      >
                        <strong>{device.hostname}</strong>
                        <span>Category: {device.computerCategory.name}</span>
                        <span>Model: {device.model}</span>
                        <span>Serial number: {device.serialNumber}</span>
                        <span>Status: {device.status}</span>
                        <button
                          className="btn btn-success btn-sm mt-2 align-self-end"
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
