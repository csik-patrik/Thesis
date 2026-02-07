export default function Table({
  headerItems,
  children,
}: {
  headerItems: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="min-w-full border-collapse">
      <thead>
        <tr>
          {headerItems.map((item) => (
            <th className="text-left px-4 py-2 border-b">{item}</th>
          ))}
        </tr>
      </thead>
      {children}
      <tbody>{children}</tbody>
    </table>
  );
}
