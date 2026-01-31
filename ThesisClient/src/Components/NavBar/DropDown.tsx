export default function DropDown({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const btnClasses =
    "group relative border border-gray-300 bg-white text-gray-500 text-lg px-3 py-1 rounded";
  return (
    <button className={btnClasses}>
      {title}
      <div className="absolute bg-white top-full right-0 rounded-lg p-3 mt-1 shadow-md scale-y-0 group-focus:scale-y-100 origin-top duration-200 flex flex-col">
        {children}
      </div>
    </button>
  );
}
