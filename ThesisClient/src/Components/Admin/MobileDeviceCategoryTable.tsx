import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";

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
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Mobile Device Categories</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-2">
            <CustomLink
              color="green"
              to="/admin/mobile-device-categories/create"
              label="Create"
            />
          </div>
        </div>
        <Table headerItems={["Id", "Name", "Actions"]}>
          {mobileDeviceCategories.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50 border-b">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.name}</td>
              <td className="px-4 py-2">
                <CustomLink
                  color="yellow"
                  to={`/admin/mobile-device-categories/${d.id}`}
                  label="Edit"
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
