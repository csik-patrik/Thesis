import axios from "axios";
import type {
  CreateSimCardRequest,
  SimCallControlGroupResponse,
  SimCardResponse,
} from "../Types/MobileTypes";

export async function GetSimCardsInInventory() {
  return await axios.get<SimCardResponse[]>("http://localhost:5268/sim-cards");
}

export async function DeleteSimCard(id: number) {
  return await axios.delete(`http://localhost:5268/sim-cards/${id}`);
}

export async function GetSimCallControlGroups() {
  return await axios.get<SimCallControlGroupResponse[]>(
    "http://localhost:5268/sim-call-control-groups",
  );
}

export async function CreateSimCard(formData: CreateSimCardRequest) {
  return await axios.post("http://localhost:5268/sim-cards", formData);
}
