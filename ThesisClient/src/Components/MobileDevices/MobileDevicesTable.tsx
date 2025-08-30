import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface MobileDevice {
  id: number;
  hostname: string;
  type: string;
  imeiNumber: string;
  serialNumber: string;
  iosVersion: string;
  batteryStatus: string;
}

function MobileDevicesTable() {
  const [data, setData] = useState<MobileDevice[]>([]);

  useEffect(() => {
    axios
      .get<MobileDevice[]>("http://localhost:5268/api/mobile-devices")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
      <h1>Mobile devices</h1>
      <div className="w-75 rounded bg-white border shadow p-4">
        <Link className="btn btn-success me-2" to="/mobiles/create">
          Create
        </Link>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Id</th>
              <th scope="col">Hostname</th>
              <th scope="col">Type</th>
              <th scope="col">Imei number</th>
              <th scope="col">Serial number</th>
              <th scope="col">IOs version</th>
              <th scope="col">Battery status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td scope="row">{d.id}</td>
                <td>{d.hostname}</td>
                <td>{d.type}</td>
                <td>{d.imeiNumber}</td>
                <td>{d.serialNumber}</td>
                <td>{d.iosVersion}</td>
                <td>{d.batteryStatus}</td>
                <td>actions</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MobileDevicesTable;
