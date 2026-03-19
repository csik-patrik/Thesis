export default function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    Delivered: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
    "In inventory": "bg-green-100 text-green-700",
    "In repair": "bg-yellow-100 text-yellow-700",
    "Pending disposal": "bg-red-100 text-red-700",
    "Waiting for approval": "bg-yellow-100 text-yellow-700",
    "Deliver device": "bg-green-100 text-green-700",
  };
  const colors = colorMap[status] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${colors}`}>{status}</span>
  );
}
