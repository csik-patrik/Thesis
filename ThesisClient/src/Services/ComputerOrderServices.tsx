import axios from "axios";
import type {
  ComputerOrderResponse,
  CreateComputerOrderRequest,
} from "../Types/ComputerTypes";
import type { User } from "../Types/UserTypes";

export async function GetComputerCategories(user: User) {
  return await axios.get("http://localhost:5268/computer-categories", {
    headers: { Authorization: `Bearer ${user.token}` },
  });
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

export async function GetComputerOrders(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    "http://localhost:5268/computer-orders",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetComputerOrdersWaitingForApproval(user: User) {
  return await axios.get<ComputerOrderResponse[]>(
    "http://localhost:5268/computer-orders/approval",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function GetComputerOrderById(id: number, user: User) {
  return await axios.get<ComputerOrderResponse>(
    `http://localhost:5268/computer-orders/${id}`,
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeliverComputerOrder(id: number, user: User) {
  return await axios.put(
    `http://localhost:5268/computer-orders/deliver/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function MakeDecisionAsApprover(
  id: number,
  decision: boolean,
  user: User,
) {
  return await axios.put(
    `http://localhost:5268/computer-orders/approval/${id}`,
    decision,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}
