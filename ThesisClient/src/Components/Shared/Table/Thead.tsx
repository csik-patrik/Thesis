export default function Thead({ headers }: { headers: string[] }) {
  return (
    <thead>
      <tr className="border-b border-gray-100 bg-gray-50/70">
        {headers.map((header) => (
          <th
            key={header}
            className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
}
