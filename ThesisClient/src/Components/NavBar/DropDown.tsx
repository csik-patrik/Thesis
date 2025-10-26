export default function DropDown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle text-light fw-semibold px-3"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{
          textShadow: "0 1px 2px rgba(0, 0, 0, 0.4)",
        }}
      >
        {title}
      </a>
      <ul
        className="dropdown-menu shadow border-0"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          minWidth: "12rem",
        }}
      >
        {children}
      </ul>
    </li>
  );
}
