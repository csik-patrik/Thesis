interface InputProps {
  title: string;
  fieldName: string;
  placeHolder: string;
  type: string;
  value: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  title,
  fieldName,
  placeHolder,
  type,
  value,
  handleChange,
}: InputProps) {
  const classes =
    "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";
  return (
    <div className="mb-2">
      <label htmlFor={fieldName}>{title}</label>
      <input
        type={type}
        name={fieldName}
        className={classes}
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}
