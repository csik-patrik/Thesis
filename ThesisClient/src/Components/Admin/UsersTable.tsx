import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface UserRole {
  id: number;
  name: string;
}

interface MobileDevice {
  id: number;
  username: string;
  email: string;
  department: string;
  costCenter: string;
  userRoles: UserRole[];
}

export default function Users() {
  const [data, setData] = useState<MobileDevice[]>([]);

  useEffect(() => {
    axios
      .get<MobileDevice[]>("http://localhost:5268/api/admin/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/admin/users/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
      <h1>Users</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2" to="/admin/users/create">
          Create
        </Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Username</th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Cost center</th>
              <th scope="col">Roles</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td scope="row">{d.id}</td>
                <td>{d.username}</td>
                <td>{d.email}</td>
                <td>{d.department}</td>
                <td>{d.costCenter}</td>
                <td>
                  {d.userRoles.map((r) => (
                    <span key={r.id}>{r.name} </span>
                  ))}
                </td>
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
  );
}
