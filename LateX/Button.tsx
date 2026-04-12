export default function Button({
  handleClick,
  color,
  label,
}: {
  handleClick: () => void;
  color: "red" | "green" | "gray" | "blue" | "yellow";
  label: string;
}) {
  let classes = "text-white px-2 py-1 rounded transition cursor-pointer";

  if (color == "red") classes += " bg-red-600 hover:bg-red-800";
  else if (color == "gray") classes += " bg-gray-300 hover:bg-gray-800";
  else if (color == "blue") classes += " bg-blue-600 hover:bg-blue-800";
  else if (color == "yellow") classes += " bg-yellow-500 hover:bg-yellow-800";
  else if (color == "green") classes += " bg-green-500 hover:bg-green-800";

  return (
    <button onClick={handleClick} className={classes}>
      {label}
    </button>
  );
}
