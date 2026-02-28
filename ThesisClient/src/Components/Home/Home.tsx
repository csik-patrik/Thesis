import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import type { ReactNode } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────

const MobileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ComputerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const OrderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const SimIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V8l-5-5H9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 3v5h6" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5l5.5 5.5a2 2 0 010 2.83l-6.17 6.17a2 2 0 01-2.83 0L3.5 12a2 2 0 010-2.83L7 7z" />
  </svg>
);

// ── Quick Action Card ──────────────────────────────────────────────────────

function QuickCard({
  title,
  description,
  to,
  icon,
  accent,
}: {
  title: string;
  description: string;
  to: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors text-sm">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-300 group-hover:text-teal-400 transition-colors shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
      {label}
    </h2>
  );
}

// ── Home ──────────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useAuth();

  const isAdmin = user?.roles.includes("Admin") ?? false;
  const isApprover = user?.roles.includes("Group leader") ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Hero ── */}
      <section className="relative bg-linear-to-br from-teal-700 via-teal-600 to-cyan-500 text-white overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-14">
          {user ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {isAdmin && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 border border-white/20">
                    Admin
                  </span>
                )}
                {isApprover && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-400/80 border border-amber-300/40">
                    Approver
                  </span>
                )}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
                Welcome back,{" "}
                <span className="text-cyan-200">{user.displayname}</span>
              </h1>
              <p className="text-teal-100 text-base sm:text-lg max-w-lg">
                Manage your IT assets, submit orders, and track device deployments.
              </p>
              {(user.department || user.costCenter) && (
                <div className="flex flex-wrap gap-5 mt-5 text-sm text-teal-100/80">
                  {user.department && (
                    <span className="flex items-center gap-1.5">
                      <BuildingIcon />
                      {user.department}
                    </span>
                  )}
                  {user.costCenter && (
                    <span className="flex items-center gap-1.5">
                      <TagIcon />
                      Cost Centre: {user.costCenter}
                    </span>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="text-teal-200 text-xs font-bold uppercase tracking-widest mb-3">
                IT Asset Management System
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                One platform for<br />all your IT assets
              </h1>
              <p className="text-teal-100 text-base sm:text-lg max-w-lg mb-8">
                Request devices, track orders, and manage your entire hardware
                inventory — from mobiles to computers and SIM cards.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold px-6 py-3 rounded-full shadow transition"
              >
                Sign In
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── Logged-in content ── */}
      {user && (
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
          {/* My Assets */}
          <section>
            <SectionHeader label="My Assets" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickCard
                title="My Mobiles"
                description="Devices assigned to you"
                to="/mobiles/my-mobiles"
                icon={<MobileIcon />}
                accent="bg-teal-500"
              />
              <QuickCard
                title="My Computers"
                description="Computers assigned to you"
                to="/computers/my-computers"
                icon={<ComputerIcon />}
                accent="bg-cyan-600"
              />
              <QuickCard
                title="My Mobile Orders"
                description="Track your mobile requests"
                to="/mobile-orders/my-orders"
                icon={<OrderIcon />}
                accent="bg-indigo-500"
              />
              <QuickCard
                title="My Computer Orders"
                description="Track your computer requests"
                to="/computer-orders/my-orders"
                icon={<OrderIcon />}
                accent="bg-violet-500"
              />
            </div>
          </section>

          {/* New Requests */}
          <section>
            <SectionHeader label="New Requests" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <QuickCard
                title="Order a Mobile"
                description="Submit a new mobile device request"
                to="/mobile-orders/create"
                icon={<PlusIcon />}
                accent="bg-amber-500"
              />
              <QuickCard
                title="Order a Computer"
                description="Submit a new computer request"
                to="/computer-orders/create"
                icon={<PlusIcon />}
                accent="bg-orange-500"
              />
            </div>
          </section>

          {/* Approvals — Group leader only */}
          {isApprover && (
            <section>
              <SectionHeader label="Pending Approvals" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickCard
                  title="Mobile Order Approvals"
                  description="Review and approve mobile requests"
                  to="/mobile-orders/approval"
                  icon={<CheckIcon />}
                  accent="bg-rose-500"
                />
                <QuickCard
                  title="Computer Order Approvals"
                  description="Review and approve computer requests"
                  to="/computer-orders/approval"
                  icon={<CheckIcon />}
                  accent="bg-pink-500"
                />
              </div>
            </section>
          )}

          {/* Admin */}
          {isAdmin && (
            <section>
              <SectionHeader label="Administration" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <QuickCard
                  title="Mobile Inventory"
                  description="Manage mobile devices in stock"
                  to="/mobiles"
                  icon={<MobileIcon />}
                  accent="bg-teal-600"
                />
                <QuickCard
                  title="Computer Inventory"
                  description="Manage computers in stock"
                  to="/computers"
                  icon={<ComputerIcon />}
                  accent="bg-slate-600"
                />
                <QuickCard
                  title="SIM Cards"
                  description="View and manage SIM card inventory"
                  to="/sim-cards"
                  icon={<SimIcon />}
                  accent="bg-gray-600"
                />
                <QuickCard
                  title="All Orders"
                  description="Mobile and computer order overview"
                  to="/mobile-orders"
                  icon={<InventoryIcon />}
                  accent="bg-neutral-600"
                />
                <QuickCard
                  title="Users"
                  description="Manage system users and roles"
                  to="/admin/users"
                  icon={<UsersIcon />}
                  accent="bg-zinc-600"
                />
              </div>
            </section>
          )}
        </div>
      )}

      {/* ── Not logged in: feature highlights ── */}
      {!user && (
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            What you can do
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <MobileIcon />,
                accent: "bg-teal-500",
                title: "Device Requests",
                body: "Order mobile phones and computers for your team. Submit requests, track progress, and manage approvals in one flow.",
              },
              {
                icon: <InventoryIcon />,
                accent: "bg-cyan-600",
                title: "Asset Inventory",
                body: "Keep a live record of every device in the organisation — deployed, in stock, or decommissioned.",
              },
              {
                icon: <UsersIcon />,
                accent: "bg-indigo-500",
                title: "User Management",
                body: "Assign roles, link devices to employees, and manage cost-centre allocations across departments.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white mb-5 ${f.accent}`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
