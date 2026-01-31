import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { SimCardResponse } from "../../Types/MobileTypes";

function SimCardsTable() {
  const [data, setData] = useState<SimCardResponse[]>([]);
  useEffect(() => {
    axios
      .get<SimCardResponse[]>("http://localhost:5268/sim-cards")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/sim-cards/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Sim card deleted successfully!");
    } catch (err) {
      console.error("Error deleting sim card:", err);
      alert("Failed to delete sim card.");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Sim Cards</h1>

      <div className="w-full max-w-4xl bg-white border rounded-lg shadow-md p-6">
        {/* Create Button */}
        <div className="mb-4">
          <Link
            to="/sim-cards/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Create
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Id</th>
                <th className="border px-4 py-2 text-left">Phone Number</th>
                <th className="border px-4 py-2 text-left">
                  Call Control Group
                </th>
                <th className="border px-4 py-2 text-left">Is Data Enabled</th>
                <th className="border px-4 py-2 text-left">Status</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{d.id}</td>
                  <td className="border px-4 py-2">{d.phoneNumber}</td>
                  <td className="border px-4 py-2">
                    {d.simCallControlGroup.name}
                  </td>
                  <td className="border px-4 py-2">
                    {d.simCallControlGroup.isDataEnabled ? "True" : "False"}
                  </td>
                  <td className="border px-4 py-2">{d.status}</td>
                  <td className="border px-4 py-2 flex flex-wrap gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition text-sm">
                      View
                    </button>
                    <Link
                      to={`/sim-cards/${d.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
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

export default SimCardsTable;
