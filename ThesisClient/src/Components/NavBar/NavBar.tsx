import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import NavItems from "./NavItems";

const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z" />
  </svg>
);

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <header className="w-full">
      <nav>
        {/* Bar */}
        <div className="flex items-center gap-3 px-5 py-3 bg-teal-600 shadow-md shadow-teal-900/15 transition">

          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-white font-semibold text-sm shrink-0"
          >
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <BrandIcon />
            </div>
            <span className="hidden sm:block tracking-wide">ITAM</span>
          </Link>

          {/* Divider */}
          <div className="hidden md:block w-px h-4 bg-white/25 mx-1" />

          {/* Desktop nav */}
          <div className="hidden md:flex flex-1 min-w-0">
            <NavItems />
          </div>

          {/* Mobile: hamburger */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden ml-auto text-white/90 hover:text-white p-1 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-teal-700 px-4 py-3 border-t border-teal-500/60">
            <NavItems mobile />
          </div>
        )}
      </nav>
    </header>
  );
}
