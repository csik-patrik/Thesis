import { useEffect, useState } from "react";
import type { ComputerCategoryResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

export default function ComputerCategoriesTable() {
  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5268/computer-categories`)
      .then((response) => setComputerCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light">
      <h1>Mobile device categories</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link
          className="btn btn-success me-2"
          to="/admin/computers/categories/create"
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
            {computerCategories.map((d) => (
              <tr key={d.id}>
                <td scope="row">{d.id}</td>
                <td>{d.name}</td>
                <td>
                  <Link
                    to={`/admin/mobile-device-categories/${d.id}`}
                    className="btn btn-warning btn-sm me-2"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
