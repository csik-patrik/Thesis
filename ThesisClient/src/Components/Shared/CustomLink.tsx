import { Link } from "react-router-dom";

const styles: Record<string, string> = {
  green:  "px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm",
  gray:   "px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors",
  blue:   "px-5 py-2.5 text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors shadow-sm",
  yellow: "px-5 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-white rounded-xl transition-colors shadow-sm",
};

export default function CustomLink({
  to,
  label,
  color,
}: {
  to: string;
  label: string;
  color: "green" | "gray" | "blue" | "yellow";
}) {
  return (
    <Link to={to} className={styles[color]}>
      {label}
    </Link>
  );
}
