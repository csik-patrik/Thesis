import { Link } from "react-router-dom";

export default function CustomLink2({
  to,
  label,
}: {
  to: string;
  label: string;
}) {
  const classes =
    "px-5 py-2.5 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-xl transition-colors shadow-sm";
  return (
    <Link to={to} className={classes}>
      {label}
    </Link>
  );
}
