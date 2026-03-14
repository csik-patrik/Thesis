import axios from "axios";
import type { MobileOrderResponse } from "../Types/MobileTypes";
import type { User } from "../Types/UserTypes";

export async function FetchMyMobileOrders(user: User) {
  return await axios.get<MobileOrderResponse[]>(
    "http://localhost:5268/mobile-orders/my-orders",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeleteMobileOrder(id: number, user: User) {
  return await axios.delete(`http://localhost:5268/mobile-orders/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function FetchMobileOrders(user: User) {
  return await axios.get<MobileOrderResponse[]>(
    "http://localhost:5268/mobile-orders",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
