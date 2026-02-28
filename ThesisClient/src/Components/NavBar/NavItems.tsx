import { useAuth } from "../../Auth/AuthContext";
import AdminItems from "./AdminItems";
import ApproverItems from "./ApproverItems";
import OrderItems from "./OrderItems";
import UserItems from "./UserItems";
import NotificationBell from "./NotificationBell";
import { NavLink } from "react-router-dom";

const btnClasses =
  "py-1 px-2 rounded-2xl text-center text-white bg-amber-500 hover:bg-amber-300";

export default function NavItems({ mobile = false }: { mobile?: boolean }) {
  const { user, logout } = useAuth();

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        <NavLink to="/" className={btnClasses}>
          Home
        </NavLink>
        {user && (
          <>
            <div className="flex flex-col mt-1">
              <OrderItems mobile />
              {user.roles.includes("Admin") && <AdminItems mobile />}
              {user.roles.includes("Group leader") && <ApproverItems mobile />}
            </div>
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-teal-500">
              <NotificationBell />
              <UserItems displayname={user.displayname} mobile />
              <NavLink to="/" onClick={logout} className={btnClasses}>
                Logout
              </NavLink>
            </div>
          </>
        )}
        {!user && (
          <NavLink to="/login" className={btnClasses}>
            Login
          </NavLink>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <NavLink to="/" className={btnClasses}>
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
            <NotificationBell />
            <UserItems displayname={user.displayname} />
            <NavLink to="/" onClick={logout} className={btnClasses}>
              Logout
            </NavLink>
          </div>
        </>
      )}
      {!user && (
        <NavLink to="/login" className={btnClasses}>
          Login
        </NavLink>
      )}
    </div>
  );
}
