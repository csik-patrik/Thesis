import axios from "axios";
import type { ComputerResponse } from "../Types/ComputerTypes";
import type { User } from "../Types/UserTypes";

export async function GetDeployedComputers(user: User) {
  return await axios.get<ComputerResponse[]>(
    "http://localhost:5268/computers/deployed",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function ReturnComputer(
  id: number,
  status: string,
  statusReason: string,
  user: User,
) {
  return await axios.put(
    `http://localhost:5268/computers/return/${id}`,
    { status, statusReason },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    },
  );
}

export async function GetComputersInInventory(user: User) {
  return await axios.get<ComputerResponse[]>(
    "http://localhost:5268/computers/inventory",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}

export async function DeleteComputer(id: number, user: User) {
  return await axios.delete(`http://localhost:5268/computers/${id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

export async function GetMyComputers(user: User) {
  return await axios.get<ComputerResponse[]>(
    "http://localhost:5268/computers/my-devices",
    {
      headers: { Authorization: `Bearer ${user.token}` },
    },
  );
}
