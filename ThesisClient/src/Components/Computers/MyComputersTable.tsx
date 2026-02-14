import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { useAuth } from "../../Auth/AuthContext";
import axios from "axios";
import Table from "../Shared/Table";

export default function MyComputersTable() {
  const [data, setData] = useState<ComputerResponse[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (!user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/my-devices",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchDevices();
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">My computers</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <Table
          headerItems={[
            "Hostname",
            "Category",
            "Model",
            "Serial number",
            "Status",
            "Status reason",
          ]}
        >
          {data.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50 border-b">
              <td className="px-3 py-2">{d.hostname}</td>
              <td className="px-3 py-2">{d.computerCategory.name}</td>
              <td className="px-3 py-2">{d.model}</td>
              <td className="px-3 py-2">{d.serialNumber}</td>
              <td className="px-3 py-2">{d.status}</td>
              <td className="px-3 py-2">{d.statusReason}</td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
