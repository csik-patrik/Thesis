import { Route } from "react-router-dom";
import ProtectedRoute from "../Auth/ProtectedRoute.tsx";
import SimCardsTable from "../Components/SimCards/SimCardsTable.tsx";
import SimCardsCreate from "../Components/SimCards/SimCardsCreate.tsx";
import SimCardsCreateBulk from "../Components/SimCards/SimCardsCreateBulk.tsx";

const SimCardRoutes = (
  <>
    <Route
      path="/sim-cards"
      element={
        <ProtectedRoute>
          <SimCardsTable />
        </ProtectedRoute>
      }
    />
    <Route
      path="/sim-cards/create"
      element={
        <ProtectedRoute>
          <SimCardsCreate />
        </ProtectedRoute>
      }
    />
    <Route
      path="/sim-cards/create-bulk"
      element={
        <ProtectedRoute>
          <SimCardsCreateBulk />
        </ProtectedRoute>
      }
    />
  </>
);

export default SimCardRoutes;
