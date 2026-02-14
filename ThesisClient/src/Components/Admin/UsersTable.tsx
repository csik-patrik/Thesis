import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { UserResponse } from "../../Types/UserTypes";
import CustomLink from "../Shared/CustomLink";
import Table from "../Shared/Table";
import Button from "../Shared/Button";

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
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <div className=" bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex gap-2 mb-4 flex-col">
          <div className="flex gap-2">
            <CustomLink color="green" to="/admin/users/create" label="Create" />
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
          {data.map((u) => (
            <tr key={u.id} className="even:bg-gray-50 border-b">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.username}</td>
              <td className="px-4 py-2">{u.displayName}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.department}</td>
              <td className="px-4 py-2">{u.costCenter}</td>
              <td className="px-4 py-2">
                {u.userRoles.map((r) => (
                  <span key={r.id} className="mr-1">
                    {r.name}
                  </span>
                ))}
              </td>
              <td className="px-4 py-2">
                <Button
                  color="red"
                  label="Delete"
                  handleClick={() => handleDelete(u.id)}
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
}
