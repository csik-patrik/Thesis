import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute.tsx";
import MobileDevicesTable from "../Components/MobileDevices/MobileDevicesTable.tsx";
import MyMobileDeviceTable from "../Components/MobileDevices/MyMobileDevicesTable.tsx";
import MobileDevicesDeployedTable from "../Components/MobileDevices/MobileDevicesDeployedTable.tsx";
import MobileDeviceCreate from "../Components/MobileDevices/MobileDeviceCreate.tsx";
import MobileDeviceCreateBulk from "../Components/MobileDevices/MobileDeviceCreateBulk.tsx";
import MobileOrdersTable from "../Components/MobileOrders/MobileOrdersTable.tsx";
import MyMobileOrdersTable from "../Components/MobileOrders/MyMobileOrdersTable.tsx";
import MobileOrderWaitingForApprovalTable from "../Components/MobileOrders/MobileOrderWaitingForApprovalTable.tsx";
import MobileOrdersCreate from "../Components/MobileOrders/MobileOrdersCreate.tsx";
import MobileOrderView from "../Components/MobileOrders/MobileOrderView.tsx";

const MobileRoutes = (
  <>
    <Route
      path="/mobiles"
      element={<ProtectedRoute><MobileDevicesTable /></ProtectedRoute>}
    />
    <Route
      path="/mobiles/my-mobiles"
      element={<ProtectedRoute><MyMobileDeviceTable /></ProtectedRoute>}
    />
    <Route
      path="/mobiles/deployed"
      element={<ProtectedRoute><MobileDevicesDeployedTable /></ProtectedRoute>}
    />
    <Route
      path="/mobiles/create"
      element={<ProtectedRoute><MobileDeviceCreate /></ProtectedRoute>}
    />
    <Route
      path="/mobiles/create-bulk"
      element={<ProtectedRoute><MobileDeviceCreateBulk /></ProtectedRoute>}
    />
    <Route
      path="/mobile-orders"
      element={<ProtectedRoute><MobileOrdersTable /></ProtectedRoute>}
    />
    <Route
      path="/mobile-orders/my-orders"
      element={<ProtectedRoute><MyMobileOrdersTable /></ProtectedRoute>}
    />
    <Route
      path="/mobile-orders/approval"
      element={<ProtectedRoute><MobileOrderWaitingForApprovalTable /></ProtectedRoute>}
    />
    <Route
      path="/mobile-orders/create"
      element={<ProtectedRoute><MobileOrdersCreate /></ProtectedRoute>}
    />
    <Route
      path="/mobile-orders/:id"
      element={<ProtectedRoute><MobileOrderView /></ProtectedRoute>}
    />
  </>
);

export default MobileRoutes;
