import { Link } from "react-router-dom";

export default function CustomLink({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  const classes =
    "bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition";

  return (
    <Link to={to} className={classes}>
      {label}
    </Link>
  );
}
