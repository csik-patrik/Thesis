import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimCardsTable from "./Components/SimCards/SimCardsTable.tsx";
import SimCardsCreate from "./Components/SimCards/SimCardsCreate.tsx";
import MobileOrdersTable from "./Components/MobileOrders/MobileOrdersTable.tsx";
import MobileOrdersCreate from "./Components/MobileOrders/MobileOrdersCreate.tsx";
import MobileOrderView from "./Components/MobileOrders/MobileOrderView.tsx";
import Home from "./Components/Home/Home.tsx";
import Layout from "./Components/Layout.tsx";
import Login from "./Auth/Login.tsx";
import MobileDevicesTable from "./Components/MobileDevices/MobileDevicesTable.tsx";
import MobileDeviceCreate from "./Components/MobileDevices/MobileDeviceCreate.tsx";
import MobileDeviceCategoryTable from "./Components/Admin/MobileDeviceCategoryTable.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import SimCardsEdit from "./Components/SimCards/SimCardsEdit.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />}></Route>
            <Route path="/mobiles" element={<MobileDevicesTable />}></Route>
            <Route
              path="/mobiles/create"
              element={<MobileDeviceCreate />}
            ></Route>
            <Route path="/sim-cards" element={<SimCardsTable />}></Route>
            <Route
              path="/sim-cards/create"
              element={<SimCardsCreate />}
            ></Route>
            <Route path="/sim-cards/:id" element={<SimCardsEdit />}></Route>
            <Route
              path="/mobile-orders/create"
              element={<MobileOrdersCreate />}
            ></Route>
            <Route
              path="/mobile-orders"
              element={<MobileOrdersTable />}
            ></Route>
            <Route
              path="/mobile-orders/:id"
              element={<MobileOrderView />}
            ></Route>
            <Route
              path="/admin/mobile-device-categories"
              element={<MobileDeviceCategoryTable />}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
