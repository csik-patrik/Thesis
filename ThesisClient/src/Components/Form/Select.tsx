interface SelectProps {
  title: string;
  fieldName: string;
  value: string;
  options: { label: string; value: string }[];
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
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <select
        name={fieldName}
        className="form-control"
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
