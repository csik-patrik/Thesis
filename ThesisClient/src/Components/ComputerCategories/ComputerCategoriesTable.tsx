import { useEffect, useState } from "react";
import type { ComputerCategoryResponse } from "../../Types/ComputerTypes";
import axios from "axios";
import { toast } from "react-toastify";
import { FaComputer } from "react-icons/fa6";
import { Link } from "react-router-dom";
import CustomLink2 from "../Shared/CustomLink2";

export default function ComputerCategoriesTable() {
  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5268/computer-categories`)
      .then((response) => setComputerCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Computer categories
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage computer categories
            </p>
          </div>
          <CustomLink2
            to="/admin/computers/categories/create"
            label="Create new category"
          />
        </div>
        {/* ── Empty state ── */}
        {computerCategories.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <FaComputer />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              No computer categories yet
            </h3>
            <p className="text-sm text-gray-500 mb-6 max-w-xs">
              You haven't created any computer category yet. Create your first
              one to get started.
            </p>
          </div>
        ) : (
          <>
            {/* ── Table card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/70">
                      {["Id", "Name", "Actions"].map((h) => (
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
                    {computerCategories.map((d) => (
                      <tr
                        key={d.id}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                          {d.id}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                          {d.name}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/mobile-device-categories/${d.id}`}
                              className="text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
