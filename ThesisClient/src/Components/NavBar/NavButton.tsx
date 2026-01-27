import type { ReactNode } from "react";

export default function NavButton({ children }: { children: ReactNode }) {
  const classes =
    "px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-colors duration-200";
  return <button className={classes}>{children}</button>;
}
