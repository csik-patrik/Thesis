import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import NavBar from "../NavBar/NavBar";

interface MobileOrder {
  id: number;
  requesterName: string;
  requesterUsername: string;
  customerName: string;
  customerUsername: string;
  customersCostCenter: string;
  deviceType: string;
  callControlGroup: string;
  pickupLocation: string;
  status: string;
  createdBy: string;
  createdAt: string;
  modifiedBy: string;
  modifiedAt: string;
}

function MobileOrderView() {
  const { id } = useParams<{ id: string }>(); // get ID from URL
  const [order, setOrder] = useState<MobileOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get<MobileOrder>(
          `http://localhost:5268/api/mobile-orders/${id}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching mobile order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  if (!order)
    return <p className="text-center text-danger mt-5">Order not found.</p>;

  return (
    <>
      <NavBar />
      <div className="container mt-5">
        <h2>Mobile Order Details</h2>
        <div className="card shadow p-4 mt-3">
          <p>
            <strong>Id:</strong> {order.id}
          </p>
          <p>
            <strong>Requester's Name:</strong> {order.requesterName}
          </p>
          <p>
            <strong>Requester's Username:</strong> {order.requesterUsername}
          </p>
          <p>
            <strong>Customer's Name:</strong> {order.customerName}
          </p>
          <p>
            <strong>Customer's Username:</strong> {order.customerUsername}
          </p>
          <p>
            <strong>Customer's Cost Center:</strong> {order.customersCostCenter}
          </p>
          <p>
            <strong>Device Type:</strong> {order.deviceType}
          </p>
          <p>
            <strong>Call Control Grouop:</strong> {order.callControlGroup}
          </p>
          <p>
            <strong>Pickup Location:</strong> {order.pickupLocation}
          </p>
          <p>
            <strong>Order's status:</strong> {order.status}
          </p>
          <p>
            <strong>Created By:</strong> {order.createdBy}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Modified By:</strong> {order.modifiedBy}
          </p>
          <p>
            <strong>Modified At:</strong>{" "}
            {new Date(order.modifiedAt).toLocaleString()}
          </p>
        </div>
        <div className="mt-3">
          <Link to="/mobile-orders" className="btn btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    </>
  );
}

export default MobileOrderView;
