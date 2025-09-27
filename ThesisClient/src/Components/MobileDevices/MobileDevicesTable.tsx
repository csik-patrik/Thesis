import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface MobileDevice {
  id: number;
  hostname: string;
  mobileDeviceCategory: string;
  imeiNumber: string;
  serialNumber: string;
  iosVersion: string;
  batteryStatus: string;
  deviceStatus: string;
  deviceStatusReason: string;
}

function MobileDevicesTable() {
  const [data, setData] = useState<MobileDevice[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [statusReasonFilter, setStatusReasonFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    axios
      .get<MobileDevice[]>("http://localhost:5268/api/mobile-devices")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/api/mobile-devices/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id)); // update table
      toast.success("Mobile deleted successfully!");
    } catch (err) {
      console.error("Error deleting mobile device:", err);
      alert("Failed to delete sim card.");
    }
  };

  // Get unique device categories for the filter dropdown
  const categories = Array.from(
    new Set(data.map((device) => device.mobileDeviceCategory))
  );
  const statuses = Array.from(
    new Set(data.map((device) => device.deviceStatus))
  );
  const statusReasons = Array.from(
    new Set(data.map((device) => device.deviceStatusReason))
  );

  // Filter data by device category, status, and status reason
  const filteredData = data.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.mobileDeviceCategory === categoryFilter
      : true;
    const statusMatch = statusFilter
      ? device.deviceStatus === statusFilter
      : true;
    const reasonMatch = statusReasonFilter
      ? device.deviceStatusReason === statusReasonFilter
      : true;
    return categoryMatch && statusMatch && reasonMatch;
  });

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>Mobile devices</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2" to="/mobiles/create">
          Create
        </Link>
        <Link className="btn btn-success" to="/mobiles/create-bulk">
          Create bulk
        </Link>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Id</th>
                <th scope="col">Hostname</th>
                <th scope="col">
                  Category
                  <select
                    id="categoryFilter"
                    className="form-select form-select-sm mt-2"
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
                </th>
                <th scope="col">Imei number</th>
                <th scope="col">Serial number</th>
                <th scope="col">IOs version</th>
                <th scope="col">Battery status</th>
                <th scope="col">
                  Status
                  <select
                    id="statusFilter"
                    className="form-select form-select-sm mt-2"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </th>
                <th scope="col">
                  Status reason
                  <select
                    id="statusReasonFilter"
                    className="form-select form-select-sm mt-2"
                    value={statusReasonFilter}
                    onChange={(e) => setStatusReasonFilter(e.target.value)}
                  >
                    <option value="">All</option>
                    {statusReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td scope="row">{d.id}</td>
                  <td>{d.hostname}</td>
                  <td>{d.mobileDeviceCategory}</td>
                  <td>{d.imeiNumber}</td>
                  <td>{d.serialNumber}</td>
                  <td>{d.iosVersion}</td>
                  <td>{d.batteryStatus}</td>
                  <td>{d.deviceStatus}</td>
                  <td>{d.deviceStatusReason}</td>
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

export default MobileDevicesTable;
