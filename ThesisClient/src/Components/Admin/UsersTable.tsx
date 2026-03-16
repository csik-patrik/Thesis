import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";
import Modal, { type ModalHandle } from "../Shared/Modal";
import { Link } from "react-router-dom";
import { DeleteUser, GetUsers } from "../../Services/UserServices";
import TableLayout from "../../Layouts/TableLayout";
import Table from "../Shared/Table/Table";
import Thead from "../Shared/Table/Thead";
import Tr from "../Shared/Table/Tr";
import Td from "../Shared/Table/Td";

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    GetUsers()
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      DeleteUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  function showModal(id: number) {
    setSelectedUserId(id);
    dialog.current?.open();
  }

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected user?"
        buttonText="Delete"
        buttonColor="red"
        handleSubmit={() => handleDelete(selectedUserId)}
      ></Modal>
      <TableLayout
        title="Users"
        subtitle="Manage user in the system"
        links={[{ to: "/admin/users/create", label: "Create new user" }]}
      >
        <Table>
          <Thead
            headers={[
              "Id",
              "Username",
              "Displayname",
              "E-mail address",
              "Department",
              "Cost center",
              "Roles",
              "Actions",
            ]}
          />
          <tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.username}</Td>
                <Td>{user.displayName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.department}</Td>
                <Td>{user.costCenter}</Td>
                <Td>{user.userRoles.map((role) => role.name + " ")}</Td>
                <Td>
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/admin/users/${user.id}`}
                      className="text-sm font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => showModal(user.id)}
                      className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableLayout>
    </>
  );
}
