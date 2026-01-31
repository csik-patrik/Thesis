import { useEffect, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";

export default function ComputersInInventoryTable() {
  const [data, setData] = useState<ComputerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user.token) return;

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/inventory",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      if (!user || !user.token) return;

      (await axios.delete(`http://localhost:5268/computers/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      }),
        setData((prev) => prev.filter((item) => item.id !== id)));
      toast.success("Computer deleted!");
    } catch (err) {
      console.error("Error deleting computer: ", err);
      toast.error("Error deleting computer!");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center px-4">
        <h1 className="text-gray-400 text-3xl mb-3">💻 No computers found</h1>
        <p className="text-gray-500 mb-4">
          It looks like there are no computers yet.
        </p>
        <Link
          to="/computers/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
        >
          Create a new computer
        </Link>
      </div>
    );
  }

  // ✅ Data loaded state
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 min-h-screen p-4">
      <h1 className="text-2xl font-semibold mb-6">Computers in inventory</h1>

      <div className="w-full max-w-6xl bg-white rounded-lg shadow p-4">
        <div className="flex gap-2 mb-4">
          <Link
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            to="/computers/create"
          >
            Create
          </Link>
          <Link
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            to="/computers/create-bulk"
          >
            Create bulk
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Id",
                  "Hostname",
                  "Category",
                  "Model",
                  "Serial number",
                  "Status",
                  "Status reason",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className={`px-3 py-2 text-left text-gray-700 font-medium border-b`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border-b">{d.id}</td>
                  <td className="px-3 py-2 border-b">{d.hostname}</td>
                  <td className="px-3 py-2 border-b">
                    {d.computerCategory.name}
                  </td>
                  <td className="px-3 py-2 border-b">{d.model}</td>
                  <td className="px-3 py-2 border-b">{d.serialNumber}</td>
                  <td className="px-3 py-2 border-b">{d.status}</td>
                  <td className="px-3 py-2 border-b">{d.statusReason}</td>
                  <td className="px-3 py-2 border-b text-center">
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400 text-sm"
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
