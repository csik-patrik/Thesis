import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute.tsx";
import ComputersInInventoryTable from "../Components/Computers/ComputersInInventoryTable.tsx";
import ComputersCreate from "../Components/Computers/ComputersCreate.tsx";
import ComputersCreateBulk from "../Components/Computers/ComputersCreateBulk.tsx";
import ComputersDeployedTable from "../Components/Computers/ComputersDeployedTable.tsx";
import MyComputersTable from "../Components/Computers/MyComputersTable.tsx";
import ComputerOrdersTable from "../Components/ComputerOrders/ComputerOrdersTable.tsx";
import MyComputerOrdersTable from "../Components/ComputerOrders/MyComputerOrdersTable.tsx";
import ComputerOrderWaitingForApprovalTable from "../Components/ComputerOrders/ComputerOrderWaitingForApprovalTable.tsx";
import ComputerOrderCreate from "../Components/ComputerOrders/ComputerOrderCreate.tsx";
import ComputerOrderView from "../Components/ComputerOrders/ComputerOrderView.tsx";

const ComputerRoutes = (
  <>
    <Route
      path="/computers"
      element={<ProtectedRoute><ComputersInInventoryTable /></ProtectedRoute>}
    />
    <Route
      path="/computers/create"
      element={<ProtectedRoute><ComputersCreate /></ProtectedRoute>}
    />
    <Route
      path="/computers/create-bulk"
      element={<ProtectedRoute><ComputersCreateBulk /></ProtectedRoute>}
    />
    <Route
      path="/computers/deployed"
      element={<ProtectedRoute><ComputersDeployedTable /></ProtectedRoute>}
    />
    <Route
      path="/computers/my-computers"
      element={<ProtectedRoute><MyComputersTable /></ProtectedRoute>}
    />
    <Route
      path="/computer-orders"
      element={<ProtectedRoute><ComputerOrdersTable /></ProtectedRoute>}
    />
    <Route
      path="/computer-orders/my-orders"
      element={<ProtectedRoute><MyComputerOrdersTable /></ProtectedRoute>}
    />
    <Route
      path="/computer-orders/approval"
      element={<ProtectedRoute><ComputerOrderWaitingForApprovalTable /></ProtectedRoute>}
    />
    <Route
      path="/computer-orders/create"
      element={<ProtectedRoute><ComputerOrderCreate /></ProtectedRoute>}
    />
    <Route
      path="/computer-orders/:id"
      element={<ProtectedRoute><ComputerOrderView /></ProtectedRoute>}
    />
  </>
);

export default ComputerRoutes;
