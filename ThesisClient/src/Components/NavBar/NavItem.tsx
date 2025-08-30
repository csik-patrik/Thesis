import { Link } from "react-router-dom";

export default function NavItem({ to, title }: { to: string; title: string }) {
  return (
    <li className="nav-item">
      <Link to={to} className="nav-link">
        {title}
      </Link>
    </li>
  );
}
