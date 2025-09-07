import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

function Layout() {
  return (
    <>
      <NavBar />
      <div className="border border-3 justify-content-center">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
