type Order = {
  status: string;
};

type FilterTabsProps = {
  statuses: string[];
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  orders: Order[];
};

export default function FilterTabs({
  statuses,
  statusFilter,
  setStatusFilter,
  orders,
}: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {["All", ...statuses].map((s) => (
        <button
          key={s}
          onClick={() => setStatusFilter(s)}
          className={`px-3 py-1.5 text-sm rounded-xl font-medium transition-colors ${
            statusFilter === s
              ? "bg-teal-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {s}
          <span
            className={`ml-1.5 text-xs ${
              statusFilter === s ? "text-teal-200" : "text-gray-400"
            }`}
          >
            {s === "All"
              ? orders.length
              : orders.filter((o) => o.status === s).length}
          </span>
        </button>
      ))}
    </div>
  );
}
