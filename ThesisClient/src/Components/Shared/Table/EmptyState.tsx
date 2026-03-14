import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center py-20 text-center px-6">
      <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>

      <p className="text-sm text-gray-500 mb-6 max-w-xs">{description}</p>

      {action}
    </div>
  );
}
