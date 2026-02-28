interface SelectProps {
  title: string;
  fieldName: string;
  value: string | number;
  options: { label: string; value: string | number }[];
  handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function Select({
  title,
  fieldName,
  value,
  options,
  handleChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
        {title}
      </label>
      <div className="relative">
        <select
          id={fieldName}
          name={fieldName}
          value={value}
          onChange={handleChange}
          className="w-full appearance-none px-3 py-2.5 pr-9 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-gray-700"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
