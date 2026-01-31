import { NavLink } from "react-router-dom";

export default function NavItem({ to, title }: { to: string; title: string }) {
  const classes =
    "py-2 px-3 mx-2 text-neutral-700 hover:text-neutral-800 whitespace-nowrap";
  return (
    <NavLink to={to} className={classes}>
      {title}
    </NavLink>
  );
}
