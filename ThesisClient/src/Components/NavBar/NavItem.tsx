import { NavLink } from "react-router-dom";

export default function NavItem({
  to,
  title,
  mobile = false,
}: {
  to: string;
  title: string;
  mobile?: boolean;
}) {
  const classes = mobile
    ? "block py-1.5 px-2 text-sm text-white/90 hover:text-white transition-colors whitespace-nowrap"
    : "block px-4 py-2 text-sm text-gray-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors whitespace-nowrap";
  return (
    <NavLink to={to} className={classes}>
      {title}
    </NavLink>
  );
}
