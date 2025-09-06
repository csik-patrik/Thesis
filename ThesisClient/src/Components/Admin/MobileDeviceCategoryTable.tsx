import { useEffect, useState } from "react";
import type { MobileDeviceCategory } from "../../Types/MobileDeviceCategory";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function MobileDeviceCategoryTable() {
  const [data, setData] = useState<MobileDeviceCategory[]>([]);

  useEffect(() => {
    axios
      .get<MobileDeviceCategory[]>(
        "http://localhost:5268/api/admin/mobile-device-categories"
      )
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `http://localhost:5268/api/admin/mobile-device-categories/${id}`
      );
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
      <h1>Mobile device categories</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link
          className="btn btn-success me-2"
          to="/admin/mobile-device-categories/create"
        >
          Create
        </Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Name</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td scope="row">{d.id}</td>
                <td>{d.name}</td>
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
