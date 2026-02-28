import { useEffect, useRef, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import CustomLink from "../Shared/CustomLink";
import Spinner from "../Shared/Spinner";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";

export default function ComputersInInventoryTable() {
  const { user } = useAuth();
  const [data, setData] = useState<ComputerResponse[]>([]);
  const [selectedComputerId, setSelectedComputerId] = useState(0);
  const [loading, setLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const dialog = useRef<ModalHandle>(null);

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

  function showModal(id: number) {
    setSelectedComputerId(id);
    dialog.current?.open();
  }

  // Get unique device categories for the filter dropdown
  const categories = Array.from(
    new Set(data.map((device) => device.computerCategory.name)),
  );

  // Filter data by device category
  const filteredData = data.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.computerCategory.name === categoryFilter
      : true;

    return categoryMatch;
  });

  if (loading) {
    return <Spinner />;
  }

  // No data state
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center bg-gray-100 text-center px-4">
        <h1 className="text-gray-400 text-3xl mb-3">💻 No computers found</h1>
        <p className="text-gray-500 mb-4">
          It looks like there are no computers yet.
        </p>
        <CustomLink color="green" to="/computers/create" label="Create" />
      </div>
    );
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected computer?"
        buttonText="Delete"
        buttonColor="red"
        handleSubmit={() => handleDelete(selectedComputerId)}
      ></Modal>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Computers</h1>
        <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex gap-2 mb-4 flex-col">
            <div className="flex gap-2">
              <CustomLink color="green" to="/computers/create" label="Create" />
              <CustomLink
                color="green"
                to="/computers/create-bulk"
                label="Create bulk"
              />
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span>Category</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value="">All</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                "Hostname",
                "Category",
                "Model",
                "Serial number",
                "Status",
                "Status reason",
                "Actions",
              ]}
            >
              {filteredData.map((computer) => (
                <tr key={computer.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{computer.id}</td>
                  <td className="px-4 py-2 border-b">{computer.hostname}</td>
                  <td className="px-4 py-2 border-b">
                    {computer.computerCategory.name}
                  </td>
                  <td className="px-4 py-2 border-b">{computer.model}</td>
                  <td className="px-4 py-2 border-b">
                    {computer.serialNumber}
                  </td>
                  <td className="px-4 py-2 border-b">{computer.status}</td>
                  <td className="px-4 py-2 border-b">
                    {computer.statusReason}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <Button
                      color="red"
                      label="Delete"
                      handleClick={() => showModal(computer.id)}
                    />
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
