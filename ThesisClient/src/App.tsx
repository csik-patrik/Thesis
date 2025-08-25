import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimCardsTable from "./Components/SimCards/SimCardsTable.tsx";
import SimCardsCreate from "./Components/SimCards/SimCardsCreate.tsx";
import Home from "./Components/Home/Home.tsx";
import MobileOrdersTable from "./Components/MobileOrders/MobileOrdersTable.tsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/mobile-orders" element={<MobileOrdersTable />}></Route>
        <Route path="/sim-cards" element={<SimCardsTable />}></Route>
        <Route path="/sim-cards/create" element={<SimCardsCreate />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
