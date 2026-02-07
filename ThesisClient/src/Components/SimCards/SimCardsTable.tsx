import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { SimCardResponse } from "../../Types/MobileTypes";
import CustomLink from "../Shared/CustomLink";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Sim Cards</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="mb-4 flex gap-4 flex-col">
          <div className="flex gap-2">
            <CustomLink to="/sim-cards/create" label="Create" />
          </div>
        </div>
        <div>
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-4 py-2 border-b">Id</th>
                <th className="text-left px-4 py-2 border-b">Phone Number</th>
                <th className="text-left px-4 py-2 border-b">
                  Call Control Group
                </th>
                <th className="text-left px-4 py-2 border-b">Data Enabled</th>
                <th className="text-left px-4 py-2 border-b">Status</th>
                <th className="text-left px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{d.id}</td>
                  <td className="px-4 py-2 border-b">{d.phoneNumber}</td>
                  <td className="px-4 py-2 border-b">
                    {d.simCallControlGroup.name}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {d.simCallControlGroup.isDataEnabled ? "True" : "False"}
                  </td>
                  <td className="px-4 py-2 border-b">{d.status}</td>
                  <td className="px-4 py-2 border-b flex gap-1">
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
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition"
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
