import { NavLink } from "react-router-dom";
import { Home } from "lucide-react";
import { useUIStore } from "@/store/uiStore";

const NAV_MAIN = [{ to: "/", icon: Home, label: "Home", exact: true }];

function NavItem({ to, icon: Icon, label, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm
         transition-colors mx-2
         ${
           isActive
             ? "bg-violet-50 text-violet-700 font-medium"
             : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
         }`
      }
    >
      <Icon size={15} className="flex-shrink-0" />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className={`
      w-56 bg-white border-r border-gray-200 flex flex-col
      transition-all duration-200 flex-shrink-0 overflow-y-auto
      ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0"}
    `}
    >
      <div className="py-3 flex-1">
        <div className="mb-4">
          <p
            className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider
                        px-5 mb-1"
          >
            Main
          </p>
          {NAV_MAIN.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-400">CQI Module</p>
      </div>
    </aside>
  );
}
