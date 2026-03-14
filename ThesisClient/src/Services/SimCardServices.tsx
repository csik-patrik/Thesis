import axios from "axios";
import type { SimCardResponse } from "../Types/MobileTypes";

export async function GetSimCardsInInventory() {
  return await axios.get<SimCardResponse[]>("http://localhost:5268/sim-cards");
}

export async function DeleteSimCard(id: number) {
  return await axios.delete(`http://localhost:5268/sim-cards/${id}`);
}
