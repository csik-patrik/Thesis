import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute.tsx";
import ComputerCategoriesTable from "../Components/ComputerCategories/ComputerCategoriesTable.tsx";
import ComputerCategoriesCreate from "../Components/ComputerCategories/ComputerCategoriesCreate.tsx";
import MobileDeviceCategoryTable from "../Components/Admin/MobileDeviceCategoryTable.tsx";
import EditMobileDeviceCategory from "../Components/Admin/EditMobileDeviceCategory.tsx";
import CreateMobileDeviceCategory from "../Components/Admin/CreateMobileDeviceCategory.tsx";
import UsersTable from "../Components/Admin/UsersTable.tsx";
import UserCreate from "../Components/Admin/UserCreate.tsx";
import UsersEdit from "../Components/Admin/UsersEdit.tsx";

const AdminRoutes = (
  <>
    <Route
      path="/admin/computers/categories"
      element={<ProtectedRoute><ComputerCategoriesTable /></ProtectedRoute>}
    />
    <Route
      path="/admin/computers/categories/create"
      element={<ProtectedRoute><ComputerCategoriesCreate /></ProtectedRoute>}
    />
    <Route
      path="/admin/mobile-device-categories"
      element={<ProtectedRoute><MobileDeviceCategoryTable /></ProtectedRoute>}
    />
    <Route
      path="/admin/mobile-device-categories/:id"
      element={<ProtectedRoute><EditMobileDeviceCategory /></ProtectedRoute>}
    />
    <Route
      path="/admin/mobile-device-categories/create"
      element={<ProtectedRoute><CreateMobileDeviceCategory /></ProtectedRoute>}
    />
    <Route
      path="/admin/users"
      element={<ProtectedRoute><UsersTable /></ProtectedRoute>}
    />
    <Route
      path="/admin/users/create"
      element={<ProtectedRoute><UserCreate /></ProtectedRoute>}
    />
    <Route
      path="/admin/users/:id"
      element={<ProtectedRoute><UsersEdit /></ProtectedRoute>}
    />
  </>
);

export default AdminRoutes;
