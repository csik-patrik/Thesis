import NavItem from "./NavItem";
import DropDown from "./DropDown";

export default function NavBar() {
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
              <NavItem title="Login" to="/login" />
              <NavItem title="Home" to="/" />
              <DropDown title="Orders">
                <NavItem title="Mobile orders" to="/mobile-orders"></NavItem>
              </DropDown>
              <DropDown title="Inventory">
                <NavItem title="Mobiles" to="/mobiles"></NavItem>
                <NavItem title="Sim cards" to="/sim-cards"></NavItem>
              </DropDown>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
