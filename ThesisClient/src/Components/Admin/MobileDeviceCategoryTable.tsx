import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { MobileDeviceCategoryResponse } from "../../Types/MobileTypes";
import { GetMobileDeviceCategories } from "../../Services/MobileDeviceServices";
import { FaComputer } from "react-icons/fa6";
import { Link } from "react-router-dom";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import Spinner from "../Shared/Spinner";

export default function MobileDeviceCategoryTable() {
  const [mobileDeviceCategories, setMobileDeviceCategories] = useState<
    MobileDeviceCategoryResponse[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchCategories = async () => {
      try {
        const res = await GetMobileDeviceCategories();
        setMobileDeviceCategories(res.data);
      } catch (err) {
        console.error("Error loading mobile categories:", err);

        toast.error("Failed to load mobile categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) return <Spinner fullPage />;

  return (
    <TableLayout
      title="Mobile device categories"
      subtitle="Manage mobile device categories"
      links={[{ to: "/admin/mobile-device-categories/create", label: "Create new category" }]}
    >
      {mobileDeviceCategories.length === 0 ? (
        <EmptyState
          icon={<FaComputer />}
          title="No mobile device categories yet"
          description="You haven't created any mobile device category yet. Create your first
              one to get started."
        />
      ) : (
        <Table>
          <Thead headers={["Id", "Name", "Actions"]} />
          <tbody>
            {mobileDeviceCategories.map((category) => (
              <Tr key={category.id}>
                <Td>{category.id}</Td>
                <Td>{category.name}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/mobile-device-categories/${category.id}`}
                      className="text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
    </TableLayout>
  );
}
