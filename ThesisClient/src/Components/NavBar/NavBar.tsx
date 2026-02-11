import NavItems from "./NavItems";

export default function NavBar() {
  return (
    <header className="w-full px-4 ">
      <nav className="mx-auto mt-2 max-w-7xl">
        <div
          className="
            flex items-center justify-between
            rounded-full px-6 py-3
            bg-teal-600 backdrop-blur
            border border-neutral-200
            shadow-sm
            transition
            
          "
        >
          <NavItems />
        </div>
      </nav>
    </header>
  );
}
