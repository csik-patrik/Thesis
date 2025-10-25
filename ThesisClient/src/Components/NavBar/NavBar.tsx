import NavItem from "./NavItem";
import DropDown from "./DropDown";
import { useAuth } from "../../Auth/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
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
        <div className="collapse navbar-collapse" id="navbarNav">
          {user && (
            <ul className="navbar-nav">
              <NavItem title="Home" to="/" />
              <DropDown title="Production">
                <NavItem title="Mobiles" to="/mobiles/deployed" />
              </DropDown>
              <DropDown title="Orders">
                <NavItem title="Mobile orders" to="/mobile-orders" />
                <NavItem title="Computer orders" to="/computer-orders" />
              </DropDown>
              <DropDown title="Inventory">
                <NavItem title="Computers" to="/computers" />
                <NavItem title="Mobiles" to="/mobiles" />
                <NavItem title="Sim cards" to="/sim-cards" />
              </DropDown>
              <DropDown title="Admin">
                <NavItem
                  title="Mobile categories"
                  to="/admin/mobile-device-categories"
                />
                <NavItem title="Users" to="/admin/users" />
              </DropDown>
            </ul>
          )}

          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <DropDown title={user.displayname!}>
                  <NavItem title="My mobiles" to="/mobiles/my-mobiles" />
                </DropDown>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm"
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
