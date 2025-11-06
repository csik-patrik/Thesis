import NavItem from "./NavItem";
import DropDown from "./DropDown";
import { useAuth } from "../../Auth/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold text-light" href="/">
          📱 IT Asset Portal
        </a>

        {/* Toggler (for mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Left side — navigation */}
          {user && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <DropDown title="Orders">
                {user.roles.includes("Admin") && (
                  <>
                    <NavItem title="Mobile Orders" to="/mobile-orders" />
                    <NavItem title="Computer Orders" to="/computer-orders" />
                  </>
                )}
              </DropDown>

              {user.roles.includes("Admin") && (
                <>
                  <DropDown title="Production">
                    <NavItem title="Computers" to="/computers/deployed" />
                    <NavItem title="Mobiles" to="/mobiles/deployed" />
                  </DropDown>
                  <DropDown title="Inventory">
                    <NavItem title="Computers" to="/computers" />
                    <NavItem title="Mobiles" to="/mobiles" />
                    <NavItem title="Sim Cards" to="/sim-cards" />
                  </DropDown>
                  <DropDown title="Admin">
                    <NavItem
                      title="Computer categories"
                      to="/admin/computers/categories"
                    />
                    <NavItem
                      title="Mobile Categories"
                      to="/admin/mobile-device-categories"
                    />
                    <NavItem title="Users" to="/admin/users" />
                  </DropDown>
                </>
              )}
            </ul>
          )}

          {/* Right side — user info / login */}
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <DropDown title={`👤 ${user.displayname ?? "User"}`}>
                  <NavItem title="My Computers" to="/computers/my-computers" />
                  <NavItem title="My Mobiles" to="/mobiles/my-mobiles" />
                </DropDown>
                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <NavItem title="Login" to="/login" />
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
