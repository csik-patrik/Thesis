import axios from 'axios';
import type { LogEntryResponse } from '../Types/LogTypes';
import type { User } from '../Types/UserTypes';

const API_URL = import.meta.env.VITE_API_URL;

export async function GetLogs(user: User, take = 200, contains = '') {
  return await axios.get<LogEntryResponse[]>(`${API_URL}/logs`, {
    params: {
      take,
      contains: contains || undefined,
    },
    headers: { Authorization: `Bearer ${user.token}` },
  });
}
