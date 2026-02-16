import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function Home() {
  const { user } = useAuth();
  //const token = localStorage.getItem("user.token");
  console.log(user);

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Mobile Device Management System
        </h1>
        <p className="text-lg text-gray-700">
          Manage mobile devices, orders, and users efficiently. Allocate
          devices, track orders, and keep your inventory up to date.
        </p>

        {user && (
          <div className="inline-block text-left bg-blue-100 border border-blue-300 text-blue-800 rounded-lg p-4 mt-4">
            <strong>Logged in as:</strong>
            <br />
            Id: {user.id} <br />
            Email: {user.email} <br />
            Name: {user.displayname} <br />
            Roles: {user.roles}
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Mobile Orders */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col h-full">
          <h5 className="text-xl font-semibold mb-2">Mobile Orders</h5>
          <p className="text-gray-700 mb-4 grow">
            View, create, and manage mobile device orders.
          </p>
          <Link
            to="/mobile-orders"
            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center"
          >
            Go to Orders
          </Link>
        </div>

        {/* Devices Inventory */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col h-full">
          <h5 className="text-xl font-semibold mb-2">Devices Inventory</h5>
          <p className="text-gray-700 mb-4 grow">
            Browse, add, and allocate mobile devices in inventory.
          </p>
          <Link
            to="/mobiles"
            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center"
          >
            Go to Devices
          </Link>
        </div>

        {/* User Management */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col h-full">
          <h5 className="text-xl font-semibold mb-2">User Management</h5>
          <p className="text-gray-700 mb-4 grow">
            Manage users and roles for the system.
          </p>
          <Link
            to="/admin/users"
            className="mt-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-center"
          >
            Go to Users
          </Link>
        </div>
      </div>
    </div>
  );
}
