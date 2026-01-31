import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-100 text-center px-4">
      <h1 className="mb-4 text-7xl font-extrabold text-red-600">404</h1>

      <h2 className="mb-3 text-2xl font-semibold text-neutral-800">
        Page Not Found
      </h2>

      <p className="mb-6 max-w-md text-neutral-500">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="
        inline-flex items-center gap-2
        rounded-md bg-neutral-800 px-5 py-2 text-white
        hover:bg-neutral-700 transition
      "
      >
        ⬅ Go back home
      </Link>
    </div>
  );
}
