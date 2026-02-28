import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavItems from "./NavItems";

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full px-4">
      <nav className="mx-auto mt-2 max-w-7xl">
        {/* Main pill */}
        <div className="flex items-center justify-between rounded-full px-6 py-3 bg-teal-600 backdrop-blur border border-neutral-200 shadow-sm transition">
          {/* Desktop nav */}
          <div className="hidden md:flex w-full">
            <NavItems />
          </div>

          {/* Mobile: hamburger */}
          <div className="flex md:hidden items-center justify-between w-full">
            <span className="text-white font-semibold">Menu</span>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="text-white p-1"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden mt-1 rounded-2xl bg-teal-600 border border-neutral-200 shadow-sm px-4 py-3">
            <NavItems mobile />
          </div>
        )}
      </nav>
    </header>
  );
}
