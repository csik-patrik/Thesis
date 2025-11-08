import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileOrderResponse } from "../../Types/MobileTypes";

export default function MobileOrderWaitingForApprovalTable() {
  const { user } = useAuth();
  const [data, setData] = useState<MobileOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get<MobileOrderResponse[]>(
          "http://localhost:5268/mobile-orders/approval",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <h3>Loading your mobile orders...</h3>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
        <h1 className="text-muted mb-3">
          💻 There aren't any orders waiting for approval
        </h1>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Mobile orders waiting for approval</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="d-flex justify-content-between align-items-center mb-3"></div>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Device Type</th>
                <th scope="col">Pickup Location</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.customer.displayName}</td>
                  <td>{d.mobileDeviceCategory.name}</td>
                  <td>{d.pickupLocation}</td>
                  <td>{d.status}</td>
                  <td>
                    <Link
                      to={`/mobile-orders/${d.id}`}
                      className="btn btn-primary btn-sm me-2 text-light"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
