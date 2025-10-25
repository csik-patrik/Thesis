import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function ComputersTable() {
  const [data, setData] = useState<ComputerResponse[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/"
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/computers/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Computer deleted!");
    } catch (err) {
      console.error("Error deleting computer: ", err);
      toast.error("Error deleting computer!");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Computers</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2" to="/computers/create">
          Create
        </Link>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Hostname</th>
                <th scope="col">Category</th>
                <th scope="col">Model</th>
                <th scope="col">Serial number</th>
                <th scope="col">Status</th>
                <th scope="col">Status reason</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id}>
                  <td scope="row">{d.id}</td>
                  <td>{d.hostname}</td>
                  <td>{d.computerCategory.name}</td>
                  <td>{d.model}</td>
                  <td>{d.serialNumber}</td>
                  <td>{d.status}</td>
                  <td>{d.statusReason}</td>
                  <td>
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
        </div>
      </div>
    </div>
  );
}
