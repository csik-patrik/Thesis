import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";

import type {
  MobileOrderResponse,
  MobileDeviceResponse,
  SimCardResponse,
} from "../../Types/MobileTypes";

function MobileOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<MobileOrderResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [devices, setDevices] = useState<MobileDeviceResponse[]>([]);
  const [allocating, setAllocating] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [simCards, setSimCards] = useState<SimCardResponse[]>([]);
  const [allocatingSim, setAllocatingSim] = useState<number | null>(null);
  const [simSearch, setSimSearch] = useState("");

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get<MobileOrderResponse>(
          `http://localhost:5268/mobile-orders/${id}`,
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
  }, [id, user]);

  useEffect(() => {
    if (!user || !user.token) return;
    if (!order || order.mobileDevice) return;

    axios
      .get<MobileDeviceResponse[]>(
        `http://localhost:5268/mobile-devices/allocation/${order?.mobileDeviceCategory.id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => setDevices(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable devices.");
        console.error("Error fetching allocable devices:", err);
      });
  }, [order, user]);

  // Only fetch allocable sim cards if a device is allocated and no sim card is allocated
  useEffect(() => {
    if (!user || !user.token) return;
    if (!order || !order.mobileDevice || order.mobileDevice.simCard) return;

    axios
      .get<SimCardResponse[]>(
        `http://localhost:5268/sim-cards/allocation/${order.simCallControlGroup.id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => setSimCards(res.data))
      .catch((err) => {
        toast.error("Error fetching allocable sim cards.");
        console.error("Error fetching allocable sim cards:", err);
      });
  }, [order, user]);

  const handleAllocateMobileDevice = async (deviceId: number) => {
    setAllocating(deviceId);
    try {
      await axios.put(
        `http://localhost:5268/mobile-orders/allocate/device/`,
        {
          orderId: id,
          mobileDeviceId: deviceId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Device allocated successfully!");
      setDevices((prev) => prev.filter((d) => d.id !== deviceId));
      // Refresh order to show allocated device
      const res = await axios.get<MobileOrderResponse>(
        `http://localhost:5268/mobile-orders/${id}`
      );
      setOrder(res.data);
    } catch (err) {
      toast.error("Failed to allocate device.");
      console.error("Allocation error:", err);
    }
  };

  const handleAllocateSim = async (simCardId: number) => {
    setAllocatingSim(simCardId);
    try {
      await axios.put(
        `http://localhost:5268/mobile-orders/allocate/sim-card`,
        {
          orderId: id,
          simCardId: simCardId,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Sim card allocated successfully!");
      setSimCards((prev) => prev.filter((s) => s.id !== simCardId));
      // Refresh order to show allocated sim card
      const res = await axios.get<MobileOrderResponse>(
        `http://localhost:5268/mobile-orders/${id}`
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
      await axios.put(`http://localhost:5268/mobile-orders/deliver/${id}`);
      toast.success("Order marked as delivered!");
      // Optionally refresh order data
      const res = await axios.get<MobileOrderResponse>(
        `http://localhost:5268/mobile-orders/${id}`
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
        `http://localhost:5268/mobile-orders/approval/${id}`,
        decision,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // 🔹 Refresh order
      const res = await axios.get<MobileOrderResponse>(
        `http://localhost:5268/mobile-orders/${id}`,
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

  // Filter sim cards by phone number
  const filteredSimCards = simCards.filter((sim) =>
    sim.phoneNumber.toLowerCase().includes(simSearch.toLowerCase())
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
              <dt>Customer's Name:</dt>
              <dd>{order.customer.displayName}</dd>
              <dt>Customer's Cost Center:</dt>
              <dd>{order.customer.costCenter}</dd>
              <dt>Device Category:</dt>
              <dd>{order.mobileDeviceCategory.name}</dd>
              <dt>Call Control Group:</dt>
              <dd>{order.simCallControlGroup.name}</dd>
              <dt>Pickup Location:</dt>
              <dd>{order.pickupLocation}</dd>
              <dt>Note:</dt>
              <dd>{order.note}</dd>
              <dt>Order's Status:</dt>
              <dd>{order.status}</dd>
              <dt className="col-sm-4">Approver:</dt>
              <dd className="col-sm-8">
                {order.approver.displayName} - {order.approver.department}
              </dd>
            </dl>
          </div>
          <div className="mt-3 mb-2">
            {user?.roles.includes("Admin") && (
              <Link to="/mobile-orders" className="btn btn-primary me-2">
                Back to Orders
              </Link>
            )}
            {user?.roles.includes("Group leader") && (
              <>
                <Link
                  to="/mobile-orders/approval"
                  className="btn btn-primary me-2"
                >
                  Back to Orders
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

            {order.mobileDevice !== null &&
              user?.roles.includes("Admin") &&
              order.mobileDevice.simCard !== null &&
              order.status !== "Delivered" && (
                <button className="btn btn-success" onClick={handleDeliver}>
                  Deliver Device
                </button>
              )}
          </div>
        </div>
        {/* Allocated Device or Allocation Section */}
        {user?.roles.includes("Admin") && (
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
                      {order.mobileDevice.mobileDeviceCategory.name}
                    </li>
                    <li className="list-group-item">
                      <strong>IMEI:</strong> {order.mobileDevice.imeiNumber}
                    </li>
                    <li className="list-group-item">
                      <strong>Serial:</strong> {order.mobileDevice.serialNumber}
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
                          <span>
                            Category: {device.mobileDeviceCategory.name}
                          </span>
                          <span>IMEI: {device.imeiNumber}</span>
                          <span>Serial: {device.serialNumber}</span>
                          <span>Status: {device.status}</span>
                          <button
                            className="btn btn-success btn-sm mt-2 align-self-end"
                            disabled={allocating === device.id}
                            onClick={() =>
                              handleAllocateMobileDevice(device.id)
                            }
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
            {order.mobileDevice &&
              (order.mobileDevice.simCard ? (
                <>
                  <h2 className="mt-4">Allocated Sim Card</h2>
                  <div className="card shadow p-4 mt-3">
                    <ul className="list-group">
                      <li className="list-group-item">
                        <strong>Phone Number:</strong>{" "}
                        {order.mobileDevice.simCard.phoneNumber}
                      </li>
                      <li className="list-group-item">
                        <strong>Call Control Group:</strong>{" "}
                        {order.mobileDevice.simCard.simCallControlGroup.name}
                      </li>
                      <li className="list-group-item">
                        <strong>Data Enabled:</strong>{" "}
                        {order.mobileDevice.simCard.simCallControlGroup
                          .isDataEnabled
                          ? "Yes"
                          : "No"}
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-4">Allocate Sim Card</h2>
                  <input
                    type="text"
                    className="form-control mb-3 mt-3"
                    placeholder="Search by phone number..."
                    value={simSearch}
                    onChange={(e) => setSimSearch(e.target.value)}
                  />
                  <div className="card shadow p-3">
                    {filteredSimCards.length === 0 ? (
                      <div>No sim cards available for allocation.</div>
                    ) : (
                      <ul className="list-group">
                        {filteredSimCards.map((sim) => (
                          <li
                            key={sim.id}
                            className="list-group-item d-flex flex-column"
                          >
                            <strong>{sim.phoneNumber}</strong>
                            <span>
                              Call Control Group: {sim.simCallControlGroup.name}
                            </span>
                            <span>
                              Data Enabled:{" "}
                              {sim.simCallControlGroup.isDataEnabled
                                ? "Yes"
                                : "No"}
                            </span>
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
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MobileOrderView;
