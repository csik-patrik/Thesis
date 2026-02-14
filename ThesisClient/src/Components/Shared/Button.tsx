export default function Button({
  handleClick,
  color,
  label,
}: {
  handleClick: () => void;
  color: "red" | "green" | "gray" | "blue";
  label: string;
}) {
  let classes = "text-white px-2 py-1 rounded transition";

  if (color == "red") classes += " bg-red-600";
  else if (color == "gray") classes += " bg-gray-300";
  else if (color == "blue") classes += " bg-blue-600";

  return (
    <button onClick={handleClick} className={classes}>
      {label}
    </button>
  );
}
