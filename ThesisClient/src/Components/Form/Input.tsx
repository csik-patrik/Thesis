interface InputProps {
  title: string;
  fieldName: string;
  placeHolder: string;
  type: string;
  value: string;
  required?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  title,
  fieldName,
  placeHolder,
  type,
  value,
  required,
  handleChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={fieldName} className="text-sm font-medium text-gray-700">
        {title}
      </label>
      <input
        id={fieldName}
        type={type}
        name={fieldName}
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        required={required}
        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}
