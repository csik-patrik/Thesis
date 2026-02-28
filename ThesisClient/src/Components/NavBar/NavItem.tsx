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
    ? "py-1.5 px-2 text-white hover:text-amber-300 whitespace-nowrap block"
    : "py-2 px-3 mx-2 text-neutral-700 hover:text-neutral-800 whitespace-nowrap";
  return (
    <NavLink to={to} className={classes}>
      {title}
    </NavLink>
  );
}
