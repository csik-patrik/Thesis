import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface SimCard {
  id: number;
  phoneNumber: string;
  department: string;
  callControlGroup: string;
  isDataEnabled: boolean;
  type: string;
  status: string;
}

function SimCardsTable() {
  const [data, setData] = useState<SimCard[]>([]);
  useEffect(() => {
    axios
      .get<SimCard[]>("http://localhost:5268/api/sim-cards")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/sim-cards/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id)); // update table
      toast.success("Sim card deleted successfully!");
    } catch (err) {
      console.error("Error deleting sim card:", err);
      alert("Failed to delete sim card.");
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
      <h1>Sim cards</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2" to="/sim-cards/create">
          Create
        </Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">PhoneNumber</th>
              <th scope="col">Department</th>
              <th scope="col">CallControlGroup</th>
              <th scope="col">IsDataEnabled</th>
              <th scope="col">Type</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td scope="row">{d.id}</td>
                <td>{d.phoneNumber}</td>
                <td>{d.department}</td>
                <td>{d.callControlGroup}</td>
                <td>{d.isDataEnabled ? "True" : "False"}</td>
                <td>{d.type}</td>
                <td>{d.status}</td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">View</button>
                  <Link
                    to={`/sim-cards/${d.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                  <button
                    className="btn btn-sm btn-danger me-2"
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
  );
}

export default SimCardsTable;
