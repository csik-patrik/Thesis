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
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 px-4">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-800">
        My computers
      </h1>

      <div className="w-full max-w-6xl rounded-lg bg-white border border-neutral-200 shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 text-left">
                <th className="px-3 py-2 font-medium text-neutral-700">Id</th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Hostname
                </th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Category
                </th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Model
                </th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Serial number
                </th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Status
                </th>
                <th className="px-3 py-2 font-medium text-neutral-700">
                  Status reason
                </th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-neutral-100 even:bg-neutral-50 hover:bg-neutral-100 transition"
                >
                  <td className="px-3 py-2 font-medium text-neutral-700">
                    {d.id}
                  </td>
                  <td className="px-3 py-2">{d.hostname}</td>
                  <td className="px-3 py-2">{d.computerCategory.name}</td>
                  <td className="px-3 py-2">{d.model}</td>
                  <td className="px-3 py-2">{d.serialNumber}</td>
                  <td className="px-3 py-2">{d.status}</td>
                  <td className="px-3 py-2">{d.statusReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
