import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";

export default function DeployedMobileDevicesTable() {
  const [data, setData] = useState<MobileDeviceResponse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { user } = useAuth();

  console.log(user);

  useEffect(() => {
    if (!user?.token) {
      toast.error("You must be logged in to view this page.");
      return;
    }
    axios
      .get<MobileDeviceResponse[]>(
        "http://localhost:5268/mobile-devices/deployed",
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        console.log("Fetched devices:", res.data);

        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [user]);

  // Get unique device categories for the filter dropdown
  const categories = Array.from(
    new Set(data.map((device) => device.mobileDeviceCategory.name))
  );

  // Filter data by device category, status, and status reason
  const filteredData = data.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory.name === categoryFilter
      : true;
    return categoryMatch;
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Deployed Mobile Devices</h1>
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
                <th scope="col">Imei number</th>
                <th scope="col">Serial number</th>
                <th scope="col">User</th>
                <th scope="col">Phone number</th>
                <th scope="col">Call control group</th>
                <th scope="col">Data enabled</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td scope="row">{d.id}</td>
                  <td>{d.hostname}</td>
                  <td>{d.mobileDeviceCategory.name}</td>
                  <td>{d.imeiNumber}</td>
                  <td>{d.serialNumber}</td>
                  <td>{d.user?.userName}</td>
                  <td>{d.simCard?.phoneNumber}</td>
                  <td>{d.simCard?.simCallControlGroup.name}</td>
                  <td>
                    {d.simCard?.simCallControlGroup.isDataEnabled
                      ? "True"
                      : "False"}
                  </td>
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
