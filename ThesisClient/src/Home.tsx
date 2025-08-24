import axios from "axios";
import { useEffect } from "react";

function Home() {
  useEffect(() => {
    axios
      .get("http://localhost:5268/api/sim-cards")
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="d-flex flex-column justify-content-center align-items-center bd-light vh-100">
      <h1>Sim cards</h1>
      <table className="w-75 rounded bg-white border shadow p-4"></table>
    </div>
  );
}

export default Home;
