import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";

export default function Users() {
  const [data, setData] = useState<UserResponse[]>([]);

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
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>

      <div className="w-full max-w-5xl bg-white border rounded-lg shadow-md p-6">
        {/* Create Button */}
        <div className="mb-4">
          <Link
            to="/admin/users/create"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Create
          </Link>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Id</th>
                <th className="border px-4 py-2 text-left">Username</th>
                <th className="border px-4 py-2 text-left">Display Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Department</th>
                <th className="border px-4 py-2 text-left">Cost Center</th>
                <th className="border px-4 py-2 text-left">Roles</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((u) => (
                <tr key={u.id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{u.id}</td>
                  <td className="border px-4 py-2">{u.username}</td>
                  <td className="border px-4 py-2">{u.displayName}</td>
                  <td className="border px-4 py-2">{u.email}</td>
                  <td className="border px-4 py-2">{u.department}</td>
                  <td className="border px-4 py-2">{u.costCenter}</td>
                  <td className="border px-4 py-2">
                    {u.userRoles.map((r) => (
                      <span key={r.id} className="mr-1">
                        {r.name}
                      </span>
                    ))}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition text-sm"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
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
