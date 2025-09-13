type Option = {
  label: string;
  value: string | number;
};

type SelectMultipleProps = {
  title: string;
  fieldName: string;
  value: (string | number)[];
  options: Option[];
  handleChange: (e: {
    target: {
      name: string;
      value: (string | number)[];
    };
  }) => void;
};

export default function SelectMultiple({
  title,
  fieldName,
  value,
  options,
  handleChange,
}: SelectMultipleProps) {
  return (
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <select
        name={fieldName}
        multiple
        className="form-control"
        value={value.map(String)} // React expects string[]
        onChange={(e) => {
          const selectedValues = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          );
          handleChange({
            target: {
              name: fieldName,
              value: selectedValues,
            },
          });
        }}
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
