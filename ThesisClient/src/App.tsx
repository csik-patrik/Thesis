import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./Auth/AuthContext.tsx";
import { NotificationProvider } from "./Auth/NotificationContext.tsx";
import Layout from "./Components/Layout.tsx";
import Home from "./Components/Home/Home.tsx";
import Login from "./Auth/Login.tsx";
import Unauthorized from "./Pages/Unauthorized.tsx";
import NotFound from "./Pages/NotFound.tsx";
import ComputerRoutes from "./Routes/ComputerRoutes.tsx";
import MobileRoutes from "./Routes/MobileRoutes.tsx";
import SimCardRoutes from "./Routes/SimCardRoutes.tsx";
import AdminRoutes from "./Routes/AdminRoutes.tsx";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              {ComputerRoutes}
              {MobileRoutes}
              {SimCardRoutes}
              {AdminRoutes}
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
