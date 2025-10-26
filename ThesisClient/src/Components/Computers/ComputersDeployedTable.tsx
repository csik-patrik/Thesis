import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import axios from "axios";

export default function ComputersDeployedTable() {
  const [data, setData] = useState<ComputerResponse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    axios
      .get<ComputerResponse[]>("http://localhost:5268/computers/deployed")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const categories = Array.from(
    new Set(data.map((device) => device.computerCategory.name))
  );

  const filteredData = data.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.computerCategory.name === categoryFilter
      : true;
    return categoryMatch;
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Deployed computers</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="table-responsive">
          <div className="d-flex align-items-center mb-3">
            <label htmlFor="categoryFilter" className="form-label mb-0 me-2">
              Filter by Category:
            </label>
            <select
              id="categoryFilter"
              className="form-select form-select-sm w-auto"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Hostname</th>
                <th scope="col">Category</th>
                <th scope="col">Model</th>
                <th scope="col">Serial number</th>
                <th scope="col">User</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td scope="row">{d.id}</td>
                  <td>{d.hostname}</td>
                  <td>{d.computerCategory.name}</td>
                  <td>{d.model}</td>
                  <td>{d.serialNumber}</td>
                  <td>{d.user?.userName}</td>
                  <td>Actions</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
