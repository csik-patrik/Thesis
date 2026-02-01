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
  const classes =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";

  return (
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <select
        name={fieldName}
        className={classes}
        value={value}
        onChange={handleChange}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
