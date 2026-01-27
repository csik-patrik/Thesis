import { useAuth } from "../../Auth/AuthContext";
import AdminItems from "./AdminItems";
import ApproverItems from "./ApproverItems";
import UserItems from "./UserItems";
import NavItem from "./NavItem";
import NavButton from "./NavButton";

export default function NavItems() {
  const { user, logout } = useAuth();

  return (
    <div className="collapse navbar-collapse" id="navbarNav">
      {user && (
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {user.roles.includes("Admin") && <AdminItems />}

          {user.roles.includes("Group leader") && <ApproverItems />}

          <UserItems displayname={user.displayname} />

          {/* <NavItem title="My Computers" to="/computers/my-computers" />

          <li className="nav-item ms-2">
            <button
              className="btn btn-outline-light btn-sm px-3"
              onClick={logout}
            >
              Logout
            </button>
          </li> */}
        </ul>
      )}
      {!user && <NavButton>Login</NavButton>}
      {/* {!user && <NavItem title="Login" to="/login" />} */}
    </div>
  );
}
