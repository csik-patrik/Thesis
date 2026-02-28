export default function Spinner({ fullPage = false }: { fullPage?: boolean }) {
  const spinner = (
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/60">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      {spinner}
    </div>
  );
}
