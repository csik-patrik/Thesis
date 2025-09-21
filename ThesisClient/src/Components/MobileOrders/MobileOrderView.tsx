import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface AllocableDevice {
  id: number;
  hostname: string;
  mobileDeviceCategory: string;
  imeiNumber: string;
  serialNumber: string;
  iosVersion: string;
  batteryStatus: number;
  userId: number | null;
  simCard: any;
  deviceStatus: string | null;
  deviceStatusReason: string | null;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

interface MobileOrder {
  id: number;
  requesterName: string;
  requesterUsername: string;
  customerName: string;
  customerUsername: string;
  customersCostCenter: string;
  mobileDeviceCategory: string;
  callControlGroup: string;
  pickupLocation: string;
  status: string;
  simCard?: SimCard | null;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
  note?: string | null;
  mobileDevice?: AllocableDevice | null;
}

interface SimCard {
  id: number;
  phoneNumber: string;
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  type: string;
  status: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
}

function MobileOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<AllocableDevice[]>([]);
  const [allocating, setAllocating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [simCards, setSimCards] = useState<SimCard[]>([]);
  const [allocatingSim, setAllocatingSim] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get<MobileOrder>(
          `http://localhost:5268/api/mobile-orders/${id}`
        );
        setOrder(res.data);
      } catch (err) {
        toast.error("Error fetching mobile order.");
        console.error("Error fetching mobile order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (!order || order.mobileDevice) return; // Only fetch if order exists and no device is allocated
    axios
      .get<AllocableDevice[]>(
        `http://localhost:5268/api/mobile-devices/for-allocation/${order?.id}`
      )
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });
  }, [order]);

  useEffect(() => {
    if (!order || order.simCard) return; // Only fetch if order exists and no sim card is allocated
    axios
      .get<SimCard[]>(
        `http://localhost:5268/api/sim-cards/for-allocation/${order.id}`
      )
      .then((res) => setSimCards(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable sim cards.");
        console.error("Error fetching allocable sim cards:", err);
      });
  }, [order]);

  const handleAllocate = async (deviceId: number) => {
    setAllocating(deviceId);
    try {
      await axios.put(
        `http://localhost:5268/api/mobile-orders/allocate/${id}`,
        deviceId.toString(), // send as string
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Device allocated successfully!");
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      // Refresh order to show allocated device
      const res = await axios.get<MobileOrder>(
        `http://localhost:5268/api/mobile-orders/${id}`
      );
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    } finally {
      setAllocating(null);
    }
  };

  const handleAllocateSim = async (simCardId: number) => {
    setAllocatingSim(simCardId);
    try {
      await axios.put(
        `http://localhost:5268/api/mobile-orders/allocate-sim/${id}`,
        simCardId.toString(),
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Sim card allocated successfully!");
      setSimCards((prev) => prev.filter((s) => s.id !== simCardId));
      // Refresh order to show allocated sim card
      const res = await axios.get<MobileOrder>(
        `http://localhost:5268/api/mobile-orders/${id}`
      );
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to allocate sim card.");
      console.error("Sim allocation error:", err);
    } finally {
      setAllocatingSim(null);
    }
  };

  const handleDeliver = async () => {
    try {
      await axios.put(`http://localhost:5268/api/mobile-orders/deliver/${id}`);
      toast.success("Order marked as delivered!");
      // Optionally refresh order data
      const res = await axios.get<MobileOrder>(
        `http://localhost:5268/api/mobile-orders/${id}`
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
          <h2>Mobile Order Details</h2>
          <div className="card shadow p-4 mt-3">
            <dl>
              <dt>Id:</dt>
              <dd>{order.id}</dd>
              <dt>Requester's Name:</dt>
              <dd>{order.requesterName}</dd>
              <dt>Requester's Username:</dt>
              <dd>{order.requesterUsername}</dd>
              <dt>Customer's Name:</dt>
              <dd>{order.customerName}</dd>
              <dt>Customer's Username:</dt>
              <dd>{order.customerUsername}</dd>
              <dt>Customer's Cost Center:</dt>
              <dd>{order.customersCostCenter}</dd>
              <dt>Device Category:</dt>
              <dd>{order.mobileDeviceCategory}</dd>
              <dt>Call Control Group:</dt>
              <dd>{order.callControlGroup}</dd>
              <dt>Pickup Location:</dt>
              <dd>{order.pickupLocation}</dd>
              <dt>Order's Status:</dt>
              <dd>{order.status}</dd>
              <dt>Note:</dt>
              <dd>
                {order.note || <span className="text-muted">No note</span>}
              </dd>
              <dt>Created By:</dt>
              <dd>{order.createdBy}</dd>
              <dt>Created At:</dt>
              <dd>{new Date(order.createdAt).toLocaleString()}</dd>
              <dt>Modified By:</dt>
              <dd>{order.modifiedBy}</dd>
              <dt>Modified At:</dt>
              <dd>{new Date(order.modifiedAt).toLocaleString()}</dd>
            </dl>
          </div>
        </div>
        {/* Allocated Device or Allocation Section */}
        <div className="col-md-4">
          {order.mobileDevice ? (
            <>
              <h2>Allocated Device</h2>
              <div className="card shadow p-4 mt-3">
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>Hostname:</strong> {order.mobileDevice.hostname}
                  </li>
                  <li className="list-group-item">
                    <strong>Category:</strong>{" "}
                    {order.mobileDevice.mobileDeviceCategory}
                  </li>
                  <li className="list-group-item">
                    <strong>IMEI:</strong> {order.mobileDevice.imeiNumber}
                  </li>
                  <li className="list-group-item">
                    <strong>Serial:</strong> {order.mobileDevice.serialNumber}
                  </li>
                  <li className="list-group-item">
                    <strong>iOS:</strong> {order.mobileDevice.iosVersion}
                  </li>
                  <li className="list-group-item">
                    <strong>Battery:</strong> {order.mobileDevice.batteryStatus}
                    %
                  </li>
                  <li className="list-group-item">
                    <strong>Created By:</strong> {order.mobileDevice.createdBy}
                  </li>
                  <li className="list-group-item">
                    <strong>Created At:</strong>{" "}
                    {new Date(order.mobileDevice.createdAt).toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Modified By:</strong>{" "}
                    {order.mobileDevice.modifiedBy}
                  </li>
                  <li className="list-group-item">
                    <strong>Modified At:</strong>{" "}
                    {new Date(order.mobileDevice.modifiedAt).toLocaleString()}
                  </li>
                </ul>
                {order.status !== "Delivered" && (
                  <button
                    className="btn btn-success mt-3"
                    onClick={handleDeliver}
                  >
                    Deliver Device
                  </button>
                )}
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
                        <span>Category: {device.mobileDeviceCategory}</span>
                        <span>IMEI: {device.imeiNumber}</span>
                        <span>Serial: {device.serialNumber}</span>
                        <span>iOS: {device.iosVersion}</span>
                        <span>Status: {device.deviceStatus}</span>
                        <button
                          className="btn btn-success btn-sm mt-2 align-self-end"
                          disabled={allocating === device.id}
                          onClick={() => handleAllocate(device.id)}
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
          {/* Allocated Sim Card or Allocation Section */}
          {order.simCard ? (
            <>
              <h2 className="mt-4">Allocated Sim Card</h2>
              <div className="card shadow p-4 mt-3">
                <ul className="list-group">
                  <li className="list-group-item">
                    <strong>Phone Number:</strong> {order.simCard.phoneNumber}
                  </li>
                  <li className="list-group-item">
                    <strong>Department:</strong> {order.simCard.department}
                  </li>
                  <li className="list-group-item">
                    <strong>Call Control Group:</strong>{" "}
                    {order.simCard.callControlGroup}
                  </li>
                  <li className="list-group-item">
                    <strong>Data Enabled:</strong>{" "}
                    {order.simCard.isDataEnabled ? "Yes" : "No"}
                  </li>
                  <li className="list-group-item">
                    <strong>Type:</strong> {order.simCard.type}
                  </li>
                  <li className="list-group-item">
                    <strong>Status:</strong> {order.simCard.status}
                  </li>
                  <li className="list-group-item">
                    <strong>Created By:</strong> {order.simCard.createdBy}
                  </li>
                  <li className="list-group-item">
                    <strong>Created At:</strong>{" "}
                    {new Date(order.simCard.createdAt).toLocaleString()}
                  </li>
                  <li className="list-group-item">
                    <strong>Modified By:</strong> {order.simCard.modifiedBy}
                  </li>
                  <li className="list-group-item">
                    <strong>Modified At:</strong>{" "}
                    {new Date(order.simCard.modifiedAt).toLocaleString()}
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-4">Allocate Sim Card</h2>
              <div className="card shadow p-3">
                {simCards.length === 0 ? (
                  <div>No sim cards available for allocation.</div>
                ) : (
                  <ul className="list-group">
                    {simCards.map((sim) => (
                      <li
                        key={sim.id}
                        className="list-group-item d-flex flex-column"
                      >
                        <strong>{sim.phoneNumber}</strong>
                        <span>Department: {sim.department}</span>
                        <span>Call Control Group: {sim.callControlGroup}</span>
                        <span>
                          Data Enabled: {sim.isDataEnabled ? "Yes" : "No"}
                        </span>
                        <span>Type: {sim.type}</span>
                        <span>Status: {sim.status}</span>
                        <button
                          className="btn btn-success btn-sm mt-2 align-self-end"
                          disabled={allocatingSim === sim.id}
                          onClick={() => handleAllocateSim(sim.id)}
                        >
                          {allocatingSim === sim.id
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
          <div className="mt-3 mb-2">
            <Link to="/mobile-orders" className="btn btn-primary mb-2">
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileOrderView;
