export default function DropDown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        type="button"
        className="border border-gray-300 bg-white text-gray-500 text-lg px-3 py-1 rounded"
      >
        {title}
      </button>

      {/* Menu */}
      <div
        className="
          absolute right-0 top-full mt-1
          rounded-lg bg-white p-3 shadow-md
          scale-y-0 origin-top
          group-hover:scale-y-100
          transition duration-200
          flex flex-col whitespace-nowrap
          z-50
        "
      >
        {children}
      </div>
    </div>
  );
}
