import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";

export default function MyComputersTable() {
  const [data, setData] = useState<ComputerResponse[]>([]);

  const { user } = useAuth();

  console.log(user);

  useEffect(() => {
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/my-devices",
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

  return (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light vh-100">
      <h1>My computers</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
