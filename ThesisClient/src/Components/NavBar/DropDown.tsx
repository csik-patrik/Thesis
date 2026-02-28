import { useState, useRef, useEffect } from "react";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
  </svg>
);

export default function DropDown({
  title,
  children,
  mobile = false,
}: {
  title: string;
  children: React.ReactNode;
  mobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobile) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobile]);

  if (mobile) {
    return (
      <div className="border-b border-teal-500/60 last:border-b-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full py-2.5 text-sm font-medium text-white/90"
        >
          {title}
          <Chevron open={open} />
        </button>
        {open && (
          <div className="pb-2 pl-3 flex flex-col gap-0.5">{children}</div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white hover:bg-white/15 px-3 py-1.5 rounded-xl transition-colors"
      >
        {title}
        <Chevron open={open} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1.5 rounded-xl bg-white shadow-xl border border-gray-100 py-1.5 min-w-45 z-50">
          {children}
        </div>
      )}
    </div>
  );
}
