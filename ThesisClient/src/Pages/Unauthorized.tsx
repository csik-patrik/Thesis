import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <h1 className="text-danger mb-3">🚫 Access Denied</h1>
      <p>You must be logged in to view this page.</p>
      <Link to="/login" className="btn btn-primary mt-3">
        Go to Login
      </Link>
    </div>
  );
}
