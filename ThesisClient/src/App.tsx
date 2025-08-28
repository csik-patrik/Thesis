import { BrowserRouter, Routes, Route } from "react-router-dom";
import SimCardsTable from "./Components/SimCards/SimCardsTable.tsx";
import SimCardsCreate from "./Components/SimCards/SimCardsCreate.tsx";
import Home from "./Components/Home/Home.tsx";
import MobileOrdersTable from "./Components/MobileOrders/MobileOrdersTable.tsx";
import MobileOrdersCreate from "./Components/MobileOrders/MobileOrdersCreate.tsx";
import MobileOrderView from "./Components/MobileOrders/MobileOrderView.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/mobile-orders/" element={<MobileOrdersTable />}></Route>
          <Route
            path="/mobile-orders/:id"
            element={<MobileOrderView />}
          ></Route>
          <Route
            path="/mobile-orders/create"
            element={<MobileOrdersCreate />}
          ></Route>
          <Route path="/sim-cards" element={<SimCardsTable />}></Route>
          <Route path="/sim-cards/create" element={<SimCardsCreate />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
