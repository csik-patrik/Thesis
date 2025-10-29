import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
      <h1 className="display-3 text-danger fw-bold mb-3">404</h1>
      <h2 className="mb-3">Page Not Found</h2>
      <p className="text-secondary mb-4">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        ⬅ Go back home
      </Link>
    </div>
  );
}
