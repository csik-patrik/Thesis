import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";
import Modal, { type ModalHandle } from "../Shared/Modal";
import CustomLink2 from "../Shared/CustomLink2";
import { Link } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(0);
  const dialog = useRef<ModalHandle>(null);

  useEffect(() => {
    axios
      .get<UserResponse[]>("http://localhost:5268/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5268/users/${id}`);
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
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-sm text-gray-500 mt-1">Manage users</p>
            </div>
            <CustomLink2 to="/admin/users/create" label="Create new user" />
          </div>
          {/* ── Table card ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">
                    {[
                      "Id",
                      "Username",
                      "Displayname",
                      "E-mail address",
                      "Department",
                      "Cost center",
                      "Roles",
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
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">
                        {user.id}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-700 font-medium">
                        {user.username}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {user.displayName}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {user.department}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {user.costCenter}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">
                        {user.userRoles.map((role) => role.name + " ")}
                      </td>
                      <td className="px-5 py-3.5">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
