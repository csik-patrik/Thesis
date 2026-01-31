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
  const parseValues = (selected: string[]): (string | number)[] => {
    return selected.map((val) => {
      const opt = options.find((o) => String(o.value) === val);
      return opt ? opt.value : val;
    });
  };

  const classes =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";

  return (
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <select
        id={fieldName}
        name={fieldName}
        multiple
        className={classes}
        value={value.map(String)}
        onChange={(e) => {
          const selectedValues = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value,
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
