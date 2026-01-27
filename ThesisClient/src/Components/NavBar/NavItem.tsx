import { NavLink } from "react-router-dom";

export default function NavItem({ to, title }: { to: string; title: string }) {
  return (
    <li className="nav-item">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `nav-link px-3 fw-semibold ${isActive ? "text-dark" : "text-dark"}`
        }
      >
        {title}
      </NavLink>
    </li>
  );
}
