import NavItem from "./NavItem";
import DropDown from "./DropDown";
import { useAuth } from "../../Auth/AuthContext";

export default function NavBar() {
  const { user, logout } = useAuth();
  console.log(user);
  return (
    <>
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
            <ul className="navbar-nav">
              <NavItem title="Home" to="/" />
              {user ? (
                <>
                  <span>Welcome, {user.email}</span>
                  <button onClick={logout}>Logout</button>
                </>
              ) : (
                <NavItem title="Login" to="/login" />
              )}
              <DropDown title="Orders">
                <NavItem title="Mobile orders" to="/mobile-orders"></NavItem>
              </DropDown>
              <DropDown title="Inventory">
                <NavItem title="Mobiles" to="/mobiles"></NavItem>
                <NavItem title="Sim cards" to="/sim-cards"></NavItem>
              </DropDown>
              <DropDown title="Admin">
                <NavItem
                  title="Mobile device categories"
                  to="/admin/mobile-device-categories"
                ></NavItem>
              </DropDown>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
