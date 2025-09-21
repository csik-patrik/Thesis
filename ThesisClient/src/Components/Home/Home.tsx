import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container py-5">
      <div className="mb-5 text-center">
        <h1>Mobile Device Management System</h1>
        <p className="lead">
          Manage mobile devices, orders, and users efficiently. Allocate
          devices, track orders, and keep your inventory up to date.
        </p>
        {user && (
          <div className="alert alert-info d-inline-block text-start">
            <strong>Logged in as:</strong>
            <br />
            Id: {user.id} <br />
            Email: {user.email} <br />
            Name: {user.displayname} <br />
            Role:
          </div>
        )}
      </div>
      <div className="row justify-content-center">
        <div className="col-12 col-md-4 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Mobile Orders</h5>
              <p className="card-text">
                View, create, and manage mobile device orders.
              </p>
              <Link to="/mobile-orders" className="btn btn-primary mt-auto">
                Go to Orders
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">Devices Inventory</h5>
              <p className="card-text">
                Browse, add, and allocate mobile devices in inventory.
              </p>
              <Link to="/mobiles" className="btn btn-primary mt-auto">
                Go to Devices
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 mb-4">
          <div className="card h-100 shadow">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">User Management</h5>
              <p className="card-text">
                Manage users and roles for the system.
              </p>
              <Link to="/admin/users" className="btn btn-primary mt-auto">
                Go to Users
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
