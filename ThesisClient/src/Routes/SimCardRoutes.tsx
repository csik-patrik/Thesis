import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute.tsx";
import SimCardsTable from "../Components/SimCards/SimCardsTable.tsx";
import SimCardsCreate from "../Components/SimCards/SimCardsCreate.tsx";
import SimCardsEdit from "../Components/SimCards/SimCardsEdit.tsx";

const SimCardRoutes = (
  <>
    <Route
      path="/sim-cards"
      element={<ProtectedRoute><SimCardsTable /></ProtectedRoute>}
    />
    <Route
      path="/sim-cards/create"
      element={<ProtectedRoute><SimCardsCreate /></ProtectedRoute>}
    />
    <Route
      path="/sim-cards/:id"
      element={<ProtectedRoute><SimCardsEdit /></ProtectedRoute>}
    />
  </>
);

export default SimCardRoutes;
