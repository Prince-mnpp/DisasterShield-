import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileWarning,
  Building2,
  ShieldAlert,
  LogIn,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Reports", path: "/reports", icon: FileWarning },
  { name: "Authority Panel", path: "/admin", icon: Building2 },
  { name: "Login", path: "/login", icon: LogIn },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-72 bg-slate-950/95 border-r border-white/10 min-h-screen p-5">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-cyan-500/15 border border-cyan-400/20">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Disaster Shield</h1>
            <p className="text-xs text-slate-400">AI Disaster Intelligence</p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                  isActive
                    ? "bg-cyan-500 text-slate-950 font-semibold"
                    : "text-slate-300 hover:bg-white/5"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-8 p-4 rounded-3xl bg-white/5 border border-white/10">
        <p className="text-sm text-slate-400 mb-2">System Status</p>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
          <span className="text-sm text-white">Monitoring active</span>
        </div>
      </div>
    </aside>
  );
}