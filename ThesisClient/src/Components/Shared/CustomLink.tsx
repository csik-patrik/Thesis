import { Link } from "react-router-dom";

export default function CustomLink({
  to,
  label,
  color,
}: {
  to: string;
  label: string;
  color: "green" | "gray" | "blue" | "yellow";
}) {
  let classes = "text-white px-2 py-1 rounded transition";

  if (color == "green") classes += " bg-green-600";
  else if (color == "gray") classes += " bg-gray-300";
  else if (color == "blue") classes += " bg-blue-600";
  else if (color == "yellow") classes += " bg-yellow-500";

  return (
    <Link to={to} className={classes}>
      {label}
    </Link>
  );
}
