import { useEffect, useRef, useState } from "react";
import type { ComputerResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../../Auth/AuthContext";
import Spinner from "../Shared/Spinner";
import type { ModalHandle } from "../Shared/Modal";
import Modal from "../Shared/Modal";
import { Link } from "react-router-dom";
import StatusBadge from "../Shared/StatusBadge";

export default function ComputersInInventoryTable() {
  const { user } = useAuth();
  const [computers, setComputers] = useState<ComputerResponse[]>([]);
  const [selectedComputerId, setSelectedComputerId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    if (!user || !user.token) return;

    setIsLoading(true);

    const fetchDevices = async () => {
      try {
        const res = await axios.get<ComputerResponse[]>(
          "http://localhost:5268/computers/inventory",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          },
        );
        setComputers(res.data);
      } catch (err) {
        console.error("Failed to fetch devices:", err);

        toast.error("Failed to load computers.");
      } finally {
        setIsLoading(false);
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
        setComputers((prev) => prev.filter((item) => item.id !== id)));
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
    new Set(computers.map((device) => device.computerCategory.name)),
  );

  // Filter data by device category
  const filteredData = computers.filter((device) => {
    const categoryMatch = categoryFilter
      ? device.computerCategory.name === categoryFilter
      : true;

    return categoryMatch;
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (computers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">
          There aren't any computers in the database yet!
        </h1>
        <div className="flex gap-2">
          <Link
            to="/computers/create"
            className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
          >
            Create
          </Link>
          <Link
            to="/computers/create-bulk"
            className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
          >
            Create bulk
          </Link>
        </div>
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Computers in inventory
              </h1>
              <p className="text-sm text-gray-500 mt-1">Manage computers</p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/computers/create"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create new
              </Link>
              <Link
                to="/computers/create-bulk"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create bulk
              </Link>
            </div>
          </div>
          {/* ── Empty state ── */}
          {computers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-teal-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                No orders yet
              </h3>
              <p className="text-sm text-gray-500 mb-6 max-w-xs">
                You haven't submitted any computer requests. Create your first
                one to get started.
              </p>
              <Link
                to="/computer-orders/create"
                className="px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm"
              >
                Create your first order
              </Link>
            </div>
          ) : (
            <>
              {/* ── Status filter tabs ── */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["All", ...categories].map((s) => (
                  <button
                    key={s}
                    onClick={() => setCategoryFilter(s)}
                    className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
                      categoryFilter === s
                        ? "bg-teal-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {s}
                    <span
                      className={`ml-1.5 text-xs ${categoryFilter === s ? "text-teal-200" : "text-gray-400"}`}
                    >
                      {s === "All"
                        ? computers.length
                        : computers.filter((c) => c.computerCategory.name === s)
                            .length}
                    </span>
                  </button>
                ))}
              </div>

              {/* ── Table card ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/70">
                        {[
                          "Id",
                          "Hostname",
                          "Category",
                          "Model",
                          "Serial number",
                          "Status",
                          "Status reason",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((d) => (
                        <tr
                          key={d.id}
                          className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                        >
                          <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                            {d.id}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                            {d.hostname}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.computerCategory.name}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.model}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-gray-600">
                            {d.serialNumber}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.status} />
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={d.statusReason} />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => showModal(d.id)}
                                className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredData.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-400">
                    No computers match the selected filter.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
