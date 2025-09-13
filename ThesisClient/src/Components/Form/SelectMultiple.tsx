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
  // Helper to convert string[] back to original types
  const parseValues = (selected: string[]): (string | number)[] => {
    return selected.map((val) => {
      const opt = options.find((o) => String(o.value) === val);
      return opt ? opt.value : val;
    });
  };

  return (
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <select
        id={fieldName}
        name={fieldName}
        multiple
        className="form-control"
        value={value.map(String)}
        onChange={(e) => {
          const selectedValues = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          );
          handleChange({
            target: {
              name: fieldName,
              value: parseValues(selectedValues),
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
