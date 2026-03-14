import axios from "axios";
import type {
  ComputerOrderResponse,
  CreateComputerOrderRequest,
} from "../Types/ComputerTypes";
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

export async function GetMyComputerOrders(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    "http://localhost:5268/computer-orders/my-orders",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeleteComputerOrder(id: number, user: User) {
  return await axios.delete(`http://localhost:5268/computer-orders/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
