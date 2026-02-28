import { useAuth } from "../../Auth/AuthContext";
import AdminItems from "./AdminItems";
import ApproverItems from "./ApproverItems";
import OrderItems from "./OrderItems";
import UserItems from "./UserItems";
import NotificationBell from "./NotificationBell";
import { NavLink } from "react-router-dom";

const SignOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export default function NavItems({ mobile = false }: { mobile?: boolean }) {
  const { user, logout } = useAuth();

  if (mobile) {
    return (
      <div className="flex flex-col gap-1">
        {user && (
          <>
            <div className="flex flex-col">
              <OrderItems mobile />
              {user.roles.includes("Admin") && <AdminItems mobile />}
              {user.roles.includes("Group leader") && <ApproverItems mobile />}
            </div>
            <div className="flex items-center gap-3 pt-2.5 mt-1 border-t border-teal-500/60">
              <NotificationBell />
              <UserItems displayname={user.displayname} mobile />
              <button
                onClick={logout}
                className="ml-auto flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
              >
                <SignOutIcon />
                Sign out
              </button>
            </div>
          </>
        )}
        {!user && (
          <NavLink
            to="/login"
            className="text-sm font-semibold px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white transition-colors text-center"
          >
            Sign in
          </NavLink>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 w-full">
      {user && (
        <>
          <div className="flex items-center gap-1">
            <OrderItems />
            {user.roles.includes("Admin") && <AdminItems />}
            {user.roles.includes("Group leader") && <ApproverItems />}
          </div>
          <div className="ms-auto flex items-center gap-2">
            <NotificationBell />
            <UserItems displayname={user.displayname} />
            <div className="w-px h-4 bg-white/25 mx-1" />
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
            >
              <SignOutIcon />
              <span className="hidden lg:inline">Sign out</span>
            </button>
          </div>
        </>
      )}
      {!user && (
        <NavLink
          to="/login"
          className="text-sm font-semibold px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white transition-colors shadow-sm"
        >
          Sign in
        </NavLink>
      )}
    </div>
  );
}
