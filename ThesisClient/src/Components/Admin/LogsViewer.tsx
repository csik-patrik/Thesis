import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../Auth/AuthContext";
import TableLayout from "../../Layouts/TableLayout";
import Spinner from "../Shared/Spinner";
import { GetLogs } from "../../Services/LogServices";
import type { LogEntryResponse } from "../../Types/LogTypes";

export default function LogsViewer() {
  const { user } = useAuth();

  const [logs, setLogs] = useState<LogEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contains, setContains] = useState("");

  const isAdmin = user?.roles.includes("Admin") ?? false;

  const loadLogs = async () => {
    if (!user || !user.token) return;

    setIsLoading(true);
    try {
      const response = await GetLogs(user, 300, contains);
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to load logs:", error);
      toast.error("Failed to load logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [user]);

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isLoading) return <Spinner fullPage />;

  return (
    <TableLayout
      title="Application logs"
      subtitle="Latest backend log entries (admin only)"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={contains}
          onChange={(e) => setContains(e.target.value)}
          placeholder="Filter (for example: ERR, /computers, Validation)"
          className="w-full sm:max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          onClick={loadLogs}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Refresh
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No log entries found.</p>
        ) : (
          <div className="max-h-[70vh] overflow-auto rounded-md bg-gray-950 p-3 text-xs text-gray-100">
            {logs.map((log, index) => (
              <pre
                key={`${log.fileName}-${index}`}
                className="whitespace-pre-wrap break-words"
              >
                [{log.fileName}] {log.line}
              </pre>
            ))}
          </div>
        )}
      </div>
    </TableLayout>
  );
}
