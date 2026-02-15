import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";
import Button from "../Shared/Button";
import Modal, { type ModalHandle } from "../Shared/Modal";

export default function Users() {
  const [data, setData] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const dialog = useRef<ModalHandle>(null);

  function showModal(id: number) {
    setSelectedUserId(id);
    dialog.current?.open();
  }

  useEffect(() => {
    axios
      .get<UserResponse[]>("http://localhost:5268/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/users/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user.");
    }
  };

  return (
    <>
      <Modal
        ref={dialog}
        title="Do you want to delete the selected user?"
        handleSubmit={() => handleDelete(selectedUserId)}
      ></Modal>
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6">Users</h1>
        <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex gap-2 mb-4 flex-col">
            <div className="flex gap-2">
              <CustomLink
                color="green"
                to="/admin/users/create"
                label="Create"
              />
            </div>
          </div>
          <Table
            headerItems={[
              "Id",
              "Username",
              "Displayname",
              "E-mail address",
              "Department",
              "Cost center",
              "Roles",
              "Actions",
            ]}
          >
            {data.map((user) => (
              <tr key={user.id} className="even:bg-gray-50 border-b">
                <td className="px-4 py-2">{user.id}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.displayName}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.department}</td>
                <td className="px-4 py-2">{user.costCenter}</td>
                <td className="px-4 py-2">
                  {user.userRoles.map((r) => (
                    <span key={r.id} className="mr-1">
                      {r.name}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <CustomLink
                    color="yellow"
                    label="Edit"
                    to={`/admin/users/${user.id}`}
                  />
                  <Button
                    color="red"
                    label="Delete"
                    handleClick={() => showModal(user.id)}
                  />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </>
  );
}
