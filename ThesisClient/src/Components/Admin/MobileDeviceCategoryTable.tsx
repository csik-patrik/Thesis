import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";

export default function MobileDeviceCategoryTable() {
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  useEffect(() => {
    GetMobileDeviceCategories()
      .then((response) => setMobileDeviceCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Device Categories</h1>

      <div className="w-full max-w-3xl bg-white border rounded-lg shadow-md p-6">
        {/* Create Button */}
        <div className="mb-4">
          <Link
            to="/admin/mobile-device-categories/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Create
          </Link>
        </div>

        {/* Categories Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Id</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mobileDeviceCategories.map((d) => (
                <tr key={d.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{d.id}</td>
                  <td className="border px-4 py-2">{d.name}</td>
                  <td className="border px-4 py-2">
                    <Link
                      to={`/admin/mobile-device-categories/${d.id}`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition text-sm"
                    >
                      Edit
                    </Link>
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
