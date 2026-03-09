import { Link } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import type { ReactNode } from "react";
import { FaComputer, FaRegBuilding, FaSimCard } from "react-icons/fa6";
import { IoPricetagOutline } from "react-icons/io5";
import { CiCircleCheck, CiCirclePlus, CiMobile1, CiUser } from "react-icons/ci";
import { GrDocumentText } from "react-icons/gr";
import { MdInventory } from "react-icons/md";

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
      <div
        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white ${accent}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-800 group-hover:text-teal-600 transition-colors text-sm">
          {title}
        </p>
        <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
          {description}
        </p>
      </div>
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
                Manage your IT assets, submit orders, and track device
                deployments.
              </p>
              {(user.department || user.costCenter) && (
                <div className="flex flex-wrap gap-5 mt-5 text-sm text-teal-100/80">
                  {user.department && (
                    <span className="flex items-center gap-1.5">
                      <FaRegBuilding />
                      {user.department}
                    </span>
                  )}
                  {user.costCenter && (
                    <span className="flex items-center gap-1.5">
                      <IoPricetagOutline />
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
                One platform for
                <br />
                all your IT assets
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
                icon={<CiMobile1 />}
                accent="bg-teal-500"
              />
              <QuickCard
                title="My Computers"
                description="Computers assigned to you"
                to="/computers/my-computers"
                icon={<FaComputer />}
                accent="bg-cyan-600"
              />
              <QuickCard
                title="My Mobile Orders"
                description="Track your mobile requests"
                to="/mobile-orders/my-orders"
                icon={<GrDocumentText />}
                accent="bg-indigo-500"
              />
              <QuickCard
                title="My Computer Orders"
                description="Track your computer requests"
                to="/computer-orders/my-orders"
                icon={<GrDocumentText />}
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
                icon={<CiCirclePlus />}
                accent="bg-amber-500"
              />
              <QuickCard
                title="Order a Computer"
                description="Submit a new computer request"
                to="/computer-orders/create"
                icon={<CiCirclePlus />}
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
                  icon={<CiCircleCheck />}
                  accent="bg-rose-500"
                />
                <QuickCard
                  title="Computer Order Approvals"
                  description="Review and approve computer requests"
                  to="/computer-orders/approval"
                  icon={<CiCircleCheck />}
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
                  icon={<CiMobile1 />}
                  accent="bg-teal-600"
                />
                <QuickCard
                  title="Computer Inventory"
                  description="Manage computers in stock"
                  to="/computers"
                  icon={<FaComputer />}
                  accent="bg-slate-600"
                />
                <QuickCard
                  title="SIM Cards"
                  description="View and manage SIM card inventory"
                  to="/sim-cards"
                  icon={<FaSimCard />}
                  accent="bg-gray-600"
                />
                <QuickCard
                  title="All Orders"
                  description="Mobile and computer order overview"
                  to="/mobile-orders"
                  icon={<MdInventory />}
                  accent="bg-neutral-600"
                />
                <QuickCard
                  title="Users"
                  description="Manage system users and roles"
                  to="/admin/users"
                  icon={<CiUser />}
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
                icon: <CiMobile1 />,
                accent: "bg-teal-500",
                title: "Device Requests",
                body: "Order mobile phones and computers for your team. Submit requests, track progress, and manage approvals in one flow.",
              },
              {
                icon: <MdInventory />,
                accent: "bg-cyan-600",
                title: "Asset Inventory",
                body: "Keep a live record of every device in the organisation — deployed, in stock, or decommissioned.",
              },
              {
                icon: <CiUser />,
                accent: "bg-indigo-500",
                title: "User Management",
                body: "Assign roles, link devices to employees, and manage cost-centre allocations across departments.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-white mb-5 ${f.accent}`}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
