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
import CreateMobileDeviceCategory from "./Components/Admin/CreateMobileDeviceCategory.tsx";
import EditMobileDeviceCategory from "./Components/Admin/EditMobileDeviceCategory.tsx";
import { AuthProvider } from "../src/Auth/AuthContext.tsx";
import UsersTable from "./Components/Admin/UsersTable.tsx";
import UserCreate from "./Components/Admin/UserCreate.tsx";
import DeployedMobileDevicesTable from "./Components/MobileDevices/DeployedMobileDevicesTable.tsx";
import MobileDeviceCreateBulk from "./Components/MobileDevices/MobileDeviceCreateBulk.tsx";
import MyMobileDeviceTable from "./Components/MobileDevices/MyMobileDevicesTable.tsx";
import ComputersInInventoryTable from "./Components/Computers/ComputersInInventoryTable.tsx";
import ComputersCreate from "./Components/Computers/ComputersCreate.tsx";
import ComputerOrdersTable from "./Components/ComputerOrders/ComputerOrdersTable.tsx";
import ComputerOrderCreate from "./Components/ComputerOrders/ComputerOrderCreate.tsx";
import ComputerOrderView from "./Components/ComputerOrders/ComputerOrderView.tsx";
import ComputersDeployedTable from "./Components/Computers/ComputersDeployedTable.tsx";
import ComputerCategoriesTable from "./Components/ComputerCategories/ComputerCategoriesTable.tsx";
import ComputerCategoriesCreate from "./Components/ComputerCategories/ComputerCategoriesCreate.tsx";
import MyComputersTable from "./Components/Computers/MyComputersTable.tsx";
import ProtectedRoute from "./Auth/ProtectedRoute.tsx";
import Unauthorized from "./Pages/Unauthorized.tsx";
import ComputersCreateBulk from "./Components/Computers/ComputersCreateBulk.tsx";
import NotFound from "./Pages/NotFound.tsx";
import MyComputerOrdersTable from "./Components/ComputerOrders/MyComputerOrdersTable.tsx";
import MyMobileOrdersTable from "./Components/MobileOrders/MyMobileOrdersTable.tsx";
import ComputerOrderWaitingForApprovalTable from "./Components/ComputerOrders/ComputerOrderWaitingForApprovalTable.tsx";
import MobileOrderWaitingForApprovalTable from "./Components/MobileOrders/MobileOrderWaitingForApprovalTable.tsx";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />}></Route>
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/computers"
                element={
                  <ProtectedRoute>
                    <ComputersInInventoryTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/computers/create"
                element={
                  <ProtectedRoute>
                    <ComputersCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computers/create-bulk"
                element={
                  <ProtectedRoute>
                    <ComputersCreateBulk />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computer-orders"
                element={
                  <ProtectedRoute>
                    <ComputerOrdersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computer-orders/my-orders"
                element={
                  <ProtectedRoute>
                    <MyComputerOrdersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computer-orders/approval"
                element={
                  <ProtectedRoute>
                    <ComputerOrderWaitingForApprovalTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computer-orders/create"
                element={
                  <ProtectedRoute>
                    <ComputerOrderCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computer-orders/:id"
                element={
                  <ProtectedRoute>
                    <ComputerOrderView />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computers/deployed"
                element={
                  <ProtectedRoute>
                    <ComputersDeployedTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/computers/my-computers"
                element={
                  <ProtectedRoute>
                    <MyComputersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobiles"
                element={
                  <ProtectedRoute>
                    <MobileDevicesTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobiles/my-mobiles"
                element={
                  <ProtectedRoute>
                    <MyMobileDeviceTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobiles/deployed"
                element={
                  <ProtectedRoute>
                    <DeployedMobileDevicesTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobiles/create"
                element={
                  <ProtectedRoute>
                    <MobileDeviceCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobiles/create-bulk"
                element={
                  <ProtectedRoute>
                    <MobileDeviceCreateBulk />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/sim-cards"
                element={
                  <ProtectedRoute>
                    <SimCardsTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/sim-cards/create"
                element={
                  <ProtectedRoute>
                    <SimCardsCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/sim-cards/:id"
                element={
                  <ProtectedRoute>
                    <SimCardsEdit />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobile-orders/approval"
                element={
                  <ProtectedRoute>
                    <MobileOrderWaitingForApprovalTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobile-orders/create"
                element={
                  <ProtectedRoute>
                    <MobileOrdersCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobile-orders"
                element={
                  <ProtectedRoute>
                    <MobileOrdersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobile-orders/my-orders"
                element={
                  <ProtectedRoute>
                    <MyMobileOrdersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/mobile-orders/:id"
                element={
                  <ProtectedRoute>
                    <MobileOrderView />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/computers/categories"
                element={
                  <ProtectedRoute>
                    <ComputerCategoriesTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/computers/categories/create"
                element={
                  <ProtectedRoute>
                    <ComputerCategoriesCreate />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/mobile-device-categories"
                element={
                  <ProtectedRoute>
                    <MobileDeviceCategoryTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/mobile-device-categories/:id"
                element={
                  <ProtectedRoute>
                    <EditMobileDeviceCategory />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/mobile-device-categories/create"
                element={
                  <ProtectedRoute>
                    <CreateMobileDeviceCategory />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute>
                    <UsersTable />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/admin/users/create"
                element={
                  <ProtectedRoute>
                    <UserCreate />
                  </ProtectedRoute>
                }
              ></Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </>
  );
}

export default App;
