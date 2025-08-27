import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface MobileOrder {
  id: number;
  customerName: string;
  customerUsername: string;
  deviceType: string;
  deviceCount: number;
  pickupLocation: string;
  status: string;
  createdBy: string;
}

function MobileOrdersTable() {
  const [data, setData] = useState<MobileOrder[]>([]);

  useEffect(() => {
    axios
      .get<MobileOrder[]>("http://localhost:5268/api/mobile-orders")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/mobile-orders/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id)); // update table
      toast.success("Mobile order deleted successfully!");
    } catch (err) {
      console.error("Error deleting sim card:", err);
      alert("Failed to delete sim card.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
        <h1>Mobile orders</h1>
        <div className="w-75 rounded bg-white border shadow p-4">
          <Link className="btn btn-success me-2" to="/mobile-orders/create">
            Create
          </Link>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">CustomerName</th>
                <th scope="col">CustomerUsername</th>
                <th scope="col">Device type</th>
                <th scope="col">DeviceCount</th>
                <th scope="col">PickupLocation</th>
                <th scope="col">Status</th>
                <th scope="col">CreatedBy</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td scope="row">{d.id}</td>
                  <td>{d.customerName}</td>
                  <td>{d.customerUsername}</td>
                  <td>{d.deviceType}</td>
                  <td>{d.deviceCount}</td>
                  <td>{d.pickupLocation}</td>
                  <td>{d.status}</td>
                  <td>{d.createdBy}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2">
                      View
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(d.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MobileOrdersTable;
