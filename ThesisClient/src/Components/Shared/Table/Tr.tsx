export default function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/60 transition-colors">
      {children}
    </tr>
  );
}
