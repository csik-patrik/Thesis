interface InputProps {
  title: string;
  fieldName: string;
  placeHolder: string;
  type: string;
  value: string;
  classes: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  title,
  fieldName,
  placeHolder,
  type,
  value,
  classes,
  handleChange,
}: InputProps) {
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
