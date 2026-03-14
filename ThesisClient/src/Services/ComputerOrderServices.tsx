import axios from "axios";
import type { CreateComputerOrderRequest } from "../Types/ComputerTypes";
import type { User } from "../Types/UserTypes";

export async function GetComputerCategories() {
  return await axios.get("http://localhost:5268/computer-categories");
}

export async function CreateComputerOrder(
  formData: CreateComputerOrderRequest,
  user: User,
) {
  await axios.post("http://localhost:5268/computer-orders", formData, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
