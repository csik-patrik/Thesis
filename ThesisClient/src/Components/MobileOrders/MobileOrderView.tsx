import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
  const { id } = useParams<{ id: string }>();
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
        toast.error("Error fetching mobile order.");
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
    <div className="container mt-5">
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
          <dt>Device Type:</dt>
          <dd>{order.deviceType}</dd>
          <dt>Call Control Group:</dt>
          <dd>{order.callControlGroup}</dd>
          <dt>Pickup Location:</dt>
          <dd>{order.pickupLocation}</dd>
          <dt>Order's Status:</dt>
          <dd>{order.status}</dd>
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
      <div className="mt-3 mb-2">
        <Link to="/mobile-orders" className="btn btn-primary mb-2">
          Back to Orders
        </Link>
      </div>
    </div>
  );
}

export default MobileOrderView;
