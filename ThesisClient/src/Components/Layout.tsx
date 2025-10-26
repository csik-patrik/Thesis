import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";

function Layout() {
  return (
    <>
      <NavBar />
      <div className="container-fluid mt-5 pt-4">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
