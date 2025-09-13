import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
}

function MobileOrdersTable() {
  const [data, setData] = useState<MobileOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<MobileOrder[]>("http://localhost:5268/api/mobile-orders")
      .then((res) => setData(res.data))
      .catch((err) => {
        toast.error("Failed to fetch mobile orders.");
        console.log(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/mobile-orders/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Mobile order deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile order:", err);
      toast.error("Failed to delete mobile order.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Mobile Orders</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2 mb-3" to="/mobile-orders/create">
          Create
        </Link>
        {loading ? (
          <div>Loading...</div>
        ) : data.length === 0 ? (
          <div>No mobile orders found.</div>
        ) : (
          <table className="table table-striped">
            <caption className="visually-hidden">List of mobile orders</caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Customer Name</th>
                <th scope="col">Customer Username</th>
                <th scope="col">Device Type</th>
                <th scope="col">Pickup Location</th>
                <th scope="col">Status</th>
                <th scope="col">Created By</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.customerName}</td>
                  <td>{d.customerUsername}</td>
                  <td>{d.deviceType}</td>
                  <td>{d.pickupLocation}</td>
                  <td>{d.status}</td>
                  <td>{d.createdBy}</td>
                  <td>
                    <Link
                      to={`/mobile-orders/${d.id}`}
                      className="btn btn-primary btn-sm me-2 text-light"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-danger btn-sm text-light"
                      onClick={() => handleDelete(d.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MobileOrdersTable;
