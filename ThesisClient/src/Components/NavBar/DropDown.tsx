import { useState, useRef, useEffect } from "react";

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
      <div className="border-b border-teal-500 last:border-b-0">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center justify-between w-full py-2 text-white font-medium"
        >
          {title}
          <span className="text-xs">{open ? "▲" : "▼"}</span>
        </button>
        {open && (
          <div className="pb-2 pl-3 flex flex-col gap-1">{children}</div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="border border-gray-300 bg-white text-gray-500 text-lg px-3 py-1 rounded-2xl"
      >
        {title}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 rounded-lg bg-white p-3 shadow-md flex flex-col whitespace-nowrap z-50">
          {children}
        </div>
      )}
    </div>
  );
}
