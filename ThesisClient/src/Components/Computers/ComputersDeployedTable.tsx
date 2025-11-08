import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import { toast } from "react-toastify";

export default function ComputersDeployedTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerResponse[]>([]);
  const [search, setSearch] = useState<string>("");

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [returnData, setReturnData] = useState({
    status: "In inventory",
    statusReason: "In inventory",
  });

  useEffect(() => {
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/deployed",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, [user]);

  const filteredData = data.filter((device) => {
    const searchMatch = device.hostname
      .toLowerCase()
      .includes(search.toLowerCase()); // Filter by hostname
    return searchMatch;
  });

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
        `http://localhost:5268/computers/return/${deviceId}`,
        { status, statusReason },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success(`Device returned to "${statusReason}" successfully!`);

      setData((prev) => prev.filter((d) => d.id !== deviceId));

      const res = await axios.get<ComputerResponse[]>(
        "http://localhost:5268/computers/deployed",
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
      <h1>Deployed computers</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <div className="table-responsive">
          <div className="d-flex align-items-center mb-3">
            <input
              type="text"
              className="form-control form-control-sm w-auto"
              placeholder="Search by hostname"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
