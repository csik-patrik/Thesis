import { useEffect, useState } from "react";
import type { ComputerCategoryResponse } from "../../Types/ComputerTypes";
import { toast } from "react-toastify";
import { FaComputer } from "react-icons/fa6";
import { Link } from "react-router-dom";
import TableLayout from "../../Layouts/TableLayout";
import EmptyState from "../Shared/Table/EmptyState";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";
import { GetComputerCategories } from "../../Services/ComputerOrderServices";

export default function ComputerCategoriesTable() {
  const [computerCategories, setComputerCategories] = useState<
    ComputerCategoryResponse[]
  >([]);

  useEffect(() => {
    GetComputerCategories()
      .then((response) => setComputerCategories(response.data))
      .catch((error) => {
        toast.error("Error fetching categories");
        console.error("Error fetching categories:", error);
      });
  }, []);

  return (
    <>
      <TableLayout
        title="Computer categories"
        subtitle="Manage computer categories"
        links={[
          {
            to: "/admin/computers/categories/create",
            label: "Create new category",
          },
        ]}
      >
        {computerCategories.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="No computer categories yet"
            description="You haven't created any computer category yet. Create your first
              one to get started."
          />
        ) : (
          <Table>
            <Thead headers={["Id", "Name", "Actions"]} />
            <tbody>
              {computerCategories.map((category) => (
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
      <TableLayout
        title="Computer categories"
        subtitle="Manage computer categories"
        links={[
          {
            to: "/admin/computers/categories/create",
            label: "Create new category",
          },
        ]}
      >
        {computerCategories.length === 0 ? (
          <EmptyState
            icon={<FaComputer />}
            title="No computer categories yet"
            description="You haven't created any computer category yet. Create your first
              one to get started."
          />
        ) : (
          <Table>
            <Thead headers={["Id", "Name", "Actions"]} />
            <tbody>
              {computerCategories.map((category) => (
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
    </>
  );
}
