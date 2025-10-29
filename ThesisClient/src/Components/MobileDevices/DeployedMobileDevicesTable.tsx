import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import type { MobileDeviceResponse } from "../../Types/MobileTypes";
import axios from "axios";

export default function DeployedMobileDevicesTable() {
  const [data, setData] = useState<MobileDeviceResponse[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const { user } = useAuth();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [returnData, setReturnData] = useState({
    status: "In inventory",
    statusReason: "In inventory",
  });

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

  const handleReturn = async (
    deviceId: number,
    status: string,
    statusReason: string
  ) => {
    if (!user?.token) {
      toast.error("Unauthorized — please log in again.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5268/mobile-devices/return/${deviceId}`,
        { status, statusReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(`Device marked as "${status}" successfully!`);

      setData((prev) => prev.filter((d) => d.id !== deviceId));

      const res = await axios.get<MobileDeviceResponse[]>(
        "http://localhost:5268/mobile-devices/deployed",
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setData(res.data);
    } catch (err) {
      console.error("Return error:", err);
      toast.error("Failed to return device.");
    }
  };

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
      {showReturnModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Return Device</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowReturnModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-bold">Status</label>
                  <select
                    className="form-select"
                    value={returnData.status}
                    onChange={(e) =>
                      setReturnData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option>In inventory</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Status Reason</label>
                  <select
                    className="form-select"
                    value={returnData.statusReason}
                    onChange={(e) =>
                      setReturnData((prev) => ({
                        ...prev,
                        statusReason: e.target.value,
                      }))
                    }
                  >
                    <option>In inventory</option>
                    <option>In repair</option>
                    <option>Pending disposal</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => {
                    if (selectedDeviceId) {
                      handleReturn(
                        selectedDeviceId,
                        returnData.status,
                        returnData.statusReason
                      );
                    }
                    setShowReturnModal(false);
                  }}
                >
                  Confirm Return
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        setSelectedDeviceId(d.id);
                        setShowReturnModal(true);
                      }}
                    >
                      Return
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
