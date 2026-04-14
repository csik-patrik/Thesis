export default function Td({
  children,
  colSpan,
}: {
  children: React.ReactNode;
  colSpan?: number;
}) {
  return (
    <td
      className="px-5 py-3.5 text-sm text-gray-400 font-mono"
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}
