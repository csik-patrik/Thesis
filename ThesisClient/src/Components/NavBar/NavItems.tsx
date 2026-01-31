import { useAuth } from "../../Auth/AuthContext";
import AdminItems from "./AdminItems";
import ApproverItems from "./ApproverItems";
import OrderItems from "./OrderItems";
import UserItems from "./UserItems";
import { NavLink } from "react-router-dom";

export default function NavItems() {
  const { user, logout } = useAuth();

  return (
    <div className="flex items-center gap-3 w-full">
      <NavLink
        to="/"
        className="py-1 px-2  text-white bg-neutral-500 hover:bg-neutral-700 text-center"
      >
        Home
      </NavLink>
      {user && (
        <>
          <div className="flex items-center gap-2">
            <OrderItems />

            {user.roles.includes("Admin") && <AdminItems />}

            {user.roles.includes("Group leader") && <ApproverItems />}
          </div>
          <div className="ms-auto flex items-center gap-2">
            <UserItems displayname={user.displayname} />
            <NavLink
              to="/"
              onClick={logout}
              className="py-1 px-2  text-white rounded-4xl bg-neutral-800 hover:bg-neutral-700 text-center"
            >
              Logout
            </NavLink>
          </div>
        </>
      )}
      {!user && (
        <NavLink
          to="/login"
          className="py-1 px-2 ms-auto text-white rounded-4xl bg-neutral-800 hover:bg-neutral-700 text-center"
        >
          Login
        </NavLink>
      )}
    </div>
  );
}
