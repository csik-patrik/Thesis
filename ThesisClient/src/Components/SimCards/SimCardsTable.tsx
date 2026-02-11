import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { SimCardResponse } from "../../Types/MobileTypes";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";
import Button from "../Shared/Button";

export default function SimCardsTable() {
  const [data, setData] = useState<SimCardResponse[]>([]);
  const [callControlGroupfilter, setcallControlGroupfilter] =
    useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

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

  const callControlGroups = Array.from(
    new Set(data.map((device) => device.simCallControlGroup.name)),
  );
  const statuses = Array.from(new Set(data.map((device) => device.status)));

  const filteredData = data.filter((device) => {
    const callControlGroupMatch = callControlGroupfilter
      ? device.simCallControlGroup.name === callControlGroupfilter
      : true;

    const statusMatch = statusFilter ? device.status === statusFilter : true;
    return callControlGroupMatch && statusMatch;
  });

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Sim Cards</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="mb-4 flex gap-4 flex-col">
          <div className="flex gap-2">
            <CustomLink to="/sim-cards/create" label="Create" />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span>Call control group</span>
              <select
                value={callControlGroupfilter}
                onChange={(e) => setcallControlGroupfilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All</option>
                {callControlGroups.map((callControlGroup) => (
                  <option key={callControlGroup} value={callControlGroup}>
                    {callControlGroup}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div>
          <Table
            headerItems={[
              "Id",
              "Phone number",
              "Call control group",
              "Data enabled",
              "Status",
              "Actions",
            ]}
          >
            {filteredData.map((d) => (
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
                  <Button handleDelete={() => handleDelete(d.id)} />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
