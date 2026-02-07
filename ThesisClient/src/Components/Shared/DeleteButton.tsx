export default function DeleteButton({
  handleDelete,
}: {
  handleDelete: () => void;
}) {
  const btnClasses =
    "bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition";
  return (
    <button onClick={handleDelete} className={btnClasses}>
      Delete
    </button>
  );
}
